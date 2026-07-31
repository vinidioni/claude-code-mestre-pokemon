#!/usr/bin/env node
/**
 * Script para tentar novamente orders não encontradas
 * Usa navegação mais lenta e retries
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const ORDERS = [
  { orderId: '5764679381922417924', city: 'São Paulo' },
  { orderId: '5764679535555579604', city: 'São Paulo' },
  { orderId: '5764679491968372000', city: 'São Paulo' },
  { orderId: '5764679283893144818', city: 'São Paulo' },
  { orderId: '5764679489472759005', city: 'São Paulo' },
  { orderId: '5764679321658658702', city: 'São Paulo' },
  { orderId: '5764679365128424764', city: 'São Paulo' }
];

const CONFIG = {
  outputDir: './output',
  navigationDelay: 8000,
  retryDelay: 5000,
  maxRetries: 2
};

async function initBrowser() {
  console.log('🚀 Iniciando browser...');

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  return { browser, context, page };
}

async function navigateToOrderManagement(page) {
  console.log('🌐 Navegando para Gattaran...');

  // Ir direto para Order Management
  await page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  console.log('   ⏳ Aguardando carregamento completo...');
  await page.waitForTimeout(CONFIG.navigationDelay);

  // Verificar se a página carregou corretamente
  const currentUrl = page.url();
  console.log(`   📍 URL atual: ${currentUrl}`);

  if (currentUrl.includes('login')) {
    console.log('⚠️ Redirecionado para login. Faça login manualmente...');
    await page.waitForFunction(
      () => window.location.href.includes('/v2/') && !window.location.href.includes('login'),
      { timeout: 300000 }
    );
    console.log('✅ Login detectado!');
    await page.waitForTimeout(5000);
  }

  return true;
}

async function searchSingleOrder(page, orderId, cityName, attempt = 1) {
  console.log(`\n🔍 [Tentativa ${attempt}] Buscando order ${orderId}...`);

  try {
    // Recarregar a página para ter certeza que está limpa
    if (attempt > 1) {
      console.log('   🔄 Recarregando página...');
      await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(5000);
    }

    // Procurar por múltiplos seletores de input
    const orderInputSelectors = [
      'input[placeholder*="Order ID" i]',
      'input[placeholder*="ID" i]',
      'input[name*="order" i]',
      'input[id*="order" i]',
      'input[type="text"]',
      'form input'
    ];

    let orderInput = null;
    for (const selector of orderInputSelectors) {
      try {
        const inputs = await page.locator(selector).all();
        for (const input of inputs) {
          const isVisible = await input.isVisible().catch(() => false);
          if (isVisible) {
            // Verificar se é o campo de Order ID (primeiro input visível geralmente)
            const placeholder = await input.getAttribute('placeholder').catch(() => '');
            const name = await input.getAttribute('name').catch(() => '');
            if (placeholder.toLowerCase().includes('order') ||
                name.toLowerCase().includes('order') ||
                (!orderInput && inputs.indexOf(input) === 0)) {
              orderInput = input;
              console.log(`   ✅ Input encontrado: ${selector}`);
              break;
            }
          }
        }
        if (orderInput) break;
      } catch (e) {}
    }

    if (!orderInput) {
      console.log('   ❌ Input de Order ID não encontrado');
      return null;
    }

    // Limpar e preencher Order ID
    await orderInput.click();
    await orderInput.fill(''); // Limpar
    await page.waitForTimeout(500);
    await orderInput.fill(orderId);
    console.log(`   ✅ Order ID preenchido: ${orderId}`);
    await page.waitForTimeout(1000);

    // Procurar input de cidade
    const citySelectors = [
      'input[placeholder*="City" i]',
      '.el-select__tags input',
      'input[readonly]',
      '.el-select input'
    ];

    let cityInput = null;
    for (const selector of citySelectors) {
      try {
        const inputs = await page.locator(selector).all();
        for (const input of inputs) {
          const isVisible = await input.isVisible().catch(() => false);
          if (isVisible) {
            cityInput = input;
            console.log(`   ✅ Input de cidade encontrado: ${selector}`);
            break;
          }
        }
        if (cityInput) break;
      } catch (e) {}
    }

    if (cityInput) {
      // Tentar clicar no input interno do el-select (el-select__input)
      try {
        const innerInput = page.locator('.el-select__input.is-mini').first();
        if (await innerInput.isVisible().catch(() => false)) {
          await innerInput.click();
          console.log('   ✅ Clicou no input interno do select');
        } else {
          // Fallback: clicar no container do select
          const selectContainer = page.locator('.el-select').first();
          if (await selectContainer.isVisible().catch(() => false)) {
            await selectContainer.click();
            console.log('   ✅ Clicou no container do select');
          }
        }
        await page.waitForTimeout(1000);

        // Digitar o nome da cidade
        await page.keyboard.type(cityName);
        console.log(`   ✅ Cidade digitada: ${cityName}`);
        await page.waitForTimeout(1500);
      } catch (e) {
        console.log('   ⚠️ Erro ao interagir com select:', e.message);
      }

      // Tentar selecionar do dropdown
      const dropdownOptions = [
        '.el-select-dropdown__item:has-text("São Paulo")',
        '.el-select-dropdown__item',
        '[role="option"]',
        'li:has-text("São Paulo")'
      ];

      for (const option of dropdownOptions) {
        try {
          const opt = page.locator(option).first();
          if (await opt.isVisible().catch(() => false)) {
            await opt.click();
            console.log('   ✅ Cidade selecionada do dropdown');
            await page.waitForTimeout(1000);
            break;
          }
        } catch (e) {}
      }
    }

    // Clicar em Filter
    const filterSelectors = [
      'button:has-text("Filter")',
      'button.el-button--primary',
      'button[type="button"]:has-text("Filter")',
      '.el-button:has-text("Filter")'
    ];

    let filterClicked = false;
    for (const selector of filterSelectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          console.log('   ✅ Filter clicado');
          filterClicked = true;
          await page.waitForTimeout(3000);
          break;
        }
      } catch (e) {}
    }

    if (!filterClicked) {
      console.log('   ⚠️ Botão Filter não encontrado, tentando Tab + Enter...');
      await orderInput.press('Tab');
      await page.waitForTimeout(500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
    }

    // Aguardar resultados com tempo maior
    console.log('   ⏳ Aguardando resultados...');
    await page.waitForTimeout(5000);

    // Verificar se há resultados
    const hasResults = await checkForResults(page);

    if (!hasResults) {
      console.log('   ⚠️ Nenhum resultado encontrado na página');

      // Tentar novamente se ainda temos tentativas
      if (attempt < CONFIG.maxRetries) {
        console.log(`   🔄 Tentando novamente em ${CONFIG.retryDelay/1000}s...`);
        await page.waitForTimeout(CONFIG.retryDelay);
        return await searchSingleOrder(page, orderId, cityName, attempt + 1);
      }

      return null;
    }

    // Extrair dados da order
    const orderData = await extractOrderData(page);
    return orderData;

  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);

    if (attempt < CONFIG.maxRetries) {
      console.log(`   🔄 Tentando novamente em ${CONFIG.retryDelay/1000}s...`);
      await page.waitForTimeout(CONFIG.retryDelay);
      return await searchSingleOrder(page, orderId, cityName, attempt + 1);
    }

    return null;
  }
}

async function checkForResults(page) {
  try {
    // Verificar vários indicadores de resultado
    const checks = await page.evaluate(() => {
      const results = {
        hasTable: document.querySelectorAll('table tr').length > 1,
        hasRows: document.querySelectorAll('.el-table__row, tr[class*="row"]').length > 0,
        hasData: document.body.innerText.includes('Order ID') ||
                 document.body.innerText.includes('Status'),
        hasNoData: document.body.innerText.includes('No Data') ||
                   document.body.innerText.includes('Sem dados') ||
                   document.body.innerText.includes('暂无数据')
      };
      return results;
    });

    console.log(`   📊 Status: ${JSON.stringify(checks)}`);

    return checks.hasTable && checks.hasData && !checks.hasNoData;
  } catch (e) {
    return false;
  }
}

async function extractOrderData(page) {
  try {
    const data = await page.evaluate(() => {
      const result = {
        orderId: '',
        shopName: '',
        status: '',
        rawText: ''
      };

      // Tentar extrair de tabela
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const firstCell = cells[0].textContent?.trim();
            const secondCell = cells[1]?.textContent?.trim();

            if (firstCell && firstCell.includes('Order')) {
              result.orderId = secondCell || '';
            }
            if (firstCell && firstCell.includes('Status')) {
              result.status = secondCell || '';
            }
            if (firstCell && (firstCell.includes('Shop') || firstCell.includes('Merchant'))) {
              result.shopName = secondCell || '';
            }
          }
        });
      });

      // Fallback: procurar no texto
      const text = document.body.innerText;
      const lines = text.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Procurar por status
        if (line.includes('Canceled') || line.includes('Complete') || line.includes('Pending')) {
          if (!result.status) result.status = line;
        }

        // Procurar por nome da loja (geralmente vem antes de algum padrão)
        if (line.includes(' - ') && !result.shopName && line.length > 5 && line.length < 100) {
          result.shopName = line;
        }
      }

      result.rawText = text.substring(0, 3000);
      return result;
    });

    return data;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('========================================');
  console.log('🔍 RETRY - Orders Não Encontradas');
  console.log('========================================\n');

  const { browser, page } = await initBrowser();
  const results = [];

  try {
    // Navegar para Order Management (uma vez só)
    await navigateToOrderManagement(page);

    // Processar cada order
    for (let i = 0; i < ORDERS.length; i++) {
      const { orderId, city } = ORDERS[i];
      console.log(`\n${'='.repeat(50)}`);
      console.log(`[${i + 1}/${ORDERS.length}] Processando ${orderId}`);
      console.log('='.repeat(50));

      const orderData = await searchSingleOrder(page, orderId, city);

      if (orderData) {
        console.log('   ✅ Order encontrada!');
        results.push({
          orderId,
          status: 'found',
          data: orderData
        });
      } else {
        console.log('   ❌ Order não encontrada após todas as tentativas');
        results.push({
          orderId,
          status: 'not_found',
          data: null
        });
      }

      // Delay entre orders
      if (i < ORDERS.length - 1) {
        console.log(`\n   ⏳ Aguardando 5s antes da próxima...`);
        await page.waitForTimeout(5000);
      }
    }

  } finally {
    // Salvar resultados
    const outputFile = path.join(CONFIG.outputDir, `retry-results-${Date.now()}.json`);
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      total: ORDERS.length,
      found: results.filter(r => r.status === 'found').length,
      notFound: results.filter(r => r.status === 'not_found').length,
      results
    }, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO FINAL');
    console.log('='.repeat(60));
    console.log(`Total: ${ORDERS.length}`);
    console.log(`✅ Encontradas: ${results.filter(r => r.status === 'found').length}`);
    console.log(`❌ Não encontradas: ${results.filter(r => r.status === 'not_found').length}`);
    console.log(`\n📁 Resultados salvos em: ${outputFile}`);
    console.log('='.repeat(60));

    // Aguardar antes de fechar
    console.log('\n⚠️ Pressione Enter para fechar o browser...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    await browser.close();
  }
}

main().catch(console.error);

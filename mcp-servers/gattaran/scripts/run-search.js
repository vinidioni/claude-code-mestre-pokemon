#!/usr/bin/env node

import { chromium } from 'playwright';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function searchOrder() {
  console.log(`🔍 Buscando order ${ORDER_ID} em ${CITY}...`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 1. Navegar para Gattaran
    console.log('🌐 Navegando para Gattaran...');
    await page.goto('https://gattaran.didi-food.com/v2/home', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    // 2. Navegar para Order Management
    console.log('📋 Navegando para Order Management...');

    // Procurar City Services
    const cityServicesSelectors = [
      'text=City Services',
      'text=City Service',
      'text=Cidade',
      'span:has-text("City")'
    ];

    for (const selector of cityServicesSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(2000);
          console.log('✅ Clicou em City Services');
          break;
        }
      } catch (e) {}
    }

    // Procurar Transaction Management
    const transactionSelectors = [
      'text=Transaction Management',
      'text=Transaction',
      'text=Transação'
    ];

    for (const selector of transactionSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(2000);
          console.log('✅ Clicou em Transaction Management');
          break;
        }
      } catch (e) {}
    }

    // Procurar Order Management
    const orderManagementSelectors = [
      'text=Order Management',
      'text=Order',
      'text=Pedido',
      'a[href*="order"]'
    ];

    for (const selector of orderManagementSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(3000);
          console.log('✅ Clicou em Order Management');
          break;
        }
      } catch (e) {}
    }

    // 3. Buscar a order
    console.log(`🔎 Preenchendo dados da order...`);
    await page.waitForTimeout(2000);

    // Encontrar input de Order ID
    const orderIdSelectors = [
      'input[placeholder*="Order ID" i]',
      'input[placeholder*="ID" i]',
      'input[name*="order" i]',
      'input[id*="order" i]'
    ];

    let orderIdInput = null;
    for (const selector of orderIdSelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          orderIdInput = locator;
          break;
        }
      } catch (e) {}
    }

    if (orderIdInput) {
      await orderIdInput.fill(ORDER_ID);
      console.log(`✅ Preencheu Order ID: ${ORDER_ID}`);
    }

    // Encontrar input de City
    const citySelectors = [
      'input[placeholder*="City" i]',
      'input[name*="city" i]',
      'input[id*="city" i]'
    ];

    let cityInput = null;
    for (const selector of citySelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          cityInput = locator;
          break;
        }
      } catch (e) {}
    }

    if (cityInput) {
      await cityInput.click();
      await cityInput.fill(CITY);
      await page.waitForTimeout(500);

      // Tentar selecionar do dropdown
      try {
        const option = page.locator('[role="option"], .ant-select-item, .dropdown-item').first();
        if (await option.isVisible().catch(() => false)) {
          await option.click();
        }
      } catch (e) {}

      console.log(`✅ Preencheu City: ${CITY}`);
    }

    // Clicar em Search
    const searchSelectors = [
      'button:has-text("Search")',
      'button:has-text("Query")',
      'button:has-text("Buscar")',
      'button[type="submit"]',
      'button.ant-btn-primary'
    ];

    for (const selector of searchSelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          await locator.click();
          console.log('✅ Clicou em Search');
          break;
        }
      } catch (e) {}
    }

    // Aguardar resultados
    await page.waitForTimeout(3000);

    // 4. Extrair detalhes
    console.log('📊 Extraindo detalhes...');

    // Tirar screenshot
    await page.screenshot({
      path: 'gattaran-order-screenshot.png',
      fullPage: true
    });

    // Extrair dados da página
    const details = await page.evaluate(() => {
      const result = {
        orderId: '',
        status: '',
        customerInfo: {},
        merchantInfo: {},
        items: [],
        payment: {},
        delivery: {},
        timestamps: {},
        timeline: [],
        rawText: ''
      };

      // Extrair de tabelas
      const tables = document.querySelectorAll('table');
      tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const key = cells[0].textContent?.trim();
            const value = cells[1].textContent?.trim();
            if (key && value) {
              result[`table_${tableIndex}_${key}`] = value;
            }
          }
        });
      });

      // Extrair de listas de definição
      const dls = document.querySelectorAll('dl');
      dls.forEach((dl, dlIndex) => {
        const dts = dl.querySelectorAll('dt');
        const dds = dl.querySelectorAll('dd');
        dts.forEach((dt, index) => {
          const key = dt.textContent?.trim();
          const value = dds[index]?.textContent?.trim();
          if (key && value) {
            result[`dl_${dlIndex}_${key}`] = value;
          }
        });
      });

      // Extrair campos de formulário
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const label = input.previousElementSibling ||
                     input.parentElement?.querySelector('label') ||
                     document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          const key = label.textContent?.trim();
          const value = input.value || input.textContent?.trim();
          if (key && value) {
            result[`field_${key}`] = value;
          }
        }
      });

      // Procurar por status específicos
      const statusElements = document.querySelectorAll('.status, .order-status, [class*="status"]');
      statusElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && (text.includes('Cancel') || text.includes('Complete') || text.includes('Pending') || text.includes('Deliver'))) {
          result.status = text;
        }
      });

      // Texto completo como fallback
      result.rawText = document.body.innerText.substring(0, 10000);

      return result;
    });

    // Salvar resultados
    const fs = await import('fs');
    fs.writeFileSync('order-details.json', JSON.stringify(details, null, 2));

    console.log('\n✅ Busca concluída!');
    console.log('📄 Screenshot salvo: gattaran-order-screenshot.png');
    console.log('📋 Detalhes salvos: order-details.json');

    // Mostrar resumo
    console.log('\n📊 RESUMO DA ORDER:');
    console.log('==================');
    console.log(`Order ID: ${ORDER_ID}`);
    console.log(`Cidade: ${CITY}`);
    console.log(`Status: ${details.status || 'Não identificado'}`);

    // Mostrar primeiros campos encontrados
    const relevantFields = Object.entries(details)
      .filter(([key]) => !key.startsWith('rawText') && !key.includes('table_0'))
      .slice(0, 20);

    if (relevantFields.length > 0) {
      console.log('\nDetalhes encontrados:');
      relevantFields.forEach(([key, value]) => {
        if (value && String(value).trim()) {
          console.log(`  ${key}: ${String(value).substring(0, 100)}`);
        }
      });
    }

    // Aguardar input do usuário antes de fechar
    console.log('\n⚠️ Pressione Enter no terminal para fechar o browser...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    await browser.close();
    console.log('✅ Browser fechado');

  } catch (error) {
    console.error('❌ Erro:', error.message);

    // Tirar screenshot em caso de erro
    try {
      await page.screenshot({ path: 'gattaran-error-screenshot.png', fullPage: true });
      console.log('📸 Screenshot de erro salvo: gattaran-error-screenshot.png');
    } catch (e) {}

    await browser.close();
    throw error;
  }
}

searchOrder().catch(console.error);

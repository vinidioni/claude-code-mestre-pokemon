#!/usr/bin/env node
/**
 * Script v2 - Busca robusta de orders no Gattaran
 * Lida melhor com elementos da interface
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const ORDERS = [
  '5764679381922417924',
  '5764679535555579604',
  '5764679491968372000',
  '5764679283893144818',
  '5764679489472759005',
  '5764679321658658702',
  '5764679365128424764'
];

async function clearAllFilters(page) {
  console.log('   🧹 Limpando filtros anteriores...');

  // Tentar clicar em Clear ou limpar campos manualmente
  const clearBtn = await page.locator('button:has-text("Clear"), button:has-text("Reset"), .el-button:has-text("Clear")').first();
  if (await clearBtn.isVisible().catch(() => false)) {
    await clearBtn.click();
    await page.waitForTimeout(3000);
    console.log('   ✅ Filtros limpos via botão Clear');
    return;
  }

  // Limpar campos manualmente
  const inputs = await page.locator('input[type="text"]').all();
  for (const input of inputs) {
    try {
      const isVisible = await input.isVisible().catch(() => false);
      if (isVisible) {
        await input.click();
        await input.fill('');
        await page.waitForTimeout(300);
      }
    } catch (e) {}
  }

  // Pressionar ESC para fechar dropdowns
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  console.log('   ✅ Campos limpos manualmente');
}

async function fillOrderId(page, orderId) {
  console.log(`   ✏️ Preenchendo Order ID: ${orderId}`);

  // Encontrar o input de Order ID
  const orderInput = await page.locator('input[placeholder*="Order ID"]').first();

  if (!await orderInput.isVisible().catch(() => false)) {
    throw new Error('Input de Order ID não encontrado');
  }

  // Clicar e preencher
  await orderInput.click();
  await orderInput.fill(''); // Limpar primeiro
  await page.waitForTimeout(500);
  await orderInput.fill(orderId);

  // Disparar eventos para garantir que o valor foi registrado
  await orderInput.evaluate(el => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.waitForTimeout(1000);
  console.log('   ✅ Order ID preenchido');
}

async function selectCity(page, cityName) {
  console.log(`   🏙️ Selecionando cidade: ${cityName}`);

  // Clicar no select de cidade (usar force: true para ignorar sobreposição)
  const citySelect = await page.locator('.el-select').first();

  // Tentar clicar no ícone do select ou no próprio elemento
  const selectIcon = await page.locator('.el-select .el-select__caret, .el-select .el-icon-arrow-up').first();

  if (await selectIcon.isVisible().catch(() => false)) {
    await selectIcon.click({ force: true });
  } else {
    await citySelect.click({ force: true });
  }

  await page.waitForTimeout(2000);

  // Agora digitar o nome da cidade
  // Encontrar o input dentro do dropdown
  const dropdownInput = await page.locator('.el-select-dropdown__wrap input, .el-select-dropdown input').first();

  if (await dropdownInput.isVisible().catch(() => false)) {
    await dropdownInput.fill(cityName);
  } else {
    // Se não tiver input no dropdown, digitar direto
    await page.keyboard.type(cityName);
  }

  await page.waitForTimeout(2000);

  // Selecionar a opção
  const option = await page.locator('.el-select-dropdown__item:has-text("São Paulo")').first();

  if (await option.isVisible().catch(() => false)) {
    await option.click();
    console.log('   ✅ Cidade selecionada');
  } else {
    // Tentar pressionar Enter
    await page.keyboard.press('Enter');
    console.log('   ✅ Enter pressionado no dropdown');
  }

  await page.waitForTimeout(1500);

  // Fechar dropdown se ainda estiver aberto
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

async function clickFilter(page) {
  console.log('   🔘 Clicando em Filter...');

  const filterBtn = await page.locator('button.el-button--primary:has-text("Filter"), button:has-text("Filter"), button[type="button"]:has-text("Filter")').first();

  if (!await filterBtn.isVisible().catch(() => false)) {
    // Tentar encontrar qualquer botão primário
    const primaryBtn = await page.locator('button.el-button--primary').first();
    if (await primaryBtn.isVisible().catch(() => false)) {
      await primaryBtn.click();
    } else {
      throw new Error('Botão Filter não encontrado');
    }
  } else {
    await filterBtn.click();
  }

  console.log('   ✅ Filter clicado');
  await page.waitForTimeout(5000);
}

async function checkResults(page) {
  console.log('   🔍 Verificando resultados...');

  const result = await page.evaluate(() => {
    const text = document.body.innerText;

    return {
      hasNoData: text.includes('No Data') || text.includes('暂无数据') || text.includes('No results'),
      hasTable: document.querySelectorAll('.el-table__body-wrapper table, table.el-table__body').length > 0,
      rowCount: document.querySelectorAll('.el-table__row').length,
      pageText: text.substring(0, 2000)
    };
  });

  console.log(`   📊 Status: NoData=${result.hasNoData}, HasTable=${result.hasTable}, Rows=${result.rowCount}`);

  return result;
}

async function extractOrderDetails(page) {
  console.log('   📋 Extraindo detalhes...');

  const details = await page.evaluate(() => {
    const data = {
      shopName: '',
      status: '',
      orderId: ''
    };

    // Tentar extrair da tabela
    const rows = document.querySelectorAll('.el-table__row');
    if (rows.length > 0) {
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');

      cells.forEach((cell, index) => {
        const text = cell.textContent?.trim();
        if (text) {
          // Order ID geralmente é o primeiro ou tem formato numérico longo
          if (index === 0 || text.match(/^\d{15,20}$/)) {
            data.orderId = text;
          }
          // Status geralmente contém palavras como Canceled, Complete, etc
          if (text.toLowerCase().includes('cancel') ||
              text.toLowerCase().includes('complete') ||
              text.toLowerCase().includes('pending')) {
            data.status = text;
          }
          // Nome da loja geralmente vem com formato "Loja - Local"
          if (text.includes(' - ') && text.length > 5 && text.length < 80 && !data.shopName) {
            data.shopName = text;
          }
        }
      });
    }

    // Se não encontrou na tabela, procurar no texto
    if (!data.shopName || !data.status) {
      const fullText = document.body.innerText;
      const lines = fullText.split('\n');

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes(' - ') && trimmed.length > 5 && trimmed.length < 80 && !data.shopName) {
          data.shopName = trimmed;
        }
        if ((trimmed.toLowerCase().includes('canceled') ||
             trimmed.toLowerCase().includes('cancelled')) && !data.status) {
          data.status = trimmed;
        }
      });
    }

    return data;
  });

  console.log(`   ✅ Detalhes: ${details.shopName || 'N/A'} | ${details.status || 'N/A'}`);
  return details;
}

async function searchSingleOrder(page, orderId) {
  console.log(`\n🔍 Processando order: ${orderId}`);
  console.log('=' .repeat(50));

  try {
    // 1. Limpar filtros
    await clearAllFilters(page);

    // 2. Preencher Order ID
    await fillOrderId(page, orderId);

    // 3. Selecionar cidade
    await selectCity(page, 'São Paulo');

    // 4. Clicar em Filter
    await clickFilter(page);

    // 5. Verificar resultados
    const results = await checkResults(page);

    if (results.hasNoData || !results.hasTable) {
      console.log('   ❌ Order não encontrada');
      return { orderId, found: false, reason: 'no_data' };
    }

    // 6. Extrair detalhes
    const details = await extractOrderDetails(page);

    console.log('   ✅ Order encontrada!');
    return {
      orderId,
      found: true,
      shopName: details.shopName,
      status: details.status
    };

  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return { orderId, found: false, reason: 'error', error: error.message };
  }
}

async function main() {
  console.log('========================================');
  console.log('🔍 GATTARAN SEARCH V2 - Orders Perdidas');
  console.log('========================================\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  const results = [];

  try {
    // Navegar para a página
    console.log('🌐 Navegando para Gattaran...');
    await page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(5000);

    // Verificar se precisa de login
    if (page.url().includes('login')) {
      console.log('\n⚠️ FAÇA LOGIN MANUALMENTE no browser aberto');
      console.log('   Depois pressione Enter aqui para continuar...\n');
      await new Promise(r => process.stdin.once('data', r));
      await page.waitForTimeout(5000);
    }

    console.log('✅ Página carregada, iniciando buscas...\n');

    // Processar cada order
    for (let i = 0; i < ORDERS.length; i++) {
      const result = await searchSingleOrder(page, ORDERS[i]);
      results.push(result);

      // Delay entre orders
      if (i < ORDERS.length - 1) {
        console.log('\n   ⏳ Aguardando 3s...');
        await page.waitForTimeout(3000);
      }
    }

  } finally {
    // Salvar resultados
    const outputDir = './output';
    await fs.mkdir(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, `v2-search-results-${Date.now()}.json`);
    await fs.writeFile(outputFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      total: ORDERS.length,
      found: results.filter(r => r.found).length,
      notFound: results.filter(r => !r.found).length,
      results
    }, null, 2));

    // Relatório
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO FINAL');
    console.log('='.repeat(60));
    console.log(`Total: ${ORDERS.length}`);
    console.log(`✅ Encontradas: ${results.filter(r => r.found).length}`);
    console.log(`❌ Não encontradas: ${results.filter(r => !r.found).length}`);

    console.log('\n📋 Detalhes:');
    results.forEach(r => {
      if (r.found) {
        console.log(`  ✅ ${r.orderId} - ${r.shopName} - ${r.status}`);
      } else {
        console.log(`  ❌ ${r.orderId} - ${r.reason}`);
      }
    });

    console.log(`\n📁 Resultados salvos em: ${outputFile}`);
    console.log('='.repeat(60));

    // Manter browser aberto
    console.log('\n⚠️ Pressione Enter para fechar o browser...');
    await new Promise(r => process.stdin.once('data', r));
    await browser.close();
  }
}

main().catch(console.error);

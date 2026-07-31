#!/usr/bin/env node
/**
 * Script com login automático via sessão salva
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

const ORDERS = [
  '5764679381922417924',
  '5764679535555579604',
  '5764679491968372000',
  '5764679283893144818',
  '5764679489472759005',
  '5764679321658658702',
  '5764679365128424764'
];

const SESSION_FILE = './sessions/gattaran-session.json';

async function saveSession(context) {
  const state = await context.storageState();
  await fs.mkdir('./sessions', { recursive: true });
  await fs.writeFile(SESSION_FILE, JSON.stringify(state, null, 2));
  console.log('💾 Sessão salva');
}

async function loadSession() {
  try {
    const data = await fs.readFile(SESSION_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Buscando orders com persistência de sessão\n');

  const browser = await chromium.launch({ headless: false });

  // Tentar carregar sessão existente
  const sessionData = await loadSession();
  let context;

  if (sessionData) {
    console.log('📂 Sessão anterior encontrada, usando...');
    context = await browser.newContext({ storageState: sessionData });
  } else {
    console.log('🆕 Nova sessão');
    context = await browser.newContext();
  }

  const page = await context.newPage();

  // Navegar para Order Management
  console.log('🌐 Navegando...');
  await page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Se redirecionou para login, fazer login manual
  if (page.url().includes('login')) {
    console.log('\n⚠️ FAÇA LOGIN e depois pressione ENTER aqui');
    await new Promise(r => process.stdin.once('data', r));
    await page.waitForTimeout(3000);
    await saveSession(context);
  }

  console.log('✅ Logado! Processando orders...\n');

  const results = [];

  for (const orderId of ORDERS) {
    console.log(`\n🔍 ${orderId}`);

    // Limpar e preencher
    await page.locator('input[placeholder*="Order ID"]').first().fill('');
    await page.waitForTimeout(500);
    await page.locator('input[placeholder*="Order ID"]').first().fill(orderId);
    await page.waitForTimeout(1000);

    // Cidade - clicar no select
    await page.locator('.el-select').first().click();
    await page.waitForTimeout(1500);
    await page.keyboard.type('São Paulo');
    await page.waitForTimeout(2000);
    await page.locator('.el-select-dropdown__item:has-text("São Paulo")').first().click().catch(() => {
      page.keyboard.press('Enter');
    });
    await page.waitForTimeout(1500);

    // Filter
    await page.locator('button:has-text("Filter")').first().click();
    await page.waitForTimeout(5000);

    // Verificar
    const hasData = await page.evaluate(() =>
      !document.body.innerText.includes('No Data') &&
      document.querySelectorAll('.el-table__row').length > 0
    );

    if (hasData) {
      console.log('   ✅ ENCONTRADA');

      // Extrair dados
      const data = await page.evaluate(() => {
        const row = document.querySelector('.el-table__row');
        if (!row) return {};
        const cells = row.querySelectorAll('td');
        return {
          shop: cells[2]?.textContent?.trim() || '',
          status: cells[3]?.textContent?.trim() || ''
        };
      });

      results.push({ orderId, found: true, ...data });
    } else {
      console.log('   ❌ Não encontrada');
      results.push({ orderId, found: false });
    }

    await page.waitForTimeout(3000);
  }

  // Resultados
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTADOS');
  console.log('='.repeat(60));

  results.forEach(r => {
    if (r.found) {
      console.log(`✅ ${r.orderId} - ${r.shop} - ${r.status}`);
    } else {
      console.log(`❌ ${r.orderId} - NÃO ENCONTRADA`);
    }
  });

  console.log(`\nEncontradas: ${results.filter(r => r.found).length}/${ORDERS.length}`);

  // Salvar
  await fs.writeFile('./output/final-search.json', JSON.stringify(results, null, 2));
  console.log('\n📁 Salvo em: output/final-search.json');

  console.log('\nPressione Enter para fechar...');
  await new Promise(r => process.stdin.once('data', r));
  await browser.close();
}

main().catch(console.error);

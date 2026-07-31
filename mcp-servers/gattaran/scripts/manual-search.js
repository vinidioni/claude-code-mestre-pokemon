#!/usr/bin/env node
/**
 * Script simplificado para buscar orders no Gattaran
 * Busca uma a uma de forma manual
 */

import { chromium } from 'playwright';

const ORDER_ID = process.argv[2] || '5764679381922417924';
const CITY = 'São Paulo';

async function searchOrder() {
  console.log(`🔍 Buscando order ${ORDER_ID} em ${CITY}...\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  try {
    // Navegar direto para Order Management
    console.log('🌐 navegando para Order Management...');
    await page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(5000);

    // Verificar login
    if (page.url().includes('login')) {
      console.log('⚠️ Faça login manualmente no browser e pressione Enter...');
      await new Promise(r => process.stdin.once('data', r));
      await page.waitForTimeout(3000);
    }

    // Preencher Order ID (usando evaluate para evitar problemas de interceptação)
    console.log('✏️ Preenchendo Order ID...');
    await page.evaluate((orderId) => {
      const inputs = document.querySelectorAll('input');
      for (const input of inputs) {
        if (input.placeholder?.toLowerCase().includes('order') ||
            input.getAttribute('name')?.toLowerCase().includes('order')) {
          input.value = orderId;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }
      return false;
    }, ORDER_ID);
    console.log('✅ Order ID preenchido');
    await page.waitForTimeout(2000);

    // Preencher cidade
    console.log('✏️ Preenchendo cidade...');

    // Abrir o dropdown de cidade primeiro
    const citySelect = await page.locator('.el-select').first();
    if (await citySelect.isVisible().catch(() => false)) {
      await citySelect.click();
      await page.waitForTimeout(1500);

      // Digitar o nome da cidade
      await page.keyboard.type('São Paulo');
      await page.waitForTimeout(2000);

      // Selecionar a opção
      const option = await page.locator('.el-select-dropdown__item:has-text("São Paulo")').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
        console.log('✅ Cidade selecionada');
      }
    }
    await page.waitForTimeout(2000);

    // Clicar em Filter
    console.log('🔘 Clicando em Filter...');
    const filterBtn = await page.locator('button:has-text("Filter"), button.el-button--primary').first();
    if (await filterBtn.isVisible().catch(() => false)) {
      await filterBtn.click();
      console.log('✅ Filter clicado');
    }
    await page.waitForTimeout(5000);

    // Verificar resultados
    console.log('🔍 Verificando resultados...');
    const pageText = await page.evaluate(() => document.body.innerText);

    if (pageText.includes('No Data') || pageText.includes('暂无数据')) {
      console.log('\n❌ Order não encontrada no sistema');
    } else {
      console.log('\n✅ Order encontrada!');

      // Tirar screenshot
      await page.screenshot({ path: `order-${ORDER_ID}.png`, fullPage: true });
      console.log(`📸 Screenshot salvo: order-${ORDER_ID}.png`);

      // Extrair dados básicos
      const orderData = await page.evaluate(() => {
        const text = document.body.innerText;
        const lines = text.split('\n').filter(l => l.trim());

        return {
          hasTable: document.querySelectorAll('table').length > 0,
          hasRows: document.querySelectorAll('.el-table__row').length > 0,
          previewText: lines.slice(0, 30).join('\n')
        };
      });

      console.log('\n📊 Preview dos dados:');
      console.log(orderData.previewText);
    }

    console.log('\n⚠️ Pressione Enter para fechar...');
    await new Promise(r => process.stdin.once('data', r));
    await browser.close();

  } catch (error) {
    console.error('❌ Erro:', error.message);
    await page.screenshot({ path: `error-${ORDER_ID}.png`, fullPage: true });
    await browser.close();
  }
}

searchOrder();

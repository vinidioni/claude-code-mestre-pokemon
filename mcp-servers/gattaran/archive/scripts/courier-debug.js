#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Debug: Procurando link do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // Navegar e buscar order
    await client.page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await client.page.waitForTimeout(3000);

    const orderInput = client.page.locator('form input[placeholder*="Order ID"]').first();
    await orderInput.fill(ORDER_ID);

    const cityInput = client.page.locator('div.el-select__tags > input').first();
    await cityInput.click();
    await cityInput.fill(CITY);
    await client.page.waitForTimeout(1000);

    const cityOption = client.page.locator('li.hover').first();
    if (await cityOption.isVisible().catch(() => false)) {
      await cityOption.click();
    }

    const filterBtn = client.page.locator('button.el-button--primary').first();
    await filterBtn.click();
    await client.page.waitForTimeout(5000);

    // Tirar screenshot da tabela
    await client.page.screenshot({ path: 'debug-table.png', fullPage: true });
    console.log('📸 Screenshot da tabela salvo');

    // Extrair HTML da tabela
    const tableHtml = await client.page.evaluate(() => {
      const table = document.querySelector('.el-table');
      return table ? table.outerHTML.substring(0, 5000) : 'Tabela não encontrada';
    });

    await import('fs').then(fs =>
      fs.promises.writeFile('debug-table.html', tableHtml)
    );
    console.log('💾 HTML da tabela salvo');

    // Procurar todos os links na página
    console.log('\n🔍 Links encontrados:');
    const links = await client.page.locator('a').all();
    for (const link of links.slice(0, 20)) {
      try {
        const text = await link.textContent().catch(() => '');
        const href = await link.getAttribute('href').catch(() => '');
        const isVisible = await link.isVisible().catch(() => false);

        if (text?.trim() && isVisible) {
          console.log(`   "${text.trim()}" -> ${href}`);
        }
      } catch (e) {}
    }

    // Procurar especificamente elementos com FEL
    console.log('\n🔍 Elementos com "FEL":');
    const felElements = await client.page.locator('text=/FEL/i').all();
    for (const el of felElements) {
      try {
        const tag = await el.evaluate(e => e.tagName);
        const text = await el.textContent();
        const parent = await el.evaluate(e => e.parentElement?.tagName);

        console.log(`   Tag: ${tag}, Parent: ${parent}, Texto: "${text?.trim()}"`);
      } catch (e) {}
    }

  } finally {
    await client.close();
  }
}

main().catch(console.error);

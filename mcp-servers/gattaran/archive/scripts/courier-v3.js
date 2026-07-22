#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order e informações do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // Navegar para Order Management
    await client.page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await client.page.waitForTimeout(5000);

    // Preencher Order ID
    const orderInput = client.page.locator('form input[placeholder*="Order ID"]').first();
    await orderInput.fill(ORDER_ID);

    // Selecionar cidade
    const cityInput = client.page.locator('div.el-select__tags > input').first();
    await cityInput.click();
    await cityInput.fill(CITY);
    await client.page.waitForTimeout(1000);
    await client.page.locator('li.hover').first().click();

    // Clicar em Filter
    await client.page.locator('button.el-button--primary').first().click();
    await client.page.waitForTimeout(5000);

    // Tirar screenshot
    await client.page.screenshot({ path: 'table-view.png', fullPage: true });

    // Procurar o link do courier na 9ª coluna da tabela
    console.log('🔍 Procurando link do courier...');

    // Estratégia 1: XPath exato do recording3
    const courierLink = client.page.locator('xpath=//*[@id="__qiankun_microapp_wrapper_for_b_trans_mgr_i_18_n__"]/div/div/div/div/div[1]/section/div[1]/div[3]/table/tbody/tr/td[9]/div/a').first();

    try {
      const isVisible = await courierLink.isVisible({ timeout: 5000 });
      if (isVisible) {
        const text = await courierLink.textContent();
        console.log(`✅ Link encontrado: "${text?.trim()}"`);

        // Clicar
        await courierLink.click();
        console.log('🖱️ Clique realizado');
      }
    } catch (e) {
      console.log('❌ XPath específico não funcionou:', e.message);

      // Estratégia 2: Procurar na 9ª célula de qualquer linha
      console.log('\n🔄 Tentando estratégia alternativa...');
      const row = client.page.locator('table tbody tr').first();
      const courierCell = row.locator('td').nth(8); // 9ª coluna (índice 8)
      const linkInCell = courierCell.locator('a').first();

      const hasLink = await linkInCell.count() > 0;
      if (hasLink) {
        const text = await linkInCell.textContent();
        console.log(`✅ Link na 9ª coluna: "${text?.trim()}"`);
        await linkInCell.click();
        console.log('🖱️ Clique realizado');
      } else {
        console.log('❌ Nenhum link encontrado na 9ª coluna');
      }
    }

    // Aguardar carregamento
    await client.page.waitForTimeout(5000);
    console.log(`\n🌐 URL após clique: ${client.page.url()}`);

    // Tirar screenshot
    await client.page.screenshot({ path: 'courier-detail.png', fullPage: true });
    console.log('📸 Screenshot: courier-detail.png');

    // Extrair informações
    const info = await extractInfo(client.page);
    console.log('\n✅ INFORMAÇÕES DO ENTREGADOR:');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-info-result.json', JSON.stringify(info, null, 2))
    );

  } finally {
    await client.close();
  }
}

async function extractInfo(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      controlInformation: {},
      sections: {},
      fullText: document.body.innerText.substring(0, 10000)
    };

    const text = document.body.innerText;

    // Procurar Control Information
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|$)/i);
    if (controlMatch) {
      const lines = controlMatch[1].trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Extrair seções
    document.querySelectorAll('.el-collapse-item, .detail-section').forEach(section => {
      const title = section.querySelector('.el-collapse-item__header, .title')?.textContent?.trim();
      if (title) {
        const data = {};
        section.querySelectorAll('.el-form-item, .info-row').forEach(row => {
          const label = row.querySelector('.el-form-item__label, .label')?.textContent?.trim();
          const value = row.querySelector('.el-form-item__content, .value')?.textContent?.trim();
          if (label && value) {
            data[label] = value;
          }
        });
        if (Object.keys(data).length > 0) {
          result.sections[title] = data;
        }
      }
    });

    return result;
  });
}

main().catch(console.error);

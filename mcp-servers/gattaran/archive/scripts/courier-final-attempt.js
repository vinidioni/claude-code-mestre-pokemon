#!/usr/bin/env node

import { chromium } from 'playwright';

const ORDER_ID = '5764678698494132425';
const RIDER_ID = '650911850070348';

async function main() {
  console.log(`🔍 Acessando informações do courier ${RIDER_ID}...\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navegar para página do rider
    console.log('1️⃣ Navegando para página do courier...');
    await page.goto(
      `https://gattaran.didi-food.com/v2/gtr_deliver-mgr/rider/detail?id=${RIDER_ID}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    );

    // 2. Aguardar carregamento completo
    console.log('2️⃣ Aguardando carregamento...');
    await page.waitForTimeout(10000);

    // 3. Tirar screenshot
    await page.screenshot({ path: 'courier-page-v2.png', fullPage: true });
    console.log('📸 Screenshot: courier-page-v2.png');

    // 4. Extrair informações
    console.log('\n3️⃣ Extraindo informações...');
    const info = await extractInfo(page);

    console.log('\n✅ RESULTADO:');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-info-v2.json', JSON.stringify(info, null, 2))
    );

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await page.screenshot({ path: 'courier-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n👋 Browser fechado');
  }
}

async function extractInfo(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      extractedAt: new Date().toISOString(),
      controlInfo: {},
      allData: {},
      sections: [],
      fullText: document.body.innerText
    };

    // Tentar extrair de várias estruturas possíveis

    // 1. Procurar por elementos com texto específico
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const text = el.textContent?.trim();
      if (text && text.includes('Control')) {
        result.sections.push({
          tag: el.tagName,
          class: el.className,
          text: text.substring(0, 200)
        });
      }
    }

    // 2. Procurar em todas as divs por padrões de label:valor
    document.querySelectorAll('div').forEach(div => {
      const text = div.textContent?.trim();
      if (text && text.includes(':') && text.length < 100) {
        const match = text.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result.allData[match[1]] = match[2];
        }
      }
    });

    // 3. Procurar especificamente por tabelas
    document.querySelectorAll('table').forEach((table, i) => {
      const tableData = {};
      table.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 2) {
          const key = cells[0]?.textContent?.trim();
          const value = cells[1]?.textContent?.trim();
          if (key && value) {
            tableData[key] = value;
          }
        }
      });
      if (Object.keys(tableData).length > 0) {
        result[`table_${i}`] = tableData;
      }
    });

    // 4. Procurar por formulários
    document.querySelectorAll('.el-form-item, .form-item').forEach(item => {
      const label = item.querySelector('.el-form-item__label, label')?.textContent?.trim();
      const value = item.querySelector('.el-form-item__content, .value')?.textContent?.trim();
      if (label && value) {
        result.allData[label] = value;
      }
    });

    return result;
  });
}

main().catch(console.error);

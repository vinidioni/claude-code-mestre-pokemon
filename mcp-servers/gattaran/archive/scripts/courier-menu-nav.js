#!/usr/bin/env node

import { chromium } from 'playwright';

const RIDER_ID = '650911850070348';

async function main() {
  console.log(`🔍 Acessando dados do courier via navegação...\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navegar para home
    console.log('1️⃣ Navegando para home...');
    await page.goto('https://gattaran.didi-food.com/v2/home', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    // 2. Clicar no menu "Courier" (baseado no texto extraído)
    console.log('2️⃣ Clicando no menu Courier...');
    const courierMenu = page.locator('text=Courier').first();
    if (await courierMenu.isVisible().catch(() => false)) {
      await courierMenu.click();
      console.log('   ✅ Menu Courier clicado');
    } else {
      console.log('   ⚠️ Menu Courier não encontrado, tentando ícone...');
      // Tentar clicar no ícone de menu (3 barras/pontos)
      const menuIcon = page.locator('i.pb-icon-more, .menu-icon, [class*="more"]').first();
      if (await menuIcon.isVisible().catch(() => false)) {
        await menuIcon.click();
        await page.waitForTimeout(2000);
        const courierLink = page.locator('text=Courier').first();
        if (await courierLink.isVisible().catch(() => false)) {
          await courierLink.click();
        }
      }
    }

    await page.waitForTimeout(3000);

    // 3. Procurar submenu ou navegar para detalhes do rider
    console.log('3️⃣ Navegando para detalhes do rider...');
    await page.goto(
      `https://gattaran.didi-food.com/v2/gtr_deliver-mgr/rider/detail?id=${RIDER_ID}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    );
    await page.waitForTimeout(8000);

    // 4. Tirar screenshot
    await page.screenshot({ path: 'courier-detail-v3.png', fullPage: true });
    console.log('📸 Screenshot: courier-detail-v3.png');

    // 5. Extrair dados
    console.log('\n4️⃣ Extraindo dados...');
    const data = await extractData(page);

    console.log('\n✅ DADOS EXTRAÍDOS:');
    console.log(JSON.stringify(data, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-data-v3.json', JSON.stringify(data, null, 2))
    );

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await page.screenshot({ path: 'courier-error-v3.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

async function extractData(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      controlInformation: {},
      riderDetails: {},
      allFields: {},
      rawText: document.body.innerText.substring(0, 8000)
    };

    const text = document.body.innerText;

    // Procurar especificamente por "Control Information"
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+ \w+:|$)/i);
    if (controlMatch) {
      const lines = controlMatch[1].trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Extrair de tabelas
    document.querySelectorAll('table').forEach((table, i) => {
      const rows = table.querySelectorAll('tr');
      const tableData = {};
      rows.forEach(row => {
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

    // Extrair de campos de formulário
    document.querySelectorAll('.el-form-item, .info-item').forEach(item => {
      const label = item.querySelector('.el-form-item__label, .label')?.textContent?.trim();
      const value = item.querySelector('.el-form-item__content, .value')?.textContent?.trim();
      if (label && value) {
        result.allFields[label] = value;
      }
    });

    return result;
  });
}

main().catch(console.error);

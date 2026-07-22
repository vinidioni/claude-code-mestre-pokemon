#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const RIDER_ID = '650911850070348';

async function main() {
  console.log(`🔍 Acessando Control Information do courier ${RIDER_ID}...\n`);

  const client = await createClient({ headless: false });

  try {
    // 1. Navegar para página do rider
    console.log('1️⃣ Navegando para página do courier...');
    await client.page.goto(
      `https://gattaran.didi-food.com/v2/gtr_delivery-op/rider/detail/base?id=${RIDER_ID}`,
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
    await client.page.waitForTimeout(8000);
    console.log(`   ✅ Página carregada: ${client.page.url()}`);

    // 2. Tirar screenshot
    await client.page.screenshot({ path: 'courier-base-page.png', fullPage: true });
    console.log('📸 Screenshot: courier-base-page.png');

    // 3. Clicar na navegação das tabs se necessário
    console.log('\n2️⃣ Clicando na seta de navegação...');
    try {
      const nextArrow = client.page.locator('span.pb-tabs__nav-next > i').first();
      if (await nextArrow.isVisible({ timeout: 3000 })) {
        await nextArrow.click();
        console.log('   ✅ Seta clicada');
        await client.page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('   ℹ️ Seta não encontrada');
    }

    // 4. Clicar na aba "Control Information"
    console.log('\n3️⃣ Clicando na aba Control Information...');

    const tabSelectors = [
      '#tab-controls',
      'text=Control Information',
      '[aria-label="Control Information"]'
    ];

    let clicked = false;
    for (const selector of tabSelectors) {
      try {
        const tab = client.page.locator(selector).first();
        if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
          await tab.click();
          console.log(`   ✅ Aba clicada`);
          clicked = true;
          break;
        }
      } catch (e) {}
    }

    if (!clicked) {
      console.log('   ⚠️ Tentando encontrar por texto...');
      const allTabs = await client.page.locator('.pb-tabs__item, .el-tabs__item, [role="tab"]').all();
      for (const tab of allTabs) {
        try {
          const text = await tab.textContent().catch(() => '');
          if (text?.toLowerCase().includes('control')) {
            await tab.click();
            console.log(`   ✅ Aba "${text}" clicada`);
            clicked = true;
            break;
          }
        } catch (e) {}
      }
    }

    await client.page.waitForTimeout(5000);

    // 5. Tirar screenshot da aba
    await client.page.screenshot({ path: 'courier-control-tab.png', fullPage: true });
    console.log('📸 Screenshot: courier-control-tab.png');

    // 6. Extrair informações
    console.log('\n4️⃣ Extraindo informações...');
    const info = await extractControlInfo(client.page);

    console.log('\n✅ INFORMAÇÕES DE CONTROL INFORMATION:');
    console.log('=======================================');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('control-info-final.json', JSON.stringify(info, null, 2))
    );

    // 7. Resumo
    printSummary(info);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await client.page.screenshot({ path: 'courier-control-error.png', fullPage: true });
  } finally {
    await client.close();
  }
}

async function extractControlInfo(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      extractedAt: new Date().toISOString(),
      controlInformation: {},
      riderInfo: {},
      allSections: {},
      rawText: document.body.innerText.substring(0, 10000)
    };

    const text = document.body.innerText;

    // Procurar Control Information
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+ \w+:|$)/i);
    if (controlMatch) {
      const lines = controlMatch[1].trim().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match && match[1] && match[2]) {
          result.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Extrair de tabelas
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

    // Extrair de formulários
    document.querySelectorAll('.el-form-item, .info-item').forEach(item => {
      const label = item.querySelector('.el-form-item__label, .label')?.textContent?.trim();
      const value = item.querySelector('.el-form-item__content, .value')?.textContent?.trim();
      if (label && value) {
        result.allSections[label] = value;
      }
    });

    // Campos específicos
    const fields = ['Control Type', 'Control Reason', 'Control Start', 'Control End', 'In Control', 'Status'];
    fields.forEach(field => {
      const pattern = new RegExp(`${field}[:\\s]+([^\\n]+)`, 'i');
      const match = text.match(pattern);
      if (match) {
        result[field] = match[1].trim();
      }
    });

    return result;
  });
}

function printSummary(info) {
  console.log('\n📋 RESUMO - CONTROL INFORMATION');
  console.log('================================\n');

  if (Object.keys(info.controlInformation).length > 0) {
    Object.entries(info.controlInformation).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } else if (Object.keys(info.allSections).length > 0) {
    Object.entries(info.allSections).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } else {
    console.log('  (Nenhum dado estruturado encontrado)');
  }

  console.log('\n💾 Dados completos salvos em control-info-final.json');
}

main().catch(console.error);

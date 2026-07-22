#!/usr/bin/env node

import { chromium } from 'playwright';

const RIDER_ID = '650911850070348';

async function main() {
  console.log(`🔍 Acessando Control Information do courier ${RIDER_ID}...\n`);

  const browser = await chromium.launch({ headless: false });

  // Carregar sessão salva
  let context;
  try {
    const fs = await import('fs');
    const sessionData = JSON.parse(fs.readFileSync('.gattaran-session.json', 'utf-8'));
    context = await browser.newContext({ storageState: sessionData });
    console.log('📂 Sessão carregada');
  } catch {
    context = await browser.newContext();
    console.log('🆕 Nova sessão');
  }

  const page = await context.newPage();

  try {
    // 1. Navegar direto para página do rider (URL do recording4)
    console.log('1️⃣ Navegando para página do courier...');
    await page.goto(
      `https://gattaran.didi-food.com/v2/gtr_delivery-op/rider/detail/base?id=${RIDER_ID}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    );
    await page.waitForTimeout(5000);
    console.log(`   ✅ Página carregada: ${page.url()}`);

    // 2. Tirar screenshot da página inicial
    await page.screenshot({ path: 'courier-base.png', fullPage: true });
    console.log('📸 Screenshot: courier-base.png');

    // 3. Clicar na seta de navegação das tabs (se necessário)
    console.log('\n2️⃣ Clicando na navegação das tabs...');
    const nextArrow = page.locator('span.pb-tabs__nav-next > i').first();
    try {
      if (await nextArrow.isVisible({ timeout: 3000 })) {
        await nextArrow.click();
        console.log('   ✅ Seta clicada');
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('   ℹ️ Seta não encontrada ou não necessária');
    }

    // 4. Clicar na aba "Control Information" (seletor do recording4)
    console.log('\n3️⃣ Clicando na aba Control Information...');

    // Tentar diferentes seletores
    const tabSelectors = [
      '#tab-controls',
      'text=Control Information',
      '[aria-label="Control Information"]',
      'xpath//*[@id="tab-controls"]'
    ];

    let clicked = false;
    for (const selector of tabSelectors) {
      try {
        const tab = page.locator(selector).first();
        if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
          await tab.click();
          console.log(`   ✅ Aba clicada (${selector})`);
          clicked = true;
          break;
        }
      } catch (e) {}
    }

    if (!clicked) {
      console.log('   ⚠️ Aba não encontrada, tentando por texto parcial...');
      try {
        const tabByText = page.locator('text=Control').first();
        if (await tabByText.isVisible({ timeout: 3000 })) {
          await tabByText.click();
          console.log('   ✅ Aba encontrada por texto');
          clicked = true;
        }
      } catch (e) {
        console.log('   ❌ Não foi possível clicar na aba');
      }
    }

    await page.waitForTimeout(5000);

    // 5. Tirar screenshot da aba Control Information
    await page.screenshot({ path: 'courier-control-info.png', fullPage: true });
    console.log('📸 Screenshot: courier-control-info.png');

    // 6. Extrair informações (com mais tempo para carregar)
    console.log('\n4️⃣ Aguardando dados carregarem...');
    await page.waitForTimeout(3000);
    console.log('   Extraindo informações de Control Information...');
    const info = await extractControlInfo(page);

    console.log('\n✅ INFORMAÇÕES DE CONTROL INFORMATION:');
    console.log('=======================================');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('control-information.json', JSON.stringify(info, null, 2))
    );
    console.log('\n💾 Dados salvos em control-information.json');

    // 7. Resumo formatado
    printSummary(info);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await page.screenshot({ path: 'courier-error-final.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n👋 Browser fechado');
  }
}

async function extractControlInfo(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      extractedAt: new Date().toISOString(),
      controlInformation: {},
      allSections: {},
      rawText: document.body.innerText.substring(0, 10000)
    };

    const text = document.body.innerText;

    // Procurar por Control Information
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|\n[A-Z][a-z]+ \w+:|$)/i);
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
    document.querySelectorAll('.el-form-item, .info-item, .detail-row').forEach(item => {
      const label = item.querySelector('.el-form-item__label, .label, .name')?.textContent?.trim();
      const value = item.querySelector('.el-form-item__content, .value, .content')?.textContent?.trim();
      if (label && value) {
        result.allSections[label] = value;
      }
    });

    // Procurar por campos específicos de controle
    const controlFields = [
      'Control Type', 'Control Status', 'In Control',
      'Control Reason', 'Reason',
      'Control Start Time', 'Start Time', 'Control Start',
      'Control End Time', 'End Time', 'Control End',
      'Created By', 'Operator',
      'Created Time', 'Creation Time',
      'Notes', 'Comments', 'Remarks'
    ];

    controlFields.forEach(field => {
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
    console.log('Dados estruturados:');
    Object.entries(info.controlInformation).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  }

  if (info.Control_Type || info['Control Type']) {
    console.log(`\n📝 Control Type: ${info.Control_Type || info['Control Type']}`);
  }
  if (info.Control_Reason || info['Control Reason'] || info.Reason) {
    console.log(`📝 Reason: ${info.Control_Reason || info['Control Reason'] || info.Reason}`);
  }
  if (info.Control_Start_Time || info['Control Start Time'] || info['Start Time']) {
    console.log(`📝 Start: ${info.Control_Start_Time || info['Control Start Time'] || info['Start Time']}`);
  }
  if (info.Control_End_Time || info['Control End Time'] || info['End Time']) {
    console.log(`📝 End: ${info.Control_End_Time || info['Control End Time'] || info['End Time']}`);
  }

  console.log('\n✅ Dados completos salvos em control-information.json');
}

main().catch(console.error);

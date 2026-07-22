#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order ${ORDER_ID} e clicando no link do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // 1. Navegar para Order Management
    console.log('🔗 Navegando para Order Management...');
    await client.page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await client.page.waitForTimeout(3000);

    // 2. Preencher Order ID
    console.log('📝 Preenchendo Order ID...');
    const orderInput = client.page.locator('form input[placeholder*="Order ID"], form input[type="text"]').first();
    await orderInput.click();
    await orderInput.fill(ORDER_ID);

    // 3. Selecionar cidade
    console.log('🌍 Selecionando cidade...');
    const cityInput = client.page.locator('div.el-select__tags > input').first();
    await cityInput.click();
    await cityInput.fill(CITY);
    await client.page.waitForTimeout(1000);

    const cityOption = client.page.locator('li.hover').first();
    if (await cityOption.isVisible().catch(() => false)) {
      await cityOption.click();
    }

    // 4. Clicar em Filter
    console.log('🔍 Clicando em Filter...');
    const filterBtn = client.page.locator('button.el-button--primary').first();
    await filterBtn.click();
    await client.page.waitForTimeout(5000);

    // 5. Clicar no link do courier na tabela
    console.log('🖱️ Clicando no link do courier (FEL****IES)...');

    // Usar os seletores do recording3
    const courierLinkSelectors = [
      'td.el-table_2_column_23 a',
      'text=FEL****IES',
      'a:has-text("FEL")',
      'table tbody tr td:nth-child(9) a',
      '[aria-label="FEL****IES"]'
    ];

    let courierLink = null;
    for (const selector of courierLinkSelectors) {
      try {
        const locator = client.page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          const text = await locator.textContent().catch(() => '');
          console.log(`   ✅ Link encontrado: "${text?.trim()}"`);
          courierLink = locator;
          break;
        }
      } catch (e) {}
    }

    if (!courierLink) {
      console.log('❌ Link do courier não encontrado na tabela');
      await client.page.screenshot({ path: 'courier-not-found.png', fullPage: true });
      return;
    }

    // Clicar no link
    await courierLink.click();
    console.log('   ✅ Clique realizado, aguardando página carregar...');

    // Aguardar navegação
    await client.page.waitForTimeout(5000);
    console.log(`   🌐 URL atual: ${client.page.url()}`);

    // 6. Tirar screenshot
    await client.page.screenshot({ path: 'courier-detail-page.png', fullPage: true });
    console.log('📸 Screenshot salvo: courier-detail-page.png');

    // 7. Extrair informações da página do courier
    console.log('\n📊 Extraindo informações...');
    const courierInfo = await extractCourierInfo(client.page);

    console.log('\n✅ INFORMAÇÕES DO ENTREGADOR:');
    console.log('=============================');
    console.log(JSON.stringify(courierInfo, null, 2));

    // Salvar
    await import('fs').then(fs =>
      fs.promises.writeFile('courier-full-info.json', JSON.stringify(courierInfo, null, 2))
    );
    console.log('\n💾 Dados salvos em courier-full-info.json');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
  }
}

async function extractCourierInfo(page) {
  return await page.evaluate(() => {
    const info = {
      extractedAt: new Date().toISOString(),
      url: window.location.href,
      courierInfo: {},
      controlInformation: {},
      allSections: {},
      rawText: document.body.innerText.substring(0, 10000)
    };

    const text = document.body.innerText;

    // Procurar por Control Information
    const controlSectionMatch = text.match(/Control Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|\n[A-Z][a-z]+ \w+:|$)/i);
    if (controlSectionMatch) {
      const lines = controlSectionMatch[1].trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          info.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Procurar por todas as seções na página
    document.querySelectorAll('.el-collapse-item, .detail-section, .info-section, .el-card, section').forEach(section => {
      const title = section.querySelector('.el-collapse-item__header, .title, h3, h4, .section-title')?.textContent?.trim();
      if (title) {
        const sectionData = {};
        section.querySelectorAll('.el-form-item, .info-row, .detail-row, dl, tr').forEach(row => {
          const label = row.querySelector('.el-form-item__label, .label, dt, th')?.textContent?.trim();
          const value = row.querySelector('.el-form-item__content, .value, dd, td')?.textContent?.trim();
          if (label && value) {
            sectionData[label] = value;
          }
        });
        if (Object.keys(sectionData).length > 0) {
          info.allSections[title] = sectionData;
        }
      }
    });

    // Extrair campos específicos do courier
    const fields = [
      'Rider ID', 'Courier ID', 'ID',
      'Name', 'Full Name', 'Rider Name',
      'Phone', 'Mobile', 'Contact',
      'Email',
      'Status', 'Rider Status', 'Account Status',
      'Registration Time', 'Join Date', 'Onboard Date',
      'City', 'Working City',
      'Vehicle Type', 'Vehicle',
      'Control Type',
      'Control Reason',
      'Control Start Time',
      'Control End Time',
      'In Control',
      'Blocked',
      'Suspended',
      'Rating',
      'Total Orders',
      'Completed Orders',
      'Cancellation Rate'
    ];

    fields.forEach(field => {
      const pattern = new RegExp(`${field}[:\\s]+([^\\n]+)`, 'i');
      const match = text.match(pattern);
      if (match) {
        info.courierInfo[field] = match[1].trim();
      }
    });

    return info;
  });
}

main().catch(console.error);

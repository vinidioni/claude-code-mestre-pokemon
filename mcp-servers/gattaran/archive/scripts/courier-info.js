#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order ${ORDER_ID} e informações do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // Primeiro buscar a order
    const order = await client.searchOrder(ORDER_ID, CITY, false);

    if (!order) {
      console.log('⚠️ Order não encontrada');
      return;
    }

    console.log('✅ Order encontrada');
    console.log(`   Entregador: ${order.rider?.name || 'N/A'}`);
    console.log(`   ID do entregador: ${order.rider?.id || 'N/A'}\n`);

    // Navegar para página de detalhes
    console.log('🔗 Navegando para página de detalhes...');
    const detailUrl = `https://gattaran.didi-food.com/customerService/order/detail?orderId=${ORDER_ID}&cityId=${order.cityId || '55000199'}`;
    await client.page.goto(detailUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await client.page.waitForTimeout(3000);
    console.log('✅ Página carregada\n');

    // Clicar no hiperlink do courier name
    console.log('🖱️ Procurando hiperlink do courier...');

    // Tentar diferentes seletores para o link do courier
    const courierSelectors = [
      'a[href*="rider"]',
      'a[href*="courier"]',
      'a[href*="delivery"]',
      'a.el-link--primary',
      '.info-row a',
      'td a',
    ];

    let courierLink = null;
    for (const selector of courierSelectors) {
      try {
        const locator = client.page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          const text = await locator.textContent().catch(() => '');
          const href = await locator.getAttribute('href').catch(() => '');
          console.log(`   Encontrado: "${text?.trim()}" (${href})`);

          if (text?.toLowerCase().includes('fel') ||
              href.includes('rider') ||
              href.includes('courier')) {
            courierLink = locator;
            console.log('   ✅ Este parece ser o link do courier!');
            break;
          }
        }
      } catch (e) {}
    }

    // Se não encontrou pelos seletores, tentar procurar na página
    if (!courierLink) {
      console.log('   Procurando todos os links na página...');
      const allLinks = await client.page.locator('a').all();
      for (const link of allLinks) {
        try {
          const text = await link.textContent().catch(() => '');
          const href = await link.getAttribute('href').catch(() => '');

          if (text?.toLowerCase().includes('fel') ||
              href.includes('rider') ||
              href.includes('courier')) {
            console.log(`   Link encontrado: "${text?.trim()}" -> ${href}`);
            courierLink = link;
            break;
          }
        } catch (e) {}
      }
    }

    if (!courierLink) {
      console.log('❌ Link do courier não encontrado');
      await client.page.screenshot({ path: 'courier-link-debug.png', fullPage: true });
      console.log('📸 Screenshot salvo: courier-link-debug.png');
      return;
    }

    // Clicar no link do courier
    console.log('\n🖱️ Clicando no link do courier...');
    await courierLink.click();
    console.log('✅ Clique realizado');

    // Aguardar nova página/carregamento
    await client.page.waitForTimeout(5000);
    console.log(`   URL atual: ${client.page.url()}`);

    // Tirar screenshot da página do courier
    await client.page.screenshot({ path: 'courier-page.png', fullPage: true });
    console.log('📸 Screenshot salvo: courier-page.png');

    // Extrair informações de Control Information
    console.log('\n📊 Extraindo Control Information...');
    const controlInfo = await extractControlInfo(client.page);

    console.log('\n✅ INFORMAÇÕES DO ENTREGADOR:');
    console.log('============================');
    console.log(JSON.stringify(controlInfo, null, 2));

    // Salvar resultado
    await import('fs').then(fs =>
      fs.promises.writeFile('courier-control-info.json', JSON.stringify(controlInfo, null, 2))
    );
    console.log('\n💾 Dados salvos em courier-control-info.json');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
  }
}

async function extractControlInfo(page) {
  return await page.evaluate(() => {
    const info = {
      extractedAt: new Date().toISOString(),
      url: window.location.href,
      sections: {},
      fullText: ''
    };

    const allText = document.body.innerText;
    info.fullText = allText.substring(0, 5000);

    // Procurar por Control Information
    const controlPatterns = [
      /Control Information[\s\S]*?(?=\n[A-Z][a-z]+\s*\n|$)/i,
      /Control Info[\s\S]*?(?=\n[A-Z][a-z]+\s*\n|$)/i,
      /Courier Control[\s\S]*?(?=\n[A-Z][a-z]+\s*\n|$)/i,
    ];

    for (const pattern of controlPatterns) {
      const match = allText.match(pattern);
      if (match) {
        info.controlInformationRaw = match[0];
        break;
      }
    }

    // Procurar por seções na página
    document.querySelectorAll('.el-collapse-item, .detail-section, .info-section, .el-card').forEach(section => {
      const header = section.querySelector('.el-collapse-item__header, .title, h3, h4')?.textContent?.trim();

      if (header) {
        const sectionData = {};

        section.querySelectorAll('.el-form-item, .info-row, .detail-row, dl, tr').forEach(row => {
          const label = row.querySelector('.el-form-item__label, .label, dt, th')?.textContent?.trim();
          const value = row.querySelector('.el-form-item__content, .value, dd, td')?.textContent?.trim();

          if (label && value) {
            sectionData[label] = value;
          }
        });

        if (Object.keys(sectionData).length > 0) {
          info.sections[header] = sectionData;
        }
      }
    });

    // Extrair campos específicos
    const specificFields = [
      'Courier ID', 'Rider ID', 'Delivery Person ID',
      'Name', 'Full Name',
      'Phone', 'Mobile', 'Contact',
      'Email',
      'Status', 'Courier Status', 'Account Status',
      'Registration Date', 'Join Date', 'Onboard Date',
      'City', 'Working City',
      'Vehicle Type', 'Transportation',
      'Rating', 'Score',
      'Total Orders', 'Completed Orders',
      'Cancellation Rate',
      'Violation Count',
      'Blocked', 'Suspended',
      'Control Status', 'Control Notes'
    ];

    specificFields.forEach(field => {
      const pattern = new RegExp(`${field}[\\s:]*([^\\n]+)`, 'i');
      const match = allText.match(pattern);
      if (match) {
        info[field] = match[1].trim();
      }
    });

    // Procurar por tabelas de dados
    document.querySelectorAll('table').forEach((table, index) => {
      const tableData = {};
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 2) {
          const key = cells[0].textContent?.trim();
          const value = cells[1].textContent?.trim();
          if (key && value) {
            tableData[key] = value;
          }
        }
      });
      if (Object.keys(tableData).length > 0) {
        info[`table_${index}`] = tableData;
      }
    });

    return info;
  });
}

main().catch(console.error);

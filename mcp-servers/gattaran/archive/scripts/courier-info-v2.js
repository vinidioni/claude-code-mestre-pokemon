#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order ${ORDER_ID} e informações do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // Navegar direto para página de detalhes
    console.log('🔗 Navegando para página de detalhes...');
    const detailUrl = `https://gattaran.didi-food.com/customerService/order/detail?orderId=${ORDER_ID}&cityId=55000199`;
    await client.page.goto(detailUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await client.page.waitForTimeout(3000);
    console.log('✅ Página carregada\n');

    // Extrair HTML para debug
    const pageContent = await client.page.content();
    await import('fs').then(fs =>
      fs.promises.writeFile('page-debug.html', pageContent)
    );
    console.log('💾 HTML salvo em page-debug.html');

    // Procurar TODOS os links na página
    console.log('\n🔍 Procurando todos os links...');
    const allLinks = await client.page.locator('a').all();
    console.log(`   Total de links encontrados: ${allLinks.length}`);

    for (let i = 0; i < Math.min(allLinks.length, 20); i++) {
      try {
        const link = allLinks[i];
        const text = await link.textContent().catch(() => '');
        const href = await link.getAttribute('href').catch(() => '');
        const className = await link.getAttribute('class').catch(() => '');

        if (text?.trim()) {
          console.log(`   ${i + 1}. "${text.trim()}" -> ${href} [${className}]`);
        }
      } catch (e) {}
    }

    // Procurar especificamente por elementos que possam ser o nome do entregador
    console.log('\n🔍 Procurando elementos com "FEL" ou "IES"...');
    const felElements = await client.page.locator('text=/FEL/', { hasText: /FEL/ }).all();
    console.log(`   Elementos com "FEL": ${felElements.length}`);

    for (const el of felElements) {
      try {
        const tag = await el.evaluate(e => e.tagName).catch(() => 'unknown');
        const text = await el.textContent().catch(() => '');
        const clickable = await el.evaluate(e => {
          return e.tagName === 'A' || e.onclick !== null || window.getComputedStyle(e).cursor === 'pointer';
        }).catch(() => false);

        console.log(`   Tag: ${tag}, Texto: "${text?.trim()}", Clicável: ${clickable}`);

        if (clickable || tag === 'A') {
          console.log('   🎯 Encontrado elemento clicável do courier!');

          // Tentar clicar
          console.log('   🖱️ Clicando...');
          await el.click();
          await client.page.waitForTimeout(5000);

          console.log(`   URL após clique: ${client.page.url()}`);
          await client.page.screenshot({ path: 'courier-page.png', fullPage: true });

          // Extrair dados
          const info = await extractCourierInfo(client.page);
          console.log('\n✅ DADOS DO ENTREGADOR:');
          console.log(JSON.stringify(info, null, 2));

          await import('fs').then(fs =>
            fs.promises.writeFile('courier-data.json', JSON.stringify(info, null, 2))
          );

          return;
        }
      } catch (e) {
        console.log(`   Erro: ${e.message}`);
      }
    }

    // Se não encontrou clicável, tentar navegar direto pela URL do rider
    console.log('\n🔗 Tentando navegar direto para página do rider...');
    const riderId = '650911850070348';
    const riderUrl = `https://gattaran.didi-food.com/v2/gtr_deliver-mgr/rider/detail?id=${riderId}`;

    await client.page.goto(riderUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await client.page.waitForTimeout(3000);
    console.log(`   URL: ${client.page.url()}`);

    await client.page.screenshot({ path: 'courier-direct.png', fullPage: true });

    const info = await extractCourierInfo(client.page);
    console.log('\n✅ DADOS DO ENTREGADOR (via URL direta):');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-data.json', JSON.stringify(info, null, 2))
    );

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
      controlInformation: {},
      allSections: {},
      rawText: document.body.innerText.substring(0, 8000)
    };

    // Procurar especificamente por "Control Information"
    const text = document.body.innerText;

    // Extrair seção de Control Information
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n[A-Z]|\n[A-Z][a-z]+ \w+:|$)/i);
    if (controlMatch) {
      const controlSection = controlMatch[1].trim();
      const lines = controlSection.split('\n');

      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          info.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Procurar por todas as seções
    document.querySelectorAll('.el-collapse-item, .detail-section, .info-block').forEach(section => {
      const title = section.querySelector('.el-collapse-item__header, .title, h3, .section-title')?.textContent?.trim();
      if (title) {
        const data = {};
        section.querySelectorAll('.el-form-item, .info-row, .detail-row, tr').forEach(row => {
          const label = row.querySelector('.el-form-item__label, .label, th, dt')?.textContent?.trim();
          const value = row.querySelector('.el-form-item__content, .value, td, dd')?.textContent?.trim();
          if (label && value) {
            data[label] = value;
          }
        });
        if (Object.keys(data).length > 0) {
          info.allSections[title] = data;
        }
      }
    });

    // Extrair campos comuns de courier
    const courierFields = [
      'Rider ID', 'Courier ID', 'ID',
      'Name', 'Full Name', 'Rider Name',
      'Phone', 'Mobile', 'Contact Number',
      'Email',
      'Status', 'Rider Status', 'Account Status',
      'Registration Time', 'Join Date',
      'City', 'Working City',
      'Vehicle Type',
      'Control Type', 'Control Reason',
      'Control Start Time', 'Control End Time',
      'Control Status', 'In Control',
      'Blocked', 'Suspended', 'Restricted'
    ];

    courierFields.forEach(field => {
      const patterns = [
        new RegExp(`${field}[:\s]+([^\n]+)`, 'i'),
        new RegExp(`${field}[:\s]+([^\n]+?)(?=\n[A-Z]|$)`, 'i')
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1].trim()) {
          info[field] = match[1].trim();
          break;
        }
      }
    });

    return info;
  });
}

main().catch(console.error);

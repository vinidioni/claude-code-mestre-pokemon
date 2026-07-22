#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY_ID = '55000199';

async function main() {
  console.log(`🔍 Acessando detalhes da order e link do courier...\n`);

  const client = await createClient({ headless: false });

  try {
    // 1. Navegar direto para página de detalhes da order
    console.log('1️⃣ Navegando para página de detalhes...');
    await client.page.goto(
      `https://gattaran.didi-food.com/customerService/order/detail?orderId=${ORDER_ID}&cityId=${CITY_ID}`,
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
    await client.page.waitForTimeout(3000);
    console.log(`   ✅ Página carregada: ${client.page.url()}`);

    // 2. Tirar screenshot
    await client.page.screenshot({ path: 'order-detail-for-courier.png', fullPage: true });

    // 3. Procurar link do courier na página de detalhes
    console.log('\n2️⃣ Procurando link do courier...');

    // O link pode estar em vários lugares - procurar todos
    const courierSelectors = [
      'a[href*="rider"]',
      'a[href*="courier"]',
      'a[href*="delivery"]',
      'a:has-text("FEL")',
      'a:has-text("IES")',
      '.el-link--primary',
      'table a',
      '.info-row a',
      'a[href*="650911850070348"]'  // ID do courier
    ];

    let courierLink = null;
    for (const selector of courierSelectors) {
      try {
        const locator = client.page.locator(selector).first();
        const count = await locator.count();
        if (count > 0) {
          const isVisible = await locator.isVisible().catch(() => false);
          if (isVisible) {
            const text = await locator.textContent().catch(() => '');
            const href = await locator.getAttribute('href').catch(() => '');
            console.log(`   🔗 Encontrado: "${text?.trim()}" -> ${href}`);

            // Verificar se parece ser link do courier
            if (text?.toLowerCase().includes('fel') ||
                href.includes('rider') ||
                href.includes('courier') ||
                href.includes('650911850070348')) {
              courierLink = locator;
              console.log('   ✅ Este é o link do courier!');
              break;
            }
          }
        }
      } catch (e) {}
    }

    // 4. Se não encontrou, tentar navegar direto pela URL
    if (!courierLink) {
      console.log('\n3️⃣ Link não encontrado na página, navegando direto...');

      const riderId = '650911850070348';
      const riderUrl = `https://gattaran.didi-food.com/v2/gtr_deliver-mgr/rider/detail?id=${riderId}`;

      await client.page.goto(riderUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log('   ⏳ Aguardando carregamento...');
      await client.page.waitForTimeout(8000);  // Aumentar tempo de espera
      console.log(`   ✅ URL: ${client.page.url()}`);
    } else {
      // Clicar no link
      console.log('\n3️⃣ Clicando no link do courier...');
      await courierLink.click();
      await client.page.waitForTimeout(5000);
      console.log(`   ✅ URL após clique: ${client.page.url()}`);
    }

    // 5. Aguardar página carregar completamente
    console.log('   ⏳ Aguardando dados carregarem...');
    await client.page.waitForTimeout(5000);

    // 6. Tirar screenshot da página do courier
    await client.page.screenshot({ path: 'courier-final.png', fullPage: true });
    console.log('📸 Screenshot: courier-final.png');

    // 7. Extrair informações
    console.log('\n4️⃣ Extraindo informações...');
    const info = await extractCourierInfo(client.page);

    console.log('\n✅ INFORMAÇÕES DO ENTREGADOR:');
    console.log('============================');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-data-final.json', JSON.stringify(info, null, 2))
    );
    console.log('\n💾 Dados salvos em courier-data-final.json');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await client.close();
  }
}

async function extractCourierInfo(page) {
  // Aguardar até que a página tenha carregado (não mais "loading")
  await page.waitForFunction(() => {
    const text = document.body.innerText;
    return !text.includes('loading') && text.length > 100;
  }, { timeout: 15000 }).catch(() => {
    console.log('   ⚠️ Timeout aguardando carregamento, continuando...');
  });

  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
      controlInformation: {},
      riderInfo: {},
      allSections: {}
    };

    const text = document.body.innerText;

    // Procurar Control Information
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

    // Procurar Rider/Courier Information
    const riderMatch = text.match(/(?:Rider|Courier) Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|$)/i);
    if (riderMatch) {
      const lines = riderMatch[1].trim().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match && match[1] && match[2]) {
          result.riderInfo[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Extrair todas as seções
    document.querySelectorAll('.el-collapse-item, .detail-section, .info-section, .el-card').forEach(section => {
      const header = section.querySelector('.el-collapse-item__header, .title, h3, h4, .section-title')?.textContent?.trim();
      if (header) {
        const data = {};
        section.querySelectorAll('.el-form-item, .info-row, .detail-row, tr, dl').forEach(row => {
          const label = row.querySelector('.el-form-item__label, .label, dt, th')?.textContent?.trim();
          const value = row.querySelector('.el-form-item__content, .value, dd, td')?.textContent?.trim();
          if (label && value) {
            data[label] = value;
          }
        });
        if (Object.keys(data).length > 0) {
          result.allSections[header] = data;
        }
      }
    });

    // Campos específicos
    const fields = [
      'Rider ID', 'Courier ID', 'ID', 'Delivery Person ID',
      'Name', 'Full Name', 'Rider Name', 'Courier Name',
      'Phone', 'Mobile', 'Contact', 'Contact Number',
      'Email', 'E-mail',
      'Status', 'Rider Status', 'Courier Status', 'Account Status',
      'Registration Time', 'Join Date', 'Onboard Date', 'Created At',
      'City', 'Working City', 'Region',
      'Vehicle Type', 'Vehicle', 'Transportation',
      'Control Type', 'Control Status', 'In Control',
      'Control Reason', 'Reason',
      'Control Start Time', 'Control Start', 'Start Date',
      'Control End Time', 'Control End', 'End Date',
      'Blocked', 'Suspended', 'Restricted', 'Banned'
    ];

    fields.forEach(field => {
      const patterns = [
        new RegExp(`${field}[:\\s]+([^\\n]+?)(?=\\n[A-Z][a-z]+:|\\n\\n|$)`, 'i'),
        new RegExp(`${field}[:\\s]+([^\\n]+)`, 'i')
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1].trim()) {
          result[field] = match[1].trim();
          break;
        }
      }
    });

    result.rawText = text.substring(0, 5000);

    return result;
  });
}

main().catch(console.error);

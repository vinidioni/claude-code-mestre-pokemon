#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order e clicando no courier (baseado no recording3)...\n`);

  const client = await createClient({ headless: false });

  try {
    // 1. Navegar para Order Management (igual no recording)
    console.log('1️⃣ Navegando para Order Management...');
    await client.page.goto('https://gattaran.didi-food.com/v2/gtr_trans-mgr/order/list', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await client.page.waitForTimeout(3000);

    // 2. Preencher Order ID (seletor do recording)
    console.log('2️⃣ Preenchendo Order ID...');
    const orderInput = client.page.locator('form > div > div > div:nth-of-type(1) > div:nth-of-type(1) input').first();
    await orderInput.click();
    await orderInput.fill(ORDER_ID);
    console.log('   ✅ Order ID preenchido');

    // 3. Selecionar cidade (seletor do recording)
    console.log('3️⃣ Selecionando cidade...');
    const cityInput = client.page.locator('div.el-select__tags > input').first();
    await cityInput.click();
    await cityInput.fill('São p');
    await client.page.waitForTimeout(1000);

    // Clicar na opção São Paulo
    const cityOption = client.page.locator('li.hover').first();
    if (await cityOption.isVisible().catch(() => false)) {
      await cityOption.click();
      console.log('   ✅ Cidade selecionada');
    }

    // 4. Clicar em Filter (seletor do recording)
    console.log('4️⃣ Clicando em Filter...');
    const filterBtn = client.page.locator('button.el-button--primary').first();
    await filterBtn.click();
    console.log('   ✅ Filter clicado');

    // Aguardar resultados carregarem
    await client.page.waitForTimeout(5000);

    // 5. Clicar no link do courier (EXATAMENTE como no recording3)
    console.log('5️⃣ Clicando no link do courier FEL****IES...');

    // Seletores do recording3
    const courierSelectors = [
      'td.el-table_2_column_23 a',  // Seletor principal do recording
      'text=FEL****IES',             // Seletor por texto
      'aria/FEL****IES[role="link"]' // Seletor ARIA
    ];

    let clicked = false;
    for (const selector of courierSelectors) {
      try {
        const locator = client.page.locator(selector).first();
        const count = await locator.count();
        const isVisible = await locator.isVisible().catch(() => false);

        console.log(`   Tentando: ${selector}`);
        console.log(`   - Elementos encontrados: ${count}`);
        console.log(`   - Visível: ${isVisible}`);

        if (count > 0 && isVisible) {
          const text = await locator.textContent().catch(() => '');
          console.log(`   - Texto: "${text?.trim()}"`);

          // Tentar clicar
          await locator.click();
          console.log('   ✅ CLIQUE REALIZADO!');
          clicked = true;
          break;
        }
      } catch (e) {
        console.log(`   ❌ Erro: ${e.message}`);
      }
    }

    if (!clicked) {
      console.log('❌ Não foi possível clicar no link do courier');

      // Debug: listar todas as células da tabela
      console.log('\n🔍 Debug: Células da tabela:');
      const cells = await client.page.locator('td').all();
      for (let i = 0; i < Math.min(cells.length, 15); i++) {
        try {
          const text = await cells[i].textContent().catch(() => '');
          const hasLink = await cells[i].locator('a').count() > 0;
          console.log(`   [${i}] "${text?.trim()?.substring(0, 30)}" ${hasLink ? '(tem link)' : ''}`);
        } catch (e) {}
      }

      await client.page.screenshot({ path: 'courier-link-fail.png', fullPage: true });
      return;
    }

    // 6. Aguardar página do courier carregar
    console.log('\n6️⃣ Aguardando página do courier carregar...');
    await client.page.waitForTimeout(5000);
    console.log(`   URL atual: ${client.page.url()}`);

    // 7. Tirar screenshot
    await client.page.screenshot({ path: 'courier-page-result.png', fullPage: true });
    console.log('📸 Screenshot salvo: courier-page-result.png');

    // 8. Extrair informações
    console.log('\n7️⃣ Extraindo informações do courier...');
    const info = await extractCourierPageInfo(client.page);

    console.log('\n✅ INFORMAÇÕES EXTRAÍDAS:');
    console.log('========================');
    console.log(JSON.stringify(info, null, 2));

    await import('fs').then(fs =>
      fs.promises.writeFile('courier-final-info.json', JSON.stringify(info, null, 2))
    );
    console.log('\n💾 Dados salvos em courier-final-info.json');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
  }
}

async function extractCourierPageInfo(page) {
  return await page.evaluate(() => {
    const result = {
      url: window.location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
      controlInformation: {},
      riderInfo: {},
      allSections: {},
      rawText: document.body.innerText.substring(0, 8000)
    };

    const text = document.body.innerText;

    // Procurar especificamente por "Control Information"
    const controlMatch = text.match(/Control Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|\n[A-Z][a-z]+ \w+:|$)/i);
    if (controlMatch) {
      const lines = controlMatch[1].trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result.controlInformation[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Procurar por Rider/Courier Information
    const riderMatch = text.match(/Rider Information|Courier Information([\s\S]*?)(?=\n\n[A-Z][a-z]+|$)/i);
    if (riderMatch) {
      const lines = riderMatch[0].split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result.riderInfo[match[1].trim()] = match[2].trim();
        }
      });
    }

    // Extrair todas as seções
    document.querySelectorAll('.el-collapse-item, .detail-section, .info-block, section').forEach(section => {
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
    const fields = ['Rider ID', 'Courier ID', 'Name', 'Phone', 'Status', 'City', 'Vehicle Type',
                    'Control Type', 'Control Reason', 'Control Start', 'Control End', 'In Control'];
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

main().catch(console.error);

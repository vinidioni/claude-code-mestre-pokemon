#!/usr/bin/env node
/**
 * Script para buscar múltiplas orders em uma única sessão
 * Autenticação única -> Múltiplas buscas -> Relatório consolidado
 */

import { createClient } from '../src/api-client-v4.js';
import fs from 'fs/promises';
import path from 'path';

// Configurações
const CONFIG = {
  outputDir: './output',
  sessionFile: '../sessions/.gattaran-session.json',
  delayBetweenOrders: 2000  // ms
};

async function main() {
  // Receber orders da linha de comando ou arquivo
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🔍 Gattaran Batch Orders - Sessão Única

Uso:
  node batch-orders.js order1,order2,order3
  node batch-orders.js --file=orders.json
  node batch-orders.js --file=orders.csv

Exemplos:
  # 3 orders via CLI
  node batch-orders.js 5764678698494132425,5764678978203877694,5764678584400678506

  # Via arquivo JSON
  node batch-orders.js --file=./examples/orders.json

  # Via arquivo CSV
  node batch-orders.js --file=./examples/orders.csv
`);
    return;
  }

  // Parse dos argumentos
  let orders = [];
  let options = {
    extractCourierInfo: false,
    extractCancellation: true,
    saveScreenshots: false
  };

  for (const arg of args) {
    if (arg.startsWith('--file=')) {
      const filePath = arg.replace('--file=', '');
      orders = await loadOrdersFromFile(filePath);
    } else if (arg.startsWith('--courier-info')) {
      options.extractCourierInfo = true;
    } else if (arg.startsWith('--screenshots')) {
      options.saveScreenshots = true;
    } else if (!arg.startsWith('--')) {
      // Lista de orders separadas por vírgula
      orders = arg.split(',').map(id => ({
        orderId: id.trim(),
        cityName: 'São Paulo'  // Default
      }));
    }
  }

  if (orders.length === 0) {
    console.error('❌ Nenhuma order especificada');
    return;
  }

  console.log(`🔍 Processando ${orders.length} order(s) em uma única sessão\n`);

  // Criar cliente (login único)
  const client = await createClient({
    headless: false,  // Mostrar browser para login se necessário
    sessionFile: CONFIG.sessionFile
  });

  const results = {
    timestamp: new Date().toISOString(),
    total: orders.length,
    success: 0,
    errors: 0,
    orders: []
  };

  try {
    // Processar cada order na mesma sessão
    for (let i = 0; i < orders.length; i++) {
      const { orderId, cityName = 'São Paulo' } = orders[i];

      console.log(`\n[${i + 1}/${orders.length}] Processando ${orderId}...`);

      try {
        // Buscar order
        const order = await client.searchOrder(orderId, cityName, true);

        if (!order) {
          console.log(`   ⚠️ Order não encontrada`);
          results.errors++;
          results.orders.push({
            orderId,
            status: 'not_found',
            error: 'Order não encontrada'
          });
          continue;
        }

        const orderData = {
          orderId,
          status: 'success',
          orderInfo: {
            shopName: order.shopName,
            status: order.status,
            createTime: order.createTime,
            customer: order.customer,
            rider: order.rider
          }
        };

        // Extrair dados de cancelamento
        if (options.extractCancellation && order.status?.toLowerCase().includes('cancel')) {
          console.log('   🔍 Extraindo dados de cancelamento...');
          const cancelInfo = await client.getCancellationDetails();
          if (cancelInfo) {
            orderData.cancellation = cancelInfo;
          }
        }

        // Extrair Control Information do entregador
        if (options.extractCourierInfo && order.rider?.id) {
          console.log('   🔍 Extraindo Control Information do entregador...');
          const courierInfo = await extractCourierControlInfo(client, order.rider.id);
          if (courierInfo) {
            orderData.courierControlInfo = courierInfo;
          }
        }

        // Screenshot se solicitado
        if (options.saveScreenshots) {
          const screenshotPath = path.join(CONFIG.outputDir, `order-${orderId}.png`);
          await client.page.screenshot({ path: screenshotPath, fullPage: true });
          orderData.screenshot = screenshotPath;
        }

        results.orders.push(orderData);
        results.success++;
        console.log(`   ✅ OK - ${order.status}`);

      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        results.errors++;
        results.orders.push({
          orderId,
          status: 'error',
          error: error.message
        });
      }

      // Delay entre orders (exceto na última)
      if (i < orders.length - 1) {
        console.log(`   ⏳ Aguardando ${CONFIG.delayBetweenOrders}ms...`);
        await new Promise(r => setTimeout(r, CONFIG.delayBetweenOrders));
      }
    }

    // Salvar resultados
    const outputFile = path.join(CONFIG.outputDir, `batch-results-${Date.now()}.json`);
    await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

    // Relatório final
    printReport(results, outputFile);

  } finally {
    // Fechar browser (salva sessão automaticamente)
    await client.close();
  }
}

async function loadOrdersFromFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return data;
    } else if (data.orders) {
      return data.orders;
    }
  } else if (ext === '.csv') {
    // Parse simples de CSV
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i];
      });
      return {
        orderId: obj.orderid || obj.order_id || obj.id,
        cityName: obj.city || obj.cityname || obj.city_name || 'São Paulo'
      };
    });
  }

  throw new Error(`Formato de arquivo não suportado: ${ext}`);
}

async function extractCourierControlInfo(client, riderId) {
  try {
    // Navegar para página do entregador
    await client.page.goto(
      `https://gattaran.didi-food.com/v2/gtr_delivery-op/rider/detail/base?id=${riderId}`,
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    );
    await client.page.waitForTimeout(5000);

    // Clicar na seta de navegação das tabs
    const nextArrow = client.page.locator('span.pb-tabs__nav-next > i').first();
    if (await nextArrow.isVisible().catch(() => false)) {
      await nextArrow.click();
      await client.page.waitForTimeout(1000);
    }

    // Clicar na aba Control Information
    const controlTab = client.page.locator('#tab-controls').first();
    if (await controlTab.isVisible().catch(() => false)) {
      await controlTab.click();
      await client.page.waitForTimeout(5000);
    }

    // Extrair dados
    return await client.page.evaluate(() => {
      const info = {
        controlRecords: [],
        silenceRecords: [],
        rawText: document.body.innerText.substring(0, 5000)
      };

      // Procurar por tabelas de registros
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim());
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const record = {};
            cells.forEach((cell, i) => {
              if (headers[i]) {
                record[headers[i]] = cell.textContent?.trim();
              }
            });
            if (Object.keys(record).length > 0) {
              info.controlRecords.push(record);
            }
          }
        });
      });

      return info;
    });

  } catch (error) {
    console.log(`   ⚠️ Erro ao extrair Control Info: ${error.message}`);
    return null;
  }
}

function printReport(results, outputFile) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  console.log(`Total de orders: ${results.total}`);
  console.log(`✅ Sucesso: ${results.success}`);
  console.log(`❌ Erros: ${results.errors}`);
  console.log(`\n📁 Resultados salvos em: ${outputFile}`);

  // Resumo por status
  const statusCount = {};
  results.orders.forEach(o => {
    const status = o.orderInfo?.status || o.status;
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  console.log('\n📈 Distribuição por status:');
  Object.entries(statusCount).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  console.log('='.repeat(60));
}

main().catch(console.error);

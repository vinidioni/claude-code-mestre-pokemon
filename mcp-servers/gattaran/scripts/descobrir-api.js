/**
 * Script para descobrir qual API contém o motivo completo do cancelamento
 */

import { chromium } from 'playwright';

async function descobrir() {
  console.log('🔍 Descobrindo APIs do Gattaran...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allRequests = [];
  const allResponses = [];

  // Capturar TODAS as requisições
  page.on('request', request => {
    const url = request.url();
    if (url.includes('didi') || url.includes('gattaran')) {
      allRequests.push({
        url,
        method: request.method(),
        timestamp: Date.now()
      });
    }
  });

  // Capturar TODAS as respostas
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('didi') || url.includes('gattaran')) {
      try {
        const text = await response.text().catch(() => '');
        allResponses.push({
          url,
          status: response.status(),
          size: text.length,
          hasOutro: text.includes('Outro'),
          hasCliente: text.includes('Cliente') || text.includes('cliente'),
          hasApareceu: text.includes('apareceu') || text.includes('Apareceu'),
          preview: text.substring(0, 200)
        });
      } catch (e) {}
    }
  });

  // Navegar para a página
  await page.goto('https://gattaran.didi-food.com/customerService/order/detail?orderId=5764678584400678506&cityId=55000199', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(5000);

  console.log(`📡 Total de requisições: ${allRequests.length}`);
  console.log(`📥 Total de respostas: ${allResponses.length}\n`);

  // Analisar respostas
  console.log('🔎 APIs que contêm "Outro":');
  const comOutro = allResponses.filter(r => r.hasOutro);
  comOutro.forEach((r, i) => {
    console.log(`\n${i + 1}. ${r.url.split('?')[0]}`);
    console.log(`   Status: ${r.status}`);
    console.log(`   Tamanho: ${r.size} bytes`);
    console.log(`   Tem "Cliente": ${r.hasCliente}`);
    console.log(`   Tem "apareceu": ${r.hasApareceu}`);
    console.log(`   Preview: ${r.preview.substring(0, 100)}...`);
  });

  if (comOutro.length === 0) {
    console.log('\n⚠️ Nenhuma API retornou "Outro"');
    console.log('\nPossíveis causas:');
    console.log('1. O dado está em uma API que requer permissões de admin');
    console.log('2. O dado é carregado via WebSocket (não capturado)');
    console.log('3. O dado está em um iframe separado');
    console.log('4. O dado não foi preenchido neste cancelamento');
  }

  // Listar todas as APIs únicas
  console.log('\n📋 Todas as APIs chamadas:');
  const uniqueUrls = [...new Set(allResponses.map(r => r.url.split('?')[0]))];
  uniqueUrls.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });

  await browser.close();
}

descobrir().catch(console.error);

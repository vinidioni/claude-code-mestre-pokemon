/**
 * Script de investigação para encontrar o motivo completo do cancelamento
 * Uso: node investigar-motivo.js [orderId] [cityId]
 */

import { chromium } from 'playwright';

const orderId = process.argv[2] || '5764678584400678506';
const cityId = process.argv[3] || '55000199';

async function investigar() {
  console.log(`🔍 Investigando order ${orderId}...\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Array para armazenar todas as chamadas de API
  const apiCalls = [];

  // Interceptar TODAS as chamadas de API
  page.on('request', request => {
    const url = request.url();
    if (url.includes('gateway') || url.includes('api') || url.includes('didi')) {
      apiCalls.push({
        type: 'request',
        url: url,
        method: request.method(),
        timestamp: new Date().toISOString()
      });
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('gateway') || url.includes('api') || url.includes('didi')) {
      try {
        const text = await response.text().catch(() => null);
        apiCalls.push({
          type: 'response',
          url: url,
          status: response.status(),
          hasOutro: text && text.includes('Outro'),
          hasCliente: text && text.includes('Cliente'),
          hasApareceu: text && text.includes('apareceu'),
          text: text ? text.substring(0, 500) : null,
          timestamp: new Date().toISOString()
        });
      } catch (e) {}
    }
  });

  try {
    // 1. Navegar para a página de detalhes diretamente
    console.log('1️⃣ Navegando para página de detalhes...');
    await page.goto(`https://gattaran.didi-food.com/customerService/order/detail?orderId=${orderId}&cityId=${cityId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForTimeout(8000);

    // 2. Verificar todas as APIs chamadas
    console.log('\n2️⃣ APIs chamadas:');
    const relevantCalls = apiCalls.filter(call =>
      call.url.includes('order') ||
      call.url.includes('cancel') ||
      call.url.includes('detail') ||
      call.url.includes('refund')
    );

    relevantCalls.forEach((call, idx) => {
      console.log(`\n${idx + 1}. ${call.type.toUpperCase()}`);
      console.log(`   URL: ${call.url.substring(0, 80)}...`);
      if (call.type === 'response') {
        console.log(`   Status: ${call.status}`);
        console.log(`   Contém "Outro": ${call.hasOutro}`);
        console.log(`   Contém "Cliente": ${call.hasCliente}`);
        console.log(`   Contém "apareceu": ${call.hasApareceu}`);
      }
    });

    // 3. Extrair TODO o texto da página para análise
    console.log('\n3️⃣ Analisando conteúdo da página...');
    const pageContent = await page.evaluate(() => {
      // Procurar por elementos que contenham "Outro"
      const outroElements = [];
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.includes('Outro')) {
          outroElements.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            text: text,
            title: el.getAttribute('title'),
            dataReason: el.getAttribute('data-reason'),
            dataCancel: el.getAttribute('data-cancel'),
            innerHTML: el.innerHTML.substring(0, 200)
          });
        }
      });

      // Procurar por "Cliente" ou "apareceu"
      const clienteElements = [];
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.trim();
        if (text && (text.toLowerCase().includes('cliente') || text.toLowerCase().includes('apareceu'))) {
          clienteElements.push({
            tag: el.tagName,
            class: el.className,
            text: text.substring(0, 100)
          });
        }
      });

      // Verificar se há algum campo de input ou textarea com esses valores
      const formFields = [];
      document.querySelectorAll('input, textarea, select').forEach(el => {
        const value = el.value?.trim();
        if (value && (value.includes('Outro') || value.includes('Cliente') || value.includes('apareceu'))) {
          formFields.push({
            tag: el.tagName,
            name: el.name,
            value: value
          });
        }
      });

      return {
        outroElements: outroElements.slice(0, 5),
        clienteElements: clienteElements.slice(0, 5),
        formFields: formFields,
        fullText: document.body.innerText.substring(0, 3000)
      };
    });

    console.log('\nElementos com "Outro":');
    pageContent.outroElements.forEach((el, idx) => {
      console.log(`\n${idx + 1}. <${el.tag}>${el.class ? ' class="' + el.class + '"' : ''}`);
      console.log(`   Texto: ${el.text}`);
      if (el.title) console.log(`   Title: ${el.title}`);
      if (el.dataReason) console.log(`   data-reason: ${el.dataReason}`);
      if (el.dataCancel) console.log(`   data-cancel: ${el.dataCancel}`);
    });

    console.log('\nElementos com "Cliente" ou "apareceu":');
    pageContent.clienteElements.forEach((el, idx) => {
      console.log(`\n${idx + 1}. <${el.tag}>${el.class ? ' class="' + el.class + '"' : ''}`);
      console.log(`   Texto: ${el.text}`);
    });

    console.log('\nCampos de formulário:');
    pageContent.formFields.forEach((field, idx) => {
      console.log(`\n${idx + 1}. ${field.tag} name="${field.name}"`);
      console.log(`   Valor: ${field.value}`);
    });

    // 4. Verificar se há algum elemento específico de cancelamento
    console.log('\n4️⃣ Verificando seção de cancelamento...');
    const cancelSection = await page.evaluate(() => {
      const sections = document.querySelectorAll('.el-collapse-item, .detail-section, .cancel-section');
      const cancelData = [];
      sections.forEach(section => {
        const header = section.querySelector('.el-collapse-item__header, .section-header');
        const content = section.querySelector('.el-collapse-item__content, .section-content');
        if (header && content) {
          cancelData.push({
            header: header.textContent?.trim(),
            content: content.textContent?.trim().substring(0, 200)
          });
        }
      });
      return cancelData;
    });

    console.log('Seções encontradas:');
    cancelSection.forEach((section, idx) => {
      console.log(`\n${idx + 1}. ${section.header}`);
      console.log(`   Conteúdo: ${section.content}`);
    });

    // 5. Tirar screenshot para análise visual
    await page.screenshot({ path: `investigacao-${orderId}.png`, fullPage: true });
    console.log(`\n📸 Screenshot salvo: investigacao-${orderId}.png`);

    // 6. Verificar se há algum botão ou link para expandir detalhes
    console.log('\n5️⃣ Verificando botões/links de expansão...');
    const expandableElements = await page.locator('button:has-text("View"), button:has-text("Details"), a:has-text("More"), [class*="expand"]').all();
    console.log(`Encontrados ${expandableElements.length} elementos expansíveis`);

    // Salvar relatório
    const report = {
      orderId,
      cityId,
      timestamp: new Date().toISOString(),
      apiCalls: relevantCalls,
      pageContent: {
        outroElements: pageContent.outroElements,
        clienteElements: pageContent.clienteElements,
        formFields: pageContent.formFields
      },
      conclusion: 'Análise completa. Verifique se há APIs adicionais ou elementos ocultos.'
    };

    await import('fs/promises').then(fs =>
      fs.writeFile(`investigacao-${orderId}.json`, JSON.stringify(report, null, 2))
    );
    console.log(`\n📄 Relatório salvo: investigacao-${orderId}.json`);

    console.log('\n✅ Investigação completa!');
    console.log('\nPróximos passos:');
    console.log('1. Verifique o arquivo investigacao-*.json');
    console.log('2. Olhe o screenshot para ver se há elementos visuais não capturados');
    console.log('3. Verifique se alguma API retorna dados adicionais');
    console.log('4. Tente clicar nos elementos expansíveis encontrados');

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await browser.close();
  }
}

investigar().catch(console.error);

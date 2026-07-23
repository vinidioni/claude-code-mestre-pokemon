#!/usr/bin/env node
/**
 * Script para abrir páginas do MCP Hub em modo interativo
 */
const { chromium } = require('playwright');

const url = process.argv[2] || 'https://mcphub.intra.xiaojukeji.com';

(async () => {
  console.log('🚀 Abrindo navegador...');
  console.log('📍 URL:', url);
  console.log('⏳ Faça login se necessário. Pressione ENTER no terminal quando terminar de visualizar.');

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('✅ Página carregada!');

    // Aguardar input do usuário
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
      console.log('\n💾 Salvando conteúdo...');

      // Extrair informações da página
      const content = await page.evaluate(() => {
        return {
          title: document.title,
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
            tag: h.tagName,
            text: h.innerText.trim()
          })),
          paragraphs: Array.from(document.querySelectorAll('p')).slice(0, 20).map(p => p.innerText.trim()).filter(t => t.length > 10),
          lists: Array.from(document.querySelectorAll('ul li, ol li')).slice(0, 30).map(li => li.innerText.trim()).filter(t => t.length > 0)
        };
      });

      // Salvar em arquivo
      const fs = require('fs');
      const outputFile = `C:\\Users\\viniciuscastanho\\Desktop\\dcc\\temp-storage\\mcp-content-${Date.now()}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(content, null, 2), 'utf-8');

      console.log('📝 Conteúdo salvo em:', outputFile);
      console.log('\n📋 Resumo:');
      console.log('Título:', content.title);
      console.log('Headings:', content.headings.length);
      console.log('Parágrafos:', content.paragraphs.length);
      console.log('Itens de lista:', content.lists.length);

      await browser.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    await browser.close();
    process.exit(1);
  }
})();

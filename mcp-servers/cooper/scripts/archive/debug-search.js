#!/usr/bin/env node
/**
 * Debug da página de busca
 */
import { BrowserAuth } from './src/auth/browser-auth.js';

async function debug() {
  console.log('🔍 Debug da busca no Cooper\n');
  console.log('=====================================\n');

  const auth = new BrowserAuth();

  try {
    const session = await auth.getAuthenticatedSession();
    console.log('✅ Autenticação OK\n');

    const searchUrl = 'https://cooper.didichuxing.com/search?keyword=onboarding';
    console.log(`📄 Acessando: ${searchUrl}\n`);

    await session.page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda estabilizar (redirecionamentos)
    let lastUrl = session.page.url();
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const currentUrl = session.page.url();
      if (currentUrl === lastUrl) break;
      lastUrl = currentUrl;
    }

    await new Promise(r => setTimeout(r, 5000));

    // Analisa a estrutura
    const analysis = await session.page.evaluate(() => {
      const url = window.location.href;
      const title = document.title;

      // Encontra todos os links para documentos
      const docLinks = Array.from(document.querySelectorAll('a[href*="/docs2/"], a[href*="/knowledge/"]'))
        .map(a => ({
          text: a.innerText?.trim()?.substring(0, 100),
          href: a.href,
          class: a.className
        }))
        .filter(l => l.text && l.text.length > 3);

      // Encontra elementos que parecem ser resultados de busca
      const resultSelectors = [
        '.search-result',
        '.result-item',
        '.doc-item',
        '[class*="search"]',
        '[class*="result"]'
      ];

      let resultElements = [];
      for (const selector of resultSelectors) {
        const elements = Array.from(document.querySelectorAll(selector));
        if (elements.length > 0) {
          resultElements = elements.map(el => ({
            selector,
            text: el.innerText?.substring(0, 200),
            class: el.className
          }));
          break;
        }
      }

      // Verifica se há mensagem de "nenhum resultado"
      const noResults = document.body.innerText.includes('无搜索结果') ||
                       document.body.innerText.includes('no results') ||
                       document.body.innerText.includes('没有找到');

      return {
        url,
        title,
        docLinks: docLinks.slice(0, 10),
        resultElements: resultElements.slice(0, 5),
        noResults,
        bodyPreview: document.body.innerText?.substring(0, 1000)
      };
    });

    console.log('URL:', analysis.url);
    console.log('Título:', analysis.title);
    console.log('\nLinks de documentos encontrados:', analysis.docLinks.length);
    analysis.docLinks.forEach((l, i) => {
      console.log(`  ${i + 1}. ${l.text}`);
      console.log(`     ${l.href}`);
    });

    console.log('\nElementos de resultado:', analysis.resultElements.length);
    analysis.resultElements.forEach((e, i) => {
      console.log(`\n  ${i + 1}. Seletor: ${e.selector}`);
      console.log(`     Classe: ${e.class}`);
      console.log(`     Texto: ${e.text?.substring(0, 100)}...`);
    });

    if (analysis.noResults) {
      console.log('\n⚠️ Página mostra "nenhum resultado"');
    }

    // Salva HTML para análise
    const fs = await import('fs');
    fs.writeFileSync('debug-search.html', await session.page.content());
    console.log('\n💾 HTML salvo em: debug-search.html');

    await auth.close();
    console.log('\n✅ Debug concluído!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

debug();

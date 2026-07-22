#!/usr/bin/env node
/**
 * Script de debug - salva HTML da página para análise
 */
import { BrowserAuth } from './src/auth/browser-auth.js';
import fs from 'fs';

const TEST_DOC_ID = '2207291123516';

async function debug() {
  console.log('🔍 Debug - Analisando estrutura da página Cooper\n');
  console.log('=====================================\n');

  const auth = new BrowserAuth();

  try {
    const session = await auth.getAuthenticatedSession();
    console.log('✅ Autenticação OK\n');

    const url = `https://cooper.didichuxing.com/docs2/document/${TEST_DOC_ID}`;
    console.log(`📄 Acessando: ${url}\n`);

    console.log('⏳ Navegando (SPA - carregamento dinâmico)...');
    await session.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda o loading desaparecer e conteúdo aparecer
    console.log('⏳ Aguardando carregamento do documento...');

    // Espera o loader sumir
    try {
      await session.page.waitForSelector('.doc-loading', { state: 'hidden', timeout: 30000 });
      console.log('   ✓ Loader desapareceu');
    } catch {
      console.log('   ⚠ Loader ainda presente, aguardando mais...');
    }

    // Espera conteúdo significativo aparecer
    console.log('⏳ Aguardando conteúdo renderizar...');
    let retries = 0;
    while (retries < 10) {
      const hasContent = await session.page.evaluate(() => {
        const contentDiv = document.getElementById('content');
        return contentDiv && contentDiv.innerText.length > 500;
      });
      if (hasContent) {
        console.log('   ✓ Conteúdo detectado!');
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
      retries++;
      process.stdout.write('.');
    }
    console.log();

    // Tempo adicional para estabilizar
    await new Promise(r => setTimeout(r, 3000));

    // Salva screenshot
    await session.page.screenshot({
      path: 'debug-screenshot.png',
      fullPage: true
    });
    console.log('📸 Screenshot salvo: debug-screenshot.png');

    // Salva HTML
    const html = await session.page.content();
    fs.writeFileSync('debug-page.html', html);
    console.log('📄 HTML salvo: debug-page.html');

    // Analisa estrutura
    const analysis = await session.page.evaluate(() => {
      // Verifica iframes
      const iframes = Array.from(document.querySelectorAll('iframe'))
        .map(f => ({ src: f.src, id: f.id, class: f.className }));

      // Tenta acessar shadow roots
      const shadowHosts = Array.from(document.querySelectorAll('*'))
        .filter(el => el.shadowRoot)
        .map(el => ({ tag: el.tagName, id: el.id, class: el.className }));

      // Encontra o maior bloco de texto
      const allElements = Array.from(document.querySelectorAll('div, article, section, main'));
      const textBlocks = allElements
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          textLength: el.innerText?.length || 0,
          textPreview: el.innerText?.substring(0, 200)
        }))
        .filter(b => b.textLength > 100)
        .sort((a, b) => b.textLength - a.textLength)
        .slice(0, 10);

      // Títulos possíveis
      const titles = Array.from(document.querySelectorAll('h1, [class*="title"], [class*="Title"]'))
        .map(h => ({
          text: h.innerText?.substring(0, 100),
          class: h.className,
          tag: h.tagName
        }))
        .filter(t => t.text);

      // Tenta acessar conteúdo de iframes (se houver)
      let iframeContent = '';
      if (iframes.length > 0) {
        try {
          const iframe = document.querySelector('iframe');
          if (iframe && iframe.contentDocument) {
            iframeContent = iframe.contentDocument.body?.innerText?.substring(0, 500) || '';
          }
        } catch (e) {
          iframeContent = 'Não foi possível acessar (cross-origin)';
        }
      }

      return {
        url: window.location.href,
        title: document.title,
        iframes,
        shadowHosts,
        titles,
        textBlocks,
        iframeContent
      };
    });

    fs.writeFileSync('debug-analysis.json', JSON.stringify(analysis, null, 2));
    console.log('📊 Análise salva: debug-analysis.json\n');

    console.log('Resumo:');
    console.log('=====================================');
    console.log(`URL: ${analysis.url}`);
    console.log(`Título: ${analysis.title}`);
    console.log(`\nH1s encontrados: ${analysis.titles.length}`);
    analysis.titles.forEach(t => console.log(`  - ${t.text.substring(0, 60)}`));

    console.log(`\nBlocos de texto maiores:`);
    analysis.textBlocks.slice(0, 5).forEach((b, i) => {
      console.log(`\n  ${i + 1}. ${b.tag}${b.class ? '.' + b.class.split(' ')[0] : ''}`);
      console.log(`     Caracteres: ${b.textLength}`);
      console.log(`     Preview: ${b.textPreview?.substring(0, 80)}...`);
    });

    await auth.close();
    console.log('\n✅ Debug concluído!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

debug();

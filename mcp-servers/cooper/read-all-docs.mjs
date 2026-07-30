#!/usr/bin/env node
/**
 * Lê todos os 4 documentos Data-E do Cooper
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const urls = [
  'https://cooper.didichuxing.com/knowledge/2199579337142/2203684467436',
  'https://cooper.didichuxing.com/knowledge/2204291401492/2204291776470',
  'https://cooper.didichuxing.com/knowledge/2204408191536/2204426900484',
  'https://cooper.didichuxing.com/knowledge/2203778693031/2203778843852'
];

async function extractDocument(page, url, index) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📄 DOCUMENTO ${index + 1}/4`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento - knowledge base pode ter iframe
    await new Promise(r => setTimeout(r, 8000));

    // Verifica se há iframes
    const frames = page.frames();
    let contentFrame = page;

    if (frames.length > 1) {
      console.log(`   🖼️  Detectado ${frames.length} frame(s)`);
      // Procura frame com conteúdo
      for (const frame of frames) {
        try {
          const hasContent = await frame.evaluate(() =>
            document.body?.innerText?.length > 500
          );
          if (hasContent) {
            contentFrame = frame;
            console.log('   ✅ Usando frame com conteúdo');
            break;
          }
        } catch (e) {
          // Ignora frames cross-origin
        }
      }
    }

    // Extrai informações
    const docInfo = await contentFrame.evaluate(() => {
      // Título
      let title = 'Sem título';
      const titleSelectors = [
        'h1', '.doc-title', '.knowledge-title', '[class*="title"]:not([class*="subtitle"])',
        '.page-title', 'header h1', '.ant-typography'
      ];
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el?.innerText?.trim() && el.innerText.length < 200) {
          title = el.innerText.trim();
          break;
        }
      }

      // Extrai todo o texto da página
      let fullText = '';

      // Tenta conteúdo estruturado primeiro
      const contentSelectors = [
        '.doc-content', '.knowledge-content', '.content-body',
        'article', 'main', '[class*="content"]:not([class*="container"])',
        '.editor-content', '.viewer-content', '.rich-text'
      ];

      for (const sel of contentSelectors) {
        const el = document.querySelector(sel);
        if (el?.innerText?.length > 500) {
          fullText = el.innerText;
          break;
        }
      }

      // Se não achou, pega body filtrando elementos de UI
      if (!fullText) {
        const body = document.body;
        // Remove elementos de navegação/UI
        const uiElements = body.querySelectorAll('nav, header, footer, aside, .sidebar, .menu, [class*="nav"], button, input');
        uiElements.forEach(el => el.remove());
        fullText = body.innerText;
      }

      // Extrai headings para estrutura
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.innerText?.trim()
        }))
        .filter(h => h.text && h.text.length > 0 && h.text.length < 200)
        .slice(0, 20);

      // Extrai links
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
          text: a.innerText?.trim().substring(0, 100),
          href: a.getAttribute('href')
        }))
        .filter(l => l.text && l.text.length > 5)
        .slice(0, 10);

      return {
        title,
        headings,
        links,
        fullText: fullText.substring(0, 15000),
        url: window.location.href
      };
    });

    // Exibe resumo
    console.log(`📋 TÍTULO: ${docInfo.title}`);
    console.log(`🔗 URL: ${docInfo.url}`);
    console.log(`📊 Tamanho: ${docInfo.fullText.length} caracteres\n`);

    if (docInfo.headings.length > 0) {
      console.log('📝 ESTRUTURA (Headings):');
      docInfo.headings.forEach(h => {
        const indent = '  '.repeat(h.level - 1);
        console.log(`${indent}${h.level === 1 ? '📌' : '•'} ${h.text}`);
      });
      console.log();
    }

    console.log('📄 CONTEÚDO:');
    console.log('-'.repeat(70));
    console.log(docInfo.fullText.substring(0, 12000));
    if (docInfo.fullText.length > 12000) {
      console.log('\n... [conteúdo truncado] ...');
    }
    console.log('-'.repeat(70));

    return docInfo;

  } catch (error) {
    console.error(`❌ Erro ao acessar documento ${index + 1}:`, error.message);
    return null;
  }
}

async function main() {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  console.log('🔐 Autenticado - Lendo 4 documentos Data-E...\n');

  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const doc = await extractDocument(page, urls[i], i);
    if (doc) results.push(doc);
  }

  await browser.close();

  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ RESUMO DOS 4 DOCUMENTOS');
  console.log(`${'='.repeat(70)}\n`);

  results.forEach((doc, i) => {
    console.log(`${i + 1}. ${doc.title}`);
    console.log(`   ${doc.url}`);
    console.log(`   ${doc.headings.length} seções, ${doc.fullText.length} caracteres\n`);
  });
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});

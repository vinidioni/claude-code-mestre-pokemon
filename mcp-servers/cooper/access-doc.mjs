#!/usr/bin/env node
/**
 * Acessa um documento específico do Cooper pelo ID
 * Usa as URLs que o usuário forneceu
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function accessDocument(url) {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log(`📄 Acessando: ${url}\n`);

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Aguarda carregamento
    await new Promise(r => setTimeout(r, 5000));

    // Extrai informações do documento
    const docInfo = await page.evaluate(() => {
      // Título
      const titleSelectors = [
        'h1',
        '.doc-title',
        '.knowledge-title',
        '[class*="title"]',
        'header h1',
        '.page-title'
      ];

      let title = 'Sem título';
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          title = el.innerText.trim().substring(0, 200);
          break;
        }
      }

      // Conteúdo principal
      const contentSelectors = [
        '.doc-content',
        '.knowledge-content',
        '.content-body',
        'article',
        'main',
        '[class*="content"]',
        '.editor-content'
      ];

      let content = '';
      for (const sel of contentSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.length > 100) {
          content = el.innerText.trim().substring(0, 5000);
          break;
        }
      }

      // Se não achou conteúdo específico, pega o body
      if (!content) {
        content = document.body.innerText.trim().substring(0, 5000);
      }

      // Lista todos os links knowledge encontrados
      const knowledgeLinks = Array.from(document.querySelectorAll('a[href*="/knowledge/"]'))
        .map(a => ({
          text: a.innerText?.trim().substring(0, 100),
          href: a.getAttribute('href')
        }))
        .filter(l => l.text && l.text.length > 3)
        .slice(0, 20);

      return {
        title,
        content: content.substring(0, 3000),
        url: window.location.href,
        knowledgeLinks
      };
    });

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📄 TÍTULO: ${docInfo.title}`);
    console.log(`🔗 URL: ${docInfo.url}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📝 CONTEÚDO:');
    console.log(docInfo.content);
    console.log('\n');

    if (docInfo.knowledgeLinks.length > 0) {
      console.log('🔗 LINKS RELACIONADOS (Knowledge):');
      docInfo.knowledgeLinks.forEach((link, i) => {
        console.log(`   ${i + 1}. ${link.text}`);
        console.log(`      ${link.href}`);
      });
    }

    return docInfo;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

// URLs fornecidas pelo usuário
const urls = [
  'https://cooper.didichuxing.com/knowledge/2199579337142/2203684467436',
  'https://cooper.didichuxing.com/knowledge/2204291401492/2204291776470',
  'https://cooper.didichuxing.com/knowledge/2204408191536/2204426900484',
  'https://cooper.didichuxing.com/knowledge/2203778693031/2203778843852'
];

// Acessa o primeiro documento
const targetUrl = process.argv[2] || urls[0];
accessDocument(targetUrl);

#!/usr/bin/env node
/**
 * Acessa iframes Shimo (石墨文档) dos documentos Data-E
 * Extrai conteúdo real dos documentos embedados
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');
const SHIMO_STORAGE = path.join(__dirname, '.shimo-storage.json');

// Lista de documentos Data-E para tentar acessar
const DATAE_DOCS = [
  {
    id: '2199647063221',
    name: '产品概述 (Visão Geral)',
    url: 'https://cooper.didichuxing.com/knowledge/2199579337142/2199647063221'
  },
  {
    id: '2199647150201',
    name: '快速入门 (Início Rápido)',
    url: 'https://cooper.didichuxing.com/knowledge/2199579337142/2199647150201'
  },
  {
    id: '2206895162035',
    name: '跨数据集筛选 (Chart Linkage)',
    url: 'https://cooper.didichuxing.com/knowledge/2199579337142/2206895162035'
  }
];

async function extractShimoContent(page, docInfo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📖 Documento: ${docInfo.name}`);
  console.log(`🔗 URL: ${docInfo.url}`);
  console.log('='.repeat(80));

  try {
    // Passo 1: Acessa página Cooper
    console.log('\n1️⃣ Acessando página Cooper...');
    await page.goto(docInfo.url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await new Promise(r => setTimeout(r, 5000));

    // Passo 2: Encontra iframe Shimo
    console.log('2️⃣ Procurando iframe Shimo...');
    const frames = page.frames();
    console.log(`   Total de frames: ${frames.length}`);

    let shimoFrame = null;
    let shimoUrl = null;

    for (const frame of frames) {
      const frameUrl = await frame.url().catch(() => '');
      console.log(`   - Frame: ${frameUrl.substring(0, 80)}...`);

      if (frameUrl.includes('shimo.im') || frameUrl.includes('doc/')) {
        shimoFrame = frame;
        shimoUrl = frameUrl;
        console.log(`   ✅ Frame Shimo encontrado!`);
        break;
      }
    }

    if (!shimoFrame) {
      console.log('   ⚠️ Nenhum iframe Shimo encontrado');

      // Tenta extrair da página principal
      const mainContent = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.substring(0, 2000);
      });

      console.log('\n   Conteúdo página principal:');
      console.log(mainContent);

      return { success: false, error: 'No Shimo iframe found' };
    }

    console.log(`\n3️⃣ URL Shimo: ${shimoUrl}`);

    // Passo 3: Tenta acessar diretamente o Shimo
    console.log('\n4️⃣ Acessando Shimo diretamente...');

    // Espera o frame carregar
    await shimoFrame.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));

    // Extrai conteúdo do Shimo
    const shimoContent = await shimoFrame.evaluate(() => {
      // Título
      const title = document.querySelector('h1, .doc-title, [class*="title"]')?.innerText?.trim() ||
                    document.querySelector('.ql-editor h1')?.innerText?.trim() ||
                    document.title;

      // Headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .ql-editor h1, .ql-editor h2, .ql-editor h3'))
        .map(h => ({
          level: parseInt(h.tagName?.[1]) || 1,
          text: h.innerText?.trim()
        }))
        .filter(h => h.text && h.text.length > 0 && h.text.length < 200);

      // Conteúdo - tenta vários seletores Shimo
      let content = '';
      const selectors = [
        '.ql-editor',
        '.doc-content',
        '[class*="content"]',
        '.editor-content',
        'article',
        'main'
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.length > 100) {
          content = el.innerText;
          break;
        }
      }

      // Se não achou, pega do body limpo
      if (!content) {
        const body = document.body.cloneNode(true);
        ['script', 'style', 'nav', 'header', 'aside'].forEach(sel => {
          body.querySelectorAll(sel).forEach(el => el.remove());
        });
        content = body.innerText;
      }

      // Filtra parágrafos
      const paragraphs = content.split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 20 && p.length < 500)
        .slice(0, 50);

      return {
        title,
        headings,
        paragraphs,
        fullText: content.substring(0, 10000),
        textLength: content.length
      };
    });

    console.log(`\n✅ SUCESSO!`);
    console.log(`   Título: ${shimoContent.title}`);
    console.log(`   Headings: ${shimoContent.headings.length}`);
    console.log(`   Parágrafos: ${shimoContent.paragraphs.length}`);
    console.log(`   Texto total: ${shimoContent.textLength} chars`);

    if (shimoContent.headings.length > 0) {
      console.log('\n   📋 Headings:');
      shimoContent.headings.forEach(h => {
        console.log(`   ${'  '.repeat(h.level - 1)}• ${h.text}`);
      });
    }

    if (shimoContent.paragraphs.length > 0) {
      console.log('\n   📝 Conteúdo (primeiros 10 parágrafos):');
      shimoContent.paragraphs.slice(0, 10).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.substring(0, 100)}${p.length > 100 ? '...' : ''}`);
      });
    }

    return {
      success: true,
      shimoUrl,
      ...shimoContent
    };

  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔓 Iniciando acesso a iframes Shimo...');
  console.log('Isso pode levar alguns minutos...\n');

  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  // Lança browser com storage do Cooper
  const browser = await chromium.launch({
    headless: true,
    slowMo: 100 // Slow motion para depuração
  });

  const context = await browser.newContext({
    storageState,
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  const results = [];

  for (const doc of DATAE_DOCS) {
    const result = await extractShimoContent(page, doc);
    results.push({
      docInfo: doc,
      ...result
    });

    // Pausa entre documentos
    if (doc !== DATAE_DOCS[DATAE_DOCS.length - 1]) {
      console.log('\n⏳ Pausa de 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await browser.close();

  // Resumo
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RESUMO');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success).length;
  console.log(`✅ Sucesso: ${successful}/${results.length}`);

  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    console.log(`\n${status} ${r.docInfo.name}`);
    if (r.success) {
      console.log(`   URL Shimo: ${r.shimoUrl?.substring(0, 60)}...`);
      console.log(`   Conteúdo: ${r.textLength} chars, ${r.paragraphs?.length} parágrafos`);
    } else {
      console.log(`   Erro: ${r.error}`);
    }
  });

  // Salva resultados
  const outputPath = path.join(__dirname, 'shimo-extraction-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n💾 Resultados salvos em: ${outputPath}`);
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});

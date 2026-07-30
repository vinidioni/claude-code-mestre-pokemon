#!/usr/bin/env node
/**
 * Lê o guia completo do Data-E navegando por todas as seções
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function extractFromFrame(frame, sectionName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📖 SEÇÃO: ${sectionName}`);
  console.log('='.repeat(80));

  try {
    // Aguarda carregamento do conteúdo
    await frame.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Extrai conteúdo do frame
    const content = await frame.evaluate(() => {
      // Título do documento
      const title = document.querySelector('h1, .doc-title, [class*="title"]')?.innerText?.trim() ||
                    document.title;

      // Headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.innerText?.trim()
        }))
        .filter(h => h.text && h.text.length > 0);

      // Conteúdo principal - remove UI elements
      const body = document.body.cloneNode(true);
      const uiSelectors = ['header', 'nav', '.sidebar', '.toolbar', '.menu', 'script', 'style'];
      uiSelectors.forEach(sel => {
        body.querySelectorAll(sel).forEach(el => el.remove());
      });

      // Filtra parágrafos relevantes
      const paragraphs = Array.from(body.querySelectorAll('p, div, section'))
        .map(p => p.innerText?.trim())
        .filter(t => t && t.length > 50 && t.length < 5000);

      // Procura por keywords específicas sobre chart linkage/filtros
      const keywords = ['linkage', '联动', 'filter', '筛选', '全局', 'global', 'chart', '图表'];
      const relevantContent = paragraphs.filter(p =>
        keywords.some(k => p.toLowerCase().includes(k.toLowerCase()) || p.includes(k))
      );

      return { title, headings, paragraphs, relevantContent };
    });

    console.log(`\n📋 Título: ${content.title}`);
    console.log(`📝 Total parágrafos: ${content.paragraphs.length}`);
    console.log(`🎯 Conteúdo relevante (filtros/linkage): ${content.relevantContent.length}`);

    if (content.headings.length > 0) {
      console.log('\n📝 Estrutura (Headings):');
      content.headings.forEach(h => {
        const indent = '  '.repeat(h.level - 1);
        console.log(`${indent}• ${h.text}`);
      });
    }

    if (content.relevantContent.length > 0) {
      console.log('\n🎯 CONTEÚDO RELEVANTE (Chart Linkage/Filtros):');
      console.log('-'.repeat(80));
      content.relevantContent.forEach((p, i) => {
        console.log(`\n[${i + 1}] ${p}`);
      });
      console.log('-'.repeat(80));
    }

    // Salva conteúdo completo
    console.log('\n📄 CONTEÚDO COMPLETO (primeiros 5000 chars):');
    console.log('-'.repeat(80));
    const fullText = content.paragraphs.join('\n\n');
    console.log(fullText.substring(0, 5000));
    console.log('-'.repeat(80));

    return { sectionName, ...content, fullText };

  } catch (error) {
    console.error(`❌ Erro na seção ${sectionName}:`, error.message);
    return null;
  }
}

async function main() {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  console.log('🔐 Autenticado - Iniciando leitura do guia Data-E...');
  console.log('='.repeat(80));

  // Acessa página principal (índice)
  console.log('\n📖 Acessando página principal (índice)...');
  await page.goto('https://cooper.didichuxing.com/knowledge/2199579337142/home', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 8000));

  // Extrai links para todas as sub-seções do Data-E
  const sections = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/knowledge/2199579337142/"]'))
      .map(a => ({
        text: a.innerText?.trim(),
        href: a.getAttribute('href')
      }))
      .filter(l => l.text && l.text.length > 0 && !l.href.includes('/home'));

    // Remove duplicados
    const unique = [];
    const seen = new Set();
    for (const link of links) {
      if (!seen.has(link.href)) {
        seen.add(link.href);
        unique.push(link);
      }
    }

    return unique.slice(0, 25); // Limita a 25 seções
  });

  console.log(`\n🔍 Encontradas ${sections.length} seções:`);
  sections.forEach((s, i) => console.log(`  ${i + 1}. ${s.text}`));

  // Conteúdo acumulado
  const allContent = [];

  // Acessa cada seção
  for (const section of sections) {
    try {
      const fullUrl = section.href.startsWith('http')
        ? section.href
        : `https://cooper.didichuxing.com${section.href}`;

      console.log(`\n🔄 Acessando: ${section.text}`);
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await new Promise(r => setTimeout(r, 5000));

      // Procura o frame com conteúdo (Shimo document)
      const frames = page.frames();
      console.log(`  Detectados ${frames.length} frame(s)`);

      let contentFrame = page;
      for (const frame of frames) {
        try {
          const url = await frame.url();
          if (url.includes('shimo.im') || url.includes('doc') || url.length > 50) {
            console.log(`  ✓ Frame com conteúdo: ${url.substring(0, 60)}...`);
            contentFrame = frame;
            break;
          }
        } catch (e) {}
      }

      const content = await extractFromFrame(contentFrame, section.text);
      if (content) {
        allContent.push(content);
      }
    } catch (e) {
      console.error(`  ❌ Erro ao acessar ${section.text}:`, e.message);
    }
  }

  // Resumo final
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMO DA LEITURA');
  console.log('='.repeat(80));

  // Procura por chart linkage em todo o conteúdo
  console.log('\n🔍 Buscando informações sobre Chart Linkage/Filtros Globais:');
  const keywords = ['linkage', '联动', 'filter', '筛选', '全局', 'global filter', 'chart 联动'];

  let foundRelevantInfo = false;
  for (const content of allContent) {
    if (content.relevantContent && content.relevantContent.length > 0) {
      foundRelevantInfo = true;
      console.log(`\n✅ Encontrado em "${content.sectionName}":`);
      content.relevantContent.forEach(p => {
        const excerpt = p.substring(0, 300);
        console.log(`   • ${excerpt}${p.length > 300 ? '...' : ''}`);
      });
    }
  }

  if (!foundRelevantInfo) {
    console.log('\n⚠️ Nenhuma informação específica sobre Chart Linkage encontrada nas seções.');
    console.log('\n💡 Sugestão: O documento pode estar em formato de link externo ou ');
    console.log('   a funcionalidade pode estar documentada em outro lugar.');
  }

  // Salva tudo em arquivo
  const output = {
    timestamp: new Date().toISOString(),
    source: 'https://cooper.didichuxing.com/knowledge/2199579337142/home',
    sections: allContent.map(c => ({
      name: c.sectionName,
      headings: c.headings,
      relevantContent: c.relevantContent
    }))
  };

  const outputPath = path.join(__dirname, 'datae-guide-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n💾 Conteúdo salvo em: ${outputPath}`);

  await browser.close();
  console.log('\n✅ Leitura concluída!');
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});

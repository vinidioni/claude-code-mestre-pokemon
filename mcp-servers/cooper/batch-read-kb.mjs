#!/usr/bin/env node
/**
 * Lê TODAS as seções da KB Data-E de uma vez e salva conteúdo bruto
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');
const OUTPUT_DIR = path.join(__dirname, 'kb-extracts');

// Lista de todas as seções
const SECTIONS = [
  { id: '2199579350325', name: '使用指南', category: 'guide' },
  { id: '2199647054553', name: '数易', category: 'core' },
  { id: '2204493551774', name: '自助分析', category: 'core' },
  { id: '2199587303729', name: '提取工具', category: 'tools' },
  { id: '2199587315584', name: '数据门户', category: 'portal' },
  { id: '2199613705175', name: '数据大屏', category: 'core' },
  { id: '2199587304221', name: '异动分析', category: 'core' },
  { id: '2199599720128', name: '北极星', category: 'other' },
  { id: '2202418649070', name: '数小智', category: 'ai' },
  { id: '2199587338647', name: '移动化产品', category: 'mobile' },
  { id: '2203597944990', name: '营销产品版本迭代', category: 'other' },
  { id: '2199587301215', name: 'Omega', category: 'platform' },
  { id: '2202108880462', name: 'Ditag标签平台', category: 'platform' },
  { id: '2202315628399', name: '实验评估产品', category: 'analysis' },
  { id: '2199587301149', name: '数据梦工厂', category: 'platform' },
  { id: '2199587308538', name: '指标平台', category: 'platform' },
  { id: '2199587317978', name: '资产管理平台', category: 'platform' },
  { id: '2199587329757', name: '数据地图', category: 'platform' },
  { id: '2199587320879', name: '数链', category: 'platform' },
  { id: '2199587318734', name: 'Notebook', category: 'tools' },
  { id: '2199587347847', name: '数据外发平台', category: 'tools' },
  { id: '2199904763653', name: '数据安全中心', category: 'security' },
  { id: '2204154706676', name: '大模型应用开发平台-Dify', category: 'ai' },
  { id: '2205564263801', name: '应用场景', category: 'usecases' },
  { id: '2208173856034', name: '无标题页面32', category: 'other' },
  { id: '2208389921216', name: '无标题页面33', category: 'other' }
];

async function extractSection(page, section) {
  const url = `https://cooper.didichuxing.com/knowledge/2199579337142/${section.id}`;
  console.log(`\n📖 Lendo: ${section.name}`);
  console.log(`   URL: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 6000));

    // Verifica frames
    const frames = page.frames();
    let contentFrame = page;
    for (const frame of frames) {
      const frameUrl = await frame.url();
      if (frameUrl.includes('shimo.im') || frameUrl.length > 100) {
        contentFrame = frame;
        break;
      }
    }

    const content = await contentFrame.evaluate(() => {
      const title = document.querySelector('h1, .doc-title, [class*="title"]')?.innerText?.trim() ||
                    document.title;

      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.innerText?.trim()
        }))
        .filter(h => h.text && h.text.length > 0);

      // Extrai texto limpo
      const body = document.body.cloneNode(true);
      ['script', 'style', 'nav', 'header'].forEach(sel => {
        body.querySelectorAll(sel).forEach(el => el.remove());
      });

      const fullText = body.innerText;

      // Extrai parágrafos significativos
      const paragraphs = fullText.split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 30 && p.length < 1000)
        .slice(0, 100);

      // Procura por links para sub-documentos
      const links = Array.from(document.querySelectorAll('a[href*="knowledge/"]'))
        .map(a => ({
          text: a.innerText?.trim(),
          href: a.getAttribute('href')
        }))
        .filter(l => l.text && l.text.length > 0 && l.text.length < 100);

      return { title, headings, paragraphs, links, textLength: fullText.length };
    });

    console.log(`   ✅ Título: ${content.title}`);
    console.log(`   📝 Headings: ${content.headings.length}`);
    console.log(`   📄 Parágrafos: ${content.paragraphs.length}`);
    console.log(`   🔗 Links: ${content.links.length}`);

    return {
      ...section,
      url,
      extractedAt: new Date().toISOString(),
      ...content
    };

  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}`);
    return {
      ...section,
      url,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 Iniciando leitura em lote da Knowledge Base Data-E...');
  console.log(`📊 Total de seções: ${SECTIONS.length}`);
  console.log('=' .repeat(80));

  // Cria diretório de saída
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  const results = [];

  // Processa em lotes de 5 para não sobrecarregar
  const BATCH_SIZE = 5;
  for (let i = 0; i < SECTIONS.length; i += BATCH_SIZE) {
    const batch = SECTIONS.slice(i, i + BATCH_SIZE);
    console.log(`\n\n🔄 Lote ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(SECTIONS.length/BATCH_SIZE)}`);
    console.log('-'.repeat(80));

    for (const section of batch) {
      const result = await extractSection(page, section);
      results.push(result);

      // Salva individual
      const filename = `${section.id}-${section.name.replace(/[^\w\s-]/g, '')}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(result, null, 2),
        'utf-8'
      );
    }

    // Pausa entre lotes
    if (i + BATCH_SIZE < SECTIONS.length) {
      console.log('\n⏳ Pausa de 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await browser.close();

  // Salva consolidado
  const summary = {
    extractedAt: new Date().toISOString(),
    totalSections: SECTIONS.length,
    successful: results.filter(r => !r.error).length,
    failed: results.filter(r => r.error).length,
    results: results.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      url: r.url,
      title: r.title || '(erro)',
      headingsCount: r.headings?.length || 0,
      paragraphsCount: r.paragraphs?.length || 0,
      error: r.error || null
    }))
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  // Gera relatório markdown
  let md = `# Data-E Knowledge Base - Extração Completa\n\n`;
  md += `**Data**: ${summary.extractedAt}\n\n`;
  md += `**Total**: ${summary.totalSections} seções | ✅ ${summary.successful} sucesso | ❌ ${summary.failed} falhas\n\n`;
  md += `---\n\n`;

  // Agrupa por categoria
  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    md += `## ${cat.toUpperCase()}\n\n`;
    for (const item of items) {
      md += `### ${item.name}\n`;
      md += `- **ID**: ${item.id}\n`;
      md += `- **URL**: ${item.url}\n`;
      if (item.error) {
        md += `- **Status**: ❌ Erro - ${item.error}\n`;
      } else {
        md += `- **Título**: ${item.title}\n`;
        md += `- **Headings**: ${item.headings?.length || 0}\n`;
        md += `- **Conteúdo**: ${item.paragraphs?.length || 0} parágrafos\n`;
        if (item.headings && item.headings.length > 0) {
          md += `- **Estrutura**:\n`;
          item.headings.forEach(h => {
            md += `  ${'  '.repeat(h.level-1)}- ${h.text}\n`;
          });
        }
      }
      md += `\n`;
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, '_README.md'), md, 'utf-8');

  console.log('\n\n' + '='.repeat(80));
  console.log('✅ EXTRAÇÃO CONCLUÍDA!');
  console.log('='.repeat(80));
  console.log(`\n📁 Arquivos salvos em: ${OUTPUT_DIR}`);
  console.log(`📄 Resumo: _summary.json`);
  console.log(`📝 Relatório: _README.md`);
  console.log(`📚 ${results.filter(r => !r.error).length} seções extraídas com sucesso`);
  if (summary.failed > 0) {
    console.log(`⚠️  ${summary.failed} seções com erro`);
  }
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});

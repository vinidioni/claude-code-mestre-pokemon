#!/usr/bin/env node
/**
 * Extrai TODOS os hiperlinks da knowledge base do Data-E
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function main() {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  console.log('🔍 Extraindo todos os links do Data-E Knowledge Base...');
  console.log('='.repeat(80));

  await page.goto('https://cooper.didichuxing.com/knowledge/2199579337142/home', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 8000));

  // Extrai todos os links
  const links = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a'));

    const extracted = allLinks.map(a => {
      const href = a.getAttribute('href');
      const text = a.innerText?.trim();
      const title = a.getAttribute('title');

      // Determina o tipo de link
      let type = 'other';
      if (href?.includes('/knowledge/')) {
        if (href.includes('/knowledge/2199579337142/')) {
          type = 'datae-section';
        } else {
          type = 'knowledge';
        }
      } else if (href?.includes('shimo.im')) {
        type = 'shimo-doc';
      } else if (href?.startsWith('http')) {
        type = 'external';
      }

      return {
        text: text || title || '(sem texto)',
        href: href || '(sem href)',
        type,
        hasText: !!text && text.length > 0
      };
    });

    // Remove duplicados baseado no href
    const seen = new Set();
    const unique = [];
    for (const link of extracted) {
      if (!seen.has(link.href)) {
        seen.add(link.href);
        unique.push(link);
      }
    }

    return unique;
  });

  // Organiza por tipo
  const byType = {
    'datae-section': [],
    'knowledge': [],
    'shimo-doc': [],
    'external': [],
    'other': []
  };

  for (const link of links) {
    if (byType[link.type]) {
      byType[link.type].push(link);
    } else {
      byType.other.push(link);
    }
  }

  // Exibe resumo
  console.log('\n📊 RESUMO DOS LINKS ENCONTRADOS:\n');
  console.log(`  📁 Seções Data-E (knowledge/2199579337142/): ${byType['datae-section'].length}`);
  console.log(`  📄 Outros Knowledge: ${byType['knowledge'].length}`);
  console.log(`  📑 Documentos Shimo: ${byType['shimo-doc'].length}`);
  console.log(`  🌐 Links Externos: ${byType['external'].length}`);
  console.log(`  ❓ Outros: ${byType['other'].length}`);
  console.log(`  ─────────────────────────`);
  console.log(`  📊 TOTAL: ${links.length}`);

  // Salva em formato legível
  const output = {
    source: 'https://cooper.didichuxing.com/knowledge/2199579337142/home',
    extractedAt: new Date().toISOString(),
    totalLinks: links.length,
    categories: {
      dataeSections: byType['datae-section'].map(l => ({
        title: l.text,
        url: l.href.startsWith('http') ? l.href : `https://cooper.didichuxing.com${l.href}`
      })),
      otherKnowledge: byType['knowledge'].map(l => ({
        title: l.text,
        url: l.href.startsWith('http') ? l.href : `https://cooper.didichuxing.com${l.href}`
      })),
      shimoDocs: byType['shimo-doc'].map(l => ({
        title: l.text,
        url: l.href
      })),
      externalLinks: byType['external'].map(l => ({
        title: l.text,
        url: l.href
      }))
    }
  };

  // Salva JSON
  const jsonPath = path.join(__dirname, 'all-links-datae-kb.json');
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf-8');

  // Salva formato Markdown para fácil leitura
  let mdContent = `# Data-E Knowledge Base - Todos os Links\n\n`;
  mdContent += `**Fonte**: ${output.source}\n\n`;
  mdContent += `**Extraído em**: ${output.extractedAt}\n\n`;
  mdContent += `**Total de links**: ${output.totalLinks}\n\n`;

  mdContent += `---\n\n`;
  mdContent += `## 📁 Seções Data-E (${output.categories.dataeSections.length} links)\n\n`;
  for (const link of output.categories.dataeSections) {
    mdContent += `- [${link.title}](${link.url})\n`;
  }

  mdContent += `\n---\n\n`;
  mdContent += `## 📄 Outros Knowledge (${output.categories.otherKnowledge.length} links)\n\n`;
  for (const link of output.categories.otherKnowledge.slice(0, 50)) {
    mdContent += `- [${link.title}](${link.url})\n`;
  }
  if (output.categories.otherKnowledge.length > 50) {
    mdContent += `\n... e mais ${output.categories.otherKnowledge.length - 50} links\n`;
  }

  mdContent += `\n---\n\n`;
  mdContent += `## 📑 Documentos Shimo (${output.categories.shimoDocs.length} links)\n\n`;
  for (const link of output.categories.shimoDocs) {
    mdContent += `- [${link.title}](${link.url})\n`;
  }

  mdContent += `\n---\n\n`;
  mdContent += `## 🌐 Links Externos (${output.categories.externalLinks.length} links)\n\n`;
  for (const link of output.categories.externalLinks.slice(0, 30)) {
    mdContent += `- [${link.title}](${link.url})\n`;
  }
  if (output.categories.externalLinks.length > 30) {
    mdContent += `\n... e mais ${output.categories.externalLinks.length - 30} links\n`;
  }

  const mdPath = path.join(__dirname, 'all-links-datae-kb.md');
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  console.log('\n✅ Arquivos salvos:');
  console.log(`  📄 JSON: ${jsonPath}`);
  console.log(`  📝 Markdown: ${mdPath}`);

  // Mostra os links Data-E (mais importantes)
  console.log('\n\n📋 SEÇÕES DATA-E (principais):\n');
  byType['datae-section'].forEach((link, i) => {
    const fullUrl = link.href.startsWith('http') ? link.href : `https://cooper.didichuxing.com${link.href}`;
    console.log(`${String(i + 1).padStart(2, '0')}. ${link.text}`);
    console.log(`    → ${fullUrl}\n`);
  });

  await browser.close();
  console.log('\n✅ Concluído!');
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});

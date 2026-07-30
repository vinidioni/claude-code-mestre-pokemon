#!/usr/bin/env node
/**
 * Lê TODOS os 11 documentos do Data-E e compila em um arquivo
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');
const OUTPUT_DIR = path.join(__dirname, '..', '..', '..', 'incubator', 'in-progress', 'data-e-documentation-compilation');

// Lista de TODOS os documentos Data-E
const DATAE_DOCUMENTS = [
  // Documentos principais (8)
  { id: '2199647063221', title: '产品概述 (Visão Geral)', order: 1 },
  { id: '2199647150201', title: '快速入门 (Início Rápido)', order: 2 },
  { id: '2199647093860', title: '功能介绍 (Funcionalidades)', order: 3 },
  { id: '2199647142737', title: '常见问题 (FAQ)', order: 4 },
  { id: '2199647142733', title: '产品动态 (Atualizações)', order: 5 },
  { id: '2199647135093', title: '学习资料 (Materiais)', order: 6 },
  { id: '2199717440257', title: '滴滴数据峰会作品合集 (Data Summit)', order: 7 },
  { id: '2206733911008', title: '更新中... (Updates)', order: 8 },

  // Documentos relacionados (3)
  { id: 'share/book/YcSAIftpNcle/2202742358625', title: '数小智-数易报告场景使用说明 (AI + Data-E)', order: 9, isShare: true },
  { id: '2199587338647', title: '移动化产品（数易、数梦、门户）(Mobile)', order: 10 }
];

async function extractDocument(page, doc) {
  const baseUrl = doc.isShare
    ? `https://cooper.didichuxing.com/knowledge/${doc.id}`
    : `https://cooper.didichuxing.com/knowledge/2199579337142/${doc.id}`;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📖 [${doc.order}/11] ${doc.title}`);
  console.log(`   URL: ${baseUrl}`);
  console.log('='.repeat(80));

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(r => setTimeout(r, 8000));

    // Procura frame com conteúdo
    const frames = page.frames();
    let contentFrame = page;
    for (const frame of frames) {
      const frameUrl = await frame.url();
      if (frameUrl.includes('shimo.im') || (frameUrl.length > 100 && !frameUrl.includes('home'))) {
        contentFrame = frame;
        console.log('   ✓ Usando frame com conteúdo');
        break;
      }
    }

    const content = await contentFrame.evaluate(() => {
      const title = document.querySelector('h1, .doc-title, [class*="title"]')?.innerText?.trim() ||
                    document.title || 'Sem título';

      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.innerText?.trim()
        }))
        .filter(h => h.text && h.text.length > 0);

      // Extrai texto limpo
      const body = document.body.cloneNode(true);
      ['script', 'style', 'nav', 'header', '.sidebar'].forEach(sel => {
        body.querySelectorAll(sel).forEach(el => el.remove());
      });

      const fullText = body.innerText;

      // Filtra parágrafos significativos (remove UI text)
      const paragraphs = fullText.split('\n')
        .map(p => p.trim())
        .filter(p => {
          // Remove linhas muito curtas, UI elements, etc
          if (p.length < 20 || p.length > 800) return false;
          // Remove linhas que parecem UI puro
          if (p.includes('ctrl+J') || p.includes('HomeTable') || p.includes('tagsShare')) return false;
          if (p.startsWith('Add comments') || p.includes('OutlineComment')) return false;
          return true;
        })
        .slice(0, 50); // Limita a 50 parágrafos mais relevantes

      // Extrai links relevantes para outros docs
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
          text: a.innerText?.trim(),
          href: a.getAttribute('href')
        }))
        .filter(l => {
          if (!l.text || l.text.length < 3) return false;
          // Filtra apenas links knowledge/shimo relevantes
          return (l.href?.includes('knowledge') || l.href?.includes('shimo.im'));
        })
        .slice(0, 15);

      return {
        title,
        headings,
        paragraphs,
        links,
        textLength: fullText.length
      };
    });

    console.log(`   ✅ Sucesso!`);
    console.log(`   📝 Título extraído: ${content.title}`);
    console.log(`   📊 Headings: ${content.headings.length}`);
    console.log(`   📄 Parágrafos: ${content.paragraphs.length}`);
    console.log(`   🔗 Links: ${content.links.length}`);

    return {
      success: true,
      docInfo: doc,
      url: baseUrl,
      ...content
    };

  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}`);
    return {
      success: false,
      docInfo: doc,
      url: baseUrl,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 Iniciando leitura de TODOS os documentos Data-E...');
  console.log(`📊 Total: ${DATAE_DOCUMENTS.length} documentos`);
  console.log('='.repeat(80));

  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  const results = [];

  // Processa documentos em sequência
  for (const doc of DATAE_DOCUMENTS) {
    const result = await extractDocument(page, doc);
    results.push(result);

    // Pausa entre documentos
    if (doc.order < DATAE_DOCUMENTS.length) {
      console.log('\n⏳ Pausa de 2s...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await browser.close();

  // Estatísticas
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RESUMO DA EXTRAÇÃO');
  console.log('='.repeat(80));
  console.log(`✅ Sucesso: ${successful}/${DATAE_DOCUMENTS.length}`);
  console.log(`❌ Falhas: ${failed}/${DATAE_DOCUMENTS.length}`);

  // Gera documento consolidado
  console.log('\n📝 Gerando documento consolidado...');

  let finalDoc = `# Data-E (数易) - Documentação Completa\n\n`;
  finalDoc += `**Compilado em**: ${new Date().toISOString()}\n\n`;
  finalDoc += `**Fonte**: Cooper Knowledge Base\n\n`;
  finalDoc += `**Documentos lidos**: ${successful}/${DATAE_DOCUMENTS.length}\n\n`;
  finalDoc += '---\n\n';

  // Índice
  finalDoc += '## Índice\n\n';
  results.filter(r => r.success).forEach((r, i) => {
    finalDoc += `${i + 1}. [${r.docInfo.title}](#${r.docInfo.order}-doc${r.docInfo.order})\n`;
  });
  finalDoc += '\n---\n\n';

  // Conteúdo de cada documento
  results.filter(r => r.success).forEach((r, i) => {
    finalDoc += `## ${r.docInfo.order}. ${r.docInfo.title}\n\n`;
    finalDoc += `**🔗 URL**: ${r.url}\n\n`;
    finalDoc += `**📖 Título extraído**: ${r.title}\n\n`;

    if (r.headings && r.headings.length > 0) {
      finalDoc += '### 📋 Estrutura (Headings)\n\n';
      r.headings.forEach(h => {
        finalDoc += `${'  '.repeat(h.level - 1)}- ${h.text}\n`;
      });
      finalDoc += '\n';
    }

    if (r.paragraphs && r.paragraphs.length > 0) {
      finalDoc += '### 📝 Conteúdo Principal\n\n';
      r.paragraphs.forEach((p, idx) => {
        finalDoc += `${idx + 1}. ${p}\n\n`;
      });
      finalDoc += '\n';
    }

    if (r.links && r.links.length > 0) {
      finalDoc += '### 🔗 Links Relacionados\n\n';
      r.links.forEach(l => {
        const url = l.href.startsWith('http') ? l.href : `https://cooper.didichuxing.com${l.href}`;
        finalDoc += `- [${l.text}](${url})\n`;
      });
      finalDoc += '\n';
    }

    finalDoc += '---\n\n';
  });

  // Seção de documentos com erro
  if (failed > 0) {
    finalDoc += '## ⚠️ Documentos com Erro\n\n';
    results.filter(r => !r.success).forEach(r => {
      finalDoc += `- **${r.docInfo.title}**: ${r.error}\n`;
      finalDoc += `  URL: ${r.url}\n\n`;
    });
    finalDoc += '\n---\n\n';
  }

  // Conclusão
  finalDoc += '## 🎯 Resumo Executivo\n\n';
  finalDoc += 'Esta documentação cobre:\n\n';
  finalDoc += '- **产品概述**: Visão geral do produto Data-E\n';
  finalDoc += '- **快速入门**: Guia de início rápido\n';
  finalDoc += '- **功能介绍**: Funcionalidades detalhadas\n';
  finalDoc += '- **常见问题**: FAQ e soluções\n';
  finalDoc += '- **产品动态**: Atualizações e novidades\n';
  finalDoc += '- **学习资料**: Materiais de treinamento\n';
  finalDoc += '- **Data Summit**: Cases e exemplos\n';
  finalDoc += '- **数小智集成**: Uso de AI com Data-E\n';
  finalDoc += '- **Mobile**: Uso em dispositivos móveis\n\n';

  // Salva arquivo
  const outputPath = path.join(OUTPUT_DIR, 'data-e-compiled-documentation.md');
  fs.writeFileSync(outputPath, finalDoc, 'utf-8');

  // Também salva JSON com dados brutos
  const jsonPath = path.join(OUTPUT_DIR, 'data-e-raw-extract.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    extractedAt: new Date().toISOString(),
    totalDocs: DATAE_DOCUMENTS.length,
    successful,
    failed,
    results: results.map(r => ({
      order: r.docInfo?.order,
      title: r.docInfo?.title,
      url: r.url,
      success: r.success,
      extractedTitle: r.title,
      headingsCount: r.headings?.length || 0,
      paragraphsCount: r.paragraphs?.length || 0
    }))
  }, null, 2), 'utf-8');

  console.log('\n✅ ARQUIVOS GERADOS:');
  console.log(`  📝 Documentação: ${outputPath}`);
  console.log(`  📄 JSON: ${jsonPath}`);

  console.log('\n✅ Concluído!');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});

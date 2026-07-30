#!/usr/bin/env node
/**
 * Cria catálogo de todos os sub-documentos linkados nas 26 seções
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DIR = path.join(__dirname, 'kb-extracts');
const OUTPUT_DIR = path.join(__dirname, '..', '..', '..', 'incubator', 'in-progress', 'data-e-documentation-compilation');

// Mapeamento de IDs para nomes
const SECTION_NAMES = {
  '2199579350325': '使用指南 (User Guide)',
  '2199647054553': '数易 (Data-E)',
  '2204493551774': '自助分析 (Self-service Analysis)',
  '2199587303729': '提取工具 (Extraction Tools)',
  '2199587315584': '数据门户 (Data Portal)',
  '2199613705175': '数据大屏 (Big Screen)',
  '2199587304221': '异动分析 (Anomaly Analysis)',
  '2199599720128': '北极星 (North Star)',
  '2202418649070': '数小智 (AI Assistant)',
  '2199587338647': '移动化产品 (Mobile Products)',
  '2203597944990': '营销产品版本迭代 (Marketing Iterations)',
  '2199587301215': 'Omega',
  '2202108880462': 'Ditag标签平台 (Tag Platform)',
  '2202315628399': '实验评估产品 (Experiment Evaluation)',
  '2199587301149': '数据梦工厂 (Data Dream Factory)',
  '2199587308538': '指标平台 (Metrics Platform)',
  '2199587317978': '资产管理平台 (Asset Management)',
  '2199587329757': '数据地图 (Data Map)',
  '2199587320879': '数链 (Data Chain)',
  '2199587318734': 'Notebook',
  '2199587347847': '数据外发平台 (Data Export)',
  '2199904763653': '数据安全中心 (Data Security)',
  '2204154706676': '大模型应用开发平台-Dify (LLM Platform)',
  '2205564263801': '应用场景 (Use Cases)',
  '2208173856034': '无标题页面32',
  '2208389921216': '无标题页面33'
};

function main() {
  console.log('📚 Criando catálogo de sub-documentos...\n');

  // Lê todos os arquivos JSON
  const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));

  const allSubdocs = [];
  const bySection = {};

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(KB_DIR, file), 'utf-8'));
    const sectionId = data.id;
    const sectionName = SECTION_NAMES[sectionId] || `Seção ${sectionId}`;

    bySection[sectionName] = [];

    if (data.links && data.links.length > 0) {
      for (const link of data.links) {
        // Filtra apenas links relevantes (knowledge e shimo)
        if (link.href && (
          link.href.includes('/knowledge/') ||
          link.href.includes('shimo.im')
        )) {
          // Evita duplicados do índice principal
          if (link.href.includes('2199579337142') && !link.href.includes(sectionId)) {
            continue;
          }

          const fullUrl = link.href.startsWith('http')
            ? link.href
            : `https://cooper.didichuxing.com${link.href}`;

          const subdoc = {
            section: sectionName,
            sectionId: sectionId,
            title: link.text,
            url: fullUrl,
            type: link.href.includes('shimo.im') ? 'shimo-doc' : 'knowledge-page'
          };

          allSubdocs.push(subdoc);
          bySection[sectionName].push(subdoc);
        }
      }
    }
  }

  // Remove duplicados globais
  const seen = new Set();
  const uniqueSubdocs = [];
  for (const doc of allSubdocs) {
    if (!seen.has(doc.url)) {
      seen.add(doc.url);
      uniqueSubdocs.push(doc);
    }
  }

  // Estatísticas
  const shimoCount = uniqueSubdocs.filter(d => d.type === 'shimo-doc').length;
  const knowledgeCount = uniqueSubdocs.filter(d => d.type === 'knowledge-page').length;

  console.log(`📊 Estatísticas:`);
  console.log(`  📄 Total de sub-documentos únicos: ${uniqueSubdocs.length}`);
  console.log(`  📑 Documentos Shimo: ${shimoCount}`);
  console.log(`  📋 Páginas Knowledge: ${knowledgeCount}`);
  console.log(`  📁 Seções com sub-docs: ${Object.keys(bySection).filter(k => bySection[k].length > 0).length}`);

  // Gera catálogo Markdown
  let md = `# Catálogo de Sub-Documentos Data-E\n\n`;
  md += `**Gerado em**: ${new Date().toISOString()}\n\n`;
  md += `**Total**: ${uniqueSubdocs.length} documentos | 📑 ${shimoCount} Shimo | 📋 ${knowledgeCount} Knowledge\n\n`;
  md += `---\n\n`;

  // Índice
  md += `## Índice por Seção\n\n`;
  for (const [sectionName, docs] of Object.entries(bySection)) {
    if (docs.length > 0) {
      md += `- [${sectionName}](#${sectionName.toLowerCase().replace(/[^\w]/g, '-')}) (${docs.length} docs)\n`;
    }
  }
  md += `\n---\n\n`;

  // Lista completa por seção
  for (const [sectionName, docs] of Object.entries(bySection)) {
    if (docs.length === 0) continue;

    md += `## ${sectionName}\n\n`;

    docs.forEach((doc, i) => {
      const icon = doc.type === 'shimo-doc' ? '📑' : '📋';
      md += `${icon} **${i + 1}. ${doc.title}**\n`;
      md += `   \`${doc.url}\`\n\n`;
    });
  }

  // Lista simplificada (apenas títulos e URLs)
  md += `\n---\n\n`;
  md += `## Lista Simplificada (para seleção)\n\n`;
  md += `Copie e cole os documentos que deseja que eu leia em detalhe:\n\n`;
  md += '```markdown\n';

  uniqueSubdocs.forEach((doc, i) => {
    const icon = doc.type === 'shimo-doc' ? '[Shimo]' : '[KB]';
    md += `${i + 1}. ${icon} ${doc.title}\n   URL: ${doc.url}\n\n`;
  });

  md += '```\n\n';

  // Cria diretório se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Salva arquivo
  const outputPath = path.join(OUTPUT_DIR, 'subdocuments-catalog.md');
  fs.writeFileSync(outputPath, md, 'utf-8');

  // Também salva JSON para processamento
  const jsonPath = path.join(OUTPUT_DIR, 'subdocuments-catalog.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    total: uniqueSubdocs.length,
    bySection: Object.fromEntries(
      Object.entries(bySection).filter(([k, v]) => v.length > 0)
    ),
    allSubdocs: uniqueSubdocs
  }, null, 2), 'utf-8');

  console.log(`\n✅ Catálogo salvo:`);
  console.log(`  📝 Markdown: ${outputPath}`);
  console.log(`  📄 JSON: ${jsonPath}`);

  // Preview das seções com mais documentos
  console.log(`\n📊 Top 5 Seções (por quantidade de docs):`);
  const sorted = Object.entries(bySection)
    .filter(([k, v]) => v.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  sorted.forEach(([name, docs], i) => {
    console.log(`  ${i + 1}. ${name}: ${docs.length} docs`);
  });
}

main();

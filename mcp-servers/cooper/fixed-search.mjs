#!/usr/bin/env node
/**
 * Versão corrigida da busca no Cooper
 * - Aguarda carregamento completo
 * - Usa múltiplas estratégias de busca
 * - Extrai de knowledge bases também
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function fixedSearch(query) {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log(`🔍 Buscando: "${query}"\n`);

    // Acessa a página principal
    await page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 3000));

    // ESTRATÉGIA 1: Tenta preencher diretamente via evaluate
    const filled = await page.evaluate((searchQuery) => {
      // Procura por qualquer input que pareça ser de busca
      const inputs = Array.from(document.querySelectorAll('input'));
      const searchInput = inputs.find(i =>
        i.placeholder?.toLowerCase().includes('search') ||
        i.placeholder?.includes('搜索') ||  // Chinês
        i.className?.toLowerCase().includes('search') ||
        i.type === 'search' ||
        (i.offsetParent !== null && i.type === 'text')
      );

      if (searchInput) {
        searchInput.value = searchQuery;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Tenta disparar busca com Enter
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        searchInput.dispatchEvent(enterEvent);

        return {
          success: true,
          placeholder: searchInput.placeholder,
          className: searchInput.className
        };
      }

      return { success: false };
    }, query);

    if (filled.success) {
      console.log('✅ Input de busca encontrado e preenchido');
      console.log(`   Placeholder: ${filled.placeholder || 'N/A'}`);
      console.log(`   Classe: ${filled.className || 'N/A'}`);
    } else {
      console.log('❌ Não encontrou input de busca via evaluate');
    }

    // Aguarda resultados carregarem
    await new Promise(r => setTimeout(r, 8000));

    // ESTRATÉGIA 3: Extrai resultados usando múltiplas abordagens
    const results = await page.evaluate(() => {
      const found = [];

      // Abordagem 1: Links de conhecimento/documentos
      const links = document.querySelectorAll('a[href*="/knowledge/"], a[href*="/docs2/"]');
      links.forEach(a => {
        const title = a.innerText?.trim() || a.getAttribute('title') || 'Sem título';
        const href = a.getAttribute('href');
        if (title.length > 5 && !found.some(f => f.url === href)) {
          found.push({
            title: title.substring(0, 200),
            url: href,
            type: href.includes('/knowledge/') ? 'knowledge' : 'document'
          });
        }
      });

      // Abordagem 2: Itens de resultado de busca
      const resultItems = document.querySelectorAll([
        '[class*="result"]',
        '[class*="item"]',
        '[class*="card"]',
        '[class*="doc"]',
        '[class*="knowledge"]'
      ].join(', '));

      resultItems.forEach(item => {
        const link = item.querySelector('a[href*="/knowledge/"], a[href*="/docs2/"]') || item;
        const href = link.getAttribute('href');
        if (href && !found.some(f => f.url === href)) {
          const title = item.querySelector('h3, h4, .title, [class*="title"]')?.innerText?.trim()
                     || item.innerText?.trim()
                     || 'Sem título';
          found.push({
            title: title.substring(0, 200),
            url: href,
            type: href.includes('/knowledge/') ? 'knowledge' : 'document'
          });
        }
      });

      // Abordagem 3: Qualquer elemento com título
      const titledElements = document.querySelectorAll('[title]');
      titledElements.forEach(el => {
        const href = el.getAttribute('href') || el.closest('a')?.getAttribute('href');
        if (href && (href.includes('/knowledge/') || href.includes('/docs2/'))) {
          if (!found.some(f => f.url === href)) {
            found.push({
              title: el.getAttribute('title') || el.innerText?.trim() || 'Sem título',
              url: href,
              type: href.includes('/knowledge/') ? 'knowledge' : 'document'
            });
          }
        }
      });

      return found;
    });

    console.log(`\n📄 ${results.length} resultado(s) encontrado(s):\n`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. [${r.type.toUpperCase()}] ${r.title}`);
      console.log(`   ${r.url}`);
      console.log();
    });

    return results;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}

// Executa busca
const query = process.argv[2] || 'Data-E';
fixedSearch(query).then(results => {
  console.log('✅ Busca concluída');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});

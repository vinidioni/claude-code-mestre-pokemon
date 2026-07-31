#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function searchCooper() {
  // Carrega storage state
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log('🌐 Acessando Cooper...\n');

    // Vai para a página e busca
    await page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 3000));

    // Lista de termos para buscar
    const terms = ['数据', 'Data', 'data-e', '数据 星球', '数据表'];

    for (const term of terms) {
      console.log(`\n========================================`);
      console.log(`🔍 Buscando: "${term}"`);
      console.log(`========================================`);

      try {
        // Tenta clicar na busca
        await page.click('.global-search-wrap, .search-icon, [class*="search"]', { timeout: 5000 })
          .catch(() => console.log('  ⚠️ Não encontrou botão de busca'));

        // Preenche busca
        await page.fill('input[type="text"], .search-input', term, { timeout: 5000 })
          .catch(() => console.log('  ⚠️ Não encontrou campo de busca'));

        await page.press('input[type="text"], .search-input', 'Enter');
        await new Promise(r => setTimeout(r, 5000));

        // Extrai resultados
        const results = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('.search-result-item, .result-item, a[href*="/docs2/"]'));
          return items.slice(0, 10).map(item => ({
            title: item.innerText?.trim().substring(0, 100) || 'Sem título',
            url: item.href || item.getAttribute('href')
          })).filter(r => r.title && r.title.length > 5);
        });

        if (results.length > 0) {
          console.log(`\n✅ ${results.length} resultado(s):`);
          results.forEach((r, i) => {
            console.log(`  ${i + 1}. ${r.title}`);
            if (r.url) console.log(`     ${r.url}`);
          });
        } else {
          console.log('\n  ❌ Nenhum resultado');
        }

      } catch (e) {
        console.log(`  ⚠️ Erro: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

searchCooper();

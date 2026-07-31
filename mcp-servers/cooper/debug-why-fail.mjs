#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function debugSearch() {
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log('🌐 Acessando Cooper...');
    await page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 3000));

    // Analisa elementos de busca na página
    const searchElements = await page.evaluate(() => {
      const results = [];

      // Procura por inputs
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input, i) => {
        results.push({
          type: 'input',
          index: i,
          placeholder: input.placeholder,
          class: input.className,
          id: input.id,
          type_attr: input.type,
          visible: input.offsetParent !== null
        });
      });

      // Procura por elementos com "search" no nome da classe
      const searchEls = document.querySelectorAll('[class*="search"], [class*="Search"]');
      searchEls.forEach((el, i) => {
        results.push({
          type: 'search-element',
          index: i,
          class: el.className,
          tag: el.tagName,
          text: el.innerText?.substring(0, 50),
          visible: el.offsetParent !== null
        });
      });

      // Procura por buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn, i) => {
        if (i < 5) {
          results.push({
            type: 'button',
            index: i,
            class: btn.className,
            text: btn.innerText?.substring(0, 50),
            visible: btn.offsetParent !== null
          });
        }
      });

      return results;
    });

    console.log('\n📋 Elementos de busca encontrados:');
    console.log(JSON.stringify(searchElements, null, 2));

    // Verifica se há iframes
    const frames = page.frames();
    console.log(`\n🖼️  Frames encontrados: ${frames.length}`);
    for (let i = 0; i < frames.length; i++) {
      const url = await frames[i].url().catch(() => 'N/A');
      console.log(`   Frame ${i}: ${url}`);
    }

    // Tenta fazer busca por "Data-E" manualmente
    console.log('\n🔍 Tentando busca manual por "Data-E"...');

    // Tenta várias estratégias
    const strategies = [
      { selector: 'input[placeholder*="搜索"]', name: 'Input chinês' },
      { selector: 'input[placeholder*="Search"]', name: 'Input inglês' },
      { selector: '.global-search-input', name: 'Global search' },
      { selector: '.search-input', name: 'Search input' },
      { selector: 'input[type="text"]', name: 'Qualquer input text' },
    ];

    for (const strat of strategies) {
      try {
        const input = page.locator(strat.selector).first();
        const count = await input.count();
        if (count > 0) {
          console.log(`   ✓ Estratégia "${strat.name}" funcionou!`);
          await input.fill('Data-E');
          await input.press('Enter');
          await new Promise(r => setTimeout(r, 5000));

          // Verifica resultados
          const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('a[href*="/knowledge/"], a[href*="/docs2/"]'));
            return items.map(a => ({
              text: a.innerText?.trim().substring(0, 100),
              href: a.getAttribute('href')
            })).filter(r => r.text);
          });

          console.log(`   📄 ${results.length} resultado(s) encontrado(s):`);
          results.slice(0, 5).forEach((r, i) => {
            console.log(`      ${i + 1}. ${r.text}`);
            console.log(`         ${r.href}`);
          });

          if (results.length > 0) break;
        }
      } catch (e) {
        console.log(`   ✗ Estratégia "${strat.name}" falhou: ${e.message}`);
      }
    }

    // Aguarda para usuário ver
    console.log('\n⏳ Aguardando 20 segundos...');
    await new Promise(r => setTimeout(r, 20000));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

debugSearch();

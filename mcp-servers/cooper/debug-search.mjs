#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

async function debugCooper() {
  // Carrega storage state
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: false }); // Visível para debug
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log('🌐 Acessando Cooper...');
    console.log('   (O navegador ficará aberto por 30 segundos)\n');

    await page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda e analisa a página
    await new Promise(r => setTimeout(r, 5000));

    // Extrai informações sobre a página
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      hasSearchButton: !!document.querySelector('.global-search-wrap, .search-icon, [class*="search"], button[type="button"]'),
      bodyText: document.body.innerText.substring(0, 500)
    }));

    console.log('📄 Informações da página:');
    console.log(`   Título: ${pageInfo.title}`);
    console.log(`   URL: ${pageInfo.url}`);
    console.log(`   Tem botão de busca: ${pageInfo.hasSearchButton}`);
    console.log(`   Texto: ${pageInfo.bodyText.substring(0, 200)}...`);

    // Tira screenshot
    await page.screenshot({ path: 'cooper-homepage.png' });
    console.log('\n📸 Screenshot salvo: cooper-homepage.png');

    // Aguarda para usuário ver
    await new Promise(r => setTimeout(r, 30000));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

debugCooper();

#!/usr/bin/env node
/**
 * Script para ler documentação do Cooper sobre API
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const urls = [
  'https://skillshub.intra.xiaojukeji.com/skill/cooper-mcp-troubleshoot',
  'https://cooper.didichuxing.com/knowledge/share/page/uRaZEPYXmPfm'
];

async function fetchDocs() {
  // Carrega sessão
  let storageState = undefined;
  if (fs.existsSync(STORAGE_PATH)) {
    console.log('🔄 Usando sessão salva...\n');
    storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  } else {
    console.log('❌ Sessão não encontrada. Faça login primeiro.');
    process.exit(1);
  }

  // Abre navegador headless
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  for (const url of urls) {
    console.log(`📄 Acessando: ${url}`);
    console.log('=' .repeat(60));

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise(r => setTimeout(r, 8000));

      // Extrai conteúdo
      const content = await page.evaluate(() => {
        // Tenta vários seletores de conteúdo
        const selectors = [
          '.doc-content',
          '.document-body',
          '.content',
          '[class*="content"]',
          'article',
          'main',
          '.knowledge-content',
          '.skill-content',
          '.page-content'
        ];

        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el && el.innerText.length > 200) {
            return el.innerText;
          }
        }

        // Fallback: extrai todo texto do body
        return document.body.innerText;
      });

      console.log(content.substring(0, 15000));
      console.log('\n' + '=' .repeat(60) + '\n');

    } catch (error) {
      console.error(`❌ Erro ao acessar ${url}:`, error.message);
    }
  }

  await browser.close();
}

fetchDocs().catch(console.error);

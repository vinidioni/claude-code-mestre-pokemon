#!/usr/bin/env node
/**
 * Setup de Autenticação Shimo (石墨文档)
 * Versão para execução manual pelo usuário
 *
 * Como usar:
 * 1. Execute em um terminal local: node setup-shimo-auth.js
 * 2. O browser vai abrir automaticamente
 * 3. Se pedir login, faça manualmente
 * 4. Aguarde o documento carregar
 * 5. Pressione ENTER no terminal para salvar a sessão
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(resolve => rl.question(q, a => resolve(a)));
}

(async () => {
  console.log('🔐 Setup de Autenticação Shimo (石墨文档)');
  console.log('=' .repeat(60));
  console.log('');
  console.log('Chrome/Edge vai abrir. Se pedir login:');
  console.log('1. Faça login com suas credenciais corporativas');
  console.log('2. Aguarde o documento carregar');
  console.log('3. Pressione ENTER aqui para salvar a sessão');
  console.log('');
  await ask('Pressione ENTER para começar...');

  // Paths
  const coopStorage = path.join(__dirname, '..', '.claude', 'mcp-servers', 'cooper', '.storage-state.json');
  const shimoStorage = path.join(__dirname, '..', '.claude', 'mcp-servers', 'cooper', '.shimo-storage.json');

  // Carrega storage Cooper
  let storage = {};
  if (fs.existsSync(coopStorage)) {
    storage = JSON.parse(fs.readFileSync(coopStorage, 'utf-8'));
  }

  // Abre browser VISÍVEL
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    storage: storage,
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Acessa documento Data-E
  const url = 'https://cooper.didichuxing.com/knowledge/2199579337142/2206895162035';
  console.log(`\nAbrindo: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  console.log('\n✅ Browser aberto!');
  console.log('Aguarde o documento carregar...');
  console.log('\nSe aparecer tela de login Shimo:');
  console.log('  - Faça login com SSO/credenciais corporativas');
  console.log('  - Aguarde o documento aparecer');
  console.log('  - Depois pressione ENTER aqui\n');

  await ask('Quando o documento estiver visível, pressione ENTER...');

  // Salva sessão
  const newStorage = await context.storageState();
  fs.writeFileSync(shimoStorage, JSON.stringify(newStorage, null, 2));

  console.log(`\n✅ Sessão Shimo salva em:`);
  console.log(`  ${shimoStorage}`);
  console.log('\nFeche o manualmente browser quando quiser.');

  await browser.close();
  rl.close();
})();

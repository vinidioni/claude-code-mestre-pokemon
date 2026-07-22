#!/usr/bin/env node
/**
 * Script para corrigir dependências - remove puppeteer e instala playwright
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Corrigindo dependências do Gattaran MCP Server...\n');

const __dirname = path.dirname(new URL(import.meta.url).pathname);
process.chdir(__dirname);

try {
  // Remove node_modules
  console.log('📁 Removendo node_modules antigo...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('   ✅ node_modules removido\n');
  }

  // Remove package-lock
  console.log('📄 Removendo package-lock.json...');
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('   ✅ package-lock.json removido\n');
  }

  // Instala dependências
  console.log('📦 Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Dependências instaladas\n');

  // Instala browsers do Playwright
  console.log('🌐 Instalando Chromium...');
  execSync('npx playwright install chromium', { stdio: 'inherit' });
  console.log('   ✅ Chromium instalado\n');

  console.log('✨ Tudo pronto!');
  console.log('\nPara testar, execute:');
  console.log('  node src/index.js');

} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}

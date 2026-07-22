#!/usr/bin/env node
/**
 * Script de setup do MCP Cooper
 * Valida se todas as configurações necessárias estão presentes
 *
 * Uso:
 *   node scripts/setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔧 Setup do MCP Cooper\n');
console.log('=' .repeat(50));

let hasErrors = false;

// 1. Verifica se .env existe
console.log('\n📋 Verificando arquivo .env...');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envPath)) {
  console.error('   ❌ Arquivo .env NÃO encontrado!');
  console.error('');
  console.log('   📝 Para corrigir:');
  console.log('      1. Copie o arquivo de exemplo:');
  console.log(`         cp .env.example .env`);
  console.log('');
  console.log('      2. Edite o arquivo .env e adicione seu token:');
  console.log('         COOPER_TOKEN=seu-token-aqui');
  console.log('');
  hasErrors = true;
} else {
  console.log('   ✅ Arquivo .env encontrado');
}

// 2. Verifica se .env.example existe (para referência)
console.log('\n📋 Verificando arquivo .env.example...');
if (!fs.existsSync(envExamplePath)) {
  console.error('   ⚠️  Arquivo .env.example não encontrado');
} else {
  console.log('   ✅ Arquivo .env.example encontrado');
}

// 3. Tenta carregar e validar o config
console.log('\n📋 Verificando configuração...');
try {
  // Import dinâmico para testar
  const configModule = await import('../config.js');
  const { CONFIG, validateConfig } = configModule;

  if (!validateConfig()) {
    hasErrors = true;
  } else {
    console.log('   ✅ Configuração válida!');
    console.log(`      API URL: ${CONFIG.API_URL}`);
    console.log(`      Versão: ${CONFIG.API_VERSION}`);
    console.log(`      Token: ${CONFIG.TOKEN.substring(0, 8)}...`);
  }
} catch (error) {
  console.error('   ❌ Erro ao carregar configuração:', error.message);
  hasErrors = true;
}

// 4. Verifica dependências
console.log('\n📋 Verificando dependências...');
try {
  await import('dotenv');
  console.log('   ✅ dotenv instalado');
} catch (error) {
  console.error('   ❌ dotenv não instalado!');
  console.log('      Instale com: npm install dotenv');
  hasErrors = true;
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup incompleto. Corrija os erros acima.');
  console.log('');
  console.log('📖 Documentação:');
  console.log('   https://github.com/vinidioni/claude-code-mestre-pokemon/blob/main/mcp-servers/cooper/README.md');
  process.exit(1);
} else {
  console.log('✅ Setup completo! MCP Cooper pronto para uso.');
  console.log('');
  console.log('🚀 Próximos passos:');
  console.log('   node scripts/create-doc-api.js');
  console.log('   node scripts/search-groceries.js');
  process.exit(0);
}

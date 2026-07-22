/**
 * Configuração centralizada do MCP Cooper
 *
 * Este arquivo carrega variáveis do .env e exporta um objeto CONFIG
 * para ser usado por todos os scripts.
 *
 * ⚠️ NUNCA commite o arquivo .env! Ele está no .gitignore
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega .env da pasta do mcp-server
dotenv.config({ path: join(__dirname, '.env') });

export const CONFIG = {
  // Token de autenticação (obrigatório)
  TOKEN: process.env.COOPER_TOKEN,

  // URL da API
  API_URL: process.env.COOPER_API_URL || 'http://10.88.128.45/cooper_mcp/mcp',

  // Versão da API
  API_VERSION: process.env.COOPER_API_VERSION || 'legacy',

  // Timeout em ms
  TIMEOUT: parseInt(process.env.COOPER_TIMEOUT) || 30000
};

// Validação
export function validateConfig() {
  if (!CONFIG.TOKEN || CONFIG.TOKEN === 'SEU_TOKEN_AQUI') {
    console.error('❌ ERRO: COOPER_TOKEN não configurado!');
    console.error('');
    console.error('   Para corrigir:');
    console.error('   1. Copie o arquivo .env.example para .env:');
    console.error('      cp .env.example .env');
    console.error('');
    console.error('   2. Edite o arquivo .env e adicione seu token:');
    console.error('      COOPER_TOKEN=seu-token-aqui');
    console.error('');
    console.error('   3. Obtenha o token em: https://mcphub.intra.xiaojukeji.com/square');
    console.error('');
    return false;
  }
  return true;
}

// Validação automática se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  if (validateConfig()) {
    console.log('✅ Configuração válida!');
    console.log(`   API: ${CONFIG.API_URL}`);
    console.log(`   Versão: ${CONFIG.API_VERSION}`);
    console.log(`   Token: ${CONFIG.TOKEN.substring(0, 8)}...`);
  }
}

/**
 * Configuração do MCP Cooper - LEGADO (não use mais)
 *
 * ⚠️ ATENÇÃO: Este arquivo está DEPRECIADO!
 *
 * A configuração agora é feita via arquivo .env na raiz do mcp-server.
 * Use o novo config.js na raiz do projeto.
 *
 * Novo fluxo:
 *   1. cp .env.example .env
 *   2. Edite .env com seu COOPER_TOKEN
 *   3. Importe de '../config.js' em vez deste arquivo
 *
 * Este arquivo será removido em versões futuras.
 */

console.warn('⚠️  DEPRECATED: Use ../config.js com variáveis de ambiente em vez deste arquivo!');
console.warn('   Veja: npm run setup');

// Exporta um placeholder - vai falhar intencionalmente
export const CONFIG = {
  TOKEN: process.env.COOPER_TOKEN || null,
  API_URL: process.env.COOPER_API_URL || 'http://10.88.128.45/cooper_mcp/mcp',
  API_VERSION: 'legacy',
  TIMEOUT: 30000
};

export function validateConfig() {
  if (!CONFIG.TOKEN) {
    console.error('❌ ERRO: COOPER_TOKEN não configurado no .env');
    return false;
  }
  return true;
}

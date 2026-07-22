/**
 * Configuração do MCP Cooper
 *
 * Como obter o token:
 * 1. Acesse: https://mcphub.intra.xiaojukeji.com/square
 * 2. Solicite um token da versão ANTIGA (Legacy)
 * 3. Cole abaixo substituindo o valor
 */

export const CONFIG = {
  // Token de autenticação (obter no MCPHub)
  TOKEN: 'fcfc9605-1d50-486f-aa72-80fca2315984',

  // URL da API (versão antiga - não requer LCA)
  API_URL: 'http://10.88.128.45/cooper_mcp/mcp',

  // Versão da API
  API_VERSION: 'legacy',

  // Timeout padrão (ms)
  TIMEOUT: 30000
};

// Validação
if (!CONFIG.TOKEN || CONFIG.TOKEN === 'SEU_TOKEN_AQUI') {
  console.error('❌ ERRO: Configure seu token em scripts/config.js');
  console.error('   Obtenha em: https://mcphub.intra.xiaojukeji.com/square');
  process.exit(1);
}

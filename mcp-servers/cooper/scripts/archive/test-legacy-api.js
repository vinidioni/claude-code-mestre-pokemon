#!/usr/bin/env node
/**
 * Testa a API antiga do Cooper MCP (sem LCA)
 */

const TOKEN = 'dXI4RkRwYkIvMFpZa0FBQUFTbUk5akYzSWE1bk94SWQ3b2NwVmtWUmxUSGZ6MmtFWk9pa3BFY2kyY3E2Z21jdGVpY2YxTVFycTVRd1k3RHZud3MwOERzQ1I0NUN5aXRydWtlNTIzdz0';
const LEGACY_API_URL = 'http://10.88.128.45/cooper_mcp/mcp';

async function testLegacyAPI() {
  console.log('🧪 Testando API ANTIGA do Cooper MCP...\n');
  console.log(`URL: ${LEGACY_API_URL}`);
  console.log(`Token: ${TOKEN.substring(0, 30)}...\n`);

  try {
    // Test 1: Listar ferramentas
    console.log('1️⃣ Listando ferramentas...');
    const response = await fetch(LEGACY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      })
    });

    const data = await response.json();
    console.log('\n📄 Resposta:', JSON.stringify(data, null, 2));

    if (data.result && data.result.tools) {
      console.log('\n✅ Ferramentas disponíveis:');
      data.result.tools.forEach((tool, i) => {
        console.log(`  ${i + 1}. ${tool.name}`);
      });
    } else if (data.error) {
      console.log('\n❌ Erro:', data.error.message);
    }

  } catch (error) {
    console.error('\n❌ Erro de conexão:', error.message);
    console.log('\n⚠️ Possíveis causas:');
    console.log('   1. Você não está na rede interna da DiDi');
    console.log('   2. A VPN não está conectada');
    console.log('   3. O servidor 10.88.128.45 não está acessível');
  }
}

testLegacyAPI();

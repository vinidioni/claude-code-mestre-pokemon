#!/usr/bin/env node
/**
 * Testa a API oficial do Cooper MCP
 */

const TOKEN = 'dXI4RkRwYkIvMFpZa0FBQUFTbUk5akYzSWE1bk94SWQ3b2NwVmtWUmxUSGZ6MmtFWk9pa3BFY2kyY3E2Z21jdGVpY2YxTVFycTVRd1k3RHZud3MwOERzQ1I0NUN5aXRydWtlNTIzdz0';
const API_URL = 'http://127.0.0.1:28582/v1/hub/cooper_mcp';

async function testAPI() {
  console.log('🧪 Testando API do Cooper MCP...\n');
  console.log(`URL: ${API_URL}`);
  console.log(`Token: ${TOKEN.substring(0, 20)}...\n`);

  try {
    // Test 1: Listar ferramentas
    console.log('1️⃣ Listando ferramentas disponíveis...');
    const listResponse = await fetch(API_URL, {
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

    const listData = await listResponse.json();
    console.log('✅ Resposta recebida!\n');
    console.log('Ferramentas disponíveis:');
    if (listData.result && listData.result.tools) {
      listData.result.tools.forEach((tool, i) => {
        console.log(`  ${i + 1}. ${tool.name} - ${tool.description?.substring(0, 60)}...`);
      });
    }
    console.log('\n' + '='.repeat(60) + '\n');

    // Test 2: Criar documento
    console.log('2️⃣ Criando documento de teste...');
    const createResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'cooper_create_document',
          arguments: {
            title: 'Documento do DCC',
            content: 'Oi pessoal, esse arquivo foi criado exclusivamente dentro do dcc. Só quem se arrisca merece viver o extraordinário.'
          }
        }
      })
    });

    const createData = await createResponse.json();
    console.log('✅ Documento criado!\n');
    console.log('Resposta:', JSON.stringify(createData, null, 2));

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n⚠️ Verifique se:');
    console.log('   1. O LCA (滴滴安全助手) está instalado e rodando');
    console.log('   2. A porta 28582 está disponível');
    console.log('   3. Você está na rede interna da DiDi');
  }
}

testAPI();

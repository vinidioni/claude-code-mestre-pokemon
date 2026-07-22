#!/usr/bin/env node
/**
 * Cria documento no Cooper via API oficial
 */

const TOKEN = 'fcfc9605-1d50-486f-aa72-80fca2315984';
const API_URL = 'http://10.88.128.45/cooper_mcp/mcp';

const docTitle = 'Documento do DCC';
const docContent = 'Oi pessoal, esse arquivo foi criado exclusivamente dentro do dcc. So quem se arrisca merece viver o extraordinario.';

async function createDocument() {
  console.log('📝 Criando documento no Cooper...\n');

  const requestBody = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'createCooperDocument',
      arguments: {
        spaceId: '0',
        parentId: '0',
        name: docTitle,
        content: docContent
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Resposta bruta:', responseText);

    // Processa SSE (Server-Sent Events)
    const lines = responseText.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.substring(6);
        try {
          const data = JSON.parse(jsonStr);
          console.log('\n📄 Resultado:', JSON.stringify(data, null, 2));

          if (data.result) {
            console.log('\n✅ Documento criado com sucesso!');
            if (data.result.docId) {
              console.log(`🔗 https://cooper.didichuxing.com/docs2/document/${data.result.docId}`);
            }
            if (data.result.resourceId) {
              console.log(`📄 Resource ID: ${data.result.resourceId}`);
            }
          } else if (data.error) {
            console.log('\n❌ Erro:', data.error.message || data.error);
          }
        } catch (e) {
          // Ignora linhas que não são JSON válido
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createDocument();

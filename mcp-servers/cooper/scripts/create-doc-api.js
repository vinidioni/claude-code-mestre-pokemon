#!/usr/bin/env node
/**
 * Cria documento no Cooper via API oficial
 *
 * Uso:
 *   node scripts/create-doc-api.js
 *
 * Configuração:
 *   1. Crie o arquivo .env a partir de .env.example
 *   2. Adicione seu COOPER_TOKEN
 */

import { CONFIG, validateConfig } from '../config.js';

// Configurações do documento (edite aqui)
const docTitle = 'Documento do DCC';
const docContent = 'Conteúdo do documento criado via API.';

async function createDocument() {
  // Valida configuração
  if (!validateConfig()) {
    process.exit(1);
  }

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
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.TOKEN}`,
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

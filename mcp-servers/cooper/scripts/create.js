#!/usr/bin/env node
/**
 * Cria documento no Cooper
 * Uso: node scripts/create.js "Título" "Conteúdo"
 */

import { CONFIG } from './config.js';

const title = process.argv[2] || 'Novo Documento';
const content = process.argv[3] || 'Conteúdo do documento';

async function createDocument() {
  console.log('📝 Criando documento...\n');
  console.log(`Título: ${title}`);
  console.log(`Conteúdo: ${content.substring(0, 50)}...\n`);

  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'createCooperDocument',
      arguments: {
        spaceId: '0',
        parentId: '0',
        name: title,
        content: content
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

    // Processa SSE
    const lines = responseText.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.substring(6);
        try {
          const data = JSON.parse(jsonStr);
          if (data.result?.content) {
            const contentText = data.result.content[0]?.text;
            if (contentText) {
              const result = JSON.parse(contentText);
              console.log('✅ Documento criado com sucesso!\n');
              console.log(`📄 Nome: ${result.docName}`);
              console.log(`🆔 Resource ID: ${result.resourceId}`);
              console.log(`🔗 URL: ${result.url}\n`);
              return result;
            }
          } else if (data.error) {
            console.error('❌ Erro:', data.error.message || data.error);
          }
        } catch (e) {
          // Ignora
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createDocument();

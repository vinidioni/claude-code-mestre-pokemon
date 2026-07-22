#!/usr/bin/env node
/**
 * Lê documento do Cooper
 * Uso: node scripts/read.js [resourceId]
 */

import { CONFIG } from './config.js';

const resourceId = process.argv[2] || '2208870008908';

async function readDocument() {
  console.log(`📖 Lendo documento: ${resourceId}\n`);

  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'readContent',
      arguments: {
        resourceId: resourceId,
        appId: 2,
        range: ''
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
              console.log('📄 Conteúdo:\n');
              console.log(contentText);
              console.log('\n✅ Leitura concluída!');
              return contentText;
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

readDocument();

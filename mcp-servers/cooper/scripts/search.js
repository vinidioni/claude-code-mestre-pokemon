#!/usr/bin/env node
/**
 * Busca documentos no Cooper
 * Uso: node scripts/search.js "termo de busca"
 */

import { CONFIG } from './config.js';

const searchTerm = process.argv[2] || 'onboarding';

async function search() {
  console.log(`🔍 Buscando: "${searchTerm}"...\n`);

  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'search',
      arguments: {
        key: searchTerm,
        spaceId: '0',
        pageNum: 0,
        pageSize: 10
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

              // Documentos
              if (result.document?.items?.length > 0) {
                console.log('📄 Documentos:');
                result.document.items.forEach(doc => {
                  console.log(`  • ${doc.name}`);
                  console.log(`    ID: ${doc.resourceId}`);
                  if (doc.url) console.log(`    URL: ${doc.url}`);
                  console.log();
                });
              }

              // Páginas
              if (result.allPages?.items?.length > 0) {
                console.log('📑 Páginas:');
                result.allPages.items.slice(0, 5).forEach(page => {
                  console.log(`  • ${page.name || 'Sem título'} (ID: ${page.resourceId})`);
                });
              }

              if (!result.document?.items?.length && !result.allPages?.items?.length) {
                console.log('❌ Nenhum resultado encontrado');
              }
            }
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

search();

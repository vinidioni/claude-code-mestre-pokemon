#!/usr/bin/env node
/**
 * Busca documentos sobre groceries em SP no Cooper
 *
 * Uso:
 *   node scripts/search-groceries.js
 *
 * Configuração:
 *   1. Crie o arquivo .env a partir de .env.example
 *   2. Adicione seu COOPER_TOKEN
 */

import { CONFIG, validateConfig } from '../config.js';

const searchTerms = [
  'groceries',
  'grocery',
  'mercado',
  'supermercado',
  'SP',
  'Sao Paulo',
  'food'
];

async function searchAll() {
  // Valida configuração
  if (!validateConfig()) {
    process.exit(1);
  }

  console.log('🔍 Buscando documentos sobre groceries...\n');

  for (const term of searchTerms) {
    console.log(`\n📄 Buscando: "${term}"`);
    console.log('-'.repeat(50));

    const requestBody = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search',
        arguments: {
          key: term,
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
            if (data.result && data.result.content) {
              const contentText = data.result.content[0]?.text;
              if (contentText) {
                const result = JSON.parse(contentText);

                // Verifica se tem resultados
                const hasResults = Object.values(result).some(
                  v => v && typeof v === 'object' && v.totalCount > 0
                );

                if (hasResults) {
                  console.log('✅ Resultados encontrados:');

                  if (result.document?.items?.length > 0) {
                    console.log('\n  📄 Documentos:');
                    result.document.items.forEach(doc => {
                      console.log(`    - ${doc.name} (ID: ${doc.resourceId})`);
                      if (doc.url) console.log(`      ${doc.url}`);
                    });
                  }
                } else {
                  console.log('  ❌ Nenhum resultado');
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

    // Aguarda entre buscas
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('🔍 Busca concluída!');
  console.log('='.repeat(60));
}

searchAll();

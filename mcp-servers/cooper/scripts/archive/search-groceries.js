#!/usr/bin/env node
/**
 * Busca documentos sobre groceries em SP no Cooper
 */

const TOKEN = 'fcfc9605-1d50-486f-aa72-80fca2315984';
const API_URL = 'http://10.88.128.45/cooper_mcp/mcp';

const searchTerms = [
  'groceries',
  'grocery',
  'mercado',
  'supermercado',
  'SP',
  'Sao Paulo',
  '55000199',
  'food',
  'lançamento'
];

async function searchAll() {
  console.log('🔍 Buscando documentos sobre groceries em SP...\n');

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

                  if (result.allPages?.items?.length > 0) {
                    console.log('\n  📑 Páginas:');
                    result.allPages.items.slice(0, 5).forEach(page => {
                      console.log(`    - ${page.name} (ID: ${page.resourceId})`);
                    });
                  }

                  if (result.wiki?.items?.length > 0) {
                    console.log('\n  📚 Wiki:');
                    result.wiki.items.forEach(wiki => {
                      console.log(`    - ${wiki.name}`);
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

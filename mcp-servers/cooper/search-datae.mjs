#!/usr/bin/env node
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const TOKEN = process.env.COOPER_TOKEN;
const API_URL = process.env.COOPER_API_URL || 'http://10.88.128.45/cooper_mcp/mcp';

if (!TOKEN) {
  console.error('❌ Token não configurado! Verifique o arquivo .env');
  process.exit(1);
}

async function search(term) {
  console.log(`\n========================================`);
  console.log(`🔍 Buscando: "${term}"`);
  console.log(`========================================`);

  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'search',
      arguments: {
        key: term,
        spaceId: '0',
        pageNum: 0,
        pageSize: 20
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
    const lines = responseText.split('\n');
    let foundAny = false;

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.substring(6);
        try {
          const data = JSON.parse(jsonStr);
          if (data.result?.content) {
            const contentText = data.result.content[0]?.text;
            if (contentText) {
              const result = JSON.parse(contentText);

              if (result.document?.items?.length > 0) {
                console.log('\n📄 Documentos:');
                result.document.items.forEach(doc => {
                  console.log(`  • ${doc.name}`);
                  console.log(`    ID: ${doc.resourceId}`);
                  if (doc.url) console.log(`    URL: ${doc.url}`);
                  foundAny = true;
                });
              }

              if (result.allPages?.items?.length > 0) {
                console.log('\n📑 Páginas:');
                result.allPages.items.slice(0, 10).forEach(page => {
                  console.log(`  • ${page.name || 'Sem título'} (ID: ${page.resourceId})`);
                  foundAny = true;
                });
              }
            }
          }
        } catch (e) {}
      }
    }

    if (!foundAny) {
      console.log('  ❌ Nenhum resultado');
    }
  } catch (error) {
    console.error('  Erro:', error.message);
  }
}

async function main() {
  const terms = process.argv.slice(2);
  if (terms.length === 0) {
    terms.push('data-e', 'Data-E', 'data e', 'DataE', 'DPX', 'big data', '数仓');
  }

  for (const term of terms) {
    await search(term);
  }
}

main();

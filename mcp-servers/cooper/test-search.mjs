#!/usr/bin/env node
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

async function searchCooper() {
  const auth = new BrowserAuth();

  try {
    console.log('🔐 Obtendo sessão autenticada...');
    const session = await auth.getAuthenticatedSession();

    console.log('📡 Criando cliente Cooper...');
    const client = new CooperClient(session.page);

    const searchTerms = ['data-e', 'Data-E', 'data e', 'DPX', 'data platform', 'big data'];

    for (const term of searchTerms) {
      console.log(`\n========================================`);
      console.log(`🔍 Buscando: "${term}"`);
      console.log(`========================================`);

      try {
        const results = await client.search(term, { limit: 10 });

        if (results.documents && results.documents.length > 0) {
          console.log('\n📄 Documentos:');
          results.documents.forEach(doc => {
            console.log(`  • ${doc.title || doc.name}`);
            console.log(`    ID: ${doc.id || doc.resourceId}`);
            if (doc.url) console.log(`    URL: ${doc.url}`);
          });
        }

        if (results.pages && results.pages.length > 0) {
          console.log('\n📑 Páginas:');
          results.pages.slice(0, 5).forEach(page => {
            console.log(`  • ${page.title || page.name || 'Sem título'} (ID: ${page.id || page.resourceId})`);
          });
        }

        if ((!results.documents || results.documents.length === 0) &&
            (!results.pages || results.pages.length === 0)) {
          console.log('  ❌ Nenhum resultado');
        }
      } catch (err) {
        console.log(`  ⚠️ Erro na busca: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await auth.close();
  }
}

searchCooper();

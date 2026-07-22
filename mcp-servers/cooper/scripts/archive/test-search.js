#!/usr/bin/env node
/**
 * Teste da funcionalidade de busca
 */
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

const TEST_QUERY = process.argv[2] || 'onboarding';

async function test() {
  console.log(`🔍 Teste de busca no Cooper: "${TEST_QUERY}"\n`);
  console.log('=====================================\n');

  const auth = new BrowserAuth();

  try {
    const session = await auth.getAuthenticatedSession();
    console.log('✅ Autenticação OK\n');

    const client = new CooperClient(session.page);

    const results = await client.search(TEST_QUERY, { limit: 10 });

    console.log('\n📊 Resultados:');
    console.log('=====================================');
    console.log(`Query: ${results.query}`);
    console.log(`Encontrados: ${results.count}\n`);

    if (results.results.length === 0) {
      console.log('❌ Nenhum resultado encontrado');
    } else {
      results.results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.title}`);
        console.log(`   URL: ${r.url}`);
        if (r.snippet) {
          console.log(`   Trecho: ${r.snippet.substring(0, 100)}...`);
        }
        console.log();
      });
    }

    await auth.close();
    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

test();

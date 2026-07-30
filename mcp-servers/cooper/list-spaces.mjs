#!/usr/bin/env node
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

async function listSpaces() {
  const auth = new BrowserAuth();

  try {
    console.log('🔐 Obtendo sessão...');
    const session = await auth.getAuthenticatedSession();

    console.log('📡 Criando cliente...\n');
    const client = new CooperClient(session.page);

    console.log('📁 Listando espaços disponíveis...\n');
    const spaces = await client.listSpaces();

    if (spaces.length === 0) {
      console.log('❌ Nenhum espaço encontrado');
    } else {
      console.log(`✅ ${spaces.length} espaço(s) encontrado(s):\n`);
      spaces.forEach((space, i) => {
        console.log(`${i + 1}. ${space.name}`);
        if (space.url) console.log(`   URL: ${space.url}`);
        console.log();
      });
    }

    // Tentar busca genérica por "数据" (dados em chinês)
    console.log('\n========================================');
    console.log('🔍 Buscando por "数据" (dados)...');
    console.log('========================================\n');

    const results = await client.search('数据', { limit: 20 });

    if (results.results && results.results.length > 0) {
      console.log(`✅ ${results.results.length} resultado(s):\n`);
      results.results.forEach((item, i) => {
        console.log(`${i + 1}. ${item.title}`);
        if (item.url) console.log(`   URL: ${item.url}`);
        if (item.snippet) console.log(`   Resumo: ${item.snippet.substring(0, 100)}...`);
        console.log();
      });
    } else {
      console.log('❌ Nenhum resultado para "数据"');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await auth.close();
  }
}

listSpaces();

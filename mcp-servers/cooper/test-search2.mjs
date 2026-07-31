#!/usr/bin/env node
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

async function searchCooper() {
  const auth = new BrowserAuth();

  try {
    console.log('🔐 Obtendo sessão auténtica...');
    const session = await auth.getAuthenticatedSession();

    console.log('📡 Criando cliente Cooper...\n');
    const client = new CooperClient(session.page);

    // Termos adicionais para tentativa
    const searchTerms = [
      '数据中台',     // Plataforma Dados
      '数据平台',     // Plataforma Dados
      '数据仓库',     // DW
      '大数据',       // Big data em chino
      '数据工程',     // Engenharia Dados
      '离线数据',     // Offline Dados
      '实时数据',     // Realtime Dados
      'Data Services',
      'Data Tools',
      'Data Analysis',
      '数仓平台',
      '巴西数据',     // Dados BR
      'Didi数据',     // Didi
    ];

    for (const term of searchTerms) {
      console.log(`\n========================================`);
      console.log(`🔍 Buscando: "${term}"`);
      console.log(`========================================\n`);

      try {
        const startTime = Date.now();
        const results = await client.search(term, { limit: 10 });
        const timeTaken = Date.now() - startTime;

        let foundAny = false;

        if (results.documents && results.documents.length > 0) {
          console.log(`📄 DOCUMENTOS (${results.documents.length}):'`);
          results.documents.forEach((doc, i) => {
            console.log(`${i + 1}. ${doc.title || doc.name}`);
            console.log(`   ID: ${doc.id || doc.resourceId}`);
            if (doc.url) console.log(`   URL: ${doc.url}`);
            if (doc.content) console.log(`   Resumo: ${doc.content.substring(0, 100)}...' || 'N/A'`);
            console.log();
          });
          foundAny = true;
        }

        if (results.pages && results.pages.length > 0) {
          console.log(`📑 PÁGINAS (${results.pages.length}):'`);
          results.pages.slice(0, 5).forEach((page, i) => {
            console.log(`${i + 1}. ${page.title || page.name || 'Sem título'}'`);
            console.log(`   ID: ${page.id || page.resourceId}`);
            if (page.url) console.log(`   URL: ${page.url}`);
          });
          foundAny = true;
        }

        if (!foundAny) {
          console.log(`❌ Nenhum resultado (${timeTaken}ms)`);
        } else {
          console.log(`\n✅ Encontrado em ${timeTaken}ms`);
        }

      } catch (err) {
        console.log(`⚠️ Erro na busca: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  } finally {
    await auth.close();
  }
}

searchCooper();

#!/usr/bin/env node
/**
 * Script de teste para validar autenticação do Cooper
 * Executa um teste simples: obter o documento de teste
 */
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

const TEST_DOC_ID = '2207291123516';

async function test() {
  console.log('🧪 Teste de conexão com Cooper\n');
  console.log('=====================================\n');

  const auth = new BrowserAuth();

  try {
    // Obtém sessão autenticada (abre navegador se necessário)
    const session = await auth.getAuthenticatedSession();

    console.log('✅ Autenticação OK\n');

    // Cria cliente e testa obter documento
    const client = new CooperClient(session.page);

    console.log(`📄 Testando obter documento: ${TEST_DOC_ID}\n`);

    // Debug: mostra URL atual antes
    const currentUrl = session.page.url();
    console.log(`   URL atual antes: ${currentUrl}`);

    const doc = await client.getDocument(TEST_DOC_ID);

    console.log(`   URL após carregar: ${doc.url}`);

    // Salva conteúdo completo em arquivo
    const fs = await import('fs');
    const outputFile = `doc_${TEST_DOC_ID}.txt`;
    fs.writeFileSync(outputFile,
      `Título: ${doc.title}\n` +
      `URL: ${doc.url}\n` +
      `Fonte: ${doc.contentSource || 'page'}\n` +
      `Tamanho: ${doc.content?.length || 0} caracteres\n\n` +
      `CONTEÚDO:\n${'='.repeat(50)}\n\n${doc.content}`
    );

    console.log('\n📊 Resultado:');
    console.log('=====================================');
    console.log(`Título: ${doc.title}`);
    console.log(`URL: ${doc.url}`);
    console.log(`Autor: ${doc.author || 'N/A'}`);
    console.log(`Data: ${doc.date || 'N/A'}`);
    console.log(`Headings: ${doc.headings?.length || 0}`);
    console.log(`Conteúdo: ${doc.content?.length || 0} caracteres`);
    console.log(`Fonte: ${doc.contentSource || 'page'}`);
    console.log(`\n💾 Conteúdo salvo em: ${outputFile}`);
    console.log('\nPrimeiros 500 caracteres:');
    console.log('-------------------------------------');
    console.log(doc.content?.substring(0, 500));
    console.log('\n=====================================');

    if (session.isNewAuth) {
      console.log('\n💡 Dica: Como foi a primeira autenticação,');
      console.log('   a sessão foi salva para reuso nas próximas vezes.');
    }

    await auth.close();
    console.log('\n✅ Teste concluído com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

test();

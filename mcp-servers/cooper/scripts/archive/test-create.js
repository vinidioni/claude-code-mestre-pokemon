#!/usr/bin/env node
/**
 * Teste da funcionalidade de criação de documentos
 */
import { BrowserAuth } from './src/auth/browser-auth.js';
import { CooperClient } from './src/api/cooper-client.js';

const TEST_TITLE = process.argv[2] || 'Documento de Teste';
const TEST_CONTENT = process.argv[3] || `Este é um documento de teste criado via MCP.

## Seção 1
Conteúdo da primeira seção.

## Seção 2
Conteúdo da segunda seção.

---
Criado automaticamente em: ${new Date().toISOString()}`;

async function test() {
  console.log(`📝 Teste de criação de documento\n`);
  console.log('=====================================\n');
  console.log(`Título: ${TEST_TITLE}`);
  console.log(`Conteúdo: ${TEST_CONTENT.substring(0, 100)}...\n`);

  const auth = new BrowserAuth();

  try {
    const session = await auth.getAuthenticatedSession();
    console.log('✅ Autenticação OK\n');

    const client = new CooperClient(session.page);

    // Mantém navegador aberto para o usuário ver/interagir
    console.log('🌐 Navegador ficará aberto para você verificar/ajustar o documento');
    console.log('   Feche o navegador quando terminar.\n');

    const result = await client.createDocument({
      title: TEST_TITLE,
      content: TEST_CONTENT,
    });

    console.log('\n📊 Resultado:');
    console.log('=====================================');
    console.log(`Sucesso: ${result.success}`);
    console.log(`URL: ${result.url}`);
    console.log(`Mensagem: ${result.message}`);
    console.log('\n=====================================');

    // Aguarda usuário fechar navegador
    console.log('\n⏳ Aguardando... (feche o navegador para continuar)');
    await new Promise(() => {}); // Espera infinitamente

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

test();

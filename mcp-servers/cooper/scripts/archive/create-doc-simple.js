#!/usr/bin/env node
/**
 * Script simples para criar documento no Cooper
 * Abre navegador visível para você preencher manualmente
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const title = process.argv[2] || 'Documento do DCC';
const content = process.argv[3] || 'Conteúdo do documento';

async function createDocument() {
  console.log('📝 Criando documento no Cooper...\n');
  console.log(`Título sugerido: ${title}`);
  console.log(`Conteúdo sugerido: ${content}\n`);

  // Carrega sessão se existir
  let storageState = undefined;
  if (fs.existsSync(STORAGE_PATH)) {
    console.log('🔄 Usando sessão salva...\n');
    storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  }

  // Abre navegador visível
  console.log('🌐 Abrindo navegador...\n');
  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1400,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    ...(storageState && { storageState })
  });

  const page = await context.newPage();

  // Navega para criação de documento
  console.log('⏳ Abrindo página de criação...\n');
  await page.goto('https://cooper.didichuxing.com/docs2/create', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Aguarda um pouco
  await new Promise(r => setTimeout(r, 5000));

  // Verifica se precisa de login
  const currentUrl = page.url();
  if (currentUrl.includes('login') || currentUrl.includes('stargate-auth')) {
    console.log('🔐 Por favor, faça login na sua conta Didi...');
    console.log('   Aguardando...\n');

    await page.waitForFunction(() => {
      const url = window.location.href;
      return !url.includes('login') && !url.includes('stargate-auth');
    }, { timeout: 300000 });

    console.log('✅ Login detectado!\n');

    // Salva sessão
    const newStorage = await context.storageState();
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(newStorage, null, 2));
    console.log('💾 Sessão salva para próximas vezes!\n');
  }

  // Aguarda página de criação carregar
  await new Promise(r => setTimeout(r, 5000));

  // Mensagem final
  console.log('='.repeat(60));
  console.log('✅ NAVEGADOR PRONTO!');
  console.log('='.repeat(60));
  console.log('\n📋 Instruções:');
  console.log('   1. O navegador está aberto na página de criação');
  console.log('   2. Copie o título abaixo:');
  console.log(`      "${title}"`);
  console.log('   3. Copie o conteúdo abaixo:');
  console.log(`      "${content}"`);
  console.log('   4. Cole no editor do Cooper');
  console.log('   5. Salve o documento');
  console.log('\n⚠️  NÃO FECHE ESTE TERMINAL');
  console.log('   (fecha automaticamente quando você salvar ou após 10 minutos)');
  console.log('='.repeat(60));

  // Aguarda 10 minutos ou até usuário fechar
  await new Promise(r => setTimeout(r, 600000));
  await browser.close();
}

createDocument().catch(console.error);

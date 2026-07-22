#!/usr/bin/env node
/**
 * Script standalone para criar documento no Cooper
 * Abre navegador visível para o usuário revisar e salvar
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
  console.log(`Título: ${title}`);
  console.log(`Conteúdo: ${content}\n`);

  // Carrega sessão se existir
  let storageState = undefined;
  if (fs.existsSync(STORAGE_PATH)) {
    console.log('🔄 Carregando sessão existente...');
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
  console.log('⏳ Navegando para o Cooper...');
  await page.goto('https://cooper.didichuxing.com/docs2/create', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Aguarda carregamento
  await new Promise(r => setTimeout(r, 8000));

  // Verifica se precisa de login
  const currentUrl = page.url();
  if (currentUrl.includes('login') || currentUrl.includes('stargate-auth')) {
    console.log('\n🔐 Por favor, faça login na sua conta Didi...');
    console.log('   Aguardando 5 minutos para login...\n');

    await page.waitForFunction(() => {
      const url = window.location.href;
      return !url.includes('login') && !url.includes('stargate-auth');
    }, { timeout: 300000 });

    console.log('✅ Login detectado!\n');
    await new Promise(r => setTimeout(r, 3000));

    // Salva sessão
    const newStorage = await context.storageState();
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(newStorage, null, 2));
    console.log('💾 Sessão salva!\n');
  }

  // Preenche título
  try {
    console.log('✏️  Preenchendo título...');
    const titleSelectors = [
      'input[placeholder*="标题"]',
      'input[placeholder*="title"]',
      'input[placeholder*="Title"]',
      '.doc-title-input',
      '[class*="title"] input'
    ];

    for (const selector of titleSelectors) {
      const input = page.locator(selector).first();
      const count = await input.count();
      if (count > 0) {
        await input.fill(title);
        console.log('   ✓ Título preenchido\n');
        break;
      }
    }
  } catch (e) {
    console.log('   ⚠️ Não foi possível preencher título automaticamente\n');
  }

  // Preenche conteúdo
  try {
    console.log('✏️  Preenchendo conteúdo...');
    await new Promise(r => setTimeout(r, 3000));

    const frame = page.frameLocator('iframe').first();
    const editor = frame.locator('[contenteditable="true"]').first();

    if (await editor.count() > 0) {
      await editor.fill(content);
      console.log('   ✓ Conteúdo preenchido\n');
    }
  } catch (e) {
    console.log('   ⚠️ Não foi possível preencher conteúdo automaticamente\n');
  }

  // Mensagem final
  console.log('='.repeat(60));
  console.log('✅ DOCUMENTO PRONTO!');
  console.log('='.repeat(60));
  console.log('\n📝 O navegador está aberto com:');
  console.log(`   Título: ${title}`);
  console.log(`   Conteúdo: ${content.substring(0, 50)}...`);
  console.log('\n👉 Por favor:');
  console.log('   1. Revise o conteúdo no navegador');
  console.log('   2. Faça ajustes se necessário');
  console.log('   3. Salve o documento no Cooper');
  console.log('\n⚠️  NÃO FECHE ESTE TERMINAL ATÉ SALVAR O DOCUMENTO');
  console.log('='.repeat(60));

  // Mantém aberto
  await new Promise(() => {});
}

createDocument().catch(console.error);

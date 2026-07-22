#!/usr/bin/env node
/**
 * Script que automatiza criação de documento no Cooper
 * Usa clipboard para preencher o conteúdo
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const docTitle = process.argv[2] || 'Documento do DCC';
const docContent = process.argv[3] || 'Conteúdo do documento';

async function createDocument() {
  console.log('📝 Criando documento no Cooper...\n');

  // Carrega sessão
  let storageState = undefined;
  if (fs.existsSync(STORAGE_PATH)) {
    console.log('🔄 Usando sessão salva...');
    storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
  }

  // Abre navegador
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

  try {
    // Navega para criação
    console.log('⏳ Carregando página de criação...');
    await page.goto('https://cooper.didichuxing.com/docs2/create', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 5000));

    // Verifica login
    if (page.url().includes('login') || page.url().includes('stargate-auth')) {
      console.log('🔐 Faça login...');
      await page.waitForFunction(() => {
        return !window.location.href.includes('login') &&
               !window.location.href.includes('stargate-auth');
      }, { timeout: 300000 });

      const newStorage = await context.storageState();
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(newStorage, null, 2));
      console.log('💾 Sessão salva!\n');
      await new Promise(r => setTimeout(r, 3000));
    }

    console.log('✅ Página carregada!\n');

    // Copia título para clipboard
    await page.evaluate((text) => {
      navigator.clipboard.writeText(text);
    }, docTitle);

    console.log('📋 Título copiado para clipboard');

    // Aguarda e clica no primeiro input
    await new Promise(r => setTimeout(r, 5000));

    // Clica no campo de título (primeiro input visível)
    await page.click('input[type="text"]');
    await new Promise(r => setTimeout(r, 500));

    // Cola
    await page.keyboard.press('Control+v');
    console.log('✏️ Título colado\n');

    await new Promise(r => setTimeout(r, 2000));

    // Copia conteúdo
    await page.evaluate((text) => {
      navigator.clipboard.writeText(text);
    }, docContent);

    console.log('📋 Conteúdo copiado para clipboard');

    // Clica no iframe/editor
    const iframe = page.frameLocator('iframe').first();
    const editor = iframe.locator('[contenteditable="true"]').first();

    if (await editor.count() > 0) {
      await editor.click();
      await new Promise(r => setTimeout(r, 500));
      await page.keyboard.press('Control+v');
      console.log('✏️ Conteúdo colado\n');
    }

    console.log('='.repeat(60));
    console.log('✅ DOCUMENTO PREENCHIDO!');
    console.log('='.repeat(60));
    console.log('\n📝 Verifique o navegador e clique em SALVAR');
    console.log('   Aguardando 2 minutos...\n');

    // Monitora URL para detectar quando salvar
    const startUrl = page.url();
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const currentUrl = page.url();

      if (currentUrl !== startUrl && currentUrl.includes('/document/')) {
        console.log('\n' + '='.repeat(60));
        console.log('🎉 DOCUMENTO SALVO!');
        console.log('='.repeat(60));
        console.log(`\n🔗 ${currentUrl}\n`);

        await new Promise(r => setTimeout(r, 5000));
        await browser.close();
        return currentUrl;
      }
    }

    console.log('\n⚠️  Tempo esgotado');
    console.log(`   URL: ${page.url()}\n`);
    await browser.close();
    return null;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    await browser.close();
    throw error;
  }
}

createDocument()
  .then(url => process.exit(url ? 0 : 1))
  .catch(() => process.exit(1));

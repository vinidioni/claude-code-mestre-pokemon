#!/usr/bin/env node
/**
 * Script que preenche automaticamente o documento no Cooper
 * e retorna o link após salvar
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const title = process.argv[2] || 'Documento do DCC';
const content = process.argv[3] || 'Conteúdo do documento';

async function createAndFillDocument() {
  console.log('📝 Criando documento no Cooper...\n');

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

  try {
    // Navega para criação de documento
    console.log('⏳ Abrindo página de criação...\n');
    await page.goto('https://cooper.didichuxing.com/docs2/create', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento inicial
    await new Promise(r => setTimeout(r, 5000));

    // Verifica se precisa de login
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('stargate-auth')) {
      console.log('🔐 Por favor, faça login na sua conta Didi...');
      console.log('   Aguardando login...\n');

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

    // Aguarda página de criação carregar completamente
    console.log('⏳ Aguardando editor carregar...');
    await new Promise(r => setTimeout(r, 8000));

    // Preenche título via JavaScript (mais confiável)
    console.log('✏️ Preenchendo título...');
    await page.evaluate((docTitle) => {
      // Tenta vários seletores comuns
      const selectors = [
        'input[placeholder*="标题"]',
        'input[placeholder*="title"]',
        'input[placeholder*="Title"]',
        '.doc-title-input',
        '[class*="title"] input[type="text"]',
        'input[data-testid*="title"]',
        'input[name*="title"]'
      ];

      for (const selector of selectors) {
        const input = document.querySelector(selector);
        if (input) {
          input.value = docTitle;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }

      // Tenta encontrar por atributos
      const allInputs = document.querySelectorAll('input[type="text"]');
      for (const input of allInputs) {
        if (input.placeholder && (input.placeholder.toLowerCase().includes('title') || input.placeholder.includes('标题'))) {
          input.value = docTitle;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }

      // Último recurso: primeiro input de texto visível
      for (const input of allInputs) {
        if (input.offsetParent !== null) { // visível
          input.value = docTitle;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }

      return false;
    }, title);
    console.log('   ✅ Título preenchido\n');

    // Aguarda iframe carregar
    await new Promise(r => setTimeout(r, 5000));

    // Preenche conteúdo no iframe
    console.log('✏️ Preenchendo conteúdo...');
    const contentFilled = await page.evaluate((docContent) => {
      try {
        // Tenta acessar o iframe
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentDocument) {
          const editable = iframe.contentDocument.querySelector('[contenteditable="true"]');
          if (editable) {
            editable.innerHTML = `<p>${docContent.replace(/\n/g, '</p><p>')}</p>`;
            editable.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
        }

        // Tenta encontrar editor na página principal
        const editor = document.querySelector('[contenteditable="true"]');
        if (editor) {
          editor.innerHTML = `<p>${docContent.replace(/\n/g, '</p><p>')}</p>`;
          editor.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }

        return false;
      } catch (e) {
        console.error('Erro ao preencher:', e);
        return false;
      }
    }, content);

    if (contentFilled) {
      console.log('   ✅ Conteúdo preenchido\n');
    } else {
      console.log('   ⚠️ Conteúdo não preenchido automaticamente\n');
    }

    // Mensagem para o usuário
    console.log('='.repeat(60));
    console.log('✅ DOCUMENTO PREENCHIDO!');
    console.log('='.repeat(60));
    console.log('\n📝 O navegador está aberto com:');
    console.log(`   Título: ${title}`);
    console.log(`   Conteúdo: ${content.substring(0, 50)}...`);
    console.log('\n👉 Por favor:');
    console.log('   1. Verifique se o conteúdo está correto');
    console.log('   2. Clique no botão "Save" / "保存" (Salvar)');
    console.log('   3. Aguarde o documento ser salvo');
    console.log('\n⏳ Aguardando 2 minutos para você salvar...');
    console.log('='.repeat(60) + '\n');

    // Aguarda 2 minutos ou detecta mudança de URL (documento salvo)
    const initialUrl = page.url();
    let savedUrl = null;

    // Verifica a cada 3 segundos se a URL mudou (indica que salvou)
    for (let i = 0; i < 40; i++) { // 40 * 3s = 120s = 2 minutos
      await new Promise(r => setTimeout(r, 3000));
      const currentUrl = page.url();

      // Se a URL mudou e contém /document/, o documento foi salvo
      if (currentUrl !== initialUrl && currentUrl.includes('/document/')) {
        savedUrl = currentUrl;
        console.log('\n' + '='.repeat(60));
        console.log('🎉 DOCUMENTO SALVO COM SUCESSO!');
        console.log('='.repeat(60));
        console.log(`\n🔗 Link do documento:`);
        console.log(`   ${savedUrl}\n`);
        break;
      }

      // Mostra contagem regressiva a cada 30s
      if ((i + 1) % 10 === 0) {
        const remaining = 120 - ((i + 1) * 3);
        console.log(`   ⏳ ${remaining}s restantes...`);
      }
    }

    if (!savedUrl) {
      console.log('\n⚠️  Tempo esgotado. Verifique no navegador se o documento foi salvo.');
      console.log(`   URL atual: ${page.url()}\n`);
    }

    // Mantém navegador aberto por mais 30s para usuário ver
    await new Promise(r => setTimeout(r, 30000));

    return savedUrl;

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

createAndFillDocument()
  .then(url => {
    if (url) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

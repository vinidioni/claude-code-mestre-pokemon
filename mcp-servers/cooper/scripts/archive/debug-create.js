#!/usr/bin/env node
/**
 * Debug da página de criação de documentos
 */
import { BrowserAuth } from './src/auth/browser-auth.js';

async function debug() {
  console.log('📝 Debug da criação de documentos\n');
  console.log('=====================================\n');

  const auth = new BrowserAuth();

  try {
    const session = await auth.getAuthenticatedSession();
    console.log('✅ Autenticação OK\n');

    // Navega para página de criação
    await session.page.goto('https://cooper.didichuxing.com/docs2/create', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 8000));

    // Analisa a estrutura
    const analysis = await session.page.evaluate(() => {
      const url = window.location.href;
      const title = document.title;

      // Encontra inputs
      const inputs = Array.from(document.querySelectorAll('input, textarea, [contenteditable]'))
        .map(el => ({
          tag: el.tagName,
          type: el.type,
          placeholder: el.placeholder,
          class: el.className,
          id: el.id
        }));

      // Encontra iframes
      const iframes = Array.from(document.querySelectorAll('iframe'))
        .map(f => ({ src: f.src, id: f.id, class: f.className }));

      // Verifica botões
      const buttons = Array.from(document.querySelectorAll('button'))
        .map(b => ({
          text: b.innerText?.trim(),
          class: b.className
        }))
        .filter(b => b.text);

      return {
        url,
        title,
        inputs: inputs.slice(0, 10),
        iframes,
        buttons: buttons.slice(0, 10)
      };
    });

    console.log('URL:', analysis.url);
    console.log('Título:', analysis.title);
    console.log('\nInputs encontrados:', analysis.inputs.length);
    analysis.inputs.forEach((inp, i) => {
      console.log(`  ${i + 1}. ${inp.tag}${inp.type ? ` (${inp.type})` : ''}`);
      console.log(`     Placeholder: ${inp.placeholder || 'N/A'}`);
      console.log(`     Classe: ${inp.class}`);
    });

    console.log('\nIframes:', analysis.iframes.length);
    analysis.iframes.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.src?.substring(0, 80)}...`);
    });

    console.log('\nBotões:', analysis.buttons.length);
    analysis.buttons.slice(0, 5).forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.text} (${b.class})`);
    });

    // Salva screenshot
    await session.page.screenshot({ path: 'debug-create.png', fullPage: true });
    console.log('\n📸 Screenshot salvo: debug-create.png');

    await auth.close();
    console.log('\n✅ Debug concluído!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await auth.close();
    process.exit(1);
  }
}

debug();

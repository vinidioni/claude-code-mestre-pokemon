/**
 * Verificar se o motivo completo está em arquivos de configuração
 */

import { chromium } from 'playwright';

async function verificar() {
  console.log('🔍 Verificando arquivos de configuração...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Acessar diretamente o arquivo de tradução
    console.log('1️⃣ Buscando arquivo de tradução...');
    const i18nResponse = await page.goto(
      'https://img0.didiglobal.com/static/copywriter_h5/H5-soda-fe-b_cs-platform_i18n/src/utils/i18n/full.js',
      { timeout: 30000 }
    );

    const i18nText = await i18nResponse.text();

    // Procurar por "Outro" no arquivo
    const outroMatches = i18nText.match(/Outro[^"]*/g);
    if (outroMatches) {
      console.log('\n✅ Encontrados textos com "Outro":');
      outroMatches.slice(0, 10).forEach((match, i) => {
        console.log(`   ${i + 1}. ${match}`);
      });
    }

    // Procurar especificamente por "3:Outro"
    const pattern3Outro = i18nText.match(/3:Outro[^"]*/g);
    if (pattern3Outro) {
      console.log('\n🎯 Padrões "3:Outro" encontrados:');
      pattern3Outro.forEach((match, i) => {
        console.log(`   ${i + 1}. ${match}`);
      });
    }

    // Procurar por contexto maior
    const contextMatch = i18nText.match(/Outro.{0,100}apareceu/gi);
    if (contextMatch) {
      console.log('\n📄 Contexto "Outro...apareceu":');
      contextMatch.forEach((match, i) => {
        console.log(`   ${i + 1}. ${match}`);
      });
    }

    // 2. Verificar se há mapeamento de códigos
    console.log('\n2️⃣ Procurando mapeamento de códigos de cancelamento...');
    const cancelCodes = i18nText.match(/cancel[^"]*3[^"]*/gi);
    if (cancelCodes) {
      console.log('Códigos de cancelamento encontrados:');
      cancelCodes.slice(0, 5).forEach((code, i) => {
        console.log(`   ${i + 1}. ${code}`);
      });
    }

    // 3. Salvar trechos relevantes
    const relevantSection = i18nText.substring(
      i18nText.indexOf('Outro') - 100,
      i18nText.indexOf('Outro') + 200
    );

    console.log('\n3️⃣ Trecho relevante do arquivo:');
    console.log(relevantSection);

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await browser.close();
  }
}

verificar().catch(console.error);

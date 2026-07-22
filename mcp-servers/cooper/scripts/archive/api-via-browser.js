#!/usr/bin/env node
/**
 * Usa o navegador autenticado para chamar a API do Cooper
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '.storage-state.json');

const TOKEN = 'dXI4RkRwYkIvMFpZa0FBQUFTbUk5akYzSWE1bk94SWQ3b2NwVmtWUmxUSGZ6MmtFWk9pa3BFY2kyY3E2Z21jdGVpY2YxTVFycTVRd1k3RHZud3MwOERzQ1I0NUN5aXRydWtlNTIzdz0';
const API_URL = 'http://127.0.0.1:28582/v1/hub/cooper_mcp';

const title = process.argv[2] || 'Documento do DCC';
const content = process.argv[3] || 'Conteúdo do documento';

async function createViaBrowser() {
  console.log('📝 Criando documento via API do Cooper...\n');

  // Carrega sessão
  const storageState = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));

  // Abre navegador headless com sessão
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    // Acessa uma página do Cooper para garantir que estamos autenticados
    console.log('🔄 Verificando autenticação...');
    await page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const url = page.url();
    if (url.includes('login')) {
      console.log('❌ Não está autenticado no Cooper');
      await browser.close();
      return;
    }
    console.log('✅ Autenticado no Cooper\n');

    // Agora faz a chamada à API usando o contexto do navegador
    console.log('📡 Chamando API...');
    const response = await page.evaluate(async (apiUrl, token, docTitle, docContent) => {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'cooper_create_document',
              arguments: {
                title: docTitle,
                content: docContent
              }
            }
          })
        });
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    }, API_URL, TOKEN, title, content);

    console.log('\n📄 Resposta da API:');
    console.log(JSON.stringify(response, null, 2));

    if (response.result) {
      console.log('\n✅ Documento criado com sucesso!');
    } else if (response.error) {
      console.log('\n❌ Erro:', response.error.message || response.error);
    }

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await browser.close();
  }
}

createViaBrowser();

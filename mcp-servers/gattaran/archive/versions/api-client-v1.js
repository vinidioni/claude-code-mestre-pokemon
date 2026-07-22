/**
 * Gattaran API Client
 * Extrai dados de orders via browser automation com sessão persistente
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

export class GattaranAPIClient {
  constructor(options = {}) {
    this.headless = options.headless !== false;
    this.sessionFile = options.sessionFile || '.gattaran-session.json';
    this.baseUrl = 'https://gattaran.didi-food.com';
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Inicializando Gattaran API Client...');

    this.browser = await chromium.launch({
      headless: this.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const sessionData = await this.loadSession();

    if (sessionData) {
      console.log('📂 Sessão anterior encontrada, tentando reutilizar...');
      this.context = await this.browser.newContext({
        storageState: sessionData
      });
    } else {
      console.log('🆕 Nova sessão');
      this.context = await this.browser.newContext();
    }

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);

    const isAuthenticated = await this.checkAuth();

    if (!isAuthenticated) {
      console.log('\n🔐 ===========================================');
      console.log('FAÇA LOGIN NO GATTARAN (browser que abriu)');
      console.log('Após logar, a automação continuará automaticamente.');
      console.log('===========================================\n');

      await this.page.goto(`${this.baseUrl}/v2/home`, { waitUntil: 'networkidle' });

      await this.page.waitForFunction(
        () => window.location.href.includes('/v2/') && !window.location.href.includes('login'),
        { timeout: 300000 }
      );

      console.log('✅ Login detectado!');
      await this.saveSession();
    }

    console.log('✅ Cliente inicializado\n');
    return this;
  }

  async loadSession() {
    try {
      const data = await fs.readFile(this.sessionFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async saveSession() {
    try {
      const storageState = await this.context.storageState();
      await fs.writeFile(this.sessionFile, JSON.stringify(storageState, null, 2));
      console.log('💾 Sessão salva');
    } catch (error) {
      console.error('Erro ao salvar sessão:', error.message);
    }
  }

  async checkAuth() {
    try {
      await this.page.goto(`${this.baseUrl}/v2/home`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await this.page.waitForTimeout(2000);
      const url = this.page.url();
      return !url.includes('login') && !url.includes('auth');
    } catch {
      return false;
    }
  }

  async searchOrder(orderId, cityId = '55000199') {
    console.log(`🔍 Buscando order ${orderId}...`);

    // Estratégia 1: URL com parâmetros (faz busca automática)
    const searchUrl = `${this.baseUrl}/v2/gtr_trans-mgr/order/list?orderId=${orderId}&cityList%5B0%5D=${cityId}`;
    console.log('   Navegando para:', searchUrl);

    await this.page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   Página carregada');

    // Aguardar carregamento (máximo 10s)
    for (let i = 0; i < 10; i++) {
      await this.page.waitForTimeout(1000);

      // Verificar se dados apareceram
      const hasData = await this.page.evaluate(() => {
        const noData = document.querySelector('.el-table__empty-text, .el-table__empty-block');
        return !noData || !noData.textContent.includes('No Data');
      });

      if (hasData) {
        console.log('   ✅ Dados detectados');
        break;
      }
    }

    // Extrair dados da tabela
    const orderData = await this.extractFromTable(orderId);

    if (orderData && orderData.extractedFrom === 'table') {
      console.log(`   ✅ Order extraída com sucesso`);
      return orderData;
    }

    console.log('   ⚠️ Order não encontrada na tabela');
    return orderData;
  }

  async extractFromTable(orderId) {
    // Tirar screenshot primeiro para ver o estado
    await this.page.screenshot({ path: `table-${orderId}.png`, fullPage: true });
    console.log('   📸 Screenshot salvo');

    return await this.page.evaluate((targetId) => {
      const result = {
        orderId: targetId,
        extractedFrom: 'none',
        url: window.location.href
      };

      // Procurar em todas as tabelas
      const tables = document.querySelectorAll('table, .el-table, .el-table__body');
      result.tablesFound = tables.length;

      for (const table of tables) {
        // Verificar se é a tabela de orders (tem cabeçalhos específicos)
        const headerCells = table.querySelectorAll('th, .el-table__header-wrapper th, thead th');
        const headers = Array.from(headerCells).map(h => h.textContent?.trim());
        const hasOrderHeaders = headers.some(h =>
          h.includes('Order ID') || h.includes('Order Status') || h.includes('Store Name')
        );

        if (!hasOrderHeaders) continue;

        result.headers = headers;

        // Procurar em todas as linhas do corpo da tabela
        const rows = table.querySelectorAll('tbody tr, .el-table__row, tr');
        result.rowsFound = rows.length;

        for (const row of rows) {
          const cells = row.querySelectorAll('td, .cell, .el-table__cell');
          if (cells.length === 0) continue;

          // Verificar se a primeira célula (Order ID) corresponde
          const firstCell = cells[0]?.textContent?.trim() || '';

          // Comparar de forma flexível (pode ter máscara ou só parte do ID)
          const match = firstCell === targetId ||
                       firstCell.replace(/\D/g, '') === targetId ||
                       targetId.includes(firstCell) ||
                       firstCell.includes(targetId.substring(0, 10));

          if (match) {
            result.extractedFrom = 'table';
            result.matchedOrderId = firstCell;

            // Extrair dados de cada célula mapeando pelos headers
            headers.forEach((header, index) => {
              const cell = cells[index];
              if (cell) {
                const text = cell.textContent?.trim();
                if (text) {
                  // Limpar o nome do header para ser uma chave válida
                  const key = header.toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                  result[key] = text;
                }
              }
            });

            return result;
          }
        }
      }

      // Debug: capturar HTML da primeira tabela de orders
      const firstOrderTable = Array.from(tables).find(t => {
        const h = t.querySelectorAll('th');
        return Array.from(h).some(th => th.textContent?.includes('Order ID'));
      });

      if (firstOrderTable) {
        result.tableHtml = firstOrderTable.outerHTML.substring(0, 2000);
        result.tableText = firstOrderTable.innerText.substring(0, 500);
      }

      return result;
    }, orderId);
  }

  async batchSearch(orders, options = {}) {
    const concurrency = options.concurrency || 3;
    const delay = options.delay || 2000;
    const results = [];
    const errors = [];

    console.log(`📦 Processando ${orders.length} orders (conc: ${concurrency})...\n`);

    for (let i = 0; i < orders.length; i += concurrency) {
      const batch = orders.slice(i, i + concurrency);
      console.log(`🔄 Lote ${Math.floor(i / concurrency) + 1}/${Math.ceil(orders.length / concurrency)}`);

      const batchPromises = batch.map(async (input) => {
        const orderId = typeof input === 'string' ? input : input.orderId;
        const cityId = typeof input === 'string' ? '55000199' : (input.cityId || '55000199');

        try {
          const result = await this.searchOrder(orderId, cityId);
          return { orderId, success: true, data: result };
        } catch (error) {
          return { orderId, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      for (const r of batchResults) {
        if (r.success) results.push(r.data);
        else errors.push({ orderId: r.orderId, error: r.error });
      }

      if (i + concurrency < orders.length) {
        await new Promise(r => setTimeout(r, delay));
      }
    }

    console.log(`\n✅ Concluído: ${results.length} ok, ${errors.length} erros`);
    return { results, errors };
  }

  async close() {
    if (this.browser) {
      await this.saveSession();
      await this.browser.close();
      console.log('\n👋 Browser fechado');
    }
  }
}

export async function createClient(options) {
  const client = new GattaranAPIClient(options);
  await client.init();
  return client;
}

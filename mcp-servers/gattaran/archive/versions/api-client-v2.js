/**
 * Gattaran API Client v2
 * Foca em interceptar a API diretamente
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
      console.log('📂 Sessão anterior encontrada');
      this.context = await this.browser.newContext({ storageState: sessionData });
    } else {
      console.log('🆕 Nova sessão');
      this.context = await this.browser.newContext();
    }

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);

    const isAuthenticated = await this.checkAuth();

    if (!isAuthenticated) {
      console.log('\n🔐 FAÇA LOGIN NO GATTARAN (browser aberto)\n');
      await this.page.goto(`${this.baseUrl}/v2/home`, { waitUntil: 'networkidle' });
      await this.page.waitForFunction(
        () => window.location.href.includes('/v2/') && !window.location.href.includes('login'),
        { timeout: 300000 }
      );
      console.log('✅ Login detectado!');
      await this.saveSession();
    }

    console.log('✅ Cliente pronto\n');
    return this;
  }

  async loadSession() {
    try {
      const data = await fs.readFile(this.sessionFile, 'utf-8');
      return JSON.parse(data);
    } catch { return null; }
  }

  async saveSession() {
    try {
      const storageState = await this.context.storageState();
      await fs.writeFile(this.sessionFile, JSON.stringify(storageState, null, 2));
    } catch (e) { console.error('Erro ao salvar sessão:', e.message); }
  }

  async checkAuth() {
    try {
      await this.page.goto(`${this.baseUrl}/v2/home`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await this.page.waitForTimeout(2000);
      return !this.page.url().includes('login');
    } catch { return false; }
  }

  async searchOrder(orderId, cityId = '55000199') {
    console.log(`🔍 Buscando order ${orderId}...`);

    let apiResponse = null;

    // Configurar interceptação
    this.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('gateway')) {
        console.log(`   📡 API chamada: ${url.substring(0, 80)}...`);
        if (url.includes('order.info.getList')) {
          try {
            apiResponse = await response.json();
            console.log('   ✅ API de orders interceptada!');
          } catch (e) {
            console.log('   ⚠️ Erro ao parsear:', e.message);
          }
        }
      }
    });

    // Estratégia: Navegar para página base, preencher formulário e buscar
    const listUrl = `${this.baseUrl}/v2/gtr_trans-mgr/order/list`;
    await this.page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log('   Página base carregada');

    // Aguardar página carregar completamente
    console.log('   Aguardando carregamento...');
    await this.page.waitForTimeout(8000);

    // Estratégia: procurar input com placeholder específico
    try {
      // Procurar input de Order ID diretamente
      const orderInput = this.page.locator('input[placeholder*="Order ID"], input[placeholder*="Enter Order"]').first();

      if (await orderInput.isVisible().catch(() => false)) {
        console.log('   ✅ Input de Order ID encontrado');
        await orderInput.fill(orderId);
        console.log('   ✅ Order ID preenchido');

        // Tentar clicar no botão Search ou pressionar Enter
        const searchBtn = this.page.locator('button:has-text("Search"), button:has-text("查询"), .el-button--primary').first();

        if (await searchBtn.isVisible().catch(() => false)) {
          await searchBtn.click();
          console.log('   ✅ Search clicado');
        } else {
          // Fallback: pressionar Enter no input
          await orderInput.press('Enter');
          console.log('   ✅ Enter pressionado no input');
        }

        // Aguardar carregamento da tabela
        console.log('   Aguardando resultados...');
        await this.page.waitForTimeout(5000);

        // Tentar extrair dados do estado do Vue/React na página
        const pageData = await this.page.evaluate(() => {
          // Procurar em objetos globais comuns de frameworks
          const candidates = ['__VUE__', '__reactInternalInstance', 'app', 'vm', '_store', '$store'];
          for (const key of candidates) {
            if (window[key]) {
              return { found: key, data: window[key] };
            }
          }

          // Procurar por elementos que contenham dados
          const tables = document.querySelectorAll('.el-table');
          if (tables.length > 0) {
            const firstTable = tables[0];
            const vueData = firstTable.__vue__ || firstTable._vue;
            if (vueData) {
              return { found: 'vue-table', data: vueData };
            }
          }

          return { found: 'none' };
        });

        console.log('   📊 Dados da página:', pageData.found);
      } else {
        console.log('   ⚠️ Input de Order ID não encontrado');
      }

    } catch (error) {
      console.log('   Erro:', error.message);
    }

    if (apiResponse?.data?.list?.length > 0) {
      console.log(`   ✅ Order encontrada na API`);
      return this.formatOrder(apiResponse.data.list[0]);
    }

    console.log('   ⚠️ API não interceptada ou vazia, tentando extrair da página...');
    return await this.extractFromPage(orderId);
  }

  formatOrder(order) {
    return {
      orderId: order.orderId,
      shopName: order.shopName,
      status: order.statusTxt || order.status,
      statusCode: order.status,
      createTime: order.createTime,
      cityId: order.cityId,
      customer: {
        uid: order.uid,
        name: order.userName,
        phone: order.userPhone,
        address: order.address ? JSON.parse(order.address) : null
      },
      rider: {
        id: order.riderId,
        name: order.riderName,
        phone: order.riderPhone
      },
      deliveryType: order.deliveryType,
      businessMode: order.businessMode,
      raw: order
    };
  }

  async extractFromPage(orderId) {
    await this.page.screenshot({ path: `debug-${orderId}.png`, fullPage: true });

    const data = await this.page.evaluate((targetId) => {
      const result = { orderId: targetId, extracted: false };

      // Procurar na tabela
      const tables = document.querySelectorAll('.el-table, table');
      for (const table of tables) {
        const rows = table.querySelectorAll('tr, .el-table__row');
        for (const row of rows) {
          if (row.textContent?.includes(targetId)) {
            result.extracted = true;
            result.rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim());
            return result;
          }
        }
      }

      result.pageText = document.body.innerText.substring(0, 500);
      return result;
    }, orderId);

    return data;
  }

  async batchSearch(orders, options = {}) {
    const results = [];
    const errors = [];
    const concurrency = options.concurrency || 3;

    console.log(`📦 Processando ${orders.length} orders...\n`);

    for (let i = 0; i < orders.length; i += concurrency) {
      const batch = orders.slice(i, i + concurrency);
      console.log(`🔄 Lote ${Math.floor(i / concurrency) + 1}`);

      const promises = batch.map(async (input) => {
        const orderId = typeof input === 'string' ? input : input.orderId;
        const cityId = typeof input === 'string' ? '55000199' : (input.cityId || '55000199');

        try {
          const result = await this.searchOrder(orderId, cityId);
          return { orderId, success: true, data: result };
        } catch (error) {
          return { orderId, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(r => {
        if (r.success) results.push(r.data);
        else errors.push({ orderId: r.orderId, error: r.error });
      });

      if (i + concurrency < orders.length) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    console.log(`\n✅ ${results.length} sucessos, ${errors.length} erros`);
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

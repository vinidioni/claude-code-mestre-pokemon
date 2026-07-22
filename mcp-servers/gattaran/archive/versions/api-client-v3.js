/**
 * Gattaran API Client v3
 * Usa apenas interceptação de resposta da API
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

    // Criar promise que resolve quando a API é interceptada
    let apiResolve;
    let apiReject;
    const apiPromise = new Promise((resolve, reject) => {
      apiResolve = resolve;
      apiReject = reject;
    });

    // Configurar listener de resposta
    const responseHandler = async (response) => {
      const url = response.url();

      if (url.includes('gateway') && url.includes('order.info.getList')) {
        console.log(`   🎯 API de orders detectada!`);
        try {
          const data = await response.json();
          console.log(`   📊 Resposta: errno=${data.errno}, tem list=${!!data.data?.list}`);
          if (data.data?.list?.length > 0) {
            console.log(`   ✅ ${data.data.list.length} orders encontradas`);
            apiResolve(data.data.list[0]);
          } else {
            apiResolve(null);
          }
        } catch (e) {
          console.log(`   ❌ Erro ao parsear: ${e.message}`);
          apiReject(e);
        }
      }
    };

    this.page.on('response', responseHandler);

    try {
      // Navegar para a página base (sem parâmetros)
      const baseUrl = `${this.baseUrl}/v2/gtr_trans-mgr/order/list`;
      await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      console.log('   Página base carregada');

      // Aguardar o formulário carregar
      await this.page.waitForTimeout(3000);

      // Preencher o formulário
      console.log('   Preenchendo formulário...');

      // Procurar e preencher Order ID
      const orderInput = this.page.locator('input[placeholder*="Order ID" i]').first();
      if (await orderInput.isVisible().catch(() => false)) {
        await orderInput.fill(orderId);
        console.log('   ✅ Order ID preenchido');
      }

      // Clicar em Search ou pressionar Enter
      const searchBtn = this.page.locator('button:has-text("Search"), button:has-text("Query")').first();
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
        console.log('   ✅ Search clicado');
      } else {
        await orderInput.press('Enter');
        console.log('   ✅ Enter pressionado');
      }

      console.log('   Aguardando resposta da API...');

      // Aguardar a resposta da API (timeout de 15s)
      const orderData = await Promise.race([
        apiPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
      ]);

      if (orderData) {
        return this.formatOrder(orderData);
      }

      console.log('   ⚠️ API não retornou dados');
      return null;

    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      return null;
    } finally {
      this.page.off('response', responseHandler);
    }
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

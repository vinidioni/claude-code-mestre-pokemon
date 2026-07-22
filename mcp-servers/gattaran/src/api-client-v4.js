/**
 * Gattaran API Client v4
 * Baseado no recording do usuário
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

  async searchOrder(orderId, cityName = 'São Paulo', openDetails = false) {
    console.log(`🔍 Buscando order ${orderId}...`);

    let apiResponse = null;

    // Configurar interceptação da API
    this.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('gateway') && url.includes('order.info.getList')) {
        try {
          apiResponse = await response.json();
          console.log('   ✅ API interceptada!');
        } catch (e) {}
      }
    });

    try {
      // 1. Navegar para Order Management
      console.log('   Navegando para Order Management...');
      await this.page.goto(`${this.baseUrl}/v2/gtr_trans-mgr/order/list`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await this.page.waitForTimeout(5000);

      // 2. Clicar no input de Order ID (seletor do recording)
      console.log('   Preenchendo Order ID...');
      const orderInput = this.page.locator('form input[placeholder*="Order ID"], form input[type="text"]').first();
      await orderInput.click();
      await orderInput.fill(orderId);
      console.log('   ✅ Order ID preenchido');

      // 3. Selecionar cidade
      console.log('   Selecionando cidade...');
      const cityInput = this.page.locator('div.el-select__tags > input').first();
      await cityInput.click();
      await cityInput.fill(cityName);
      await this.page.waitForTimeout(1000);

      // Clicar na opção do dropdown
      const cityOption = this.page.locator('li.hover > span, .el-select-dropdown__item:has-text("' + cityName + '")').first();
      if (await cityOption.isVisible().catch(() => false)) {
        await cityOption.click();
        console.log('   ✅ Cidade selecionada');
      }

      // 4. Clicar em Filter (não Search!)
      console.log('   Clicando em Filter...');
      const filterBtn = this.page.locator('button.el-button--primary:has-text("Filter"), button:has-text("Filter")').first();
      await filterBtn.click();
      console.log('   ✅ Filter clicado');

      // 5. Aguardar resultados
      console.log('   Aguardando resultados...');
      await this.page.waitForTimeout(5000);

      // Se interceptamos a API, temos os dados básicos
      let orderData = null;
      if (apiResponse?.data?.list?.length > 0) {
        orderData = this.formatOrder(apiResponse.data.list[0]);
      } else {
        // Fallback: extrair da tabela
        orderData = await this.extractFromTable(orderId);
      }

      // 6. Se solicitado, abrir página de detalhes
      if (openDetails && orderData) {
        console.log('   🔗 Abrindo página de detalhes...');
        const cityId = orderData.cityId || '55000199';
        const details = await this.openOrderDetails(orderId, cityId);
        if (details) {
          orderData.details = details;
        }

        // Tentar acessar seção de Cancellation Handling
        console.log('   🔍 Procurando dados de cancelamento...');
        const cancelDetails = await this.getCancellationDetails();
        if (cancelDetails) {
          orderData.cancellationDetails = cancelDetails;
          if (cancelDetails.cancellationInfo?.reason) {
            console.log('   ✅ Motivo encontrado:', cancelDetails.cancellationInfo.reason);
          }
        }

        // Voltar para página de lista
        await this.page.goto(`${this.baseUrl}/v2/gtr_trans-mgr/order/list`, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(2000);
      }

      return orderData;

    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      return null;
    }
  }

  async openOrderDetails(orderId, cityId = '55000199') {
    try {
      // Estratégia 1: Navegar direto para URL de detalhes (do recording2)
      console.log('   🔗 Navegando para página de detalhes...');
      const detailUrl = `${this.baseUrl}/customerService/order/detail?orderId=${orderId}&cityId=${cityId}`;

      // Abrir em nova aba ou navegar para a página
      await this.page.goto(detailUrl, { waitUntil: 'networkidle', timeout: 30000 });
      console.log('   ✅ Página de detalhes carregada');

      // Aguardar carregamento
      await this.page.waitForTimeout(3000);

      // Extrair dados da página de detalhes
      const details = await this.extractDetailsFromPage();
      console.log('   ✅ Detalhes extraídos');

      // Tentar expandir seções (como mostrado no recording2 - anchor-status)
      await this.expandDetailSections();

      // Tirar screenshot da página de detalhes
      await this.page.screenshot({ path: `order-${orderId}-details.png`, fullPage: true });

      return details;

    } catch (error) {
      console.log(`   ❌ Erro ao abrir detalhes: ${error.message}`);
      return null;
    }
  }

  async getCancellationDetails() {
    try {
      // Primeiro tentar clicar na seção Bill Info para expandir
      console.log('   Tentando expandir Bill Info...');
      const billInfoHeader = this.page.locator('text=Bill Info, .el-collapse-item__header:has-text("Bill"), [class*="bill"]').first();
      if (await billInfoHeader.isVisible().catch(() => false)) {
        await billInfoHeader.click();
        console.log('   ✅ Bill Info clicado');
        await this.page.waitForTimeout(2000);
      }

      // Tentar clicar em Refunds & Coupon Compensation Records
      const refundsHeader = this.page.locator('text=Refunds, text=Compensation, .el-collapse-item__header:has-text("Refund")').first();
      if (await refundsHeader.isVisible().catch(() => false)) {
        await refundsHeader.click();
        console.log('   ✅ Refunds section clicada');
        await this.page.waitForTimeout(2000);
      }

      // Tentar passar o mouse sobre o elemento "3:Outro" para ver tooltip
      console.log('   Tentando hover sobre motivo do cancelamento...');
      const reasonElement = this.page.locator('text=3:Outro, .el-tag:has-text("Outro"), [class*="reason"], td:has-text("Outro")').first();
      if (await reasonElement.isVisible().catch(() => false)) {
        await reasonElement.hover();
        await this.page.waitForTimeout(1500);
        console.log('   ✅ Hover realizado');

        // Tentar clicar no elemento para ver se abre detalhes
        await reasonElement.click();
        await this.page.waitForTimeout(1500);
        console.log('   ✅ Clique no motivo realizado');
      }

      // Extrair dados de cancelamento do texto da página
      const cancelData = await this.page.evaluate(() => {
        const data = {
          cancellationInfo: {},
          orderActivity: []
        };

        const fullText = document.body.innerText;

        // Estratégia 1: Procurar em elementos específicos de formulário
        document.querySelectorAll('.el-form-item, .info-item, .detail-item').forEach(item => {
          const label = item.querySelector('.el-form-item__label, .label')?.textContent?.trim();
          if (label && (label.includes('Reason') || label.includes('Cancel') || label.includes('Motivo'))) {
            const value = item.querySelector('.el-form-item__content, .value, .content')?.textContent?.trim();
            if (value) {
              data.cancellationInfo.reasonFromField = value;
            }
          }
        });

        // Estratégia 2: Procurar por padrão "3:Outro" com texto após "/"
        // O padrão pode estar em uma linha ou dividido em duas
        const reasonLines = fullText.split('\n');
        for (let i = 0; i < reasonLines.length; i++) {
          const line = reasonLines[i].trim();

          // Procurar por padrão completo: "3:Outro / Cliente não apareceu"
          const fullPattern = line.match(/(\d+:[A-Za-zÀ-ÿ]+\s*\/\s*.+)/);
          if (fullPattern) {
            data.cancellationInfo.reason = fullPattern[1].trim();
            break;
          }

          // Procurar por "3:Outro" e verificar se a próxima linha tem "/"
          const partialPattern = line.match(/^(\d+:[A-Za-zÀ-ÿ]+)$/);
          if (partialPattern) {
            const code = partialPattern[1];
            // Verificar próximas 2 linhas
            for (let j = 1; j <= 2 && i + j < reasonLines.length; j++) {
              const nextLine = reasonLines[i + j].trim();
              if (nextLine.startsWith('/')) {
                data.cancellationInfo.reason = code + ' ' + nextLine;
                break;
              }
            }
            if (!data.cancellationInfo.reason) {
              data.cancellationInfo.reason = code;
            }
            break;
          }
        }

        // Estratégia 3: Procurar por elementos que contenham "Outro"
        document.querySelectorAll('*').forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.match(/^\d+:[A-Za-zÀ-ÿ]+\s*\/\s*.+/)) {
            if (!data.cancellationInfo.reason || text.length > data.cancellationInfo.reason.length) {
              data.cancellationInfo.reason = text;
            }
          }
        });

        // Estratégia 4: Procurar em atributos title (tooltips)
        document.querySelectorAll('[title], [data-title]').forEach(el => {
          const title = el.getAttribute('title') || el.getAttribute('data-title');
          if (title && title.includes('Outro')) {
            data.cancellationInfo.reasonFromTitle = title;
          }
        });

        // Estratégia 5: Procurar em inputs hidden ou campos de formulário
        document.querySelectorAll('input[type="hidden"], textarea, select').forEach(el => {
          const value = el.value?.trim();
          if (value && value.match(/^\d+:[A-Za-zÀ-ÿ]+/)) {
            data.cancellationInfo.reasonFromField = value;
          }
        });

        // Estratégia 6: Procurar texto que contenha "Outro" seguido de algo
        const allText = document.body.innerText;
        const outroMatch = allText.match(/(3:Outro[\s\S]{0,100})/);
        if (outroMatch) {
          data.cancellationInfo.reasonContext = outroMatch[1].replace(/\n/g, ' ').trim();
        }

        // Estratégia 7: Procurar especificamente por "Cliente não apareceu" ou similar
        const clienteMatch = allText.match(/(Cliente[^\n]{0,50})/i);
        if (clienteMatch) {
          data.cancellationInfo.clienteInfo = clienteMatch[1].trim();
        }

        // Estratégia 8: Procurar por qualquer texto após "/" em elementos
        document.querySelectorAll('*').forEach(el => {
          const text = el.childNodes[0]?.textContent?.trim();
          if (text && text.startsWith('/') && text.length > 2) {
            if (!data.cancellationInfo.reasonAfterSlash || text.length < 100) {
              data.cancellationInfo.reasonAfterSlash = text;
            }
          }
        });

        // Estratégia 9: Procurar especificamente por texto que vem depois de "Outro"
        // O operador pode ter digitado na mesma linha ou na próxima
        const outroIndex = allText.indexOf('3:Outro');
        if (outroIndex !== -1) {
          // Pegar os próximos 200 caracteres depois de "3:Outro"
          const afterOutro = allText.substring(outroIndex + 7, outroIndex + 200);
          data.cancellationInfo.textAfterOutro = afterOutro.replace(/\n/g, ' ').trim();
        }

        // Estratégia 10: Procurar por "apareceu" ou "Apareceu" no texto completo
        const apareceuMatch = allText.match(/(apareceu[^\n]*)/i);
        if (apareceuMatch) {
          data.cancellationInfo.apareceuContext = apareceuMatch[1].trim();
        }

        // Estratégia 11: Procurar em atributos data-* de elementos
        document.querySelectorAll('[data-reason], [data-cancel], [data-note]').forEach(el => {
          const dataValue = el.getAttribute('data-reason') || el.getAttribute('data-cancel') || el.getAttribute('data-note');
          if (dataValue && dataValue.includes('Outro')) {
            data.cancellationInfo.fromDataAttr = dataValue;
          }
        });

        // Estratégia 12: Procurar na seção de Bill Info / Refunds especificamente
        const billSection = document.querySelector('.bill-info, .refund-section, [class*="bill"]');
        if (billSection) {
          const billText = billSection.innerText;
          const billReasonMatch = billText.match(/(3:Outro[\s\S]{0,100})/);
          if (billReasonMatch) {
            data.cancellationInfo.fromBillSection = billReasonMatch[1].replace(/\n/g, ' ').trim();
          }
        }

        // Procurar por "Order cancelled by Customer Support" e extrair detalhes
        const cancelMatch = fullText.match(/Order cancelled by Customer Support[\s\S]*?(?=\n[A-Z]|$)/i);
        if (cancelMatch) {
          data.cancellationInfo.raw = cancelMatch[0];

          // Tentar extrair campos específicos
          const lines = cancelMatch[0].split('\n');
          lines.forEach(line => {
            if (line.includes('Reason') || line.includes('Motivo')) {
              const match = line.match(/(?:Reason|Motivo)[:\s]+(.+)/i);
              if (match) data.cancellationInfo.reason = match[1].trim();
            }
            // Cancellation operator
            if (line.includes('Operator') || line.includes('Operador')) {
              const match = line.match(/(?:Operator|Operador)[:\s]+(.+)/i);
              if (match) data.cancellationInfo.operator = match[1].trim();
            }
            // Cancellation originator
            if (line.includes('Originator') || line.includes('Originador')) {
              const match = line.match(/(?:Originator|Originador)[:\s]+(.+)/i);
              if (match) data.cancellationInfo.originator = match[1].trim();
            }
            // Responsible party
            if (line.includes('Responsible') || line.includes('Responsável')) {
              const match = line.match(/(?:Responsible|Responsável)(?:\s+Party)?[:\s]+(.+)/i);
              if (match) data.cancellationInfo.responsibleParty = match[1].trim();
            }
            // Customer refund amount
            if (line.includes('Refund') || line.includes('Reembolso')) {
              const match = line.match(/(?:Refund|Reembolso)(?:\s+Amount)?[:\s]+(.+)/i);
              if (match) data.cancellationInfo.refundAmount = match[1].trim();
            }
          });
        }

        // Procurar na seção de Order Activity
        const activityMatch = fullText.match(/Order Activity[\s\S]*?(?=\n[A-Z][a-z]+\s*\n|$)/);
        if (activityMatch) {
          const lines = activityMatch[0].split('\n').filter(l => l.trim() && !l.includes('Order Activity'));
          data.orderActivity = lines.map(line => {
            // Tentar separar evento e data
            const match = line.match(/(.+?)(\d{2}\/\d{2}\/\d{4},\d{2}:\d{2}:\d{2})$/);
            if (match) {
              return {
                event: match[1].trim(),
                timestamp: match[2]
              };
            }
            return { event: line.trim() };
          });
        }

        // Procurar por padrões específicos no texto completo
        // Reason: "3:Outro / Cliente não apareceu" (número:palavra)
        // Evitar pegar horas (21:06:42) - procurar dígito:letra (apenas letras, não dígitos)
        const cancelReasonPattern = /(\d+:[A-Za-z][A-Za-zÀ-ÿ\s]*(?:\/[^\n]*)?)/;
        const cancelReasonMatch = fullText.match(cancelReasonPattern);
        if (cancelReasonMatch && !data.cancellationInfo.reason) {
          data.cancellationInfo.reason = cancelReasonMatch[1].trim();
        }

        // Extrair todos os dados de campos de formulário
        document.querySelectorAll('.el-form-item, .info-row').forEach(item => {
          const label = item.querySelector('.el-form-item__label, .label, th')?.textContent?.trim();
          const value = item.querySelector('.el-form-item__content, .value, td')?.textContent?.trim();

          if (label && value) {
            const labelLower = label.toLowerCase();
            if (labelLower.includes('reason') || labelLower.includes('motivo')) {
              data.cancellationInfo.reason = value;
            }
            if (labelLower.includes('operator')) {
              data.cancellationInfo.operator = value;
            }
            if (labelLower.includes('originator')) {
              data.cancellationInfo.originator = value;
            }
            if (labelLower.includes('responsible')) {
              data.cancellationInfo.responsibleParty = value;
            }
            if (labelLower.includes('refund')) {
              data.cancellationInfo.refundAmount = value;
            }
          }
        });

        return data;
      });

      console.log('   ✅ Dados de cancelamento extraídos');
      return cancelData;

    } catch (error) {
      console.log('   ⚠️ Erro ao buscar dados de cancelamento:', error.message);
      return null;
    }
  }

  async expandDetailSections() {
    try {
      // Clicar especificamente na seção de Cancellation Handling
      const cancelSection = this.page.locator('text=Cancellation Handling, .el-collapse-item__header:has-text("Cancellation"), .detail-section:has-text("Cancellation")').first();
      if (await cancelSection.isVisible().catch(() => false)) {
        await cancelSection.click();
        console.log('   ✅ Seção Cancellation Handling expandida');
        await this.page.waitForTimeout(1000);
      }

      // Tentar clicar em outras seções expansíveis
      const expandableSections = await this.page.locator('#anchor-status svg, .expand-icon, .el-collapse-item__header, .el-collapse-item').all();

      for (const section of expandableSections.slice(0, 5)) {
        if (await section.isVisible().catch(() => false)) {
          const text = await section.textContent().catch(() => '');
          if (text.toLowerCase().includes('cancel') || text.toLowerCase().includes('handling')) {
            await section.click();
            await this.page.waitForTimeout(500);
          }
        }
      }

      // Extrair dados após expandir
      const expandedData = await this.page.evaluate(() => {
        const data = {};

        // Procurar por seções expandidas
        document.querySelectorAll('.el-collapse-item, .detail-section, .info-block').forEach(section => {
          const title = section.querySelector('.title, .header, h3')?.textContent?.trim();
          if (title) {
            data[title] = {};
            section.querySelectorAll('.row, .info-row').forEach(row => {
              const label = row.querySelector('.label, .name')?.textContent?.trim();
              const value = row.querySelector('.value, .content')?.textContent?.trim();
              if (label && value) {
                data[title][label] = value;
              }
            });
          }
        });

        return data;
      });

      return expandedData;

    } catch (error) {
      console.log('   ⚠️ Erro ao expandir seções:', error.message);
      return {};
    }
  }

  async extractDetailsFromPage() {
    return await this.page.evaluate(() => {
      const details = {
        extractedAt: new Date().toISOString(),
        url: window.location.href,
        sections: {},
        cancellationInfo: {}
      };

      // Procurar especificamente por informações de cancelamento
      const allText = document.body.innerText;

      // Patterns comuns para motivo de cancelamento
      const cancelPatterns = [
        /Cancel Reason[:\s]+([^\n]+)/i,
        /Cancellation Reason[:\s]+([^\n]+)/i,
        /Reason for Cancellation[:\s]+([^\n]+)/i,
        /Cancel Notes[:\s]+([^\n]+)/i,
        /Cancellation Notes[:\s]+([^\n]+)/i
      ];

      for (const pattern of cancelPatterns) {
        const match = allText.match(pattern);
        if (match) {
          details.cancellationInfo.reason = match[1].trim();
          break;
        }
      }

      // Procurar por seções específicas
      document.querySelectorAll('.detail-section, .info-section, .order-detail, .el-card, .el-collapse-item').forEach(section => {
        const title = section.querySelector('.title, .header, h3, h4, .el-collapse-item__header')?.textContent?.trim();
        const sectionData = {};

        section.querySelectorAll('.row, .info-row, .detail-row, dl, tr, .el-form-item').forEach(row => {
          const label = row.querySelector('.label, dt, th, .el-form-item__label')?.textContent?.trim();
          const value = row.querySelector('.value, dd, td, .el-form-item__content')?.textContent?.trim();

          if (label && value) {
            sectionData[label] = value;

            // Capturar especificamente dados de cancelamento
            if (label.toLowerCase().includes('cancel') || label.toLowerCase().includes('reason')) {
              details.cancellationInfo[label] = value;
            }
          }
        });

        if (title && Object.keys(sectionData).length > 0) {
          details.sections[title] = sectionData;
        }
      });

      // Extrair texto completo da seção de cancelamento se existir
      const cancelSection = document.querySelector('[class*="cancel"], [id*="cancel"]');
      if (cancelSection) {
        details.cancellationInfo.fullSection = cancelSection.innerText.substring(0, 500);
      }

      // Extrair texto completo para referência
      details.fullText = allText.substring(0, 3000);

      return details;
    });
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

  async extractFromTable(orderId) {
    console.log('   Extraindo da tabela...');

    const data = await this.page.evaluate((targetId) => {
      const result = { orderId: targetId, extracted: false };

      // Procurar na tabela
      const tables = document.querySelectorAll('.el-table');
      for (const table of tables) {
        const rows = table.querySelectorAll('tbody tr, .el-table__row');
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const firstCell = cells[0]?.textContent?.trim();
            if (firstCell && firstCell.includes(targetId)) {
              result.extracted = true;
              result.orderId = firstCell;
              result.status = cells[2]?.textContent?.trim(); // Order Status
              result.storeName = cells[6]?.textContent?.trim(); // Store Name
              result.customerName = cells[4]?.textContent?.trim(); // Customer Name
              result.customerPhone = cells[5]?.textContent?.trim(); // Customer Mobile
              return result;
            }
          }
        }
      }

      return result;
    }, orderId);

    return data.extracted ? data : null;
  }

  async batchSearch(orders, options = {}) {
    const results = [];
    const errors = [];

    console.log(`📦 Processando ${orders.length} orders...\n`);

    for (const input of orders) {
      const orderId = typeof input === 'string' ? input : input.orderId;
      const cityName = typeof input === 'string' ? 'São Paulo' : (input.cityName || 'São Paulo');

      try {
        const result = await this.searchOrder(orderId, cityName);
        if (result) {
          results.push(result);
          console.log(`   ✅ ${orderId} - OK\n`);
        } else {
          errors.push({ orderId, error: 'Não encontrado' });
          console.log(`   ⚠️ ${orderId} - Não encontrado\n`);
        }
      } catch (error) {
        errors.push({ orderId, error: error.message });
        console.log(`   ❌ ${orderId} - Erro: ${error.message}\n`);
      }

      // Delay entre requests
      await new Promise(r => setTimeout(r, 2000));
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

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, 'sessions', '.gattaran-session.json');

const ORDER_ID = '5764679946404432336';
const CITY = 'Goiânia';

async function searchOrder() {
  console.log(`🔍 Buscando order ${ORDER_ID} em ${CITY}...`);

  // Verifica sessão salva
  let storageState = null;
  if (fs.existsSync(SESSION_PATH)) {
    console.log('📂 Usando sessão salva...');
    storageState = SESSION_PATH;
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const contextOptions = {
    viewport: { width: 1920, height: 1080 }
  };
  
  if (storageState) {
    contextOptions.storageState = storageState;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 1. Navegar para Gattaran
    console.log('🌐 Navegando para Gattaran...');
    await page.goto('https://gattaran.didi-food.com/v2/home', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    // Verifica se está logado
    const currentUrl = page.url();
    console.log(`📍 URL atual: ${currentUrl}`);
    
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      console.log('⚠️ Necessário fazer login. Aguardando...');
      // Aguarda navegação para home
      await page.waitForNavigation({ 
        url: /gattaran.*home/,
        timeout: 120000 
      });
      console.log('✅ Login detectado!');
      
      // Salva sessão
      await context.storageState({ path: SESSION_PATH });
      console.log('💾 Sessão salva!');
    }

    // 2. Navegar para Order Management
    console.log('📋 Navegando para Order Management...');
    await page.goto('https://gattaran.didi-food.com/v2/order-management', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    // 3. Preencher Order ID
    console.log('🔎 Preenchendo dados da order...');
    const orderInput = await page.locator('input[placeholder*="Order"], input[placeholder*="order"], input[name*="order"]').first();
    if (orderInput) {
      await orderInput.fill(ORDER_ID);
      console.log('✅ Order ID preenchido');
    }

    // 4. Selecionar cidade
    const cityInput = await page.locator('input[placeholder*="City"], input[placeholder*="city"]').first();
    if (cityInput) {
      await cityInput.fill(CITY);
      await page.waitForTimeout(1000);
      // Seleciona opção do dropdown
      const cityOption = await page.locator('text=Goiânia').first();
      if (cityOption) await cityOption.click();
      console.log('✅ Cidade selecionada');
    }

    // 5. Clicar em Search
    const searchBtn = await page.locator('button:has-text("Search"), button:has-text("Buscar"), .search-button').first();
    if (searchBtn) {
      await searchBtn.click();
      console.log('🔍 Buscando...');
      await page.waitForTimeout(5000);
    }

    // 6. Extrair detalhes
    console.log('📊 Extraindo detalhes...');
    const orderDetails = await page.evaluate(() => {
      const data = {};
      
      // Tenta encontrar informações na página
      const rows = document.querySelectorAll('tr, .ant-table-row, .order-row');
      rows.forEach(row => {
        const text = row.innerText;
        if (text.includes('Status')) data.status = text;
        if (text.includes('Courier')) data.courier = text;
        if (text.includes('Customer')) data.customer = text;
      });
      
      return data;
    });

    console.log('\n✅ Busca concluída!');
    console.log('\n📊 RESUMO DA ORDER:');
    console.log('==================');
    console.log(`Order ID: ${ORDER_ID}`);
    console.log(`Cidade: ${CITY}`);
    console.log(`Status: ${orderDetails.status || 'Não identificado'}`);
    console.log(`Courier: ${orderDetails.courier || 'Não identificado'}`);
    console.log(`Customer: ${orderDetails.customer || 'Não identificado'}`);
    
    // Salva screenshot
    const screenshotPath = path.join(__dirname, 'output', `order-${ORDER_ID}-goiania.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`\n📸 Screenshot salvo: ${screenshotPath}`);

    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    await page.screenshot({ path: path.join(__dirname, 'output', 'error-screenshot.png') });
  } finally {
    await browser.close();
    console.log('\n✅ Browser fechado');
  }
}

searchOrder();

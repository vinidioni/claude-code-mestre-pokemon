import { chromium } from 'playwright';

const orderId = process.argv[2] || '5764678584400678506';
const city = process.argv[3] || 'São Paulo';

console.log(`🔍 Buscando order ${orderId} em ${city}...\n`);

(async () => {
  // Lançar browser visível (não em headless)
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 100 // Adiciona delay entre ações para visualização
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 1. Navegar para Gattaran
    console.log('1. Navegando para Gattaran...');
    await page.goto('https://gattaran.didi-food.com/v2/home', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    console.log('   URL:', page.url());

    // Se redirecionar para login, esperar usuário logar manualmente
    if (page.url().includes('login')) {
      console.log('\n⚠️  Página de login detectada!');
      console.log('   Por favor, faça login manualmente no browser que abriu.');
      console.log('   Aguardando navegação para o Gattaran...\n');

      // Aguardar até sair da página de login
      await page.waitForFunction(
        () => !window.location.href.includes('login'),
        { timeout: 120000 }
      );
      console.log('   ✅ Login detectado! Continuando...\n');
    }

    // 2. Navegar pelo menu
    console.log('2. Navegando: City Services > Transaction Management > Order Management');

    // City Services
    try {
      await page.locator('text=City Services').first().click({ timeout: 10000 });
      console.log('   ✅ City Services');
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log('   ⚠️  City Services não encontrado ou já expandido');
    }

    // Transaction Management
    try {
      await page.locator('text=Transaction Management').first().click({ timeout: 10000 });
      console.log('   ✅ Transaction Management');
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log('   ⚠️  Transaction Management não encontrado');
    }

    // Order Management
    try {
      await page.locator('text=Order Management').first().click({ timeout: 10000 });
      console.log('   ✅ Order Management');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('   ⚠️  Order Management não encontrado');
    }

    // 3. Preencher formulário de busca
    console.log('\n3. Preenchendo formulário de busca...');

    // Order ID
    const orderInput = page.locator('input[placeholder*="Order ID" i], input[placeholder*="订单号"]').first();
    if (await orderInput.isVisible().catch(() => false)) {
      await orderInput.fill(orderId);
      console.log(`   ✅ Order ID: ${orderId}`);
    } else {
      console.log('   ❌ Campo Order ID não encontrado');
    }

    // City
    const cityInput = page.locator('input[placeholder*="City" i]').first();
    if (await cityInput.isVisible().catch(() => false)) {
      await cityInput.click();
      await cityInput.fill(city);
      await page.waitForTimeout(1000);

      // Selecionar do dropdown se aparecer
      const option = page.locator('.ant-select-item-option-content:has-text("' + city + '")').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      }
      console.log(`   ✅ City: ${city}`);
    } else {
      console.log('   ❌ Campo City não encontrado');
    }

    // 4. Clicar em Search
    console.log('\n4. Clicando em Search...');
    const searchBtn = page.locator('button:has-text("Search"), button:has-text("查询"), button[type="submit"]').first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click();
      console.log('   ✅ Search clicado');
    } else {
      console.log('   ❌ Botão Search não encontrado');
    }

    // Aguardar resultados
    console.log('\n5. Aguardando resultados...');
    await page.waitForTimeout(5000);

    // 5. Extrair dados
    console.log('\n6. Extraindo dados da order...\n');

    const details = await page.evaluate(() => {
      const data = {
        orderId: '',
        status: '',
        customer: {},
        merchant: {},
        payment: {},
        delivery: {},
        items: [],
        tables: []
      };

      // Extrair de tabelas
      document.querySelectorAll('table').forEach((table, idx) => {
        const tableData = { index: idx, rows: [] };
        table.querySelectorAll('tr').forEach(row => {
          const cells = [];
          row.querySelectorAll('td, th').forEach(cell => {
            cells.push(cell.textContent?.trim());
          });
          if (cells.length > 0) tableData.rows.push(cells);
        });
        if (tableData.rows.length > 0) data.tables.push(tableData);
      });

      // Extrair texto da página para debug
      data.pageText = document.body.innerText.substring(0, 2000);

      return data;
    });

    // Salvar screenshot
    await page.screenshot({ path: `order-${orderId}-result.png`, fullPage: true });
    console.log(`📸 Screenshot salvo: order-${orderId}-result.png`);

    // Mostrar resultado
    console.log('\n=== RESULTADO ===');
    console.log(JSON.stringify(details, null, 2));

    console.log('\n✅ Busca concluída!');
    console.log('O browser permanecerá aberto. Pressione Ctrl+C para fechar.');

    // Manter browser aberto
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await page.screenshot({ path: `order-${orderId}-error.png`, fullPage: true });
    console.log(`📸 Screenshot de erro salvo: order-${orderId}-error.png`);
    await browser.close();
    process.exit(1);
  }
})();

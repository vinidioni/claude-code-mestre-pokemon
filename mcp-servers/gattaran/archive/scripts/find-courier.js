import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';

async function main() {
  const client = await createClient({ headless: false });

  try {
    // Ir para página de detalhes
    await client.page.goto(
      `https://gattaran.didi-food.com/customerService/order/detail?orderId=${ORDER_ID}&cityId=55000199`,
      { waitUntil: 'networkidle', timeout: 30000 }
    );
    await client.page.waitForTimeout(3000);

    console.log('🔍 Procurando links na página...\n');

    // Extrair todos os links com seus textos
    const links = await client.page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        class: a.className,
        id: a.id,
        parentText: a.parentElement?.textContent?.trim().substring(0, 100) || ''
      })).filter(l => l.text.length > 0);
    });

    console.log('Links encontrados:');
    links.forEach((link, i) => {
      console.log(`\n${i + 1}. Texto: "${link.text}"`);
      console.log(`   URL: ${link.href}`);
      console.log(`   Classe: ${link.class}`);
    });

    // Procurar por elementos que contenham o nome do entregador
    console.log('\n\n🔍 Procurando elementos com texto do entregador...');

    const elements = await client.page.locator('text=/FEL|IES|rider|courier/i').all();
    for (const el of elements.slice(0, 10)) {
      const tag = await el.evaluate(e => e.tagName).catch(() => 'unknown');
      const text = await el.textContent().catch(() => '');
      const clickable = await el.evaluate(e => {
        return e.tagName === 'A' || e.onclick !== null ||
               e.closest('a') !== null ||
               window.getComputedStyle(e).cursor === 'pointer';
      }).catch(() => false);

      console.log(`Tag: ${tag}, Texto: "${text?.trim()}", Clicável: ${clickable}`);

      if (clickable) {
        console.log('   👆 Este elemento é clicável!');
      }
    }

    await client.page.screenshot({ path: 'debug-page.png', fullPage: true });
    console.log('\n📸 Screenshot salvo: debug-page.png');

  } finally {
    await client.close();
  }
}

main().catch(console.error);

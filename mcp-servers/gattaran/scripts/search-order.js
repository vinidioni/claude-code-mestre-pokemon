#!/usr/bin/env node

import { createClient } from './src/api-client-v4.js';

const ORDER_ID = '5764678698494132425';
const CITY = 'São Paulo';

async function main() {
  console.log(`🔍 Buscando order ${ORDER_ID} em ${CITY}\n`);

  const client = await createClient({ headless: false });

  try {
    const order = await client.searchOrder(ORDER_ID, CITY, true);

    if (order) {
      console.log('\n✅ ORDER ENCONTRADA!\n');
      console.log(JSON.stringify(order, null, 2));

      // Salvar resultado
      await import('fs').then(fs =>
        fs.promises.writeFile('order-result.json', JSON.stringify(order, null, 2))
      );
      console.log('\n💾 Resultado salvo em order-result.json');
    } else {
      console.log('\n⚠️ Order não encontrada');
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

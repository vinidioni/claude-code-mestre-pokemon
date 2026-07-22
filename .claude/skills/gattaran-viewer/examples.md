# Exemplos Avançados - Gattaran Viewer

## Exemplo 1: Investigação Completa de Order

```javascript
// Investigar uma order cancelada com todos os detalhes
import { createClient } from './src/api-client-v4.js';

async function investigarOrder(orderId, city) {
  const client = await createClient({ headless: false });

  try {
    // 1. Buscar order
    const order = await client.searchOrder(orderId, city, true);
    console.log('Status:', order.status);

    // 2. Extrair motivo do cancelamento
    const cancelInfo = await client.getCancellationDetails();
    console.log('Motivo:', cancelInfo.cancellationInfo?.reason);

    // 3. Extrair Control Information do entregador
    const riderId = order.rider?.id;
    if (riderId) {
      // Navegar para página do entregador
      await client.page.goto(
        `https://gattaran.didi-food.com/v2/gtr_delivery-op/rider/detail/base?id=${riderId}`,
        { waitUntil: 'domcontentloaded' }
      );
      await client.page.waitForTimeout(5000);

      // Clicar em Control Information
      const nextArrow = client.page.locator('span.pb-tabs__nav-next > i').first();
      if (await nextArrow.isVisible().catch(() => false)) {
        await nextArrow.click();
      }

      const controlTab = client.page.locator('#tab-controls').first();
      if (await controlTab.isVisible().catch(() => false)) {
        await controlTab.click();
        await client.page.waitForTimeout(5000);
      }

      // Extrair dados
      const controlInfo = await client.page.evaluate(() => {
        const records = [];
        document.querySelectorAll('table tbody tr').forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            records.push({
              operator: cells[0]?.textContent?.trim(),
              action: cells[1]?.textContent?.trim(),
              date: cells[2]?.textContent?.trim()
            });
          }
        });
        return records;
      });

      console.log('Histórico de controles:', controlInfo);
    }

  } finally {
    await client.close();
  }
}

// Uso
investigarOrder('5764678698494132425', 'São Paulo');
```

## Exemplo 2: Processar Múltiplas Orders (Uma Sessão)

```bash
# Usar o script batch-orders.js para processar várias orders
# com apenas UMA autenticação

# Via CLI
node scripts/batch-orders.js 5764678698494132425,5764678978203877694,5764678584400678506

# Com extração de Control Information
node scripts/batch-orders.js 5764678698494132425,5764678978203877694 --courier-info

# Via arquivo JSON
node scripts/batch-orders.js --file=orders.json
```

Arquivo `orders.json`:
```json
[
  { "orderId": "5764678698494132425", "cityName": "São Paulo" },
  { "orderId": "5764678978203877694", "cityName": "São Paulo" },
  { "orderId": "5764678584400678506", "cityName": "São Paulo" }
]
```

## Exemplo 3: Sessão Persistente Manual

```javascript
import { createClient } from './src/api-client-v4.js';

// A sessão é salva automaticamente em sessions/.gattaran-session.json
// Na próxima execução, o login é reutilizado

async function exemploSessaoPersistente() {
  // Primeira execução: vai pedir login
  const client1 = await createClient({ headless: false });
  const order1 = await client1.searchOrder('111', 'São Paulo');
  await client1.close();
  // Sessão salva automaticamente

  // Segunda execução: usa sessão salva (sem pedir login!)
  const client2 = await createClient({ headless: true });  // pode usar headless
  const order2 = await client2.searchOrder('222', 'São Paulo');
  const order3 = await client2.searchOrder('333', 'São Paulo');
  // Mesma sessão para múltiplas orders!
  await client2.close();
}
```

## Exemplo 4: Fluxo de Batch com relatório

```javascript
// Processar lote e gerar relatório consolidado
async function processarLote(orders) {
  const client = await createClient({ headless: false });
  const resultados = [];

  for (const orderData of orders) {
    const { orderId, city } = orderData;

    try {
      const order = await client.searchOrder(orderId, city, true);

      resultados.push({
        orderId,
        encontrada: !!order,
        status: order?.status,
        entregador: order?.rider?.name,
        cancelado: order?.status?.toLowerCase().includes('cancel')
      });

    } catch (error) {
      resultados.push({
        orderId,
        erro: error.message
      });
    }

    // Delay entre orders
    await new Promise(r => setTimeout(r, 2000));
  }

  await client.close();

  // Gerar relatório
  const canceladas = resultados.filter(r => r.cancelado);
  console.log(`Total: ${resultados.length}`);
  console.log(`Canceladas: ${canceladas.length}`);

  return resultados;
}
```

## Fluxo de Autenticação

```
Primeira execução:
┌─────────────┐
│ Sem sessão  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Abre browser │
│ Pedir login  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login feito  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Salva sessão │ ──► sessions/.gattaran-session.json
└─────────────┘

Execuções seguintes:
┌─────────────┐
│ Tem sessão  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Carrega     │
│ sessão      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Pronto!     │
│ (sem login) │
└─────────────┘
```

## Comandos Úteis

```bash
# Limpar sessão (forçar novo login)
rm sessions/.gattaran-session.json

# Ver conteúdo da sessão (não commitar!)
cat sessions/.gattaran-session.json | head -20

# Listar scripts disponíveis
ls -la scripts/
```

# Gattaran API Reference

Documentação completa do cliente API para Gattaran.

## 📦 Instalação

```bash
cd mcp-servers/gattaran
npm install
```

## 🔧 Configuração

### Opções do Cliente

```javascript
import { createClient } from './src/api-client-v4.js';

const client = await createClient({
  headless: true,              // Executar sem interface gráfica
  sessionFile: '.gattaran-session.json'  // Arquivo de sessão
});
```

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `headless` | boolean | `true` | Executar browser em background |
| `sessionFile` | string | `.gattaran-session.json` | Caminho do arquivo de sessão |

## 🎯 Métodos Principais

### `searchOrder(orderId, cityName, openDetails)`

Busca uma order pelo ID.

```javascript
const order = await client.searchOrder(
  '5764678698494132425',  // orderId
  'São Paulo',            // cityName
  true                    // openDetails (opcional)
);
```

**Retorno:**
```json
{
  "orderId": "5764678698494132425",
  "shopName": "Americanas - Shopping Bonsucesso",
  "status": "Canceled by customer service",
  "statusCode": "923",
  "createTime": "1784306327",
  "cityId": 55000199,
  "customer": {
    "uid": "369436404692117",
    "name": "Car****ana",
    "phone": "(+55)119****2354",
    "address": { ... }
  },
  "rider": {
    "id": "650911850070348",
    "name": "FEL****IES",
    "phone": "119****1561"
  }
}
```

### `openOrderDetails(orderId, cityId)`

Navega para a página de detalhes da order.

```javascript
const details = await client.openOrderDetails(
  '5764678698494132425',
  '55000199'
);
```

### `getCancellationDetails()`

Extrai informações de cancelamento da página atual.

```javascript
const cancelInfo = await client.getCancellationDetails();
```

**Retorno:**
```json
{
  "cancellationInfo": {
    "reason": "3:Ocorreu um acidente",
    "raw": "Order cancelled by Customer Support..."
  },
  "orderActivity": [
    { "event": "Order picked up", "timestamp": "17/07/2026,15:53:02" },
    { "event": "Order cancelled by Customer Support", "timestamp": "17/07/2026,16:38:58" }
  ]
}
```

### `batchSearch(orders, options)`

Processa múltiplas orders em lote.

```javascript
const orders = [
  { orderId: '5764678698494132425', cityName: 'São Paulo' },
  { orderId: '5764678978203877694', cityName: 'São Paulo' }
];

const { results, errors } = await client.batchSearch(orders, {
  concurrency: 5,  // Paralelismo
  delay: 2000      // Delay entre requisições (ms)
});
```

## 🔍 Fluxo de Uso Avançado

### Extrair Control Information do Entregador

```javascript
// 1. Buscar order para obter riderId
const order = await client.searchOrder(ORDER_ID, CITY);
const riderId = order.rider.id;

// 2. Navegar para página do entregador
await client.page.goto(
  `https://gattaran.didi-food.com/v2/gtr_delivery-op/rider/detail/base?id=${riderId}`,
  { waitUntil: 'domcontentloaded' }
);
await client.page.waitForTimeout(5000);

// 3. Navegar para aba Control Information
const nextArrow = client.page.locator('span.pb-tabs__nav-next > i').first();
if (await nextArrow.isVisible()) {
  await nextArrow.click();
}

const controlTab = client.page.locator('#tab-controls').first();
await controlTab.click();
await client.page.waitForTimeout(5000);

// 4. Extrair dados
const controlInfo = await extractControlInfo(client.page);
```

## 🗺️ Códigos de Cidade

| Cidade | Código |
|--------|--------|
| São Paulo | 55000199 |
| Goiânia | (consultar time) |
| Rio de Janeiro | (consultar time) |

> 💡 Para descobrir o código de uma nova cidade, use o DevTools enquanto busca no Gattaran.

## 🔐 Sessão e Autenticação

### Como funciona

1. Na primeira execução, o browser abre para login manual
2. Após login, a sessão é salva em `sessions/.gattaran-session.json`
3. Execuções subsequentes reutilizam a sessão
4. Se a sessão expirar, o processo se repete

### Limpar sessão

```bash
rm sessions/.gattaran-session.json
```

## ⚠️ Limitações

1. **Sessão expira**: Geralmente em 24h
2. **Código da cidade obrigatório**: Não aceita nome da cidade
3. **wsgsig dinâmico**: Gerado pelo browser, não podemos replicar
4. **Rate limiting**: Respeite delays entre requisições

## 🛠️ Exemplos Completos

### Exemplo 1: Busca Simples
```javascript
import { createClient } from './src/api-client-v4.js';

async function buscarOrder() {
  const client = await createClient({ headless: false });

  const order = await client.searchOrder(
    '5764678698494132425',
    'São Paulo',
    true
  );

  console.log('Status:', order.status);
  console.log('Entregador:', order.rider?.name);

  await client.close();
}

buscarOrder();
```

### Exemplo 2: Investigação Completa
```javascript
async function investigarOrder(orderId, city) {
  const client = await createClient({ headless: false });

  // Buscar order
  const order = await client.searchOrder(orderId, city, true);

  // Extrair motivo do cancelamento
  const cancelInfo = await client.getCancellationDetails();

  // Navegar para entregador
  const riderId = order.rider?.id;
  if (riderId) {
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
  }

  // Resultado completo
  const resultado = {
    order,
    cancelamento: cancelInfo,
    url: client.page.url()
  };

  await client.close();
  return resultado;
}
```

## 📚 Referências

- [Guia de Captura de API](CAPTURA_API.md)
- [Guia de DevTools](DEVTOOLS.md)
- [Plano de Automação](PLANO_AUTOMACAO.md)

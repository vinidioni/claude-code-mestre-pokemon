# Guia de Captura de API - Gattaran

## Objetivo
Capturar os endpoints REST que o Gattaran usa para buscar orders e exibir detalhes.

---

## Passo a Passo

### 1. Abrir DevTools

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome - Gattaran                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │   Pressione F12 ou Ctrl+Shift+I                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Ações:**
- No Gattaran aberto, pressione `F12` (ou `Ctrl+Shift+I`)
- O DevTools vai abrir (geralmente na parte inferior ou lateral)

---

### 2. Configurar DevTools

```
┌─────────────────────────────────────────────────────────────┐
│  DevTools                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┬────────────┐ │
│  │ Elements │ Console  │► Network │ Sources  │ ...        │ │
│  └──────────┴──────────┴──────────┴──────────┴────────────┘ │
│                                                             │
│  ☑️ Preserve log  [MARCAR ESTA CAIXA]                       │
│  ☑️ Disable cache [MARCAR ESTA CAIXA]                       │
│                                                             │
│  Filter: [ All  XHR  JS  CSS  Img  Media  Font  Doc  WS ]  │
│                    ▲                                        │
│                    │                                        │
│            CLICAR EM "XHR" (mostra só chamadas API)        │
└─────────────────────────────────────────────────────────────┘
```

**Ações:**
1. Clique na aba **Network**
2. Marque a caixa **"Preserve log"** (circular no topo)
3. Marque a caixa **"Disable cache"**
4. Clique no filtro **"XHR"** ou **"Fetch/XHR"** (isola só chamadas de API)

---

### 3. Limpar Logs Anteriores

```
┌─────────────────────────────────────────────────────────┐
│  Network                                                │
│                                                         │
│  [ 🚫 Clear ]  [ ⏯️ ]  [ 🔴 Recording ]                │
│     ▲                                                   │
│     │                                                   │
│  CLIQUE NO "🚫" PARA LIMPAR LOGS ANTIGOS               │
│                                                         │
│  Name          Status    Type      Size    Time         │
│  ────────────────────────────────────────────────       │
│  (lista vazia ou com chamadas antigas)                  │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
- Clique no botão **🚫 Clear** (círculo com risco) para limpar logs antigos

---

### 4. Navegar até Order Management

```
┌─────────────────────────────────────────────────────────┐
│  Gattaran                                               │
│                                                         │
│  [Menu Lateral]          [Conteúdo Principal]          │
│                                                         │
│  ▶ City Services          (área de trabalho)           │
│    ▶ Transaction Management                             │
│      ▶ Order Management  ← CLIQUE AQUI                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
- Navegue: **City Services → Transaction Management → Order Management**
- Aguarde a página carregar completamente

---

### 5. Buscar a Order

```
┌─────────────────────────────────────────────────────────┐
│  Order Management                                       │
│                                                         │
│  Order ID:   [________________]                         │
│                  ▲                                      │
│                  5764678584400678506                    │
│                                                         │
│  Current City: [________________]                       │
│                  ▲                                      │
│                  São Paulo                              │
│                                                         │
│           [ 🔍 Search ]  ← CLIQUE                       │
│                 ▲                                       │
│    (ANTES DE CLICAR, CERTIFIQUE-SE QUE O DEVTOOLS       │
│     ESTÁ ABERTO E VENDO A ABA NETWORK)                  │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
1. Preencha **Order ID**: `5764678584400678506`
2. Preencha **Current City**: `São Paulo`
3. **PARE!** Certifique-se que DevTools está aberto na aba Network
4. Clique em **Search**

---

### 6. Capturar Endpoint de Busca

```
┌─────────────────────────────────────────────────────────┐
│  DevTools - Network                                     │
│                                                         │
│  Name              Status   Type     Size    Time       │
│  ─────────────────────────────────────────────────      │
│  ▶ searchOrders    200      xhr      2.3KB   450ms    │
│  ▶ getCityList     200      xhr      890B    120ms    │
│  ▶ ...                                         ▲        │
│                                                │        │
│         PROCURE POR ALGO COMO:                 │        │
│         - "searchOrders"                       │        │
│         - "orderSearch"                        │        │
│         - "queryOrder"                         │        │
│         - URL com "order" no caminho           │        │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
- Olhe na lista de chamadas
- Procure por uma chamada relacionada a busca (provavelmente com "search", "query", "list" no nome)
- Clique na chamada para ver detalhes

---

### 7. Ver Detalhes do Endpoint de Busca

```
┌─────────────────────────────────────────────────────────────┐
│  Detalhes da Chamada (abaixo da lista)                      │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ Headers  │ Payload  │ Preview  │ Response │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
│                                                             │
│  ## Aba Headers:                                            │
│  Request URL: https://gattaran.didi-food.com/api/...        │
│  Request Method: POST (ou GET)                              │
│                                                             │
│  ## Aba Payload (se for POST):                              │
│  {                                                          │
│    "orderId": "5764678584400678506",                        │
│    "city": "São Paulo"                                      │
│    ...                                                      │
│  }                                                          │
│                                                             │
│  ## Aba Response:                                           │
│  {                                                          │
│    "code": 0,                                               │
│    "data": {                                                │
│      "orders": [...]                                        │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

**Ações:**
1. Clique na chamada de busca
2. Vá para aba **Headers** - copie:
   - `Request URL`
   - `Request Method` (GET/POST)
3. Vá para aba **Payload** (se POST) ou **Query String Parameters** (se GET)
4. Vá para aba **Response** - veja o formato do retorno

---

### 8. Clicar no Link da Order

```
┌─────────────────────────────────────────────────────────┐
│  Resultado da Busca                                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Order ID          │ Status  │ ...               │    │
│  ├───────────────────┼─────────┼───────────────────┤    │
│  │ 57646785844006... │ Active  │ ...               │    │
│  │       ▲           │         │                   │    │
│  │   [LINK CLICÁVEL] │         │                   │    │
│  │       │           │         │                   │    │
│  │   CLIQUE AQUI     │         │                   │    │
│  └───────┼───────────────────────────────────────────┘    │
│          │                                              │
│          ▼                                              │
│  (vai abrir detalhes em nova guia ou modal)            │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
1. Clique no **hiperlink do Order ID** na tabela de resultados
2. Aguarde abrir a guia/modal de detalhes

---

### 9. Capturar Endpoint de Detalhes

```
┌─────────────────────────────────────────────────────────┐
│  DevTools - Network (novas chamadas aparecerão)         │
│                                                         │
│  Name              Status   Type     Size    Time       │
│  ─────────────────────────────────────────────────      │
│  ▶ searchOrders    200      xhr      2.3KB   450ms     │
│  ▶ getOrderDetail  200      xhr      5.1KB   320ms  ◄── NOVO!
│  ▶ getMerchantInfo 200      xhr      1.2KB   180ms  ◄── NOVO!
│  ▶ ...                                                  │
│                                                         │
│  PROCURE POR:                                           │
│  - "detail"                                             │
│  - "getOrder"                                           │
│  - "orderInfo"                                          │
│  - "view"                                               │
└─────────────────────────────────────────────────────────┘
```

**Ações:**
- Novas chamadas aparecerão na lista
- Procure por chamadas relacionadas a detalhes
- Clique para ver os detalhes de cada uma

---

### 10. Exportar para Mim

**Opção A: Screenshot das chamadas**
- Tire screenshots das abas Headers + Payload + Response das chamadas principais

**Opção B: Exportar como HAR**
```
┌─────────────────────────────────────────────────────────┐
│  DevTools                                               │
│                                                         │
│  Botão direito na lista de chamadas →                   │
│  "Save all as HAR with content"                         │
│                                                         │
│  Salve como: gattaran-api-capture.har                   │
└─────────────────────────────────────────────────────────┘
```

---

## Checklist - O que eu preciso

Me envie informações sobre estas chamadas:

### Chamada 1: Busca de Orders
- [ ] URL completa
- [ ] Método (GET/POST)
- [ ] Headers (especialmente `Authorization` se tiver)
- [ ] Payload/Parâmetros
- [ ] Exemplo de Response

### Chamada 2: Detalhes da Order
- [ ] URL completa
- [ ] Método (GET/POST)
- [ ] Headers
- [ ] Payload/Parâmetros
- [ ] Exemplo de Response

---

## Formato para Enviar

Você pode enviar:
1. **Screenshots** das abas Headers/Payload/Response
2. **Arquivo HAR** (exportado do DevTools)
3. **Curl** (botão direito na chamada → Copy → Copy as cURL)

**Exemplo de como copiar como cURL:**
```
Botão direito na chamada → Copy → Copy as cURL (bash)
```

Isso me dá tudo que preciso em um comando só!

---

## Dúvidas?

Se tiver qualquer dúvida durante o processo, me chame!

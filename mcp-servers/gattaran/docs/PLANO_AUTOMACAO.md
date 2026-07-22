# Plano de Automação Gattaran - Processamento em Volume

## Problema Atual
- Browser automation requer login manual a cada execução
- Não escala para volume de orders
- Depende de UI que pode mudar

## Solução Proposta: API-First Approach

### Fase 1: Engenharia Reversa da API (Imediato)
Em vez de automatizar o browser, vamos descobrir e usar as APIs REST que o Gattaran usa internamente.

**Como fazer:**
1. Abrir Gattaran no Chrome DevTools (F12)
2. Ir em Network tab
3. Fazer login e buscar uma order
4. Capturar os endpoints e payloads
5. Replicar as chamadas com fetch/axios

**Vantagens:**
- ✅ Muito mais rápido (ms vs segundos)
- ✅ Não depende de UI
- ✅ Fácil paralelizar (processar N orders simultaneamente)
- ✅ Autenticação via token (pode ser renovado automaticamente)

### Fase 2: Sistema de Sessão Persistente
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Login Manual   │────▶│  Salvar JWT  │────▶│  Reutilizar     │
│  (1x por dia)   │     │  / Cookies   │     │  até expirar    │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

**Implementação:**
- Salvar tokens em arquivo local (`.gattaran-session.json`)
- Verificar validade antes de cada execução
- Refresh automático se necessário

### Fase 3: Arquitetura de Processamento em Lote
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  CSV/JSON    │────▶│  Queue       │────▶│  Workers     │────▶│  Results     │
│  com Orders  │     │  (batches)   │     │  (paralelos) │     │  JSON/CSV    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Features:**
- Input: CSV com colunas `order_id`, `city`
- Processamento paralelo (configurável: 5, 10, 20 concorrentes)
- Retry automático em caso de erro
- Rate limiting para não sobrecarregar a API
- Export: JSON/CSV com todos os detalhes

## Opções Técnicas (escolha uma)

### Opção A: API Reverse Engineering (Recomendada)
**Tempo:** 2-4 horas para descobrir endpoints  
**Resultado:** Sistema robusto e rápido

**Passos:**
1. Capturar tráfego de rede no DevTools
2. Identificar endpoints de autenticação e busca
3. Criar cliente HTTP com axios/fetch
4. Implementar sistema de tokens

### Opção B: Playwright com Estado Persistente
**Tempo:** 1-2 horas  
**Resultado:** Mais frágil (depende de UI) mas funciona

**Como:**
- Salvar estado do browser (cookies, localStorage)
- Reutilizar em execuções subsequentes
- Somente re-logar quando expirar

### Opção C: Chrome DevTools Protocol (CDP)
**Tempo:** 3-4 horas  
**Resultado:** Conectar em Chrome já aberto e logado

**Como:**
- Conectar em `chrome://inspect`
- Usar Puppeteer/Playwright com `connectOverCDP`
- Controlar aba já logada

## Minha Recomendação

Vamos pela **Opção A (API Reverse Engineering)**. É o caminho mais profissional e escalável.

### Próximos Passos Imediatos

1. **Você faz:**
   - Abrir o Gattaran no Chrome
   - DevTools → Network tab
   - Fazer login
   - Buscar uma order (ex: 5764678584400678506)
   - Exportar como HAR ou me mostrar os endpoints capturados

2. **Eu construo:**
   - Cliente API baseado nos endpoints
   - Sistema de autenticação persistente
   - Processador em lote com paralelismo

### Estrutura do Sistema Final

```
gattaran/
├── src/
│   ├── api-client.js       # Cliente HTTP para APIs do Gattaran
│   ├── auth-manager.js     # Gerenciamento de tokens/sessão
│   ├── batch-processor.js  # Processamento em lote
│   └── cli.js              # Interface de linha de comando
├── sessions/
│   └── .gattaran-token.json # Token persistido (gitignored)
├── input/
│   └── orders.csv          # CSV com orders para processar
├── output/
│   └── results-YYYY-MM-DD.json
└── package.json
```

### Uso Final

```bash
# Login único (salva token)
npx gattaran-cli login

# Processar uma order
gattaran-cli search 5764678584400678506 "São Paulo"

# Processar lote
gattaran-cli batch --input orders.csv --output results.json --concurrency 10

# Verificar status da sessão
gattaran-cli status
```

---

**Qual das 3 opções você prefere?** Eu recomendo a A, mas posso implementar B ou C se você achar mais adequado.

**Se quiser seguir com a Opção A**, por favor abra o DevTools no Gattaran, faça uma busca de order, e me envie os endpoints que aparecerem na aba Network (pode ser um screenshot ou exportar como HAR).

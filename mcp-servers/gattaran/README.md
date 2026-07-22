# Gattaran MCP Server

MCP Server para automação de navegação e extração de dados do Gattaran (Order Management System da DiDi).

## 📁 Estrutura Organizada

```
gattaran/
├── src/                       # Código fonte principal
│   ├── index.js              # MCP Server principal
│   ├── api-client-v4.js      # Cliente API atual (usar este)
│   ├── cli.js                # Interface de linha de comando
│   └── browser/              # Automação de browser (legado)
├── scripts/                   # Scripts utilitários
│   ├── courier-control.js    # Extrair Control Information do entregador
│   ├── buscar-order-manual.js # Busca manual de order
│   └── run-search.js         # Busca rápida
├── docs/                      # Documentação
│   ├── API.md                # Referência da API
│   ├── CAPTURA_API.md        # Guia de captura de API
│   ├── DEVTOOLS.md           # Guia de DevTools
│   └── PLANO_AUTOMACAO.md    # Plano de automação
├── output/                    # Resultados de execução (gitignore)
├── sessions/                  # Sessões salvas (gitignore)
├── archive/                   # Arquivos históricos
│   ├── versions/             # Versões antigas do código
│   ├── screenshots/          # Screenshots de debug (gitignore)
│   └── scripts/              # Scripts de teste antigos
├── package.json
├── .gitignore
└── README.md                  # Este arquivo
```

## 🚀 Funcionalidades

- ✅ **Busca de orders** por ID e cidade
- ✅ **Extração de detalhes** completos da order
- ✅ **Informações do entregador** (Control Information)
- ✅ **Sessão persistente** (login uma vez, reutiliza)
- ✅ **Batch processing** - Múltiplas orders com UMA autenticação
- ✅ **Skill** integrada ao Claude Code
- ✅ **MCP Server** para automação

## 🎯 Sessão Única para Múltiplas Orders

```bash
# 5 orders com APENAS 1 autenticação
node scripts/batch-orders.js order1,order2,order3,order4,order5

# Ou via arquivo
node scripts/batch-orders.js --file=orders.json
```

A sessão é salva automaticamente em `sessions/` e reutilizada nas próximas execuções.

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [docs/API.md](docs/API.md) | Referência completa da API |
| [docs/CAPTURA_API.md](docs/CAPTURA_API.md) | Como capturar chamadas de API |
| [docs/DEVTOOLS.md](docs/DEVTOOLS.md) | Guia de uso do DevTools |
| [docs/PLANO_AUTOMACAO.md](docs/PLANO_AUTOMACAO.md) | Plano de automação completo |

## 🛠️ Uso

### Como MCP Server

O servidor MCP está configurado em `.mcp.json`:

```json
{
  "mcpServers": {
    "gattaran": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-servers\\gattaran\\src\\index.js"]
    }
  }
}
```

### Scripts Utilitários

```bash
# Buscar UMA order
node scripts/run-search.js

# Buscar MÚLTIPLAS orders (sessão única!)
node scripts/batch-orders.js order1,order2,order3

# Extrair Control Information do entregador
node scripts/courier-control.js

# Busca manual interativa
node scripts/buscar-order-manual.js
```

### Como Skill do Claude

Ative automaticamente com:
- "buscar order no gattaran"
- "analisar cancelamento"
- "ver control information do entregador"

Ou execute:
```bash
/skill run gattaran-viewer
```

### Como Biblioteca

```javascript
import { createClient } from './src/api-client-v4.js';

const client = await createClient({ headless: true });

// Buscar order
const order = await client.searchOrder('5764678698494132425', 'São Paulo', true);

// Extrair dados do entregador
const courierInfo = await extractControlInfo(client.page);

await client.close();
```

## 🔧 Desenvolvimento

### Estrutura de Código

- **`src/api-client-v4.js`**: Cliente principal atual - use este arquivo
- **`src/index.js`**: MCP Server para integração com Claude Code
- **`src/cli.js`**: Interface de linha de comando

### Versionamento

Versões anteriores do api-client estão em `archive/versions/`:
- `api-client-v1.js` - Versão inicial
- `api-client-v2.js` - Adicionado suporte a detalhes
- `api-client-v3.js` - Melhorias na extração
- `api-client-v4.js` - **Versão atual** (consolidada)

## 🔒 Segurança

- Sessões salvas em `sessions/` (não commitar)
- Arquivos de saída em `output/` (não commitar)
- Screenshots em `archive/screenshots/` (não commitar)

## 📝 Convenções

### Commits
```
[gattaran] Descrição breve

Detalhes se necessário

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Nomenclatura de Arquivos
- Scripts: `kebab-case.js`
- Resultados: `tipo-descricao-timestamp.json`
- Screenshots: `contexto-timestamp.png`

## 🐛 Troubleshooting

### Erro de timeout
Aumente o tempo de espera em `api-client-v4.js`:
```javascript
await page.waitForTimeout(10000); // Aumentar para 10s ou mais
```

### Sessão expirada
Delete `sessions/.gattaran-session.json` e faça login novamente.

### Elemento não encontrado
Verifique se o seletor está atualizado. Use os recordings em `~/Documents/` como referência.

## 📊 Exemplos de Uso

### Caso 1: Buscar order cancelada
```bash
node scripts/run-search.js
# Preenche: ORDER_ID=5764678698494132425, CITY=São Paulo
```

### Caso 2: Investigar entregador
```bash
node scripts/courier-control.js
# Extrai Control Information do entregador
```

## 🗺️ Roadmap

- [ ] Modo API direta (sem browser)
- [ ] Cache de sessões com refresh automático
- [ ] Suporte a múltiplas cidades
- [ ] Exportação CSV/Excel
- [ ] Batch processing paralelo

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `docs/`
2. Consulte os exemplos em `scripts/`
3. Veja os recordings em `~/Documents/recording*`

---

**Status**: ✅ Em produção | **Última atualização**: 2026-07-21

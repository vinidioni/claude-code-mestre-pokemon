# Guia de Configuração MCP

Este documento explica como adicionar e configurar servidores MCP (Model Context Protocol) ao projeto.

## O que é MCP?

MCP (Model Context Protocol) é um protocolo que permite ao Claude Code se conectar a serviços externos como GitHub, PostgreSQL, Slack, etc. Cada servidor MCP adiciona novas ferramentas disponíveis para o Claude usar.

## 📁 Onde Fica Cada Tipo de MCP

| Tipo | Local | Exemplo |
|------|-------|---------|
| **Customizado** | `mcp-servers/[nome]/` | D-Chat (integração interna) |
| **Oficial/Community** | Instalado via `npx` | Puppeteer, GitHub, PostgreSQL |

> Veja [`mcp-servers/README.md`](../mcp-servers/README.md) para governança completa.

## MCPs Configurados

| Servidor | Status | Arquivo de Config |
|----------|--------|-------------------|
| Google Workspace | ✅ Ativo | `.mcp.json` |
| GitHub | ⬜ Não configurado | `.mcp.json` (exemplo abaixo) |
| PostgreSQL | ⬜ Não configurado | `.mcp.json` (exemplo abaixo) |
| DChat (DiDi) | ✅ Ativo | `mcp-servers/dchat/` (custom via dws CLI) |
| Puppeteer | ⚠️ Deprecated | Removido - usar Playwright (veja abaixo) |

## Como Adicionar um Novo MCP

### Passo 1: Editar `.mcp.json`

O arquivo `.mcp.json` na raiz do projeto define quais servidores MCP estão ativos:

```json
{
  "mcpServers": {
    "nome-do-servidor": {
      "command": "comando-para-iniciar",
      "args": ["arg1", "arg2"],
      "env": {
        "VARIAVEL": "valor"
      }
    }
  }
}
```

### Passo 2: Exemplos de Configuração

#### GitHub

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Pré-requisitos:**
1. Gere um token em: https://github.com/settings/tokens
2. Permissões necessárias: `repo`, `read:org`
3. Defina a variável de ambiente: `export GITHUB_TOKEN=seu_token`

**Uso:**
```bash
claude "liste meus repositórios"
claude "crie uma issue no repo meu-projeto: Bug no login"
```

---

#### PostgreSQL

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**Uso:**
```bash
claude "liste as tabelas do banco"
claude "execute: SELECT * FROM users LIMIT 5"
```

---

#### Slack

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**Pré-requisitos:**
1. Crie um app em: https://api.slack.com/apps
2. Gere Bot Token com scopes: `chat:write`, `channels:read`
3. Defina variáveis de ambiente

**Uso:**
```bash
claude "envie mensagem no canal #geral: Deploy realizado com sucesso"
```

---

#### Automação Web (Puppeteer vs Playwright)

> ⚠️ **IMPORTANTE**: O MCP oficial `@modelcontextprotocol/server-puppeteer` está **deprecated** desde 2025.5.12. Recomendamos usar **Playwright** diretamente.

##### Alternativa Recomendada: Playwright

**Instalação:**
```bash
pip install playwright
python -m playwright install chromium
```

**Script de exemplo** (`scripts/skillshub_fetch.py`):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto('https://skillshub.intra.xiaojukeji.com/skill/dchat-message')
    content = page.evaluate('() => document.body.innerText')
    page.screenshot(path='screenshot.png')
    browser.close()
```

**Uso:**
```bash
python scripts/skillshub_fetch.py
```

**Vantagens do Playwright:**
- ✅ Ativamente mantido pela Microsoft
- ✅ Suporte melhor para sites modernos (React/Vue/Angular)
- ✅ Lida bem com autenticação SSO corporativa
- ✅ API mais simples e estável

**Ideal para:** Sites internos com autenticação SSO, aplicações React/SPA, scraping de conteúdo dinâmico.

---

##### ❌ Puppeteer (Deprecated - Não usar)

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

⚠️ **Status**: Deprecated. O servidor fecha conexões inesperadamente e não é mais mantido.

---

#### DChat (Custom - DiDi Internal via dws CLI)

O DChat é o chat interno da DiDi. Usamos o CLI `dws` (D-Chat Workspace CLI) que vem com o SmartWork para integração.

> ⚠️ **Servidor Customizado**: Este é um MCP interno desenvolvido no projeto. Código fonte em [`mcp-servers/dchat/`](../mcp-servers/dchat/).

```json
{
  "mcpServers": {
    "dchat": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-servers\\dchat\\index.js"],
      "env": {
        "DWS_SCRIPT_PATH": "C:\\Users\\viniciuscastanho\\.SmartWork\\skills\\smartwork-cli\\smartwork-shared\\assets\\dws-windows.ps1"
      }
    }
  }
}
```

**Pré-requisitos:**
1. D-Chat desktop app instalado e autenticado
2. Node.js 18+ instalado
3. SmartWork CLI disponível em `~/.SmartWork/skills/smartwork-cli/`

**Ferramentas disponíveis:**
- `send_message` - Enviar mensagens para usuários ou grupos
- `list_chats` - Listar conversas disponíveis
- `get_messages` - Ler mensagens de uma conversa

**Parâmetros do `send_message`:**
- `target_type`: `user`, `chat_id`, `chat_name`, ou `current`
- `target`: Identificador (username, chat ID, nome do grupo)
- `message`: Texto da mensagem (suporta @mentions como `@username`)
- `dry_run`: Preview sem enviar

**Uso:**
```bash
# Enviar mensagem para um usuário
claude "envie mensagem no dchat para maurojunior: Olá, tudo bem?"

# Enviar mensagem para um grupo
claude "envie mensagem no grupo 'Nome do Grupo': Reunião às 15h"

# Listar chats
claude "liste meus chats no dchat"

# Ler mensagens
claude "leia as mensagens de hoje no grupo 'Projeto X'"
```

**Limitações:**
- Rate limit: 10 mensagens/minuto ao enviar
- Workspace server requer D-Chat desktop rodando
- Conta precisa de permissão para consultar histórico

**Documentação completa:** [`mcp-dchat-server/README.md`](../mcp-dchat-server/README.md)

---

### Passo 3: Ativar no Settings Local

Para usar o MCP, ative-o em `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": [
    "google-workspace",
    "github",
    "postgres"
  ]
}
```

### Passo 4: Testar

```bash
# Ver status dos MCPs
claude mcp status

# Ou teste diretamente
claude "liste as ferramentas MCP disponíveis"
```

## Servidores MCP Comunidade

| Servidor | Instalação | Descrição |
|----------|------------|-----------|
| GitHub | `npx -y @modelcontextprotocol/server-github` | Issues, PRs, repos |
| PostgreSQL | `npx -y @modelcontextprotocol/server-postgres` | Queries SQL |
| SQLite | `npx -y @modelcontextprotocol/server-sqlite` | Banco SQLite |
| Slack | `npx -y @modelcontextprotocol/server-slack` | Mensagens |
| Puppeteer | `npx -y @modelcontextprotocol/server-puppeteer` | Automação web |
| Fetch | `npx -y @modelcontextprotocol/server-fetch` | HTTP requests |
| Filesystem | `npx -y @modelcontextprotocol/server-filesystem` | Acesso a arquivos |
| Brave Search | `npx -y @modelcontextprotocol/server-brave-search` | Busca web |

Lista completa: https://github.com/modelcontextprotocol/servers

## Troubleshooting

### "MCP server not found"
```bash
# Verifique se o pacote está instalado globalmente
npm list -g @modelcontextprotocol/server-nome

# Ou instale
npm install -g @modelcontextprotocol/server-nome
```

### "Permission denied"
- Verifique permissões do token/API key
- Confirme que a variável de ambiente está definida

### "Connection refused"
- Verifique se o serviço está rodando (ex: PostgreSQL)
- Confirme URL/credentials

## Segurança

⚠️ **Nunca commite:**
- Tokens de API
- Senhas de banco de dados
- Chaves privadas

✅ **Sempre use:**
- Variáveis de ambiente (`${VAR_NAME}`)
- `.claude/settings.local.json` (não versionado)
- `.env` files (com `.env` no `.gitignore`)

## Exemplo Completo: `.mcp.json`

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "mcp-server-google-workspace",
      "args": [],
      "env": {
        "GOOGLE_REDIRECT_URI": "http://localhost:3000/oauth2callback",
        "GOOGLE_CLIENT_SECRETS": "${GOOGLE_CLIENT_SECRETS}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

Com variáveis de ambiente:
```bash
export GOOGLE_CLIENT_SECRETS="/caminho/client_secret.json"
export GITHUB_TOKEN="ghp_xxxxxxxx"
export DATABASE_URL="postgresql://..."
```

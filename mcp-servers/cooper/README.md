# MCP Server - Cooper (DiDi Documentation Platform)

Servidor MCP para integração com a plataforma de documentação [Cooper](https://cooper.didichuxing.com) da DiDi.

## 🚀 Instalação Rápida

### 1. Instale as dependências

```bash
cd mcp-servers/cooper
npm install
```

### 2. Configure o token de autenticação

1. Acesse: https://mcphub.intra.xiaojukeji.com/square
2. Clique em **"申请令牌"** (Solicitar Token)
3. Selecione a versão **ANTIGA (Legacy)**
4. Copie o token no formato: `fcfc9605-1d50-486f-aa72-80fca2315984`
5. Cole no arquivo `scripts/config.js`:

```javascript
// scripts/config.js
module.exports = {
  token: 'SEU_TOKEN_AQUI',  // Substitua pelo seu token
  baseUrl: 'http://10.88.128.45/cooper_mcp'
};
```

> ⚠️ **Importante:** Use a versão **LEGACY** da API. A versão nova requer LCA (滴滴安全助手) instalado.

### 3. Verifique a configuração no `.mcp.json`

O servidor já deve estar configurado no `.mcp.json` da raiz:

```json
{
  "mcpServers": {
    "cooper": {
      "command": "node",
      "args": ["C:\\\\Users\\\\viniciuscastanho\\\\Desktop\\\\dcc\\\\mcp-servers\\\\cooper\\\\src\\\\index.js"]
    }
  }
}
```

### 4. Ative o servidor

No `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["cooper", "dchat"]
}
```

---

## 📁 Estrutura do Projeto

```
mcp-servers/cooper/
├── src/                           # Código fonte do MCP Server
│   ├── index.js                  # Entry point - define ferramentas MCP
│   ├── auth/
│   │   └── browser-auth.js       # Autenticação via browser (Playwright)
│   └── api/
│       └── cooper-client.js      # Cliente API Cooper
│
├── scripts/                       # Scripts utilitários (standalone)
│   ├── config.js                 # Configuração de token
│   ├── search.js                 # Buscar documentos
│   ├── read.js                   # Ler documento específico
│   └── create.js                 # Criar novo documento
│
├── examples/
│   └── usage-examples.md         # Exemplos de uso da API
│
├── package.json
└── README.md                      # Este arquivo
```

---

## 🛠️ Ferramentas MCP Disponíveis

| Ferramenta | Descrição | Parâmetros |
|------------|-----------|------------|
| `cooper_search` | Busca documentos por palavra-chave | `query` (string), `limit` (number, opcional) |
| `cooper_get_document` | Obtém conteúdo de um documento | `docId` (string - ID ou URL) |
| `cooper_list_spaces` | Lista espaços/workspaces disponíveis | - |
| `cooper_create_document` | Cria um novo documento | `title` (string), `content` (string), `spaceId` (opcional) |

---

## 💬 Uso no Claude Code

### Buscar documentos
```
"Busca no Cooper sobre onboarding de novos funcionários"
"Procura documentos sobre API gateway no Cooper"
```

### Ler documento específico
```
"Lê o documento 2207291123516 do Cooper"
"Pega o conteúdo do doc: https://cooper.didichuxing.com/docs2/document/2207291123516"
```

### Criar documento
```
"Cria um documento no Cooper chamado 'Reunião Daily' com a pauta: ..."
"Salva isso no espaço de Engenharia do Cooper: [conteúdo]"
```

### Listar espaços
```
"Quais espaços tenho no Cooper?"
"Lista minhas workspaces do Cooper"
```

---

## 🔧 Uso via Scripts (Standalone)

Se preferir usar sem o Claude Code:

```bash
# Buscar documentos
cd mcp-servers/cooper
node scripts/search.js

# Ler documento específico
node scripts/read.js

# Criar documento
node scripts/create.js
```

> Nota: Os scripts usam a API REST diretamente, não o protocolo MCP.

---

## 🔗 Integração com Skills

Este MCP é complementado pelas seguintes skills em `.claude/skills/`:

| Skill | Descrição | Quando Usar |
|-------|-----------|-------------|
| `cooper` | Skill geral do Cooper | Contexto amplo sobre documentação DiDi |
| `cooper-search` | Busca especializada | Quando o foco é encontrar documentos |
| `cooper-read` | Leitura especializada | Quando o foco é extrair conteúdo |
| `cooper-write` | Criação especializada | Quando o foco é criar documentos |

---

## 📝 Dicas

- **IDs de documentos** podem ser extraídos das URLs:
  - URL: `https://cooper.didichuxing.com/docs2/document/2207291123516`
  - ID: `2207291123516`

- **Token** não expira (versão legacy)

- **Espaço padrão**: Use `spaceId: "0"` para espaço pessoal

- **Encoding**: Evite acentos no conteúdo para prevenir erros de encoding

---

## 🔗 Links Úteis

| Recurso | URL |
|---------|-----|
| Cooper | https://cooper.didichuxing.com |
| MCPHub (Tokens) | https://mcphub.intra.xiaojukeji.com/square |
| SkillsHub | https://skillshub.intra.xiaojukeji.com |

---

**Versão:** 1.0.0  
**Licença:** MIT

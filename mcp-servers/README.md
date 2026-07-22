# MCP Servers - Governança

Este diretório contém **servidores MCP customizados** desenvolvidos internamente para o projeto DCC.

## 📁 Estrutura

```
mcp-servers/
├── README.md              # Este arquivo - governança e padrões
├── cooper/                # MCP para plataforma Cooper (DiDi Documentation)
│   ├── README.md          # Documentação do servidor
│   ├── src/               # Código fonte
│   ├── scripts/           # Scripts utilitários
│   ├── examples/          # Exemplos de uso
│   └── package.json
│
└── dchat/                 # MCP para D-Chat (DiDi messaging)
    ├── v1/                # Versão 1 (legada)
    └── v2/                # Versão 2 (atual)
        ├── README.md
        └── index.js
```

## 🏛️ Governança

### O que vai aqui

✅ **Servidores MCP customizados** (código próprio):
- Integrações internas (ex: D-Chat via `dws` CLI)
- Integrações com plataformas corporativas (ex: Cooper)
- Servidores com lógica específica do negócio
- Wrappers para APIs internas não padronizadas

### O que NÃO vai aqui

❌ **MCPs oficiais/community** (instalados via `npx`):
- Apenas referenciados no `.mcp.json` da raiz
- ⚠️ **Verificar status antes de usar** - alguns MCPs oficiais estão deprecated

⚠️ **MCPs Deprecados Encontrados:**
| MCP | Status | Alternativa Recomendada |
|-----|--------|------------------------|
| `@modelcontextprotocol/server-puppeteer` | ❌ Deprecated (2025.5.12) | Usar Playwright diretamente ou criar MCP customizado |

> **Aprendizado:** Sempre verifique se o MCP está ativamente mantido antes de adicionar ao projeto.

## 📋 Servidores Customizados

| Servidor | Descrição | Ferramentas | Status |
|----------|-----------|-------------|--------|
| **cooper** | Integração com Cooper (DiDi Documentation) | `cooper_get_document`, `cooper_search`, `cooper_list_spaces`, `cooper_create_document` | ✅ Ativo |
| **dchat** | Integração com D-Chat via CLI `dws` | `send_message`, `search_messages` | ✅ Ativo (v2) |

## 🚀 Como Usar

### 1. Configuração no `.mcp.json`

Os servidores já estão configurados no arquivo `.mcp.json` da raiz:

```json
{
  "mcpServers": {
    "cooper": {
      "command": "node",
      "args": ["C:\\\\Users\\\\...\\\\mcp-servers\\\\cooper\\\\src\\\\index.js"]
    },
    "dchat": {
      "command": "node",
      "args": ["C:\\\\Users\\\\...\\\\mcp-servers\\\\dchat\\\\v2\\\\index.js"],
      "env": {
        "DWS_SCRIPT_PATH": "..."
      }
    }
  }
}
```

### 2. Ativação em `.claude/settings.local.json`

```json
{
  "enabledMcpjsonServers": ["cooper", "dchat", "google-workspace"]
}
```

### 3. Instalação de Dependências

```bash
# Cooper
cd mcp-servers/cooper
npm install

# D-Chat (v2 - standalone)
cd mcp-servers/dchat/v2
# Não requer npm install (usa CLI externa)
```

## 🛠️ Criando um Novo Servidor Customizado

1. **Crie o diretório**:
   ```bash
   mkdir mcp-servers/meu-servidor
   cd mcp-servers/meu-servidor
   npm init -y
   ```

2. **Estrutura mínima**:
   ```
   meu-servidor/
   ├── README.md       # Documentação obrigatória
   ├── src/
   │   └── index.js    # Entry point
   ├── package.json
   └── examples/       # Exemplos de uso
   ```

3. **Documente no README.md**:
   - Propósito do servidor
   - Pré-requisitos
   - Ferramentas disponíveis
   - Exemplos de uso

4. **Adicione ao `.mcp.json`**:
   ```json
   {
     "mcpServers": {
       "meu-servidor": {
         "command": "node",
         "args": ["C:\\\\Users\\\\...\\\\mcp-servers\\\\meu-servidor\\\\src\\\\index.js"]
       }
     }
   }
   ```

5. **Skills associadas** (opcional):
   - Se o MCP precisar de skills Claude, crie em `.claude/skills/[nome]/`
   - Documente a relação no README do MCP

## 🔒 Segurança

- **Nunca commite** credenciais ou tokens
- Use variáveis de ambiente em `.claude/settings.local.json`
- Documente permissões necessárias no README do servidor

## 📚 Referências

- [MCP Servers Oficiais](https://github.com/modelcontextprotocol/servers)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Guia de Setup MCP](../docs/mcp-setup-guide.md)
- [Documentação Cooper](./cooper/README.md)

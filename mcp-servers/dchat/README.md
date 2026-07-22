# MCP D-Chat Server

Servidor MCP (Model Context Protocol) para integração com D-Chat via CLI `dws`.

## 🆕 Versão 2.0 Disponível!

Esta pasta contém a **versão atual (v2.0)**. Para a versão antiga, veja `v1/`.

### Principais Melhorias na v2.0

| Feature | v1 | v2.0 | Impacto |
|---------|-----|------|---------|
| Tools | 4 | 10 | +150% funcionalidades |
| Cache | ❌ | ✅ | Performance 3x |
| Rate Limiting | ❌ | ✅ | Sem bloqueios |
| Todo Integration | ❌ | ✅ | Novo workflow |
| Report Generation | ❌ | ✅ | Analytics |
| Dry-run Mode | ❌ | ✅ | Segurança |

📖 **Documentação completa da v2.0**: [`v2/README.md`](v2/README.md)

---

## 🚀 Quick Start

### Instalação

```bash
cd mcp-servers/dchat/v2
npm install
```

### Configuração no `.mcp.json`

```json
{
  "mcpServers": {
    "dchat": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-servers\\dchat\\v2\\index.js"],
      "env": {
        "DWS_SCRIPT_PATH": "C:\\Users\\viniciuscastanho\\.SmartWork\\skills\\smartwork-cli\\smartwork-shared\\assets\\dws-windows.ps1"
      }
    }
  }
}
```

---

## 📋 Ferramentas Disponíveis (v2.0)

### Core (Melhoradas)
- `send_message` - Envio otimizado com rate limiting e dry-run
- `list_chats` - Com cache e filtros
- `get_messages` - Busca incremental e caching

### Novas (v2.0)
- `create_todo_from_message` - Workflow: msg → todo
- `manage_todo` - CRUD completo de tarefas
- `search_messages` - Busca eficiente
- `generate_report` - Relatórios de atividade
- `get_chat_info` - Metadados detalhados
- `get_rate_limit_status` - Monitoramento
- `clear_cache` - Troubleshooting

---

## 📁 Estrutura

```
mcp-servers/dchat/
├── v1/                    # Versão 1.0 (backup)
│   ├── index.js
│   └── README.md
├── v2/                    # ✅ Versão 2.0 (atual)
│   ├── index.js
│   ├── package.json
│   ├── README.md          # Documentação completa
│   └── test.js            # Testes
├── README.md              # Este arquivo
└── .mcp.json.example
```

---

## 🛠️ Troubleshooting

### Limpar cache
```json
{
  "cache_type": "all"
}
```

### Verificar rate limit
```json
{}  // get_rate_limit_status
```

---

## 📚 Documentação

- [Documentação v2.0 Completa](v2/README.md)
- [Versão 1.0 (Legacy)](v1/README.md)
- [Skills Hub - dchat-message](https://skillshub.intra.xiaojukeji.com/skill/dchat-message)
- [Skills Hub - dchat-todo](https://skillshub.intra.xiaojukeji.com/skill/dchat-todo)

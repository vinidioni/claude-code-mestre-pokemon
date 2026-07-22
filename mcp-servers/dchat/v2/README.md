# MCP D-Chat Server v2.0

Servidor MCP (Model Context Protocol) otimizado para integração com D-Chat.

## 🆕 Novidades na v2.0

### Performance & Otimizações

| Feature | Descrição | Benefício |
|---------|-----------|-----------|
| **Chat Caching** | Cache de lista de chats (5 min TTL) | Reduz chamadas repetidas ao DWS |
| **Message Caching** | Cache incremental de mensagens | Busca mais rápida em histórico |
| **Rate Limiting** | Controle interno 10 msg/min | Evita bloqueios do servidor |
| **Multiple Formats** | JSON, Text, Markdown | Flexibilidade de output |

### Novas Funcionalidades

| Tool | Descrição | Caso de Uso |
|------|-----------|-------------|
| `create_todo_from_message` | Cria todo a partir de mensagem | Workflow: msg → ação |
| `manage_todo` | CRUD completo de todos | Gestão de tarefas |
| `search_messages` | Busca incremental | Encontrar msgs antigas rapidamente |
| `generate_report` | Relatórios de atividade | Analytics de grupos |
| `get_chat_info` | Info detalhada do chat | Metadados e membros |
| `get_rate_limit_status` | Status de rate limit | Monitoramento |
| `clear_cache` | Limpar cache | Troubleshooting |

### Melhorias nas Tools Existentes

#### `send_message` (Otimizada)
- ✅ **Rate limiting inteligente** - avisa antes de atingir limite
- ✅ **Dry-run mode** - preview antes de enviar
- ✅ **Validação de target** - resolve chat_name para chat_id automaticamente
- ✅ **Formatos de saída** - JSON, texto ou markdown

#### `list_chats` (Otimizada)
- ✅ **Cache com TTL** - 5 minutos de cache
- ✅ **Filtro por nome** - busca parcial
- ✅ **Force refresh** - atualização manual

#### `get_messages` (Otimizada)
- ✅ **Time ranges** - today, yesterday, last_7_days, custom
- ✅ **Busca por texto** - filtro local
- ✅ **Filtro @me** - apenas menções
- ✅ **Caching incremental** - guarda últimas mensagens

## 📁 Estrutura

```
mcp-servers/dchat/
├── v1/                      # Versão original (backup)
│   ├── index.js
│   └── package.json
└── v2/                      # Nova versão
    ├── index.js             # Entry point
    ├── package.json
    └── README.md            # Este arquivo
```

## ⚙️ Configuração

### 1. Instalar dependências

```bash
cd mcp-servers/dchat/v2
npm install
```

### 2. Atualizar `.mcp.json`

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

### 3. Ativar no settings

```json
{
  "enabledMcpjsonServers": ["dchat", "google-workspace"]
}
```

## 🚀 Uso

### Enviar mensagem (com dry-run)

```json
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Olá! Teste de mensagem",
  "dry_run": true,
  "output_format": "json"
}
```

### Criar todo a partir de mensagem

```json
{
  "message_link": "https://im-dichat.xiaojukeji.com/chat/123#message-456",
  "assignee": "maurojunior",
  "priority": "high",
  "due_date": "2026-07-20T18:00:00Z"
}
```

### Busca incremental

```json
{
  "target_type": "chat_name",
  "target": "SSI AI Initiatives",
  "query": "reunião",
  "since": "2026-07-10T00:00:00Z"
}
```

### Gerar relatório

```json
{
  "target_type": "chat_name",
  "target": "Customer Support",
  "period": "today",
  "analysis_type": "summary",
  "send_to_chat": true
}
```

## 📊 Comparação v1 vs v2

| Aspecto | v1 | v2 | Melhoria |
|---------|-----|-----|----------|
| Tools | 4 | 10 | +150% |
| Cache | ❌ | ✅ | Performance |
| Rate Limit | ❌ | ✅ | Confiabilidade |
| Formats | JSON | JSON/Text/Markdown | Flexibilidade |
| Todo Integration | ❌ | ✅ | Novo workflow |
| Report Generation | ❌ | ✅ | Analytics |
| Dry-run | ❌ | ✅ | Segurança |

## 🔄 Migração da v1

A v2 é **100% compatível** com a v1. Todas as tools antigas funcionam igual, apenas com melhorias.

Para migrar:
1. Backup da v1: `cp -r v1 v1-backup`
2. Copiar v2 para pasta principal (opcional)
3. Atualizar path no `.mcp.json`

## 🛠️ Troubleshooting

### Limpar cache

```json
{
  "cache_type": "all"  // ou "chats", "messages"
}
```

### Verificar rate limit

```json
{}  // get_rate_limit_status não precisa de parâmetros
```

## 📝 Changelog

### v2.0.0 (2026-07-15)
- Refatoração completa com arquitetura modular
- Sistema de cache para chats e mensagens
- Rate limiting inteligente
- 6 novas tools (todo, reports, search)
- Múltiplos formatos de saída
- Modo dry-run para testing

## 🔗 Referências

- [D-Chat Open Platform](https://open.dchat.xiaojukeji.com)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Skills Hub - dchat-message](https://skillshub.intra.xiaojukeji.com/skill/dchat-message)
- [Skills Hub - dchat-todo](https://skillshub.intra.xiaojukeji.com/skill/dchat-todo)

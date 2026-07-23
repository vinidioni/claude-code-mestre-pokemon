# MCP D-Chat Server

MCP (Model Context Protocol) Server for integration with D-Chat via CLI `dws`.

---

## 📁 Structure

```
mcp-servers/dchat/
├── index.js              # Main entry point
├── package.json          # Dependencies
├── test.js              # Tests
├── README.md            # This file
└── .mcp.json.example    # Configuration example
```

---

## 🛠️ Available Tools

| Tool | Description |
|------|-----------|
| `send_message` | Send message to user or group |
| `list_chats` | List available chats |
| `get_messages` | Get messages from a chat |
| `search_messages` | Search messages by text |
| `create_todo_from_message` | Create todo from message |
| `manage_todo` | Manage todos (CRUD) |
| `generate_report` | Generate activity reports |
| `get_chat_info` | Get chat information |
| `get_rate_limit_status` | Check rate limit status |
| `clear_cache` | Clear internal cache |

---

## ⚙️ Configuration

### 1. Install dependencies

```bash
cd mcp-servers/dchat
npm install
```

### 2. Configure `.mcp.json` (project root)

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

### 3. Activate in `.claude/settings.local.json`

```json
{
  "enabledMcpjsonServers": ["dchat", "google-workspace", "gattaran"]
}
```

---

## 🚀 Usage Examples

### Send message

```javascript
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Hello! Test message"
}
```

### Search messages

```javascript
{
  "target_type": "chat_name",
  "target": "SSI AI Initiatives",
  "query": "meeting",
  "since": "2026-07-10T00:00:00Z"
}
```

### Create todo

```javascript
{
  "message_link": "https://im-dichat.xiaojukeji.com/chat/123#message-456",
  "assignee": "maurojunior",
  "priority": "high",
  "due_date": "2026-07-20T18:00:00Z"
}
```

---

## 🔄 Features

- ✅ **Chat Caching** - Chat list cache (5 min TTL)
- ✅ **Message Caching** - Incremental message cache
- ✅ **Rate Limiting** - Internal control 10 msg/min
- ✅ **Multiple Formats** - JSON, Text, Markdown
- ✅ **Dry-run mode** - Preview before sending

---

## 🔗 References

- [D-Chat Open Platform](https://open.dchat.xiaojukeji.com)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [MCP Servers Governance](../README.md)

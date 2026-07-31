# D-Chat - DiDi Messaging Platform

**Unified skill** for complete integration with DiDi's internal messaging system.

## Overview

This single skill provides all D-Chat functionality:

| Capability | Description | Tools |
|------------|-------------|-------|
| 💬 **Send** | Direct messages to users/groups | `send_message` |
| 🔍 **Search** | Message history search | `search_messages`, `get_messages` |
| 🔔 **Notify** | Formatted notifications to channels | `send_message` with markdown |

## Activation Triggers

The skill activates when you mention:
- **Send**: "mandar mensagem", "enviar mensagem", "manda no chat"
- **Search**: "buscar mensagem", "procurar no chat", "histórico dchat"
- **Notify**: "notificar", "avisa no canal", "alerta time"

## MCP Tools

### send_message
```json
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Meeting postponed to 3pm",
  "format": "text"
}
```

### search_messages
```json
{
  "target_type": "group",
  "target": "SSI AI Initiatives",
  "query": "meeting",
  "since": "2026-07-20T00:00:00Z",
  "limit": 10
}
```

### get_messages
```json
{
  "target_type": "group",
  "target": "Engineering",
  "limit": 20
}
```

### list_chats
List all available chats (cached 5 min).

## Examples

```
"Send a message to John saying the report is ready"
"Search for 'meeting' in the AI group"
"Notify the Engineering team about the incident"
"Get last 20 messages from the team chat"
```

## Related Documentation

- [MCP Server README](../../mcp-servers/dchat/README.md)
- [SKILL.md](SKILL.md) - Full skill documentation

## Tips

- Usernames are typically `firstname.lastname`
- Group names are case-insensitive
- Rate limit: 10 messages/minute
- Markdown supported: **bold**, *italic*, `code`

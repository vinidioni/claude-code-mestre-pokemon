---
name: dchat
description: DiDi D-Chat integration - send messages, search history, and send notifications to users and groups
triggers:
  - dchat
  - mandar mensagem
  - enviar mensagem
  - manda no chat
  - mandar msg
  - manda msg
  - buscar mensagem
  - procurar no chat
  - histórico dchat
  - mensagens antigas
  - achar conversa
  - buscar no dchat
  - notificar
  - avisa no canal
  - alerta time
  - notifica equipe
  - avisar grupo
  - notificar canal
  - alerta dchat
---

# D-Chat - DiDi Messaging Platform

Complete skill set for interacting with DiDi's internal messaging system.

## Overview

| Capability | Description | Key Tools |
|------------|-------------|-----------|
| **Send** | Send direct messages to users/groups | `send_message` |
| **Search** | Search message history | `search_messages`, `get_messages` |
| **Notify** | Send formatted notifications to channels | `send_message` with markdown |

## MCP Tools Available

### send_message
Send message to user or group.

**Parameters:**
- `target_type` (string): "user" | "group"
- `target` (string): username or group name
- `message` (string): message content
- `format` (string, optional): "text" | "markdown" (default: "text")
- `mentions` (array, optional): list of usernames to mention

**Example:**
```json
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Meeting postponed to 3pm",
  "format": "text"
}
```

### search_messages
Search messages by text with filters.

**Parameters:**
- `target_type` (string): "user" | "group"
- `target` (string): username or group name (optional for global search)
- `query` (string): search term
- `since` (string, optional): ISO date (ex: "2026-07-20T00:00:00Z")
- `until` (string, optional): ISO date
- `limit` (number, optional): max results (default: 20)

**Example:**
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
Get recent messages from a chat.

**Parameters:**
- `target_type` (string): "user" | "group"
- `target` (string): username or group name
- `limit` (number, optional): quantity (default: 50)
- `before` (string, optional): message ID for pagination

### list_chats
List all available chats (5 min cache).

## Usage Examples

### Send to User
```
User: "Send a message to John saying the report is ready"
→ send_message with target="joao.silva", message="Report is ready"
```

### Send to Group
```
User: "Tell the 'Engineering' group that deploy was cancelled"
→ send_message with target_type="group", target="Engineering"
```

### Formatted Message
```
User: "Send a formatted message to the team"
→ send_message with format="markdown", message="## Alert\nDeploy cancelled"
```

### Search Messages
```
User: "Search for 'meeting' in the AI group"
→ search_messages with target="SSI AI Initiatives", query="meeting"
```

### Recent History
```
User: "Get last 20 messages from Engineering group"
→ get_messages with target="Engineering", limit=20
```

### List Chats
```
User: "What chats do I have available?"
→ list_chats
```

### Notification with Mention
```
User: "Notify the Engineering group about the incident and mention John"
→ send_message with mentions=["joao.silva"], format="markdown"
```

## Notification Templates

### Deploy
```markdown
🚀 **Deploy Completed**

- Version: {version}
- Environment: {environment}
- Status: ✅ Success
- Link: {changelog_url}
```

### Alert
```markdown
⚠️ **Alert - {severity}**

{message}

Impact: {impact}
Action required: {action}
```

### Status
```markdown
📊 **Status Update**

{title}: {status}

Details: {details}
```

## Tips

- Usernames are typically `firstname.lastname` or `firstname`
- Group names are case-insensitive
- Long messages are automatically split
- Rate limit: 10 messages/minute
- Search is case-insensitive and fuzzy
- Use relative date terms ("yesterday", "last week") for `since` parameter
- Results are ordered by most recent
- Message cache improves performance on repeated searches
- Channels are public groups listed in `list_chats`
- Mentions use @username and generate push notifications
- Markdown supports: **bold**, *italic*, `code`, [links](url)
- Emojis recommended for visibility

## Integration with Other Skills

- **cooper-write**: Send link to created document
- **gattaran-viewer**: Notify about order status
- **backup-dccrazy**: Notify after backup completion
- **dccrazy-updater**: Notify about available updates

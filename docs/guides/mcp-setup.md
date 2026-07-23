# MCP Configuration Guide

This document explains how to add and configure MCP (Model Context Protocol) servers to the project.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows Claude Code to connect to external services like GitHub, PostgreSQL, Slack, etc. Each MCP server adds new tools available for Claude to use.

## 📁 Where Each MCP Type Goes

| Type | Location | Example |
|------|-------|---------|
| **Custom** | `mcp-servers/[name]/` | D-Chat (internal integration) |
| **Official/Community** | Installed via `npx` | Puppeteer, GitHub, PostgreSQL |

> See [`mcp-servers/README.md`](../mcp-servers/README.md) for complete governance.

## Configured MCPs

| Server | Status | Config File |
|----------|--------|-------------------|
| Google Workspace | ✅ Active | `.mcp.json` |
| GitHub | ⬜ Not configured | `.mcp.json` (example below) |
| PostgreSQL | ⬜ Not configured | `.mcp.json` (example below) |
| DChat (DiDi) | ✅ Active | `mcp-servers/dchat/` (custom via dws CLI) |
| Puppeteer | ⚠️ Deprecated | Removed - use Playwright (see below) |

## How to Add a New MCP

### Step 1: Edit `.mcp.json`

The `.mcp.json` file at the project root defines which MCP servers are active:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "command-to-start",
      "args": ["arg1", "arg2"],
      "env": {
        "VARIABLE": "value"
      }
    }
  }
}
```

### Step 2: Configuration Examples

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

**Prerequisites:**
1. Generate a token at: https://github.com/settings/tokens
2. Required permissions: `repo`, `read:org`
3. Set environment variable: `export GITHUB_TOKEN=your_token`

**Usage:**
```bash
claude "list my repositories"
claude "create an issue in repo my-project: Bug in login"
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

**Usage:**
```bash
claude "list database tables"
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

**Prerequisites:**
1. Create an app at: https://api.slack.com/apps
2. Generate Bot Token with scopes: `chat:write`, `channels:read`
3. Set environment variables

**Usage:**
```bash
claude "send message to channel #general: Deployment completed successfully"
```

---

#### Web Automation (Puppeteer vs Playwright)

> ⚠️ **IMPORTANT**: The official MCP `@modelcontextprotocol/server-puppeteer` is **deprecated** since 2025.5.12. We recommend using **Playwright** directly.

##### Recommended Alternative: Playwright

**Installation:**
```bash
pip install playwright
python -m playwright install chromium
```

**Example script** (`scripts/skillshub_fetch.py`):
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

**Usage:**
```bash
python scripts/skillshub_fetch.py
```

**Playwright Advantages:**
- ✅ Actively maintained by Microsoft
- ✅ Better support for modern sites (React/Vue/Angular)
- ✅ Handles corporate SSO authentication well
- ✅ Simpler and more stable API

**Ideal for:** Internal sites with SSO authentication, React/SPA applications, dynamic content scraping.

---

##### ❌ Puppeteer (Deprecated - Do not use)

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

⚠️ **Status**: Deprecated. Server closes connections unexpectedly and is no longer maintained.

---

#### DChat (Custom - DiDi Internal via dws CLI)

DChat is DiDi's internal chat. We use the `dws` CLI (D-Chat Workspace CLI) that comes with SmartWork for integration.

> ⚠️ **Custom Server**: This is an internal MCP developed in the project. Source code at [`mcp-servers/dchat/`](../mcp-servers/dchat/).

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

**Prerequisites:**
1. D-Chat desktop app installed and authenticated
2. Node.js 18+ installed
3. SmartWork CLI available at `~/.SmartWork/skills/smartwork-cli/`

**Available tools:**
- `send_message` - Send messages to users or groups
- `list_chats` - List available conversations
- `get_messages` - Read messages from a conversation

**`send_message` parameters:**
- `target_type`: `user`, `chat_id`, `chat_name`, or `current`
- `target`: Identifier (username, chat ID, group name)
- `message`: Message text (supports @mentions like `@username`)
- `dry_run`: Preview without sending

**Usage:**
```bash
# Send message to a user
claude "send message on dchat to maurojunior: Hello, how are you?"

# Send message to a group
claude "send message to group 'Group Name': Meeting at 3pm"

# List chats
claude "list my chats on dchat"

# Read messages
claude "read today's messages in group 'Project X'"
```

**Limitations:**
- Rate limit: 10 messages/minute when sending
- Workspace server requires D-Chat desktop running
- Account needs permission to query history

**Complete documentation:** [`mcp-servers/dchat/README.md`](../mcp-servers/dchat/README.md)

---

### Step 3: Activate in Local Settings

To use the MCP, activate it in `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": [
    "google-workspace",
    "github",
    "postgres"
  ]
}
```

### Step 4: Test

```bash
# Check MCP status
claude mcp status

# Or test directly
claude "list available MCP tools"
```

## Community MCP Servers

| Server | Installation | Description |
|----------|------------|-----------|
| GitHub | `npx -y @modelcontextprotocol/server-github` | Issues, PRs, repos |
| PostgreSQL | `npx -y @modelcontextprotocol/server-postgres` | SQL queries |
| SQLite | `npx -y @modelcontextprotocol/server-sqlite` | SQLite database |
| Slack | `npx -y @modelcontextprotocol/server-slack` | Messages |
| Puppeteer | `npx -y @modelcontextprotocol/server-puppeteer` | Web automation |
| Fetch | `npx -y @modelcontextprotocol/server-fetch` | HTTP requests |
| Filesystem | `npx -y @modelcontextprotocol/server-filesystem` | File access |
| Brave Search | `npx -y @modelcontextprotocol/server-brave-search` | Web search |

Complete list: https://github.com/modelcontextprotocol/servers

## Troubleshooting

### "MCP server not found"
```bash
# Check if package is installed globally
npm list -g @modelcontextprotocol/server-name

# Or install
npm install -g @modelcontextprotocol/server-name
```

### "Permission denied"
- Check token/API key permissions
- Confirm environment variable is set

### "Connection refused"
- Check if service is running (e.g., PostgreSQL)
- Confirm URL/credentials

## Security

⚠️ **Never commit:**
- API tokens
- Database passwords
- Private keys

✅ **Always use:**
- Environment variables (`${VAR_NAME}`)
- `.claude/settings.local.json` (not versioned)
- `.env` files (with `.env` in `.gitignore`)

## Complete Example: `.mcp.json`

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

With environment variables:
```bash
export GOOGLE_CLIENT_SECRETS="/path/client_secret.json"
export GITHUB_TOKEN="ghp_xxxxxxxx"
export DATABASE_URL="postgresql://..."
```

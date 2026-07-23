# MCP Server - Cooper (DiDi Documentation Platform)

MCP Server for integration with DiDi's documentation platform [Cooper](https://cooper.didichuxing.com).

## 🚀 Quick Installation

### 1. Install dependencies

```bash
cd mcp-servers/cooper
npm install
```

### 2. Configure authentication token

1. Access: https://mcphub.intra.xiaojukeji.com/square
2. Click **"申请令牌"** (Request Token)
3. Select **OLD (Legacy)** version
4. Copy token in format: `fcfc9605-1d50-486f-aa72-80fca2315984`
5. Configure `.env` file:

```bash
# Copy example file
cp .env.example .env

# Edit .env file and add your token
COOPER_TOKEN=your-token-here
```

Or edit `.env` file directly:
```bash
# mcp-servers/cooper/.env
COOPER_TOKEN=your-token-here
COOPER_API_URL=http://10.88.128.45/cooper_mcp/mcp
```

> ⚠️ **Important:** Use **LEGACY** API version. New version requires LCA (滴滴安全助手) installed.
> 🔒 **Security:** `.env` file is in `.gitignore` and will never be committed!

### 3. Validate configuration

```bash
npm run setup
```

This command checks if all configurations are correct.

### 4. Check configuration in `.mcp.json`

Server should already be configured in root `.mcp.json`:

```json
{
  "mcpServers": {
    "cooper": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-servers\\cooper\\src\\index.js"]
    }
  }
}
```

### 4. Activate server

In `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["cooper", "dchat"]
}
```

---

## 📁 Project Structure

```
mcp-servers/cooper/
├── src/                           # MCP Server source code
│   ├── index.js                  # Entry point - defines MCP tools
│   ├── auth/
│   │   └── browser-auth.js       # Browser authentication (Playwright)
│   └── api/
│       └── cooper-client.js      # Cooper API Client
│
├── scripts/                       # Utility scripts (standalone)
│   ├── config.js                 # 🏭 Central configuration (loads .env)
│   ├── setup.js                  # ✅ Validates setup
│   ├── create-doc-api.js         # 📝 Create document
│   └── search-groceries.js       # 🔍 Search documents
│
├── .env.example                   # 📝 Configuration template (goes to Git)
├── .env                           # 🔐 YOUR CREDENTIALS (never commit!)
├── config.js                      # 🏭 Configuration loader
├── examples/
│   └── usage-examples.md         # API usage examples
│
├── package.json
└── README.md                      # This file
```

### 🔒 Security - Sensitive Files

| File | Purpose | In Git? |
|---------|-----------|---------|
| `.env` | YOUR credentials | ❌ NEVER |
| `.env.example` | Template without values | ✅ Yes |
| `config.js` | Loads configurations | ✅ Yes |
| `scripts/*.js` | Parameterized scripts | ✅ Yes |

---

## ⚙️ Centralized Configuration

All scripts use **config.js** central that loads variables from `.env`:

```javascript
// scripts/any-script.js
import { CONFIG, validateConfig } from '../config.js';

// CONFIG.TOKEN comes from .env automatically!
const response = await fetch(CONFIG.API_URL, {
  headers: { 'Authorization': `Bearer ${CONFIG.TOKEN}` }
});
```

### Supported Environment Variables

| Variable | Description | Default |
|----------|-----------|--------|
| `COOPER_TOKEN` | Authentication token (required) | - |
| `COOPER_API_URL` | API URL | `http://10.88.128.45/cooper_mcp/mcp` |
| `COOPER_API_VERSION` | API version | `legacy` |
| `COOPER_TIMEOUT` | Timeout in ms | `30000` |

---

## 🛠️ Available MCP Tools

| Tool | Description | Parameters |
|------------|-----------|------------|
| `cooper_search` | Search documents by keyword | `query` (string), `limit` (number, optional) |
| `cooper_get_document` | Get document content | `docId` (string - ID or URL) |
| `cooper_list_spaces` | List available spaces/workspaces | - |
| `cooper_create_document` | Create new document | `title` (string), `content` (string), `spaceId` (optional) |

---

## 💬 Usage in Claude Code

### Search documents
```
"Search Cooper for new employee onboarding"
"Find documents about API gateway in Cooper"
```

### Read specific document
```
"Read Cooper document 2207291123516"
"Get content from doc: https://cooper.didichuxing.com/docs2/document/2207291123516"
```

### Create document
```
"Create a Cooper document called 'Daily Meeting' with agenda: ..."
"Save this to Cooper Engineering space: [content]"
```

### List spaces
```
"What spaces do I have in Cooper?"
"List my Cooper workspaces"
```

---

## 🔧 Usage via Scripts (Standalone)

If you prefer to use without Claude Code:

```bash
# Search documents
cd mcp-servers/cooper
node scripts/search.js

# Read specific document
node scripts/read.js

# Create document
node scripts/create.js
```

> Note: Scripts use REST API directly, not MCP protocol.

---

## 🔗 Integration with Skills

This MCP is complemented by the following skills in `.claude/skills/`:

| Skill | Description | When to Use |
|-------|-----------|-------------|
| `cooper` | General Cooper skill | Broad context about DiDi documentation |
| `cooper-search` | Specialized search | When focus is finding documents |
| `cooper-read` | Specialized reading | When focus is extracting content |
| `cooper-write` | Specialized creation | When focus is creating documents |

---

## 📝 Tips

- **Document IDs** can be extracted from URLs:
  - URL: `https://cooper.didichuxing.com/docs2/document/2207291123516`
  - ID: `2207291123516`

- **Token** doesn't expire (legacy version)

- **Default space**: Use `spaceId: "0"` for personal space

- **Encoding**: Avoid accents in content to prevent encoding errors

---

## 🔗 Useful Links

| Resource | URL |
|---------|-----|
| Cooper | https://cooper.didichuxing.com |
| MCPHub (Tokens) | https://mcphub.intra.xiaojukeji.com/square |
| SkillsHub | https://skillshub.intra.xiaojukeji.com |

---

**Version:** 1.0.0  
**License:** MIT

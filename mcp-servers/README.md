# MCP Servers - Governance

This directory contains **custom MCP servers** developed internally for the DCC project.

---

## 📊 MCP Inventory

### 🏢 Custom (code in `mcp-servers/`)

Customized servers with specific business logic for internal integrations.

| Server | Description | Tools | Status |
|--------|-------------|-------|--------|
| **cooper** | DiDi Documentation (Cooper) | `cooper_get_document`, `cooper_search`, `cooper_list_spaces`, `cooper_create_document` | ✅ Active |
| **dchat** | DiDi Messaging via `dws` CLI | `send_message`, `search_messages`, `create_todo`, `manage_todo`, `generate_report` | ✅ Active |
| **gattaran** | Order Management Viewer | `gattaran_navigate_to_order`, `gattaran_extract_order_details`, `gattaran_search_order` | ✅ Active |

### 🌐 Official (via npx, configured in `.mcp.json` only)

Official/community MCP servers installed via package manager.

| Server | Description | Source | Status |
|--------|-------------|--------|--------|
| **google-workspace** | Gmail, Calendar, Drive | `@modelcontextprotocol/server-google-workspace` | ✅ Active |
| **github** | Issues, PRs, repositories | `@modelcontextprotocol/server-github` | ⚙️ Configurable |
| **postgres** | PostgreSQL queries | `@modelcontextprotocol/server-postgres` | ⚙️ Configurable |
| **slack** | Slack messages, channels | `@modelcontextprotocol/server-slack` | ⚙️ Configurable |

⚠️ **Note:** Always verify if an official MCP is actively maintained before adding to the project.

---

## 📁 Structure

```
mcp-servers/
├── README.md              # This file - governance and patterns
├── cooper/                # MCP for Cooper (DiDi Documentation)
│   ├── README.md
│   ├── src/
│   └── package.json
├── dchat/                 # MCP for D-Chat (DiDi messaging)
│   ├── README.md
│   ├── index.js
│   └── package.json
└── gattaran/              # MCP for Order Management
    ├── README.md
    ├── src/
    └── package.json
```

---

## 🏛️ Governance Rules

### What goes here ✅

- **Custom MCP servers** (own code):
  - Internal integrations (e.g., D-Chat via `dws` CLI)
  - Corporate platform integrations (e.g., Cooper)
  - Business-specific logic servers
  - Wrappers for non-standard internal APIs

### What does NOT go here ❌

- **Official/community MCPs** (installed via `npx`):
  - Only referenced in root `.mcp.json`
  - ⚠️ **Check status before using** - some official MCPs are deprecated

⚠️ **Deprecated MCPs Found:**
| MCP | Status | Recommended Alternative |
|-----|--------|------------------------|
| `@modelcontextprotocol/server-puppeteer` | ❌ Deprecated (2025.5.12) | Use Playwright directly or create custom MCP |

> **Lesson learned:** Always verify if the MCP is actively maintained before adding to the project.

---

## 🚀 How to Use

### 1. Configuration in `.mcp.json`

Servers are already configured in the root `.mcp.json`:

```json
{
  "mcpServers": {
    "cooper": {
      "command": "node",
      "args": ["C:\\Users\\...\\mcp-servers\\cooper\\src\\index.js"]
    },
    "dchat": {
      "command": "node",
      "args": ["C:\\Users\\...\\mcp-servers\\dchat\\index.js"],
      "env": {
        "DWS_SCRIPT_PATH": "..."
      }
    },
    "gattaran": {
      "command": "node",
      "args": ["C:\\Users\\...\\mcp-servers\\gattaran\\src\\index.js"]
    }
  }
}
```

### 2. Activation in `.claude/settings.local.json`

```json
{
  "enabledMcpjsonServers": ["cooper", "dchat", "gattaran", "google-workspace"]
}
```

### 3. Install Dependencies

```bash
# Cooper
cd mcp-servers/cooper
npm install

# D-Chat
cd mcp-servers/dchat
npm install

# Gattaran
cd mcp-servers/gattaran
npm install
```

---

## 🛠️ Creating a New Custom Server

1. **Create the directory**:
   ```bash
   mkdir mcp-servers/my-server
   cd mcp-servers/my-server
   npm init -y
   ```

2. **Minimum structure**:
   ```
   my-server/
   ├── README.md       # Required documentation
   ├── src/
   │   └── index.js    # Entry point
   ├── package.json
   └── examples/       # Usage examples
   ```

3. **Document in README.md**:
   - Server purpose
   - Prerequisites
   - Available tools
   - Usage examples

4. **Add to `.mcp.json`**:
   ```json
   {
     "mcpServers": {
       "my-server": {
         "command": "node",
         "args": ["C:\\Users\\...\\mcp-servers\\my-server\\src\\index.js"]
       }
     }
   }
   ```

5. **Associated skills** (optional):
   - If the MCP needs Claude skills, create in `.claude/skills/[name]/`
   - Document the relationship in the MCP's README

---

## 🔒 Security

- **Never commit** credentials or tokens
- Use environment variables in `.claude/settings.local.json`
- Document required permissions in the server's README

---

## 📚 References

- [MCP Official Servers](https://github.com/modelcontextprotocol/servers)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [MCP Setup Guide](../docs/guides/mcp-setup.md)
- [Cooper Documentation](./cooper/README.md)
- [DChat Documentation](./dchat/README.md)
- [Gattaran Documentation](./gattaran/README.md)

---

**Last updated:** 2026-07-23

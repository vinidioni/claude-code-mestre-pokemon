# Gattaran MCP Server

MCP Server for automation of navigation and data extraction from Gattaran (DiDi's Order Management System).

## 📁 Organized Structure

```
gattaran/
├── src/                       # Main source code
│   ├── index.js              # Main MCP Server
│   ├── api-client-v4.js      # Current API client (use this)
│   ├── cli.js                # Command line interface
│   └── browser/              # Browser automation (legacy)
├── scripts/                   # Utility scripts
│   ├── courier-control.js    # Extract courier Control Information
│   ├── buscar-order-manual.js # Manual order search
│   └── run-search.js         # Quick search
├── docs/                      # Documentation
│   ├── API.md                # Complete API reference
│   ├── CAPTURA_API.md        # How to capture API calls
│   ├── DEVTOOLS.md           # DevTools usage guide
│   └── PLANO_AUTOMACAO.md    # Complete automation plan
├── output/                    # Execution results (gitignore)
├── sessions/                  # Saved sessions (gitignore)
├── archive/                   # Historical files
│   ├── versions/             # Old code versions
│   ├── screenshots/          # Debug screenshots (gitignore)
│   └── scripts/              # Old test scripts
├── package.json
├── .gitignore
└── README.md                  # This file
```

## 🚀 Features

- ✅ **Order search** by ID and city
- ✅ **Complete details extraction** from order
- ✅ **Courier information** (Control Information)
- ✅ **Persistent session** (login once, reuse)
- ✅ **Batch processing** - Multiple orders with ONE authentication
- ✅ **Skill** integrated with Claude Code
- ✅ **MCP Server** for automation

## 🎯 Single Session for Multiple Orders

```bash
# 5 orders with ONLY 1 authentication
node scripts/batch-orders.js order1,order2,order3,order4,order5

# Or via file
node scripts/batch-orders.js --file=orders.json
```

Session is automatically saved in `sessions/` and reused in future executions.

## 📖 Documentation

| Document | Description |
|-----------|-----------|
| [docs/API.md](docs/API.md) | Complete API reference |
| [docs/CAPTURA_API.md](docs/CAPTURA_API.md) | How to capture API calls |
| [docs/DEVTOOLS.md](docs/DEVTOOLS.md) | DevTools usage guide |
| [docs/PLANO_AUTOMACAO.md](docs/PLANO_AUTOMACAO.md) | Complete automation plan |

## 🛠️ Usage

### As MCP Server

The MCP server is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "gattaran": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-servers\\gattaran\\src\\index.js"]
    }
  }
}
```

### Utility Scripts

```bash
# Search ONE order
node scripts/run-search.js

# Search MULTIPLE orders (single session!)
node scripts/batch-orders.js order1,order2,order3

# Extract courier Control Information
node scripts/courier-control.js

# Interactive manual search
node scripts/buscar-order-manual.js
```

### As Claude Skill

Automatically activated with:
- "search order in gattaran"
- "analyze cancellation"
- "view courier control information"

Or execute:
```bash
/skill run gattaran-viewer
```

### As Library

```javascript
import { createClient } from './src/api-client-v4.js';

const client = await createClient({ headless: true });

// Search order
const order = await client.searchOrder('5764678698494132425', 'São Paulo', true);

// Extract courier data
const courierInfo = await extractControlInfo(client.page);

await client.close();
```

## 🔧 Development

### Code Structure

- **`src/api-client-v4.js`**: Main current client - use this file
- **`src/index.js`**: MCP Server for Claude Code integration
- **`src/cli.js`**: Command line interface

### Versioning

Previous api-client versions are in `archive/versions/`:
- `api-client-v1.js` - Initial version
- `api-client-v2.js` - Added details support
- `api-client-v3.js` - Extraction improvements
- `api-client-v4.js` - **Current version** (consolidated)

## 🔒 Security

- Sessions saved in `sessions/` (do not commit)
- Output files in `output/` (do not commit)
- Screenshots in `archive/screenshots/` (do not commit)

## 📝 Conventions

### Commits
```
[gattaran] Short description

Details if necessary

Co-Authored-By: Claude <noreply@anthropic.com>
```

### File Naming
- Scripts: `kebab-case.js`
- Results: `type-description-timestamp.json`
- Screenshots: `context-timestamp.png`

## 🐛 Troubleshooting

### Timeout error
Increase wait time in `api-client-v4.js`:
```javascript
await page.waitForTimeout(10000); // Increase to 10s or more
```

### Session expired
Delete `sessions/.gattaran-session.json` and login again.

### Element not found
Check if selector is updated. Use recordings in `~/Documents/` as reference.

## 📊 Usage Examples

### Case 1: Search canceled order
```bash
node scripts/run-search.js
# Fill: ORDER_ID=5764678698494132425, CITY=São Paulo
```

### Case 2: Investigate courier
```bash
node scripts/courier-control.js
# Extracts courier Control Information
```

## 🗺️ Roadmap

- [ ] Direct API mode (no browser)
- [ ] Session cache with automatic refresh
- [ ] Support for multiple cities
- [ ] CSV/Excel export
- [ ] Parallel batch processing

## 📞 Support

For questions or issues:
1. Check documentation in `docs/`
2. Consult examples in `scripts/`
3. See recordings in `~/Documents/recording*`

---

**Status**: ✅ In production | **Last updated**: 2026-07-21

# 🚀 DCC Environment Setup

Complete guide to set up the DCC environment from scratch on a new machine.

---

## 📋 Prerequisites

### 1. Base Software

| Tool | Version | Download | Required |
|------|---------|----------|----------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) | ✅ |
| **Python** | 3.10+ | [python.org](https://python.org) | ✅ |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) | ✅ |
| **Claude Code** | latest | `npm install -g @anthropic-ai/claude-code` | ✅ |

### 2. Accounts and Access

You will need to create accounts/obtain credentials for:

- [ ] **GitHub** - Personal access token (for MCP GitHub)
- [ ] **Google Cloud** - For Google Workspace integration (optional)
- [ ] **SmartWork/D-Chat** - Corporate access (optional)

---

## 🔧 Step-by-Step Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/vinidioni/claude-code-mestre-pokemon.git dcc
cd dcc
```

### Step 2: Run the Setup Script

```bash
# Windows (PowerShell as Administrator)
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

# macOS/Linux
bash scripts/setup.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Install Node.js dependencies
- ✅ Create configuration files from templates
- ✅ Set up necessary permissions

### Step 3: Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# GitHub Token (required for MCP GitHub)
GITHUB_TOKEN=ghp_your_token_here

# Google Workspace (optional)
GOOGLE_CLIENT_SECRETS_PATH=/path/to/client_secret.json

# D-Chat / SmartWork (optional)
DWS_SCRIPT_PATH=/path/to/dws-windows.ps1
```

**How to obtain each token:**

<details>
<summary><b>GitHub Token</b></summary>

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:user`, `read:org`
4. Copy the generated token to `.env`

</details>

<details>
<summary><b>Google Workspace (optional)</b></summary>

1. Go to: https://console.cloud.google.com
2. Create a project or select an existing one
3. Enable APIs: Gmail, Calendar, Drive
4. Create OAuth 2.0 credentials
5. Download the `client_secret.json`

</details>

<details>
<summary><b>D-Chat / SmartWork (optional)</b></summary>

Requires corporate access. Contact your IT administrator for:
- SmartWork CLI installation
- D-Chat access
- `dws-windows.ps1` script

</details>

### Step 4: Configure MCP

The setup script already created `.mcp.json`. Check if the paths are correct:

```bash
# Check if the file was created
cat .mcp.json
```

If necessary, adjust the paths for your operating system.

### Step 5: Test the Installation

```bash
# Check if Claude Code is working
claude --version

# Test MCP status
claude mcp status

# Run a test workflow
claude workflow run example
```

---

## 📁 Configuration Structure

After setup, you will have:

```
dcc/
├── .env                          # Your credentials (do not commit!)
├── .mcp.json                     # Generated MCP configuration
├── .claude/
│   ├── settings.json             # Claude Code settings
│   └── settings.local.json       # Local settings (do not commit)
└── ...
```

---

## 🛠️ Manual Installation (Alternative)

If the automatic script fails, follow these steps:

### 1. Install Node.js Dependencies

```bash
# MCP Servers
cd mcp-servers/dchat
npm install
cd ../..
```

### 2. Configure MCP

```bash
# Copy the template
cp .mcp.json.example .mcp.json

# Edit with your paths
# Windows: use \ or /
# macOS/Linux: use /
```

### 3. Configure Claude Code

```bash
# Copy settings
cp .claude/settings.json.example .claude/settings.json
```

---

## ✅ Post-Setup Verification

Run the verification checklist:

```bash
node scripts/verify-setup.js
```

This will verify:
- ✅ Node.js installed
- ✅ Python installed
- ✅ Claude Code installed
- ✅ Environment variables configured
- ✅ MCPs working
- ✅ Skills loaded

---

## 🐛 Troubleshooting

### Issue: "command not found: claude"

**Solution:**
```bash
# Add to PATH
export PATH="$PATH:$(npm bin -g)"

# Or reinstall globally
npm install -g @anthropic-ai/claude-code
```

### Issue: MCP not connecting

**Solution:**
```bash
# Check if environment variables are loaded
source .env

# Test manually
claude mcp status
```

### Issue: Windows vs macOS/Linux paths

**Solution:**
In `.mcp.json`, always use `/` instead of `\\`:

```json
// ✅ Correct (works on all OS)
"args": ["C:/Users/name/Desktop/dcc/mcp-servers/dchat/index.js"]

// ❌ Avoid (only works on Windows)
"args": ["C:\\Users\\name\\Desktop\\dcc\\mcp-servers\\dchat\\index.js"]
```

---

## 📝 Next Steps

After complete technical setup, follow the **recommended reading order**:

1. **[README.md](README.md)** - Overview, architecture, and how to use each component
2. **[CLAUDE.md](CLAUDE.md)** - Complete reference documentation

**Initial practical tests:**
```bash
# Explore Skills
/skill list

# Test a workflow
/workflow

# Create your first Dev Doc
/dev-docs init my-task

# Check MCPs
claude mcp status

# Check for updates
python scripts/check-updates.py
```

---

## 🔄 Updating DCC

Over time, DCC receives updates on GitHub (new workflows, skills, fixes). To update your local installation **without losing your configurations**:

```bash
python scripts/check-updates.py
```

What the script does:
1. Checks for new commits on GitHub
2. Shows what changed (changelog)
3. Automatically backs up:
   - `.env` (your credentials)
   - `.mcp.json` (your MCP configurations)
   - `.claude/settings.local.json` (your preferences)
4. Updates the repository (if you approve)
5. Restores your local configurations
6. Installs new dependencies (if any)

**Backups are kept** in `.backup/update_YYYYMMDD_HHMMSS/` (last 5).

---

## 🤝 Support

In case of problems:

1. Check logs: `claude logs`
2. Consult documentation in `docs/`
3. Open an issue on GitHub

---

**Ready to use!** 🚀

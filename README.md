# DCC - Development Center Repository

> Extension of workflows, skills, and automations for DCC (Claude Code Infrastructure).

**What it is:**
- **DCC** = Base repository with structure, conventions, and documentation
- **This repo** = Toolkit (workflows, skills, scripts) built on top

**Author:** Vinicius Castanho (viniciuscastanho@didiglobal.com)

---

## 🚀 Quick Start (3 Simple Steps)

> **⚠️ Important Recommendation:** This toolkit is designed and tested for **VS Code**. For the best experience, install the Claude Code extension in VS Code and use it there.

### Step 1: Download
1. Click the green **"<> Code"** button on GitHub
2. Select **"Download ZIP"**
3. Save the file to your computer

### Step 2: Prepare
1. **Extract** the ZIP file
2. **Rename** the folder to `dcc`
3. **Move** the `dcc` folder to your **Desktop**

### Step 3: Install (Via VS Code - Recommended)
1. Open **VS Code**
2. Install the **Claude Code** extension (if not already installed)
3. Open the `dcc` folder from Desktop in VS Code
4. Open Claude Code (Ctrl+Shift+P → "Claude Code: Open")
5. Run: `python scripts/install/dccrazy-install.py`
6. Follow the interactive instructions

**Alternative:** Also works via terminal with `claude` directly, but VS Code offers full integration.

✅ **Done!** The toolkit will be installed automatically.

---

## 🎯 Table of Contents

1. [What is DCC](#-what-is-dcc)
2. [Getting Started (Detailed Setup)](#-getting-started-setup-from-scratch)
3. [What You Can Do](#-what-you-can-do)
4. [Commands and Conventions](#-essential-commands)
5. [Documentation](#-documentation)

---

## 🎓 What is DCC

This is a **toolkit** that extends Claude Code capabilities with:

- **Workflows** → Ready automations (code review, reports, etc.)
- **Skills** → Specialized knowledge that activates automatically
- **Dev Docs** → System to not lose context between sessions
- **Encyclopedia** → Automatic mapping of database tables
- **Integrations** → Connectors for GitHub, DiDi Docs, D-Chat, etc.

---

## 🔗 Received the Repository Link?

If someone sent you this repository link on GitHub, here's how to access it:

### Option 1: I Want My Own Copy (Recommended)

This gives you access to all workflows, skills, and tools:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/dcc-claude-infrastructure.git dcc
cd dcc

# 2. Run automatic setup
# Windows:
.\scripts\setup\setup.ps1
# macOS/Linux:
bash scripts/setup/setup.sh

# 3. Configure your credentials (see "Where to Get Credentials" section)
cp .env.example .env
# Edit .env with your tokens

# 4. Verify installation
node scripts/setup/verify-setup.js

# 5. Done!
claude
```

**You will have:**
- ✅ All workflows
- ✅ Auto-activating skills
- ✅ Dev Docs system
- ✅ Table encyclopedia
- ✅ Backup and update scripts

---

### Option 2: Just Want to View/Consult Content

If you just want to see queries, documentation, or reports:

1. **Access GitHub directly:** https://github.com/your-org/dcc-claude-infrastructure
2. **Navigate folders:**
   - `sql-library/queries/` → Ready SQL queries
   - `docs/` → Documentation and guides
   - `reports/` → Generated reports
   - `.claude/workflows/agents/` → Available workflows

3. **To use:** You can copy specific files manually, but won't have the complete working system.

---

### ⚠️ Important About Access

**Is the repository public?**
- If yes: anyone with the link can clone and use
- If no: the person needs you to add them as a collaborator on GitHub

**To add someone as collaborator:**
1. Go to Settings → Manage access (on GitHub)
2. Click "Invite a collaborator"
3. Add the person's email/username

---

## 📁 Why Local Folder?

This toolkit is designed to work in a **local folder** (not Google Drive) because:

| Advantage | Explanation |
|-----------|-------------|
| **Git Versioned** | Complete change history, branches, rollback |
| **Script Execution** | Python scripts work natively |
| **Speed** | No network latency for small files |
| **Claude Code** | Native CLI integration |
| **MCPs** | Local servers (D-Chat, Cooper) work better |

**Backup to Drive:** Optional function to sync with Google Drive when desired (see "Backup to Google Drive" section).

---

## 🚀 Getting Started (Setup from Scratch)

### 1. Clone and Enter Directory

```bash
git clone https://github.com/your-org/dcc-claude-infrastructure.git dcc
cd dcc
```

### 2. Run Automatic Setup

**Windows (PowerShell as Admin):**
```powershell
.\scripts\setup\setup.ps1
```

**macOS/Linux:**
```bash
bash scripts/setup/setup.sh
```

### 3. Configure Your Credentials

```bash
# Copy example file
cp .env.example .env

# Edit with your credentials
```

### 4. Verify Installation

```bash
node scripts/setup/verify-setup.js
```

### 5. Start Using

```bash
claude
```

---

## 📋 Requirements

| Tool | Version | Required |
|------------|--------|-------------|
| [Node.js](https://nodejs.org) | 18+ | ✅ |
| [Python](https://python.org) | 3.10+ | ✅ |
| [Git](https://git-scm.com) | 2.40+ | ✅ |
| [Claude Code](https://claude.ai/code) | latest | ✅ |

See [SETUP.md](SETUP.md) for detailed installation instructions.

---

## 🔑 Where to Get Credentials

**⚠️ Important:** All MCPs (integrations) require you to configure your own access token. DCC does not include pre-configured credentials.

| Service | Where to Obtain | Notes |
|---------|------------|-------|
| **GitHub** | https://github.com/settings/tokens | Classic token, scopes: `repo`, `read:user`, `read:org` |
| **Google Workspace** | https://console.cloud.google.com | Create project → Enable APIs (Gmail, Calendar, Drive) → Create OAuth 2.0 credentials → Download `client_secret.json` |
| **Cooper (DiDi Docs)** | https://mcphub.intra.xiaojukeji.com/ | Click **访问令牌** (access token). ⚠️ **Tip:** If you create the token and the key doesn't appear, disable page translator - the error only appears in the original language |
| **D-Chat** | https://mcphub.intra.xiaojukeji.com/ | Same process as Cooper. Requires SmartWork CLI installed |
| **Gattaran** | https://mcphub.intra.xiaojukeji.com/ | Same process as Cooper |

After obtaining tokens, configure them in `.env` and `.mcp.json`.

---

## 🏗️ DCC Architecture

DCC is organized in **5 layers** that work together:

```
┌─────────────────────────────────────────────────────────┐
│  1. Interface Layer                                      │
│     - Slash Commands (/dev-docs, /skill, /workflow)     │
├─────────────────────────────────────────────────────────┤
│  2. Automation Layer                                     │
│     - Workflows (YAML) - Complete processes             │
│     - Subagents (MD) - Adaptive reasoning               │
├─────────────────────────────────────────────────────────┤
│  3. Knowledge Layer                                      │
│     - Skills (Progressive Disclosure)                   │
│     - Dev Docs (Continuity between sessions)            │
├─────────────────────────────────────────────────────────┤
│  4. Security Layer                                       │
│     - PreToolUse Hook (Contextual suggestions)          │
│     - Security Hook (Injection detection)               │
├─────────────────────────────────────────────────────────┤
│  5. Integration Layer                                    │
│     - MCP Servers (GitHub, Google, Cooper, etc.)        │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 What You Can Do

Ask Claude in DCC using natural language:

### Integrate with External Services
**You say:** *"How do I integrate with GitHub?"* or *"Configure MCP for Slack"*

**DCC does:** Explains how to configure `.mcp.json` and which tokens are needed

**Available MCPs:**
| Server | Function | Status |
|----------|--------|--------|
| **Cooper** | DiDi Documentation (DiDi Docs) | ✅ Requires mcphub token |
| **D-Chat** | Internal DiDi messages | ✅ Requires mcphub token + SmartWork CLI |
| **Gattaran** | Order Management Viewer | ✅ Requires mcphub token |
| **Google Workspace** | Gmail, Calendar, Drive | ⚙️ Requires OAuth configuration |
| **GitHub** | Issues, PRs, repositories | ⚙️ Requires GitHub token |

---

### Create Organized Queries
**You say:** *"Create a query for [description]"*

**DCC does:**
1. Creates query with mandatory header
2. **Asks:** "Does this query access Data-E?" → Saves in `presto/` or `data-e/`
3. Updates directory index
4. Detects new tables → Updates **Encyclopedia**

**Documentation:** [docs/sql/query-template.md](docs/sql/query-template.md)

---

### Consult Table Encyclopedia
**You say:** *"What tables have I used?"* or *"Show me table X structure"*

**DCC does:** Queries `sql-library/encyclopedia/tables.json` and shows:
- Tables you have consulted
- Descriptions you added
- Documented columns

**How it works:**
- Every query is automatically analyzed
- New tables are added to the encyclopedia
- You can add descriptions manually later

---

### Teach DCC Your Patterns
**You say:** *"Whenever I [do X], suggest [Y]"*

**DCC does:**
1. Records the pattern in `.claude/memory/feedback-system.md`
2. Applies learning in future interactions

**Example:**
```
You: "Always use CTE instead of subquery in my queries"
DCC: "I'll remember that. Can I suggest CTEs next time?"
You: "Yes"
[DCC saves the feedback]

[Next query]
DCC: "Want me to use CTE for this query?"
```

---

### Automate a Task You Always Do
**You say:** *"Create a workflow for [describe task]"*

**DCC does:** Creates a custom YAML workflow in `.claude/workflows/agents/`

**Available workflows:**
| Workflow | When to Use |
|----------|-------------|
| `code-review` | Automatically review code (bugs, security, performance) |
| `doc-generator` | Generate project documentation |
| `report-generator` | Create structured reports |

---

### Have Claude Specialized in Certain Contexts
**You say:** *"Create a skill for [subject]"* or simply mention the subject

**DCC does:** Creates a skill that activates automatically when you talk about that topic

**How it works:**
```
You say: "create a React component"
          ↓
Skill "react-patterns" detects the word "React"
          ↓
Claude responds following defined React patterns
```

**Available skills:**
| Skill | Activates When You Mention... |
|-------|-------------------------------|
| `conventional-commits` | "commit", "conventional commits" |
| `react-patterns` | "react", "component", "tsx" |
| `api-design` | "api", "endpoint", "rest" |
| `cooper` | "cooper", "didi document", "docs2" |
| `engineering-skills` | "data engineering", "architecture", "backend", "devops" |

---

### Don't Lose Context Between Work Sessions
**You say:** *"Start a Dev Doc for [task name]"*

**DCC does:** Creates a tracking structure in `incubator/in-progress/[name]/`

**Why use Dev Docs?**

**Real problem:** You work on a complex task today, stop in the middle, and tomorrow don't remember:
- Where you stopped
- Which files you were editing
- What architectural decision you made

**Solution - Generated files:**
| File | Utility |
|---------|-----------|
| `plan.md` | **Decisions and strategy** - Documents the "why" of choices. Useful when you return days later and don't remember the logic |
| `context.md` | **Session history** - Records what was done each day, which files were touched. Useful to know exactly "where I left off" |
| `tasks-checklist.md` | **Pending tasks** - Lists what remains to do with checkboxes. Useful to not forget any step |

**How to use:**
```bash
# Start task
/dev-docs init implement-authentication

# View active tasks
/dev-docs status

# Continue later
/dev-docs continue implement-authentication

# Mark as complete
/dev-docs archive implement-authentication
```

---

### Check for Updates
**You say:** *"Are there updates?"* or *"Check for updates"*

**DCC does:** Runs `scripts/maintenance/check-updates.py` which:
1. Checks for new commits on GitHub
2. Shows what changed
3. Backs up your configurations (.env, .mcp.json)
4. Updates if you approve
5. Restores your local configurations

---

### Other Features

| I want to... | Tell DCC... |
|----------|----------------|
| **Review code** | "Execute code review" or "review my code" |
| **Generate report** | "Create a [type] report" |
| **List available skills** | `/skill list` |
| **Execute specific skill** | `/skill run conventional-commits` |
| **Change response style** | "Use direct and organized style" |
| **View active integrations** | `claude mcp status` |

---

## 🛠️ Essential Commands

### Slash Commands

| Command | What It Does | Example |
|---------|-----------|---------|
| `/skill` | Lists or executes skills | `/skill list`, `/skill run conventional-commits` |
| `/workflow` | Lists or executes workflows | `/workflow`, `/workflow code-review` |
| `/dev-docs` | Manages development documentation | `/dev-docs init my-feature` |

### Claude Code Commands

```bash
/help              # Shows all available commands
/clear             # Clears conversation context
/cost              # Shows current session cost
/tokens            # Shows token usage
```

---

## 📝 Project Conventions

### Queries

Every query must follow strict organization rules:

- **Location:** Save in `sql-library/queries/presto/` (generic) or `sql-library/queries/data-e/` (Data-E)
- **Template:** Use mandatory header with description, author, tables
- **Index:** Always add to folder README.md

**Full documentation:** [docs/sql/query-template.md](docs/sql/query-template.md)

---

### Naming

| Element | Pattern | Example |
|----------|--------|---------|
| Files | `kebab-case` | `code-review.yaml` |
| Folders | `kebab-case` | `api-service/` |
| Agents | `kebab-case` | `code-review`, `doc-generator` |
| Reports | `{type}-report-YYYY-MM-DD.{ext}` | `weekly-report-2024-07-22.md` |

### Commits

```
[type] Short description

Detailed body if necessary.

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `[agent]` - New agent or update
- `[skill]` - New modular skill
- `[report]` - Generated report
- `[template]` - Added/updated template
- `[doc]` - Documentation
- `[chore]` - Maintenance
- `[fix]` - Agent fix

### Branches

```
main                    # Main branch
├── feature/[name]       # New features
├── agent/[name]         # New agents
├── fix/[name]          # Fixes
├── report/[period]    # Reports
└── docs/[subject]      # Documentation
```

---

## 🧪 First Steps After Installation

Test if everything works:

```bash
# 1. Check skills
/skill list

# 2. Test automatic activation
"how do I make a conventional commit?"

# 3. Execute workflow
/workflow

# 4. Create Dev Docs
/dev-docs init my-first-task

# 5. Check MCPs
claude mcp status

# 6. Check for updates
python scripts/maintenance/check-updates.py
```

---

## 📚 Documentation

### Main
- **[CLAUDE.md](CLAUDE.md)** - Complete reference documentation
- **[docs/guides/claude-code.md](docs/guides/claude-code.md)** - Detailed installation guide

### Toolkit Features
- **[docs/sql/query-template.md](docs/sql/query-template.md)** - Rules for creating queries
- **[sql-library/encyclopedia/README.md](sql-library/encyclopedia/README.md)** - Table documentation system
- **[docs/operations/feedback-system.md](docs/operations/feedback-system.md)** - Continuous learning

### Integrations
- **[docs/guides/mcp-setup.md](docs/guides/mcp-setup.md)** - How to add MCPs
- **[docs/guides/google-workspace.md](docs/guides/google-workspace.md)** - Google integration

### Specific Context
- **.claude/workflows/CLAUDE.md** - How to create workflows
- **.claude/skills/CLAUDE.md** - How to create skills
- **incubator/CLAUDE.md** - How to use Dev Docs

---

## ✅ Installation Verification

```bash
node scripts/setup/verify-setup.js
```

Checks:
- ✅ Node.js installed
- ✅ Python installed
- ✅ Claude Code installed
- ✅ Environment variables configured
- ✅ MCPs working
- ✅ Skills loaded

---

## 💾 Backup to Google Drive

To create a backup of your complete DCC in Google Drive:

```bash
python scripts/google/backup-to-drive.py
```

**What is synchronized:**
- All DCC content (exact copy)
- Preserved folder structure
- Personal configurations (.env, .mcp.json)
- Queries, reports, dev docs

**Requirements:**
- Google Workspace MCP configured
- `DCC_Backup` folder will be created in your Drive

**Notes:**
- Backup is **manual** (you run when you want)
- Always creates a new version (doesn't overwrite)
- Useful to access from other devices or recover after formatting

---

## 🔄 Updating

To update your toolkit with the latest changes from GitHub:

```bash
python scripts/maintenance/check-updates.py
```

The script will:
1. Check if updates are available
2. Show what changed
3. Backup your local configurations
4. Apply update (if you approve)
5. Restore your configurations

---

## 👤 Authorship

Created by **Vinicius Castanho** (viniciuscastanho@didiglobal.com) with Claude Code assistance.

For questions or suggestions, please contact.

---

## 💬 Feedback

Had any issues or have suggestions to improve the toolkit?

**Fill our form:** https://forms.gle/example

---

## 📄 License

MIT - Free to use and modify.

---

**DCC Claude Infrastructure v1.0.0** | [Validation: 24/24 ✅](scripts/setup/validate.js)

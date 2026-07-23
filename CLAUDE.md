# 🎯 DCC - Development Center Repository

> **Layered Documentation Architecture**: This CLAUDE.md is the entry point. For specific contexts, consult CLAUDE.md files in subfolders (e.g., `.claude/workflows/CLAUDE.md` for creating workflows). They load automatically when you navigate to those folders.

## Purpose

This is the central repository for development, automation, and report generation using Claude Code. Here we store:

- **Reusable Agents** - Workflows for automated tasks
- **Modular Skills** - Specialized capabilities loaded on demand
- **Reports** - Generated documentation and analyses
- **Templates** - Base projects and configurations
- **Knowledge** - Guides and best practices

## Repository Structure

```
dcc/
├── .claude/                    # Claude Code configurations
│   ├── workflows/              # Reusable workflows (see local CLAUDE.md)
│   │   ├── agents/             # Specialized agents
│   │   ├── reports/            # Report generators
│   │   └── tasks/              # Automated tasks
│   ├── skills/                 # Modular skills (see local CLAUDE.md)
│   ├── agents/                 # Specialized agents (subagents)
│   ├── output-styles/          # Custom output styles
│   └── memory/                 # Persistent memory (auto)
├── agents/                     # Agent documentation
│   ├── README.md               # Agent catalog
│   └── [agent-name]/           # Specific agent docs
├── sql-library/                # SQL library (queries and assets)
│   ├── encyclopedia/           # Data dictionary
│   ├── queries/                # Reusable SQL queries
│   │   ├── data-e/             # Productive Data-E queries
│   │   ├── data-e-test/        # Test queries
│   │   ├── presto/             # Scheduled queries
│   │   ├── draft/              # Draft/temporary queries
│   │   └── README.md           # Query catalog
│   └── repository/             # Cataloged reference queries
├── reports/                    # Generated reports (see local CLAUDE.md)
│   ├── weekly/                 # Weekly reports
│   └── monthly/                # Monthly reports
├── incubator/                  # Projects and ideas in development (see local CLAUDE.md)
│   ├── in-progress/            # Active projects
│   └── backlog/                # Draft ideas
├── templates/                  # Base project templates
│   ├── web-app/                # Web app template
│   ├── api-service/            # API template
│   └── python-script/          # Python script template
├── docs/                       # General documentation (see docs/README.md)
│   ├── guides/                 # Guides and tutorials
│   ├── conventions/            # Conventions and standards
│   ├── skills/                 # Skills documentation
│   ├── operations/             # Operational documentation
│   └── sql/                    # SQL documentation
├── mcp-servers/                # Custom MCP servers (see local README)
│   ├── cooper/                 # DiDi Documentation
│   ├── dchat/                  # DiDi Messaging
│   └── gattaran/               # Order Management
├── scripts/                    # Utility scripts (see local README)
│   ├── setup/                  # Installation and setup
│   ├── auth/                   # Authentication
│   ├── analysis/               # Data analysis
│   ├── dchat/                  # DChat
│   ├── google/                 # Google Workspace
│   ├── maintenance/            # Maintenance
│   ├── install/                # Installer
│   └── utils/                  # Utilities
├── temp-storage/               # Temporary files and backups
├── CLAUDE.md                   # This file (entry point)
└── README.md                   # Overview for visitors
```

## Context Navigation (Layered Documentation)

This structure uses **progressive disclosure**: the root CLAUDE.md always loads, but CLAUDE.md files in subfolders load automatically when you enter those contexts.

| Context | File | When It Loads |
|---------|------|---------------|
| **Root** (this file) | `CLAUDE.md` | Always - overview and index |
| **Workflows** | `.claude/workflows/CLAUDE.md` | When creating/modifying workflows |
| **Skills** | `.claude/skills/CLAUDE.md` | When developing modular skills |
| **Dev Docs** | `dev/CLAUDE.md` | When working on multi-session tasks |
| **Reports** | `reports/CLAUDE.md` | When generating/consulting reports |

**How it works:**
1. The root CLAUDE.md defines global architecture and universal conventions
2. CLAUDE.md files in subfolders inherit from root and add specific details
3. When you navigate to a subfolder, Claude combines both contexts
4. Use `@file` to reference CLAUDE.md from other contexts when needed

## Conventions

### Naming
- **Branches**: `feature/`, `fix/`, `report/`, `agent/`
- **Files**: `kebab-case.ext`
- **Folders**: `kebab-case`
- **Agents**: Descriptive name in camelCase
- **Skills**: Descriptive name in camelCase

### Commits
```
[type] Short description

Detailed body if necessary

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types:
- `[agent]` - New or updated agent
- `[skill]` - New modular skill
- `[report]` - Generated report
- `[template]` - Added/updated template
- `[doc]` - Documentation
- `[chore]` - Maintenance

## Available Components

### 🎭 Agents (Workflows)
Full catalog at [`agents/README.md`](./agents/README.md) | Details at [`.claude/workflows/CLAUDE.md`](./.claude/workflows/CLAUDE.md)

Categories:
- 🕵️ **Analysis** - Code review, security audit, performance
- 📝 **Documentation** - Doc generators, README, changelogs
- 🔧 **Refactoring** - Migrations, code modernization
- 📊 **Reports** - Metrics, analyses, dashboards
- 🧪 **Tests** - Test generation, coverage, QA

### 🛠️ Modular Skills
Documentation at [`.claude/skills/CLAUDE.md`](./.claude/skills/CLAUDE.md) | Rules at [`skill-rules.json`](./.claude/skills/skill-rules.json)

#### Local Skills (Originals)
| Skill | Description | Triggers |
|-------|-------------|----------|
| `example-doc` | Example skill template | "example", "template", "skill" |
| `conventional-commits` | Structured commit patterns | "commit", "conventional commits" |
| `react-patterns` | React patterns | "react", "component", "tsx" |
| `api-design` | API design | "api", "endpoint", "rest" |
| **`cooper`** | **Cooper Integration (DiDi Docs)** | "cooper", "didi document", "docs2" |
| `cooper-search` | Specialized Cooper search | "search cooper", "find document" |
| `cooper-read` | Read Cooper documents | "read cooper document", "cooper content" |
| `cooper-write` | Create Cooper documents | "create cooper document", "save to cooper" |

#### Marketplace Skills (alirezarezvani/claude-skills v2.9.0)
Installed on 2026-07-07:

| Skill | Category | Description | Triggers |
|-------|----------|-------------|----------|
| `engineering-skills` | Data Eng | 32 skills: data engineering, architecture, backend, frontend, DevOps, security, AI/ML | "data engineering", "architecture", "backend", "devops", "AI/ML" |
| `data-quality-auditor` | Data Analytics | Dataset audit: DQS scoring, missing values analysis (MCAR/MAR/MNAR) | "data quality", "missing values", "DQS" |
| `statistical-analyst` | Data Analytics | Hypothesis tests, A/B testing, sample size calculation, confidence intervals | "A/B test", "statistical significance", "p-value" |
| `finance-skills` | Business Analytics | Financial analyst (DCF, valuation), SaaS metrics (ARR, MRR, LTV, CAC), forecasting | "financial analysis", "SaaS metrics", "ARR", "LTV" |
| `business-growth-skills` | Business Analytics | Customer success, sales engineering, revenue operations, contracts | "customer success", "churn", "retention", "RFP" |
| `business-investment-advisor` | Business Analytics | ROI, IRR, NPV, payback, build vs buy, lease vs buy | "ROI", "NPV", "investment", "capex" |

**Progressive Disclosure:** Each skill has SKILL.md (essential), examples.md and advanced.md (loaded on demand via `@file`).

### 🤖 Specialized Subagents
Documentation at [`.claude/agents/README.md`](./.claude/agents/README.md)

| Subagent | Purpose | How to Invoke |
|----------|---------|---------------|
| `planner` | Generates Dev Docs structure (plan.md, context.md, tasks-checklist.md) | `claude workflow run planner --name="x" --description="..."` |

Subagents differ from workflows: they are structured prompts (not YAML) called by other agents for decomposing complex tasks.

## How to Use

### Run a Workflow
```bash
# Direct via Claude Code
claude "execute code-review agent"

# Via workflow command
claude workflow run code-review
```

### Use a Skill
```bash
# Skills activate automatically based on skill-rules.json
# Or invoke directly:
claude skill run example-doc
```

### Slash Commands

Custom commands registered in `.claude/commands.json`:

| Command | Description | Usage |
|---------|-------------|-------|
| `/dev-docs` | Manage development documentation | `/dev-docs init <name>` |
| `/skill` | Manage modular skills | `/skill list` or `/skill run <name>` |
| `/workflow` | Execute agent workflows | `/workflow <workflow-name>` |

**Examples:**
```bash
/dev-docs init implement-auth    # Creates dev docs structure
/dev-docs status                   # Lists active tasks
/dev-docs continue implement-auth # Loads context

/skill list                        # Lists available skills
/skill run conventional-commits    # Activates specific skill

/workflow code-review              # Executes workflow
```

To create new commands, see `.claude/commands/_template.md`.

### Create a New Workflow
1. Consult [`.claude/workflows/CLAUDE.md`](./.claude/workflows/CLAUDE.md) for the pattern
2. Use the `_template.yaml` template
3. Document in `agents/[name]/README.md`
4. Add to catalog in `agents/README.md`
5. Commit with tag `[agent]`

### Create a New Skill
1. Consult [`.claude/skills/CLAUDE.md`](./.claude/skills/CLAUDE.md)
2. Create folder in `.claude/skills/[skill-name]/`
3. Add rule in `skill-rules.json`
4. Commit with tag `[skill]`

### Start Task with Dev Docs

For complex tasks (multi-session, multi-person):

```bash
# Creates complete structure in incubator/in-progress/
/dev-docs init task-name

# Or via workflow:
claude workflow run planner --name="name" --description="..."
```

This creates:
- `plan.md` - Strategy and decisions
- `context.md` - Session tracking
- `tasks-checklist.md` - Executable tasks

See [`incubator/README.md`](./incubator/CLAUDE.md) for full workflow.

## Configured Integrations (MCP)

### Active Servers
| Server | Description | Status | Documentation |
|----------|-----------|--------|--------------|
| **Google Workspace** | Gmail, Calendar, Drive | ✅ Configured | [docs/google-workspace.md](./docs/guides/google-workspace.md) |
| **Cooper** | DiDi Documentation (DiDi Docs) | ✅ Configured | [mcp-servers/cooper/README.md](./mcp-servers/cooper/README.md) |
| **D-Chat** | Messages via CLI `dws` | ✅ Configured | [mcp-servers/dchat/README.md](./mcp-servers/dchat/README.md) |
| **Gattaran** | Order Management Viewer | 🟡 MVP implemented | [mcp-servers/gattaran/README.md](./mcp-servers/gattaran/README.md) |
| **GitHub** | Issues, PRs, repositories | ⚙️ Via npx | [docs/mcp-setup.md](./docs/guides/mcp-setup.md) |

### Add New Integrations
Edit `.mcp.json` following the pattern documented in the [MCP / Integrations](#mcp--integrations) section below.

Common examples: GitHub, PostgreSQL, Slack, Discord.

## Useful Commands

```bash
# List all available agents
ls .claude/workflows/agents/

# Execute specific workflow
claude workflow run .claude/workflows/agents/code-review.yaml

# Check MCP servers status
claude mcp status
```

## Infrastructure Roadmap

### Phase 1: Foundation ✅
- [x] Folder structure
- [x] Central CLAUDE.md with layered documentation
- [x] Base documentation

### Phase 2: Advanced Infrastructure ✅
- [x] **Layered CLAUDE.md** - Hierarchical context by subfolder
- [x] **Modular Skills** - `.claude/skills/` with progressive disclosure
- [x] **Automation Hooks** - PreToolUse and security
- [x] **Agents/Subagents** - Specialized in `.claude/agents/`
- [x] **Slash Commands** - Custom commands
- [x] **Dev Docs System** - Continuity between sessions

### Phase 3: Core Agents
- [x] Code Review Agent
- [x] Documentation Agent
- [x] Security Agent
- [ ] Reports Agent (advanced)

### Phase 4: Integrations
- [x] Google Workspace
- [ ] GitHub MCP
- [ ] Jira/Linear
- [ ] Automatic notifications

### Phase 5: Full Automation
- [ ] CI/CD with agents
- [ ] Automatic reports
- [ ] Predictive analysis

---

## Infrastructure Status

```
┌────────────────────────────────────────────────────────┐
│  DCC Claude Infrastructure v1.0.0                      │
├────────────────────────────────────────────────────────┤
│  Block 1: Layered CLAUDE.md              ✅           │
│  Block 2: Modular skills                    ✅           │
│  Block 3: Automation hooks             ✅           │
│  Block 4: Agents/Subagents              ✅           │
│  Block 5: Slash Commands                     ✅           │
│  Block 6: Dev Docs system             ✅           │
│  Block 7: Plugin/distribution               ✅           │
│  Block 8: MCP / integrations                 ✅           │
│  Block 9: Session logging                    ✅           │
│  Block 10: Output Style and Status Line   ✅           │
├────────────────────────────────────────────────────────┤
│  Complete infrastructure ready to use!               │
└────────────────────────────────────────────────────────┘
```

---

## MCP / Integrations

The `.mcp.json` file configures MCP (Model Context Protocol) servers that extend Claude Code capabilities.

### `.mcp.json` Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "server-command",
      "args": ["--flag", "value"],
      "env": {
        "VARIABLE": "value"
      }
    }
  }
}
```

### Example: Add GitHub MCP

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

**Note:** Use environment variables for tokens - never commit credentials.

### Common MCP Servers

| Server | Installation | Usage |
|----------|------------|-----|
| GitHub | `npx -y @modelcontextprotocol/server-github` | Issues, PRs, repositories |
| PostgreSQL | `npx -y @modelcontextprotocol/server-postgres` | Database queries |
| Slack | `npx -y @modelcontextprotocol/server-slack` | Messages, channels |
| Puppeteer | `npx -y @modelcontextprotocol/server-puppeteer` | Web automation |

**Full list:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

**Detailed guide:** See [`docs/mcp-setup.md`](./docs/guides/mcp-setup.md) for step-by-step instructions on adding GitHub, PostgreSQL, Slack and other MCPs.

### Local Configuration

For personal configurations (not shareable), use `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["google-workspace", "github"],
  "permissions": {
    "allow": ["Bash(git *)", "Bash(gh *)"]
  }
}
```

## Contribution

1. Create a branch: `git checkout -b feature/new-feature`
2. Make your changes
3. Test the agent/workflow
4. Commit with clear message
5. Open PR (if remote is configured)

## Output Styles

Custom output styles in `.claude/output-styles/`:

| Style | File | Usage |
|-------|------|-------|
| **Direct and Organized** | `direct-and-organized.md` | Concise responses, focus on results |

### How to Use

**Mention at the beginning of the session:**
```
Use the "Direct and Organized" style for this session.
```

**Or configure in `.claude/settings.json`:**
```json
{
  "outputStyle": "direct-and-organized"
}
```

### Create New Style

1. Create file in `.claude/output-styles/style-name.md`
2. Use frontmatter with `name` and `description`
3. Define clear communication rules
4. Test with Claude

See `.claude/output-styles/direct-and-organized.md` as template.

## Memories

Claude maintains memories in `.claude/memory/` about:
- Code style preferences
- Architectural decisions
- Past feedback

Consult `MEMORY.md` for the memory index.

---

## Distribution and Installation

### Install in New Repository

To use this infrastructure in another project:

```bash
# Clone the repository
git clone https://github.com/your-org/dcc-claude-infrastructure.git
cd dcc-claude-infrastructure

# Run the installer
node scripts/install.js /path/to/your/project

# Or install in current directory
node scripts/install.js
```

The installer will:
1. Copy complete `.claude/` structure
2. Create `incubator/` and `reports/` directories
3. Merge or create root `CLAUDE.md`
4. Create appropriate `.gitignore`

### Validate Installation

```bash
node scripts/setup/validate.js
```

Checks if all components are present and correctly configured.

### Package Structure

| Component | Destination | Description |
|-----------|-------------|-------------|
| Workflows | `.claude/workflows/` | YAML Agents |
| Skills | `.claude/skills/` | Modular knowledge |
| Hooks | `.claude/hooks/` | Automation and security |
| Agents | `.claude/agents/` | Specialized subagents |
| Commands | `.claude/commands/` | Slash commands |
| Dev Docs | `incubator/` | Continuity system |
| Reports | `reports/` | Generated reports |

### Update

To update infrastructure in an existing project:

```bash
# Re-run installer (automatic backup)
node scripts/install.js /path/to/project --update
```

---

## Hooks and Automation

Hooks are scripts that intercept Claude Code events for automation and security.

### Configured Hooks

| Hook | File | Function |
|------|------|----------|
| **PreToolUse** | `.claude/hooks/pre-tool-use.js` | Check relevant skills before actions, suggest additional context, validate critical parameters |
| **Security** | `.claude/hooks/security-check.js` | Detect malicious instructions injected in CLAUDE.md/skills/prompts |

### PreToolUse Hook

This hook solves the problem of skills not activating automatically by analyzing tool context and suggesting relevant skills based on `skill-rules.json`.

**Features:**
- Detects skill triggers in action context
- Suggests up to 3 most relevant skills
- Validates potentially dangerous Bash commands
- Alerts about sensitive file modifications

### Security Check Hook

Detects malicious injection patterns in files and prompts.

**Detected patterns:**
- Instructions to ignore guidelines (`ignore all previous instructions`)
- Jailbreak attempts (`DAN mode`, developer mode)
- Hidden instructions in comments
- Obfuscated commands (`eval`, `base64 decode`)
- Data exfiltration attempts

**Severity levels:**
- 🔴 **Critical**: Blocks the action
- 🟠 **High**: Strong alert
- 🟡 **Medium**: Moderate alert
- ⚪ **Low**: Observation

### How They Work

Hooks are automatically loaded by Claude Code when present in `.claude/hooks/`. They intercept events before execution and can:
- Issue warnings
- Suggest additional context
- Block suspicious actions (critical)
- Log for audit

---

## Environment Configuration

### Status Line

Configured in `.claude/settings.json`:
```json
{
  "statusLine": {
    "format": "[{cwd}] [{gitBranch}] [{model}]"
  }
}
```

Shows:
- `[~/.claude/dcc]` - Current directory (home as ~)
- `[main]` - Current git branch
- `[sonnet]` - Model in use

### Observability / Session Logs

Claude Code provides usage information at the end of each interactive session:

```
Session completed.
Tokens: 15,234 input | 8,901 output
Estimated cost: $0.23
Cache hit rate: 45%
```

**For detailed logs:**
```bash
# Claude Code logs
ls ~/.claude/logs/

# Usage statistics
claude stats

# Session history
claude history
```

**Available metrics:**
| Metric | Description |
|--------|-------------|
| Input tokens | Tokens sent to API |
| Output tokens | Tokens generated by model |
| Cache hit rate | % of tokens read from cache |
| Estimated cost | Approximate value in USD |
| Response time | Average latency per request |

**Cost optimization:**
- Use `cache` when available (same context between calls)
- Break large tasks into smaller sessions
- Use smaller models for simple tasks (haiku vs sonnet)

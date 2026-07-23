# 🗂️ DCC Repository Organization

This document explains the structure and purpose of each directory in the repository.

---

## Overview

```
dcc/                                  ← REPOSITORY ROOT
│
├── 📄 README.md                      ← Project business card
├── 📄 CLAUDE.md                      ← Project brain (context for Claude)
├── 📄 MEMORY.md                      ← Persistent memories index
├── 📄 .gitignore                     ← Git ignored files
│
├── 📁 .claude/                       ← ⚙️ CLAUDE CODE CONFIGURATIONS
│   ├── 📁 workflows/                 ← 🤖 AGENTS AND AUTOMATIONS
│   │   ├── 📁 agents/                ← Reusable agents
│   │   ├── 📁 reports/               ← Report generators
│   │   └── 📁 tasks/                 ← One-time tasks
│   ├── 📁 memory/                    ← Persistent memories (auto)
│   └── 📄 settings.local.json        ← Local settings
│
├── 📁 agents/                        ← 📚 AGENT DOCUMENTATION
│   ├── 📄 README.md                  ← Available agents catalog
│   ├── 📁 code-review/               ← Code-review agent docs
│   ├── 📁 doc-generator/             ← Doc-generator agent docs
│   └── 📁 report-generator/          ← Report docs
│
├── 📁 docs/                          ← 📖 GENERAL DOCUMENTATION
│   ├── 📄 README.md                  ← Index and navigation
│   ├── 📁 guides/                    ← Guides and tutorials
│   │   ├── 📄 claude-code.md         ← How to use Claude Code
│   │   ├── 📄 mcp-setup.md           ← Configure MCP integrations
│   │   └── 📄 google-workspace.md    ← Google Workspace setup
│   ├── 📁 conventions/               ← Conventions and standards
│   │   └── 📄 README.md              ← Project rules
│   ├── 📁 skills/                    ← Skills Documentation
│   │   ├── 📁 skillshub/             ← SkillsHub skills
│   │   └── 📁 cooper/                ← Cooper skills
│   ├── 📁 operations/                ← Operational documentation
│   │   └── 📄 feedback-system.md     ← Learning system
│   └── 📁 sql/                       ← SQL Documentation
│       └── 📄 query-template.md      ← Query templates
│
├── 📁 sql-library/                   ← 📊 SQL LIBRARY
│   ├── 📁 encyclopedia/              ← Data dictionary
│   ├── 📁 queries/                   ← Reusable SQL queries
│   │   ├── 📁 data-e/                ← Productive queries (no CTEs, no variables)
│   │   ├── 📁 data-e-test/           ← Test queries (no CTEs, with variables)
│   │   ├── 📁 presto/                ← Scheduled queries
│   │   ├── 📁 draft/                 ← Temporary/draft queries
│   │   └── 📄 README.md              ← Query catalog
│   ├── 📁 repository/                ← Catalogued reference queries
│   └── 📄 CLAUDE.md                  ← sql-library guide
│
├── 📁 incubator/                     ← 🧪 PROJECTS IN DEVELOPMENT
│   ├── 📁 in-progress/               ← Active projects
│   ├── 📁 backlog/                   ← Draft ideas
│   ├── 📄 README.md                  ← Projects index
│   └── 📄 CLAUDE.md                  ← Format guide
│
├── 📁 temp-storage/                  ← 🗄️ TEMPORARY FILES
│   ├── 📁 backup/                    ← Backups (90 days)
│   ├── 📁 screenshots/               ← Screenshots (30 days)
│   ├── 📁 txt/                       ← Temporary analyses (30 days)
│   └── 📄 README.md                  ← Retention rules
│
├── 📁 reports/                       ← 📊 GENERATED REPORTS
│   ├── 📁 weekly/                    ← Weekly reports
│   └── 📁 monthly/                   ← Monthly reports
│
├── 📁 templates/                     ← 🎨 PROJECT TEMPLATES
│   ├── 📁 web-app/                   ← Next.js/React template
│   └── 📁 api-service/               ← API template
│
└── 📄 .mcp.json                      ← MCP integrations
```

---

## Repository Root

### `README.md`
**Purpose:** Project business card. Anyone arriving here quickly understands what it is.

**Contains:**
- Repository purpose
- Simplified structure
- Quick-start commands
- List of main agents

**When to edit:**
- When adding main agents
- When changing base structure
- When updating common commands

---

### `CLAUDE.md`
**Purpose:** Project brain. Automatically read by Claude in every session.

**Contains:**
- Repository purpose
- Detailed folder structure
- Naming conventions
- Commit types
- Agent catalog
- Useful commands
- Roadmap

**When to edit:**
- When creating new agent categories
- When changing conventions
- When adding integrations

**⚠️ IMPORTANT:** This file is essential! Claude always consults it.

---

### `MEMORY.md`
**Purpose:** Index of persistent memories that Claude creates automatically.

**How it works:**
- Claude saves memories in `.claude/memory/`
- This file lists and organizes those memories
- Types: user, project, feedback, reference

**When to use:**
- When you want Claude to "remember" something: "Remember to use camelCase"
- To consult past decisions

---

### `.gitignore`
**Purpose:** Defines files that should not be versioned.

**Ignores:**
- `.claude/memory/` (local data)
- Log and cache files
- Sensitive data (.env, secrets)
- Dependencies (node_modules)

---

## `.claude/` - Claude Code Configurations

### `workflows/` - Automations

#### `workflows/agents/` - Reusable Agents

Agents are parameterized workflows that solve specific tasks.

**Files:**

| File | Purpose | How to use |
|---------|-----------|-----------|
| `_template.yaml` | Base template for creating new agents | Copy and modify |
| `code-review.yaml` | Reviews code (bugs, security, performance) | `claude "execute code-review"` |
| `doc-generator.yaml` | Automatically generates documentation | `claude "execute doc-generator --type=readme"` |
| `security-audit.yaml` | Vulnerability audit | `claude "execute security-audit"` |
| `cleanup-temp.yaml` | Cleans expired files from temp-storage | `claude "execute cleanup-temp"` |

**Agent structure:**
```yaml
name: agent-name           ← Identifier
description: |
  Description of what it does        ← For user to understand

parameters:                    ← Accepted parameters
  - name: parameter1
    type: string
    required: true
    default: "value"

steps:                         ← Execution steps
  - name: step1
    prompt: |
      Instructions for Claude

settings:                      ← Settings
  model: sonnet
  save_output: true
  output_path: "reports/..."
```

#### `workflows/reports/` - Report Generators

Reports are workflows specialized in generating periodic documents.

**Files:**

| File | Purpose | Output |
|---------|-----------|-------|
| `report-weekly.yaml` | Weekly activities report | `reports/2024-07/weekly-report-W27.md` |

**Difference between agents and reports:**
- **Agents:** Generic tasks (review, audit)
- **Reports:** Periodic documents with date/time

#### `workflows/tasks/` - One-time Tasks

**Purpose:** Scripts for single execution.

**Future examples:**
- Data migration
- Mass renaming
- Temporary file cleanup

---

### `memory/` - Persistent Memories

**Purpose:** Stores information that Claude should remember between sessions.

**Location:** `.claude/memory/` (not committed to git)

**Format:**
```markdown
---
name: code-preference
description: Prefers arrow functions
metadata:
  type: user
---

Always use arrow functions instead of function declarations.

**Why:** More concise, no problematic hoisting.

**How to apply:** Replace `function foo()` with `const foo = () =>`
```

**Memory types:**
- `user` - Personal preferences
- `project` - Architectural decisions
- `feedback` - Received corrections
- `reference` - Links and resources

---

### `settings.local.json`

**Purpose:** Local Claude Code settings.

**Current:**
```json
{
  "enabledMcpjsonServers": ["google-workspace", "gattaran"],
  "enableAllProjectMcpServers": true
}
```

**What it does:**
- Enables Google Workspace integration (Gmail, Calendar, Drive)
- Enables Gattaran MCP Server
- Allows project MCP servers to be used

---

## `agents/` - Agent Documentation

**Purpose:** Detailed documentation of each available agent.

**Why separate:**
- Workflows (`workflows/agents/`) = executable code
- Documentation (`agents/`) = usage guide

**Structure per agent:**
```
agents/
├── README.md                    ← Catalog of all agents
├── code-review/
│   └── README.md               ← Usage, parameters, examples
├── doc-generator/
│   └── README.md               ← Usage, parameters, examples
└── report-generator/
    └── README.md               ← Usage, parameters, examples
```

**What each README contains:**
- Agent purpose
- How to use (basic and advanced)
- Parameter table
- Output examples
- CI/CD integration
- Limitations

---

## `docs/` - General Documentation

**Purpose:** Documentation about the repository itself and tools.

**Structure:**

```
docs/
├── README.md                   ← Index and navigation
├── guides/                     ← Guides and tutorials
│   ├── claude-code.md         ← How to use Claude Code
│   ├── mcp-setup.md           ← Configure MCP integrations
│   └── google-workspace.md    ← Google Workspace setup
├── conventions/               ← Conventions and standards
│   └── README.md              ← Project rules
├── skills/                    ← Skills Documentation
│   ├── skillshub/             ← SkillsHub skills
│   └── cooper/                ← Cooper skills
├── operations/                ← Operational documentation
│   └── feedback-system.md     ← Learning system
└── sql/                       ← SQL Documentation
    └── query-template.md      ← Query templates
```

**Difference from `CLAUDE.md`:**
- `CLAUDE.md` = Project context (read by Claude)
- `docs/` = Reference for humans

---

## `sql-library/` - SQL Library

**Purpose:** Central repository for SQL queries and analytical assets.

**Structure:**

```
sql-library/
├── encyclopedia/              ← Data dictionary
│   └── tables.json           ← Schema of used tables
├── queries/                   ← Reusable SQL queries
│   ├── data-e/               ← Productive queries (no CTEs, no variables)
│   ├── data-e-test/          ← Test queries (no CTEs, with variables)
│   ├── presto/               ← Scheduled queries
│   ├── draft/                ← Temporary/draft queries
│   └── README.md             ← Query catalog
├── repository/                ← Catalogued reference queries
│   └── README.md             ← High-value queries
└── CLAUDE.md                 ← sql-library guide
```

**Rules by folder:**
| Folder | CTEs | Variables | Usage |
|-------|------|-----------|-----|
| `data-e/` | ❌ No | ❌ No | Productive queries |
| `data-e-test/` | ❌ No | ✅ Yes | Local testing |
| `presto/` | ✅ Yes | ✅ Yes | Scheduled queries |
| `draft/` | ✅ Yes | ✅ Yes | Temporary drafts |

---

## `incubator/` - Projects in Development

**Purpose:** Space for ongoing projects and incubating ideas.

**Structure:**

```
incubator/
├── in-progress/               ← Active projects in development
│   └── [project].md
├── backlog/                   ← Draft future ideas
│   └── [idea].md
├── README.md                  ← Projects index
└── CLAUDE.md                 ← Format guide
```

**Lifecycle flow:**
```
backlog/ → in-progress/ → [final destination]
  (idea)   (execution)     (completed)
```

**Formats:**
- `backlog/[idea].md`: Context + Proposal + Action Plan
- `in-progress/[project].md`: Context + Plan + What We Did + Where We Are + Next Steps + Results

---

## `temp-storage/` - Temporary Files

**Purpose:** Temporary storage for short-duration files.

**Structure:**

```
temp-storage/
├── backup/              # Backups with 90-day retention
├── screenshots/         # Screenshots with 30-day retention
├── txt/                 # Analyses, page content, etc (30 days)
└── README.md            # Rules documentation
```

**Retention Rules:**
| Folder | Period | Deletion |
|-------|-------|----------|
| `backup/` | **90 days** | With user approval |
| `screenshots/` | **30 days** | Automatic |
| `txt/` | **30 days** | Automatic |

**Cleanup:**
```bash
# List expired files
claude workflow run cleanup-temp

# Execute cleanup
claude workflow run cleanup-temp --action=execute
```

---

## `reports/` - Generated Reports

**Purpose:** Store outputs from report agents.

**Structure:**
```
reports/
├── weekly/                     ← Weekly reports
│   ├── 2024-W27-code-review.md
│   ├── 2024-W28-security-audit.md
│   └── ...
└── monthly/                    ← Monthly reports
    ├── 2024-07-weekly-summary.md
    ├── 2024-07-security-audit.md
    └── ...
```

**Benefits:**
- Analysis history
- Evolution tracking
- Easy sharing

---

## `templates/` - Project Templates

**Purpose:** Base projects ready to copy and start.

**Structure:**
```
templates/
├── web-app/                    ← Next.js/React template
│   └── example-project/
│       └── .claude/
│           └── CLAUDE.md       ← Template-specific context
├── api-service/                ← API template (empty, ready)
└── python-script/              ← Python script template
```

**How to use:**
```bash
# Copy template to new project
cp -r templates/web-app/example-project ~/projects/my-new-site

# Or use as reference
```

---

## `scripts/` - Utility Scripts

**Purpose:** Scripts organized by functionality for automation and maintenance.

**Structure:**
```
scripts/
├── README.md              ← Scripts documentation
├── setup/                 ← Installation and initial setup
│   ├── install.js
│   ├── validate.js
│   ├── verify-setup.js
│   ├── setup.ps1
│   └── setup.sh
├── auth/                  ← Authentication
│   ├── auth-google.py
│   ├── auth-google-full.sh
│   ├── setup-google-auth.sh
│   └── test-google-mcp.sh
├── analysis/              ← Data analysis
│   ├── analyze_skill.py
│   ├── fetch-skillshub.py
│   └── test-skillshub.py
├── dchat/                 ← DChat
│   ├── dchat_mcp_processor.py
│   └── dchat_summarizer.py
├── google/                ← Google Workspace
│   ├── backup-to-drive.py
│   └── generate-pdf-manual.py
├── maintenance/           ← Maintenance
│   ├── check-updates.py
│   └── update-encyclopedia.py
├── install/               ← Distributable installer
│   └── dccrazy-install.py
└── utils/                 ← Utilities
    └── fetch-intranet.py
```

**How to use:**
```bash
# Python
python scripts/maintenance/check-updates.py

# Node.js
node scripts/setup/validate.js

# Shell
bash scripts/auth/setup-google-auth.sh
```

---

## `.mcp.json` - MCP Integrations

**Purpose:** Configures integrations with external services.

**Current:**
```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "mcp-server-google-workspace",
      "args": [],
      "env": {
        "GOOGLE_REDIRECT_URI": "http://localhost:3000/oauth2callback"
      }
    },
    "gattaran": {
      "command": "node",
      "args": ["mcp-servers/gattaran/src/index.js"]
    }
  }
}
```

**What it enables:**
- Gmail access
- Google Calendar access
- Google Drive access
- Gattaran access (Order Management)
- Automated email sending

---

## Typical Workflow

### 1. Use an Existing Agent
```bash
# Execute agent
claude "execute code-review --target=src/"

# Output automatically saved in reports/
```

### 2. Create a New Agent
```bash
# 1. Copy template
cp .claude/workflows/agents/_template.yaml \
   .claude/workflows/agents/my-agent.yaml

# 2. Edit the YAML

# 3. Create documentation
mkdir agents/my-agent
touch agents/my-agent/README.md

# 4. Add to catalog
# (edit agents/README.md)

# 5. Test
claude "execute my-agent --parameter1=value"

# 6. Commit
git add .
git commit -m "[agent] Add my-agent for [purpose]"
```

### 3. Generate Report
```bash
# Generate and save
claude "execute report-weekly"

# Output: reports/2024-07/weekly-report-W27.md
```

### 4. Add SQL Query
```bash
# 1. Create in appropriate folder
# sql-library/queries/presto/my-query.sql

# 2. Follow conventions (no CTEs for data-e)

# 3. Update index
# sql-library/queries/README.md

# 4. Commit
git add .
git commit -m "[query] Add my-query"
```

### 5. Start Project
```bash
# 1. Create in backlog or in-progress
# incubator/backlog/my-idea.md
# or
# incubator/in-progress/my-project.md

# 2. Follow format defined in incubator/CLAUDE.md

# 3. When completed, move result to appropriate folder
```

---

## Important Conventions

### Naming
- Files/folders: `kebab-case`
- Agents: descriptive action name
- Commits: `[type] description`

### Commits
```
[agent]    New or updated agent
[report]   Generated report
[template] Added/updated template
[doc]      Documentation
[chore]    Maintenance
[fix]      Fix
[query]    Added SQL query
```

### Gitignore
Never commit:
- `.claude/memory/` (local data)
- `reports/*/processed/` (processed)
- Secret files
- `temp-storage/` (temporary files)

---

## Maintenance Checklist

### Weekly
- [ ] Review generated reports in `reports/`
- [ ] Check for new memories in `.claude/memory/`

### Monthly
- [ ] Update catalog in `agents/README.md`
- [ ] Review documentation in `docs/`
- [ ] Run `cleanup-temp` to clean expired files
- [ ] Review projects in `incubator/in-progress/`

### New Agent
- [ ] Create workflow in `.claude/workflows/agents/`
- [ ] Create documentation in `agents/[name]/README.md`
- [ ] Add to catalog in `agents/README.md`
- [ ] Add to `CLAUDE.md` if main agent
- [ ] Test before committing
- [ ] Commit with tag `[agent]`

### New Query
- [ ] Create in appropriate folder (`sql-library/queries/`)
- [ ] Follow CTE and variable conventions
- [ ] Update index in `sql-library/queries/README.md`
- [ ] Test before committing
- [ ] Commit with tag `[query]`

---

## Visual Summary

```
┌─────────────────────────────────────────────────────────┐
│  ROOT (entry points)                                    │
│  ├── README.md        → For humans to learn             │
│  ├── CLAUDE.md        → For Claude to understand        │
│  └── MEMORY.md        → Memories index                  │
├─────────────────────────────────────────────────────────┤
│  .claude/ (executables)                                 │
│  ├── workflows/agents/    → Agents code                 │
│  ├── workflows/reports/   → Report generators           │
│  └── memory/              → Persistent data             │
├─────────────────────────────────────────────────────────┤
│  agents/ (documentation)                                │
│  └── [name]/README.md     → How to use each agent       │
├─────────────────────────────────────────────────────────┤
│  docs/ (reference)                                      │
│  ├── guides/              → Guides and tutorials        │
│  ├── conventions/         → Rules and patterns          │
│  ├── skills/              → Skills documentation        │
│  ├── operations/          → Operational documentation   │
│  └── sql/                 → SQL documentation           │
├─────────────────────────────────────────────────────────┤
│  sql-library/ (queries)                                 │
│  ├── encyclopedia/        → Data dictionary             │
│  ├── queries/             → Reusable queries            │
│  └── repository/          → Reference queries           │
├─────────────────────────────────────────────────────────┤
│  incubator/ (projects)                                  │
│  ├── backlog/             → Future ideas                │
│  └── in-progress/         → Active projects             │
├─────────────────────────────────────────────────────────┤
│  temp-storage/ (temporary)                              │
│  ├── backup/              → Backups (90 days)           │
│  ├── screenshots/         → Screenshots (30 days)       │
│  └── txt/                 → Temporary analyses (30 days)│
├─────────────────────────────────────────────────────────┤
│  reports/ (outputs)                                     │
│  └── YYYY-MM/*.md         → Generated reports           │
├─────────────────────────────────────────────────────────┤
│  templates/ (base projects)                             │
│  └── [type]/              → Copy for new projects       │
└─────────────────────────────────────────────────────────┘
```

---

**Last updated:** 2026-07-23

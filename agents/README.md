# 🤖 Agent Catalog

This directory documents all available agents in the DCC repository.

## Index

- [How to Use](#how-to-use)
- [Available Agents](#available-agents)
  - [Analysis and Quality](#analysis-and-quality-)
  - [Documentation](#documentation-)
  - [Automation](#automation-)
- [Creating New Agents](#creating-new-agents)

---

## How to Use

### Via Claude Code (Interactive)
```bash
claude "execute code-review agent"
claude "execute security-audit agent"
```

### Via Workflow (Direct)
```bash
claude workflow run .claude/workflows/agents/code-review.yaml
```

### With Parameters
```bash
# Passing additional context
claude "execute code-review focusing on security in file src/auth.ts"
```

---

## Available Agents

### Analysis and Quality 🔍

#### `code-review`
**Purpose:** Complete code review focusing on multiple dimensions.

**Analyzed dimensions:**
- 🐛 Bugs and logic
- 🔒 Security
- ⚡ Performance
- 🧪 Testability
- 📖 Readability

**Usage:**
```bash
# Review uncommitted changes
claude "execute code-review"

# Review specific file
claude "execute code-review on file src/api.ts"

# Focus on security
claude "execute code-review --focus=security"
```

**Location:** [`.claude/workflows/agents/code-review.yaml`](../.claude/workflows/agents/code-review.yaml)  
**Docs:** [`code-review/README.md`](./code-review/README.md)

---

#### `security-audit`
**Purpose:** Audit focused on security vulnerabilities.

**Detects:**
- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF
- Sensitive data exposure
- Vulnerable dependencies

**Usage:**
```bash
claude "execute security-audit"
claude "execute security-audit on directory src/"
```

---

### Documentation 📝

#### `doc-generator`
**Purpose:** Automatically generates documentation from code.

**Capabilities:**
- README.md from structure
- API documentation (OpenAPI/Swagger)
- Changelogs from commits
- JSDoc/TSDoc comments

**Usage:**
```bash
# Generate README
claude "execute doc-generator --type=readme"

# Document API
claude "execute doc-generator --type=api-docs"

# Changelog
claude "execute doc-generator --type=changelog --since=v1.0.0"
```

**Location:** [`.claude/workflows/agents/doc-generator.yaml`](../.claude/workflows/agents/doc-generator.yaml)  
**Docs:** [`doc-generator/README.md`](./doc-generator/README.md)

---

### Automation ⚙️

#### `cleanup-temp`
**Purpose:** Cleans expired files from `temp-storage/` folder.

**Features:**
- Lists expired files by category
- Automatically removes files from `screenshots/` and `txt/` (>30 days)
- Requests confirmation to delete backups (>90 days)
- Reports freed space

**Usage:**
```bash
# Just list expired files
claude "execute cleanup-temp --action=list"
claude workflow run cleanup-temp

# Execute cleanup
claude "execute cleanup-temp --action=execute"
claude workflow run cleanup-temp --action=execute
```

**Retention Rules:**
| Folder | Period | Deletion |
|-------|-------|----------|
| `backup/` | 90 days | With approval |
| `screenshots/` | 30 days | Automatic |
| `txt/` | 30 days | Automatic |

**Location:** [`.claude/workflows/agents/cleanup-temp.yaml`](../.claude/workflows/agents/cleanup-temp.yaml)

---

#### `refactor-suggester`
**Purpose:** Suggests refactorings based on patterns.

**Capabilities:**
- Detects duplicate code
- Suggests function extraction
- Identifies optimization opportunities
- Proposes modernization (e.g.: callbacks → async/await)

**Usage:**
```bash
# Analyze entire project
claude "execute refactor-suggester"

# Focus on specific file
claude "execute refactor-suggester --file=src/utils.ts"
```

---

## Creating New Agents

### Step by Step

1. **Create the workflow** in `.claude/workflows/agents/`:
```yaml
# .claude/workflows/agents/my-agent.yaml
name: my-agent
description: What this agent does

parameters:
  - name: parameter1
    type: string
    required: true
    description: Parameter description

steps:
  - name: analysis
    prompt: |
      Your task is {parameter1}
      
      Context: {context}
      
      Execute and return structured result.
```

2. **Document** in `agents/my-agent/README.md`:
```markdown
# my-agent

## Purpose
...

## Parameters
...

## Usage Examples
...
```

3. **Register** in this catalog (`agents/README.md`)

4. **Test**:
```bash
claude "execute my-agent --parameter1=value"
```

5. **Commit**:
```bash
git add .
git commit -m "[agent] Add my-agent for [purpose]"
```

### Workflow Template

See template at [`.claude/workflows/agents/_template.yaml`](../.claude/workflows/agents/_template.yaml)

---

## Sharing Agents

### Within This Repository
Agents are automatically available to everyone using this repo.

### Between Repositories
Copy the file `.claude/workflows/agents/[name].yaml` to another project.

### Distribution
To share publicly:
1. Publish the YAML in a gist/repo
2. Others can download and place in `.claude/workflows/agents/`

---

## Agent Roadmap

### Planned
- [ ] `test-generator` - Automatically generates tests
- [ ] `dependency-analyzer` - Dependency analysis
- [ ] `api-consistency` - Checks API consistency
- [ ] `i18n-checker` - Checks incomplete translations
- [ ] `accessibility-audit` - Accessibility audit

### Ideas
- [ ] `commit-message-writer` - Suggests commit messages
- [ ] `pr-description-generator` - Generates PR descriptions
- [ ] `onboarding-helper` - Helps new devs in the project

---

**Last updated:** 2026-07-23  
**Total agents:** 7

---

## 🚀 Future Projects

### Agents in Development

See folder [`incubator/in-progress/`](../incubator/in-progress/) for agent projects in planning:

| Project | Status | Description |
|---------|--------|-----------|
| `agent-orchestrator` | ⚪ Not Started | Meta-agent that orchestrates other agents |
| `report-generator-future` | ⚪ Not Started | Report agent with automatic learning |

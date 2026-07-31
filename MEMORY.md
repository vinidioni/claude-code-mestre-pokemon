# Repository Memory - DCC

This file indexes all persistent memories of the project.

> 📝 **Note:** Memories are automatically stored in `.claude/memory/`
> This file serves as an index for quick reference.

---

## Memory Index by Category

### 🖥️ MCP Servers
| Memory | Description |
|--------|-------------|
| [dchat-mcp-v2](.claude/memory/mcp-servers/dchat-mcp-v2.md) | D-Chat MCP v2.0 upgrade details (10 tools, caching, rate limiting) |
| [puppeteer-deprecated](.claude/memory/mcp-servers/puppeteer-deprecated.md) | Puppeteer MCP is deprecated - use Playwright instead |

### 🛠️ Skills
| Memory | Description |
|--------|-------------|
| [data-e-query-rules](.claude/memory/skills/data-e-query-rules.md) | Rules for Data-E queries (no CTEs, no variables, subqueries) |

### 📁 Projects
| Memory | Description |
|--------|-------------|
| [gattaran-automation](.claude/memory/projects/gattaran-automation.md) | Context for Gattaran Order Management automation |

---

## Memory Structure

```markdown
---
name: short-name
description: One-line description
metadata:
  type: mcp | skill | project | user
---

Detailed content.

**Why:** Explanation of importance

**How to apply:** Practical instructions

Related: [[another-memory]]
```

---

## Folder Organization

Memories are organized by **domain/category**:

```
.claude/memory/
├── mcp-servers/       # MCP server configurations, upgrades, issues
├── skills/            # Skill patterns, rules, best practices
├── projects/          # Active project contexts and decisions
└── user/              # User preferences (if any)
```

| Folder | Use For | Example |
|--------|---------|---------|
| `mcp-servers/` | MCP server docs, deprecations, upgrades | D-Chat v2, Playwright vs Puppeteer |
| `skills/` | Skill patterns, query rules, conventions | Data-E query rules |
| `projects/` | Context to resume later | Gattaran automation |
| `user/` | Personal preferences (optional) | Query style preferences |

---

## How to Create Memories

When you want me to remember something important:

```
You: Remember to always use [something]
```

Claude will automatically create a file in `.claude/memory/` in the appropriate folder.

---

*Last updated: 2026-07-31*

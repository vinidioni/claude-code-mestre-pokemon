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

### 🛠️ Ways of Work
| Memory | Description |
|--------|-------------|
| [data-e-query-rules](.claude/memory/ways-of-work/data-e-query-rules.md) | Rules for Data-E queries (no CTEs, no variables, subqueries) |

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
├── mcp-servers/       # Integrações, APIs, serviços externos
└── ways-of-work/      # Nossos padrões, regras, convenções
```

| Folder | Use For | Example |
|--------|---------|---------|
| `mcp-servers/` | MCP server docs, deprecations, upgrades | D-Chat v2, Playwright vs Puppeteer |
| `ways-of-work/` | Como fazemos as coisas | Data-E query rules |

**Nota:** Projetos em andamento vão para `incubator/in-progress/`, não para memórias.

---

## How to Create Memories

When you want me to remember something important:

```
You: Remember to always use [something]
```

Claude will automatically create a file in `.claude/memory/` in the appropriate folder.

---

*Last updated: 2026-07-31*

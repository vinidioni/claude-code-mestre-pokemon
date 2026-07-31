# Repository Memory - DCC

This file indexes all persistent memories of the project.

> 📝 **Note:** Memories are automatically stored in `.claude/memory/`
> This file serves as an index for quick reference.

## Memory Index

### User Preferences
| Memory | Description |
|--------|-------------|
| [dccastanho-preferences](.claude/memory/feedback/dccastanho-preferences.md) | User preferences and patterns for Vinicius Castanho |

### Project Decisions
| Memory | Description |
|--------|-------------|
| [gattaran-automation](.claude/memory/projects/gattaran-automation.md) | Context for Gattaran Order Management automation |
| [dchat-mcp-v2](.claude/memory/projects/dchat-mcp-v2.md) | D-Chat MCP v2.0 upgrade details |

### Feedback
*Feedback-type memories will be listed here*

### Reference
| Memory | Description |
|--------|-------------|
| [data-e-query-rules](.claude/memory/reference/data-e-query-rules.md) | Rules for Data-E queries (no CTEs, no variables) |
| [puppeteer-deprecated](.claude/memory/reference/puppeteer-deprecated.md) | Puppeteer MCP is deprecated, use Playwright |

---

## How to Create Memories

When you want me to remember something important:

```
You: Remember to always use [something]
```

Claude will automatically create a file in `.claude/memory/`.

## Memory Structure

```markdown
---
name: short-name
description: One-line description
metadata:
  type: user | project | feedback | reference
---

Detailed content.

**Why:** Explanation of importance

**How to apply:** Practical instructions

Related: [[another-memory]]
```

## Memory Organization

Memories are organized in subfolders by type:

```
.claude/memory/
├── feedback/          # User preferences and learned patterns
├── projects/          # Active project contexts and decisions
└── reference/         # Quick reference guides and technical notes
```

| Folder | Use For | Example |
|--------|---------|---------|
| `feedback/` | Your preferences, patterns detected | Query style, naming preferences |
| `projects/` | Context to resume later | Gattaran automation, D-Chat upgrade |
| `reference/` | Quick technical lookup | Data-E rules, deprecated tools |

---

*Last updated: 2026-07-31*

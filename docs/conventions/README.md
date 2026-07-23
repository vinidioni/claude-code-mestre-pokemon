# 📋 Conventions

Repository conventions and standards.

---

## 🏷️ Naming Conventions

### Files and Folders
- Use `kebab-case` for all file and folder names
- Use English for names
- No version numbers in filenames (use git for versioning)

✅ **Good:**
- `cleanup-temp.yaml`
- `query-template.md`
- `gattaran-order-viewer/`

❌ **Avoid:**
- `convenção_queries.md` (accents, snake_case)
- `QueryTemplate.md` (camelCase)
- `backup-v1.sql` (version in name)

---

## 📝 Commits

Format:
```
[type] Short description

Detailed body if needed

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

| Type | Use for |
|------|---------|
| `[agent]` | New or updated agent |
| `[skill]` | New skill module |
| `[query]` | New SQL query |
| `[report]` | Generated report |
| `[template]` | Added/updated template |
| `[doc]` | Documentation |
| `[chore]` | Maintenance |
| `[fix]` | Bug fix |
| `[refactor]` | Code restructuring |

---

## 🤖 Agents

### Creating a New Agent

1. Create workflow in `.claude/workflows/agents/`
2. Create documentation in `agents/[name]/README.md`
3. Add to catalog in `agents/README.md`
4. Add to `CLAUDE.md` if main agent
5. Test before committing
6. Commit with `[agent]` tag

### Agent Structure

```yaml
name: agent-name
description: Clear description of what this agent does

parameters:
  - name: param1
    type: string
    required: true
    default: "value"

steps:
  - name: step1
    prompt: |
      Instructions for Claude

settings:
  model: sonnet
  timeout: 300
```

---

## 🗄️ SQL Queries

See [Query Template](../sql/query-template.md) for full SQL conventions.

### Quick Reference

| Folder | CTEs | Variables | Use |
|--------|------|-----------|-----|
| `sql-library/queries/data-e/` | ❌ No | ❌ No | Production queries |
| `sql-library/queries/data-e-test/` | ❌ No | ✅ Yes | Local testing |
| `sql-library/queries/presto/` | ✅ Yes | ✅ Yes | Scheduled queries |
| `sql-library/queries/draft/` | ✅ Yes | ✅ Yes | Temporary drafts |

---

## 📁 Folder Conventions

### Projects
```
incubator/
├── backlog/          # Ideas only
└── in-progress/     # Active projects with tracking
```

### Temp Storage
```
temp-storage/
├── backup/          # 90 day retention, requires approval
├── screenshots/     # 30 day retention
└── txt/            # 30 day retention
```

---

## 🔄 Workflow

### Starting a Project
1. Document in `incubator/backlog/` or `incubator/in-progress/`
2. Follow format in `incubator/CLAUDE.md`
3. Move to appropriate folder when complete

### Cleaning Up
1. Run `claude workflow run cleanup-temp` monthly
2. Archive completed projects
3. Update documentation

---

Last updated: 2026-07-23

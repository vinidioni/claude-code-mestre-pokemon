# Reports - Context Documentation

> This CLAUDE.md loads automatically when you work in `reports/`. It extends the root CLAUDE.md with specific details for report generation and organization.

---

## Purpose

The `reports/` folder stores automatically generated reports by agents, organized by type (weekly/monthly) for easy historical reference.

---

## Folder Structure

```
reports/
├── CLAUDE.md              # This file
├── weekly/                # Weekly reports
│   ├── 2024-W27-code-review.md
│   ├── 2024-W28-security-audit.md
│   └── ...
└── monthly/               # Monthly reports
    ├── 2024-07-weekly-summary.md
    ├── 2024-07-security-audit.md
    └── ...
```

---

## Naming Conventions

### Files
`{type}-{timestamp}.md`

- **type**: kebab-case (ex: code-review, security-audit, weekly-summary)
- **timestamp**: YYYY-MM-DD or YYYY-W## for weekly

### Examples
- `weekly-2024-W27.md`
- `code-review-2024-07-15.md`
- `monthly-summary-2024-07.md`

---

## Report Structure

```markdown
# Report Title

**Generated:** YYYY-MM-DD HH:MM  
**By:** {agent-name}  
**Target:** {path/file analyzed}

---

## Executive Summary

2-3 lines with the most important findings.

## Details

### Section 1
...

### Section 2
...

## Recommendations

1. ...
2. ...

## Next Steps

- [ ] Recommended action
```

---

## How to Generate a Report

### Via Workflow
```bash
claude workflow run code-review --target="src/"
```

### Via Agent
```bash
claude "execute security-audit agent on directory src/api/"
```

---

## Best Practices

1. **Don't edit generated reports** - They are audit artifacts
2. **Check history** - Compare monthly reports to identify trends
3. **Archive old reports** - After 12 months, move to `temp-storage/backup/`
4. **Organize by type** - Place in correct folder (weekly/ vs monthly/)

---

## Folder Usage

| Folder | Content | Retention |
|--------|---------|-----------|
| `weekly/` | Week-based reports (W27, W28, etc.) | 6 months |
| `monthly/` | Month-based reports (2024-07, etc.) | 12 months |

---

Last updated: 2026-07-23

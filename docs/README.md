# 📚 Documentation

Central documentation for the DCC repository.

---

## 📁 Structure

```
docs/
├── README.md                   # This file
├── guides/                     # Guides and tutorials
│   ├── claude-code.md         # How to use Claude Code
│   ├── mcp-setup.md           # Configure MCP integrations
│   └── google-workspace.md    # Google Workspace setup
├── conventions/               # Conventions and standards
│   └── README.md              # Project rules
├── skills/                    # Skills documentation
│   └── skillshub/             # SkillsHub documentation
├── operations/                # Operational documentation
│   └── feedback-system.md     # Learning system
└── sql/                       # SQL documentation
    └── query-template.md      # Query templates
```

---

## 🧭 Navigation

### Getting Started
- **[Claude Code Guide](guides/claude-code.md)** - Complete guide to using Claude Code
- **[MCP Setup](guides/mcp-setup.md)** - Configure external integrations (GitHub, PostgreSQL, Slack, etc.)
- **[Google Workspace](guides/google-workspace.md)** - Setup Gmail, Calendar, and Drive access

### Standards
- **[Conventions](conventions/README.md)** - Naming, commits, workflows
- **[Query Template](sql/query-template.md)** - Template for creating SQL queries

### Skills
- **[SkillsHub](skills/skillshub/README.md)** - SkillsHub documentation and reference

### Operations
- **[Feedback System](operations/feedback-system.md)** - How the learning system works

---

## 📝 Adding New Documentation

1. Choose the appropriate folder based on content type
2. Use English for file names (`kebab-case.md`)
3. Add entry to this README
4. Update `CLAUDE.md` if it's core project documentation

---

## 🔄 Keeping Updated

Documentation should be reviewed when:
- New features are added
- Folder structure changes
- Processes are modified

Last reviewed: 2026-07-23

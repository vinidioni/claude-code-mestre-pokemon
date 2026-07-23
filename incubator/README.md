# 🧪 Incubator - Projects in Development

Space for ongoing projects and incubating ideas.

---

## 📁 Structure

```
incubator/
├── in-progress/              # Active projects in development
│   └── [project].md
├── backlog/                  # Draft future ideas
│   └── [idea].md
├── CLAUDE.md                # Complete guide for this folder
└── README.md                # This file
```

---

## 🚦 Project Status

### In Progress

| Project | Description | Status |
|---------|-----------|--------|
| [`definicoes-calculo`](in-progress/definicoes-calculo.md) | Metrics and calculations definitions | 🟡 In Progress |
| [`deskbee-chat-integration`](in-progress/deskbee-chat-integration.md) | Deskbee chat integration | 🟡 In Progress |
| [`orquestrador-agentes`](in-progress/orquestrador-agentes.md) | Meta-agent that orchestrates other agents | 🟡 In Progress |
| [`report-generator-futuro`](in-progress/report-generator-futuro.md) | Report agent with automatic learning | 🟡 In Progress |

### Backlog

*No ideas documented yet.*

---

## 🔄 Workflow

### 1. New Idea → Backlog
1. Create file in `backlog/[idea-name].md`
2. Use simple format (context + proposal + plan)
3. When executing, move to `in-progress/`

### 2. Idea → In Progress
1. Move from `backlog/` to `in-progress/`
2. Expand to full project format
3. Update regularly: What We Did / Where We Are / Next Steps

### 3. Completion → Final Destination
When completed:
1. Move result to appropriate destination folder
2. Delete file from `in-progress/`
3. If destination uncertain → discuss with user

---

## 📋 Conventions

- **File name:** `kebab-case.md`
- **Status:** 🟡 In Progress / ✅ Completed / ⚪ Not Started
- **Backlog:** Only ideas, no execution details
- **In-progress:** Active projects with complete tracking

---

## 💡 Add New Idea

```bash
# Create in backlog
# incubator/backlog/my-idea.md

# Move to execution
# incubator/in-progress/my-project.md
```

See [`CLAUDE.md`](CLAUDE.md) for complete formats.

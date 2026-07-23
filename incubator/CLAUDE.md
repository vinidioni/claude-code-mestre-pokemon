# Incubator - Project Documentation

> This CLAUDE.md loads automatically when you work in `incubator/`.

---

## Structure

```
incubator/
├── CLAUDE.md                    # This file
├── in-progress/                 # Projects in development
│   ├── definicoes-calculo.md    # 🚧 UNDER CONSTRUCTION
│   └── [project].md
├── backlog/                     # Draft ideas
│   └── [idea].md
└── README.md                    # General documentation
```

---

## File Formats

### `backlog/[idea].md` - Ideas and Proposals

```markdown
# [Idea Name]

## Context
[Description of problem/opportunity]

## Proposal
[What we want to achieve]

## Action Plan
1. [Step 1]
2. [Step 2]
```

### `in-progress/[project].md` - Projects in Execution

```markdown
# [Project Name]

> **Status:** 🟡 In Progress / ✅ Completed / ⚪ Not Started  
> **Start:** YYYY-MM-DD  
> **End:** YYYY-MM-DD (if completed)

---

## 🎯 Context + Idea

[Description of problem/opportunity and solution idea]

---

## 📋 Action Plan

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## ✅ What We Did

- [Completed 1]
- [Completed 2]

---

## 📍 Where We Are

[Current status, what is working, what is missing]

---

## 🚀 Next Steps

- [Action 1]
- [Action 2]

---

## 📊 Results

[Results achieved, when applicable]
```

---

## Project Lifecycle Flow

```
backlog/ → in-progress/ → [final destination]
  (idea)   (execution)     (completed)
```

**When completed:**
1. Move result to appropriate destination folder
2. Delete file from `in-progress/`
3. If destination uncertain → discuss with user

---

## Conventions

- **File name:** `project-name.md` (kebab-case)
- **Status:** Use emojis 🟡/✅/⚪ in header
- **Backlog:** Only initial ideas, no execution
- **In-progress:** Active projects with detailed tracking

---

## 🤖 Future: Automation

Idea: Integrate with Claude for automatic definition lookup during queries.

```bash
# Possible future command
/definition aftersales
→ Searches in in-progress/definicoes-calculo.md
```

---

## Current Projects

See `in-progress/` for projects in development.  
See `backlog/` for pending ideas.

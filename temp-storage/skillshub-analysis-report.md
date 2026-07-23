# Skillshub DiDi - Skills Analysis Report

> Date: 2026-07-23
> Total Skills Analyzed: 9
> Source: https://skillshub.intra.xiaojukeji.com

---

## Summary by Category

| Category | Count | Skills |
|----------|-------|--------|
| **Cooper Integration** | 3 | cooper, cooper-mcp-helper, cooper-image-read |
| **Data & Analytics** | 2 | aidata-nlp-sql, datatools |
| **Productivity & Collaboration** | 2 | smartwork-cli, prompt_beautifier |
| **Skill Management** | 1 | d-skills |
| **Security** | 1 | d-safe |

---

## Detailed Analysis by Skill

### 🔥 HIGH PRIORITY - Adopt Immediately

#### 1. **cooper** (v2.4.2)
| Field | Description |
|-------|-------------|
| **What it is** | Complete integration with Cooper (DiDi's internal knowledge management platform) |
| **What it does** | 10 sub-skills: team space management, knowledge base management, document operations, spreadsheet operations, file management, search, tags, comments, collaborators, recent resources |
| **Installation** | `d-skills add cooper` or `npx d-skills@latest add cooper` |
| **Sub-skills** | cooper-shared, cooper-knowledge, cooper-sheet, cooper-space, cooper-doc |
| **Key Features** | Create/edit documents, manage knowledge bases, upload/download files, search content, manage tags/collaborators, read/write spreadsheets |
| **Use Cases** | Document creation, file organization, team collaboration, knowledge management |
| **How to leverage** | ✅ **ESSENTIAL** - We already have Cooper MCP but this skill adds higher-level abstractions and workflows. Can improve our `cooper` skill. |

**Comparison with our MCP:**
- Our `cooper` MCP: Low-level API calls
- This skill: High-level workflows, automatic routing, sub-skill management

---

#### 2. **cooper-mcp-helper**
| Field | Description |
|-------|-------------|
| **What it is** | Helper for configuring and calling Cooper MCP in Codex, Claude Code, Gemini CLI (without mcporter) |
| **What it does** | Parses Cooper/Shimo document links, extracts resourceId/knowledgeId/spaceId, maps to correct MCP parameters |
| **Tools** | readContent, getKnowledgeDirectory, createKnowledgePage, listKnowledgeBases |
| **Key Features** | Link parsing, automatic ID extraction, table document workflows, exception handling |
| **Use Cases** | Reading documents, browsing knowledge bases, searching content, creating pages |
| **How to leverage** | ✅ **USEFUL** - Complements our MCP with link parsing and ID extraction. Can integrate into our skill. |

---

#### 3. **cooper-image-read**
| Field | Description |
|-------|-------------|
| **What it is** | Extract and analyze images from Cooper documents |
| **What it does** | "Read document → Extract image URLs → Download locally → Read image" 4-step pipeline |
| **Problem it solves** | Cooper's readContent only returns text (images become URL placeholders). This skill actually shows Claude what's in the image. |
| **Workflow** | 5 steps: read document → extract URLs → download images → read images → summarize output |
| **Use Cases** | Viewing screenshots, diagrams, charts in Cooper docs |
| **How to leverage** | ✅ **VERY USEFUL** - Add image reading capability to our Cooper skill. Currently we can't see images in documents. |

---

### 🛠️ DATA & ANALYTICS

#### 4. **aidata-nlp-sql** (E小数 - Smart Data Query)
| Field | Description |
|-------|-------------|
| **What it is** | Natural language to SQL query tool for ERP data |
| **What it does** | Full workflow: trigger detection → workspace discovery → session creation → smart querying → ambiguity clarification |
| **Keywords** | "用E小数", "AIDATA问数", "E小数" |
| **Tools** | aidata_ds_list, aidata_start, aidata_question_trace, aidata_clarify_trace |
| **Key Features** | Natural language queries, automatic data source selection, session management, ambiguity handling, multi-step queries |
| **Use Cases** | "Query dataset 340722 last 7 days GMV by channel" - without opening Data platform |
| **How to leverage** | ⚠️ **SPECIFIC** - For ERP/data analysts. If we work with DiDi ERP data, very useful. Otherwise, backlog. |

---

#### 5. **datatools** (数易取数分析 - Official)
| Field | Description |
|-------|-------------|
| **What it is** | Unified data workbench integrating ShuYi MCP + Cooper MCP |
| **What it does** | 3 data sources, 7 tools converged into one skill: ShuYi (nl2data/sql2data/complex tables), Cooper online tables, local Excel |
| **Key Features** | Unified entry point, async task automation, parallel batch data pulling, platform-agnostic |
| **Use Cases** | Daily queries, SQL execution, report/complex table export, weekly report batch data, Cooper ledger reading, data analysis |
| **Scenario Examples** | "Query dataset 340722", "Execute this SQL", "Download complex table 485495", "Weekly report needs these 4 datasets" |
| **Target Users** | Operations, product, data analysts, finance, BP |
| **How to leverage** | ✅ **HIGH VALUE** - Unified data access skill. Can inspire our own data analysis workflows. |

---

### 📱 PRODUCTIVITY & COLLABORATION

#### 6. **smartwork-cli** (v0.8.20)
| Field | Description |
|-------|-------------|
| **What it is** | SmartWork workspace - D-Chat, Cooper, Calendar, Todo, Approvals |
| **What it does** | D-Chat message read/send, Cooper read/write, calendar, todo, approvals |
| **Hashtags** | #dchat #dc #d-chat #cooper #doc #calendar #todo #im #message |
| **Latest Features** | Download chat files, export chat lists, meeting capabilities (transcripts), knowledge download, @ service accounts, share calendar/todo |
| **How to leverage** | ✅ **USEFUL** - We have D-Chat MCP. This skill might have more features. Compare and potentially integrate. |

---

#### 7. **prompt_beautifier**
| Field | Description |
|-------|-------------|
| **What it is** | Convert natural language requirements into structured AI prompts |
| **What it does** | Optimizes natural language into structured prompts, supports auto-execution of optimized commands |
| **Workflow** | Requirement input → optimization rules → structured prompt → optional auto-execution |
| **Installation** | `d-skills add prompt_beautifier` |
| **How to leverage** | ⚠️ **BACKLOG** - Useful for prompt engineering but not critical. Can be inspiration for our prompt templates. |

---

### 🔧 SKILL MANAGEMENT

#### 8. **d-skills**
| Field | Description |
|-------|-------------|
| **What it is** | Skill package management tool for SkillsHub ecosystem |
| **What it does** | Find, install, upgrade, remove, publish skills. Extends Agent capabilities. |
| **Features** | Interactive skill search, install from internal repo/Git links/local paths, global or per-Agent install, list/remove/update skills, skill template initialization, publish to SkillsHub |
| **Installation** | `npx --registry=http://npm.intra.xiaojukeji.com d-skills@latest` |
| **Commands** | `d-skills find [query]`, `d-skills add <skill-name>`, `d-skills list`, `d-skills remove`, `d-skills upgrade` |
| **How to leverage** | ✅ **REFERENCE** - Study the CLI design for our own skill management system. Not for direct use (DiDi internal). |

---

### 🔒 SECURITY

#### 9. **d-safe** (Skill Safety Scanner v2.0)
| Field | Description |
|-------|-------------|
| **What it is** | Terminal Skill security scanner covering 21 detection dimensions |
| **What it does** | S01-S10 basic security, S11-S18 supply chain & LLM security, C01-C03 compliance checks, behavior chain prediction |
| **Scan Workflow** | Info collection → file structure risk analysis → S01-S18 deep scan → C01-C03 compliance → behavior chain prediction → risk assessment |
| **Output** | Security report with risk levels (CLEAN, Warning, Critical) |
| **Use Cases** | Scan skill before installation, detect data exfiltration risks, supply chain attacks, compliance violations |
| **How to leverage** | ✅ **INSPIRATION** - Study the security scan dimensions for our own skill validation. Good reference for security best practices. |

---

## Recommendations Summary

### 🔴 Adopt/Integrate Immediately

| Skill | Priority | Action |
|-------|----------|--------|
| **cooper** | High | Compare with our MCP, integrate high-level workflows |
| **cooper-image-read** | High | Add image reading to our Cooper skill |
| **cooper-mcp-helper** | Medium | Integrate link parsing and ID extraction |

### 🟡 Study & Learn From

| Skill | What to Learn |
|-------|---------------|
| **datatools** | Unified data access patterns, async workflows |
| **smartwork-cli** | Compare D-Chat features with our MCP |
| **d-skills** | CLI design patterns for skill management |
| **d-safe** | Security scan dimensions and best practices |

### 🟢 Backlog / Specific Use Cases

| Skill | When to Use |
|-------|-------------|
| **aidata-nlp-sql** | If working with DiDi ERP data |
| **prompt_beautifier** | For prompt engineering inspiration |

---

## Key Insights

### What DiDi's Skill Ecosystem Does Well:
1. **Hierarchical Skills** - `cooper` has sub-skills (cooper-knowledge, cooper-sheet, etc.)
2. **Automatic Routing** - Skills detect context and route to correct sub-skill
3. **Unified Interfaces** - `datatools` unifies 7 tools into 1 skill
4. **Link Parsing** - Automatic extraction of IDs from URLs
5. **Async Workflows** - Built-in polling and timeout control
6. **Security First** - Mandatory security scans before installation

### What We Can Improve:
1. **Add image reading** to our Cooper skill (like `cooper-image-read`)
2. **Implement sub-skill routing** for complex skills
3. **Add link parsing** for automatic ID extraction
4. **Create unified data skill** combining our SQL library + MCPs
5. **Implement security scanning** for our skills (reference `d-safe`)

---

## Next Steps

1. **Immediate**: Study `cooper-image-read` implementation, add to our skill
2. **Short-term**: Compare our `cooper` MCP with DiDi's `cooper` skill for feature gaps
3. **Medium-term**: Design unified data skill inspired by `datatools`
4. **Backlog**: Create security scan checklist based on `d-safe` dimensions

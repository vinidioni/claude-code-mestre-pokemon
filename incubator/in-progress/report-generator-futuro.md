# Project: Report Generator - Future Report Agent

> **Status:** ⚪ Not Started  
> **Start:** -  
> **End:** -

---

## 🎯 Context + Idea

**Motivation:** DCC currently has basic report workflows (`report-weekly`), but the vision is to build a complete report agent in the future that:

1. **Learns from historical data** - Analyze patterns in previous reports
2. **Has intelligent templates** - Suggest formats based on data type
3. **Integrates multiple sources** - Unite data from different MCPs (GitHub, Jira, database)
4. **Generates automatic insights** - Identify trends without manual input

**Reference:** Original agent documentation is preserved below as a basis for future development.

---

## 📋 Original Documentation (Reference)

### Agent Vision

Set of agents for generating various reports.

#### Planned Agents

**report-weekly**
Weekly development activities report.

**Usage:**
```bash
# Current week
claude "execute report-weekly"

# Specific week
claude "execute report-weekly --week=2024-W27"

# Last week
claude "execute report-weekly --week=last"
```

**Output:**
- Commits by category
- Active authors
- Most modified files
- Code metrics
- Identified risks
- Highlights and next steps

**Format:** `reports/YYYY-MM/weekly-report-WNN.md`

---

**report-project-health**
Overall project health analysis.

**Usage:**
```bash
claude "execute report-project-health"
```

**Metrics:**
- Test coverage
- Technical debt
- Outdated dependencies
- Cyclomatic complexity
- Code smells
- Code duplication

---

### Common Parameters

| Parameter | Type | Description |
|-----------|------|-----------|
| output_format | string | `markdown` or `json` |
| save | boolean | Save to file (default: true) |

---

### Report Structure

#### Weekly Report

```markdown
# 📊 Weekly Report

**Period:** 07/01/2024 to 07/07/2024

## 🎯 Executive Summary
- Commits: 42 (+15% vs last week)
- Authors: 5
- Merged PRs: 8

## 📈 Activities
### Commits by Category
- ✨ Features: 15
- 🐛 Bugfixes: 12
- 🔧 Refactorings: 10

### Main Contributors
1. @alice (12 commits)
2. @bob (10 commits)

## 🚨 Attention Points
- File `src/api.ts` modified 8 times
- 3 TODOs added

## 🎯 Highlights
- New feature X delivered
- Module Y refactoring completed
```

---

## 🚀 Next Steps (When Starting)

### Phase 1: Requirements Analysis
- [ ] Study existing reports (in `reports/` when available)
- [ ] Understand team needs
- [ ] Define base templates

### Phase 2: Learning Design
- [ ] How will the agent learn from previous reports?
- [ ] What patterns to identify automatically?
- [ ] How to suggest insights?

### Phase 3: Implementation
- [ ] Create base workflow
- [ ] Implement data analysis
- [ ] Add insight generation
- [ ] Test with real data

### Phase 4: Integration
- [ ] Document in `agents/report-generator/README.md`
- [ ] Add to catalog
- [ ] Create usage examples

---

## 📚 References

- **Original location:** `agents/report-generator/README.md` (removed in favor of this record)
- **Existing workflow:** `.claude/workflows/reports/report-weekly.yaml`
- **Reports folder:** `reports/`

---

## 🧠 Notes

This project was moved from `agents/` to `dev/active/` because it represents a **future vision**, not a current implementation. Documentation was preserved to serve as a basis when development is started.

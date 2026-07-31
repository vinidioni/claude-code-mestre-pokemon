# SkillsHub DiDi - Documentation

> **SkillsHub** is DiDi's internal platform for AI skill discovery and usage.
> URL: https://skillshub.intra.xiaojukeji.com

## 📁 Structure

```
docs/skillshub/
├── README.md                      # This file
├── reference/                     # External references (DiDi SkillsHub)
│   ├── skillshub-didi-skills.md  # Analysis of SkillsHub skills
│   └── skillshub-data.json       # Raw analysis data
└── [skill-name]/                  # Specific skill documentation (if needed)
```

> **Note:** SkillsHub DiDi skills are **external references**, not skills created in DCC.
> For our own skills, see `.claude/skills/`.

## 🔍 SkillsHub DiDi Skills (Reference)

Documentation of internal DiDi skills for reference:

| Skill | Description | Category |
|-------|-------------|----------|
| `gattaran-coupon-batch-auto` | Batch coupon automation | Gattaran |
| `gattaran-coupon-creator` | Coupon creation | Gattaran |
| `gattaran-coupon-activity-batch` | Batch coupon activities | Gattaran |
| `gattaran-exp-diff` | Experiment comparison | Gattaran |
| `city-budget-rpo` | City budget management | Financial |
| `gtr-frontend-page-generator` | Frontend page generation | Development |
| `lowcode-material-creator` | Low-code material creation | Low-Code |
| `soda-ai-gattaran-workflow` | SODA AI workflow | Automation |

📄 See details at: [reference/skillshub-didi-skills.md](reference/skillshub-didi-skills.md)

## 🏠 Our Skills (DCC)

Skills created and maintained in DCC:

| Skill | Location | Description |
|-------|----------|-------------|
| `cooper` | `.claude/skills/cooper/` | Cooper integration (DiDi Docs) |
| `cooper-search` | `.claude/skills/cooper-search/` | Cooper search |
| `cooper-read` | `.claude/skills/cooper-read/` | Cooper document reading |
| `cooper-write` | `.claude/skills/cooper-write/` | Cooper document creation |
| `gattaran-viewer` | `.claude/skills/gattaran-viewer/` | Gattaran order viewer |

## 🛠️ Analysis Scripts

```bash
# Extract skills data from SkillsHub
python scripts/analysis/fetch-skillshub.py
```

## 🔗 References

- [Our Skills](../../.claude/skills/)
- [Memory: Gattaran Context](../../.claude/memory/projects/gattaran-automation.md)
- [MCP Server Gattaran](../../mcp-servers/gattaran/)
- [SkillsHub DiDi](https://skillshub.intra.xiaojukeji.com)

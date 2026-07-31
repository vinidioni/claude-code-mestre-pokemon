---
name: dccrazy
description: DCCrazy toolkit management - onboarding, updates, and backup to Google Drive with configuration preservation
triggers:
  - dccrazy
  - atualizar dccrazy
  - atualiza dccrazy
  - dccrazy update
  - atualizar dcc
  - check updates
  - tem atualização
  - tem update
  - verificar atualização dcc
  - atualizar kit de ferramentas
  - update dccrazy
  - fazer backup
  - backup dccrazy
  - backup no drive
  - salvar no google drive
  - exportar dccrazy
  - salvar dcc
  - backup google drive
  - analyze the dcc folder
  - analyze the folder
  - dcc-first-run
  - dccrazy-first-run
  - first setup
  - configure dccrazy
  - dccrazy installation
---

# DCCrazy - Development Toolkit

Complete skill set for managing the DCCrazy toolkit: onboarding, updates, and backups.

## Overview

| Capability | Description | Key Scripts |
|------------|-------------|-------------|
| **Onboarding** | First-time setup and configuration | `.dccrazy-first-run` |
| **Updates** | Check and apply updates from GitHub | `check-updates.py` |
| **Backup** | Backup to Google Drive with manifest | `backup-to-drive.py` |

## Components

### Onboarding
Interactive first-time configuration:
- VS Code workspace setup
- 5 credential collection (GitHub, Cooper, D-Chat, Gattaran, Google)
- MCP automatic configuration
- System introduction

### Updates
Update flow from GitHub:
- Check for new versions
- Show CHANGELOG
- User approval required
- Automatic backup before updates
- Preserve local modifications

### Backup
Complete backup to Google Drive:
- Includes all workflows, skills, configurations
- Generates manifest with metadata
- Creates ZIP file
- Preserves exact structure

## Onboarding Flow

Triggered by `.dccrazy-first-run` file or user request:

### Step 1: Welcome
- Folder structure explanation
- VS Code pinning instructions

### Step 2: Credentials (5 Required)

| Credential | Purpose | Source |
|------------|---------|--------|
| GITHUB_TOKEN | GitHub access | github.com/settings/tokens |
| COOPER_TOKEN | DiDi Docs | mcphub.intra.xiaojukeji.com |
| DCHAT_TOKEN | Internal messaging | mcphub.intra.xiaojukeji.com |
| GATTARAN_TOKEN | Order management | mcphub.intra.xiaojukeji.com |
| GOOGLE_CLIENT_SECRET | Google Workspace | console.cloud.google.com |

### Step 3: Configuration
Creates:
- `.env` file with all credentials
- `.mcp.json` with integrations
- Validates configuration

### Step 4: Completion
- Welcome message
- First steps guide
- Update explanation

## Update Flow

### Step 1: Check
```
Fetch from remote → Compare versions → Read CHANGELOG
```

Shows:
- Current vs new version
- New commits
- Summary of changes
- Files that will be affected

### Step 2: Approval
**NO changes without user confirmation**

### Step 3: Backup
Creates backup in `.backup/update_YYYYMMDD_HHMMSS/`

### Step 4: Analysis

| Situation | Action | Notification |
|-----------|--------|--------------|
| Official file, NOT modified | ✅ Updates | Silent |
| Official file, user modified | ⏸️ Keeps | "⚠️ Preserved: [file]" |
| New in official repo | ➕ Adds | "✅ New: [file]" |
| Removed from official | 🚫 Keeps local | "⚠️ Kept local: [file]" |

### Step 5: Apply
Updates only non-modified files

### Step 6: Report
```
✅ Update Complete!

📊 Summary:
• Files updated: 12
• New files: 3
• Files preserved: 2
• Removed from official: 1

🔄 Rollback: .backup/update_YYYYMMDD_HHMMSS/
```

## Backup Contents

| Directory | Description |
|-----------|-------------|
| `.claude/workflows/` | All YAML agents |
| `.claude/skills/` | Modular skills |
| `.claude/hooks/` | Automation |
| `.claude/memory/` | Persistent memories |
| `.env`, `.mcp.json` | Configurations |
| `sql-library/` | Queries |
| `reports/` | Generated reports |
| `incubator/` | Dev docs |
| `scripts/` | Utilities |
| `templates/` | Project templates |

**Ignored:**
- `node_modules/` - Dependencies
- `.git/` - Git history
- `__pycache__/` - Python cache
- `.backup/` - Local backups

## Usage Examples

### Onboarding
```
User: "Analyze the DCC folder on my desktop and trigger dcc-first-run"
→ Starts full onboarding flow
```

### Check Updates
```
User: "Check for updates"
→ python scripts/maintenance/check-updates.py
```

### Apply Update
```
User: "Update DCCrazy"
→ Shows available updates → User approves → Applies updates
```

### Backup
```
User: "Backup DCCrazy"
→ python scripts/google/backup-to-drive.py
```

### Check Backup Status
```
User: "When was the last backup?"
→ Shows last backup info from manifest
```

## Backup Structure

```
My Drive/
└── DCCrazy_Backup/
    └── DCCrazy_Backup_20250727_143022.zip
```

### ZIP Contents
```
DCCrazy_Backup/
├── .claude/
│   ├── workflows/
│   ├── skills/
│   ├── hooks/
│   └── memory/
├── scripts/
├── sql-library/
├── reports/
├── incubator/
├── templates/
└── manifest.json
```

## Important Rules

### ✅ Updates DO:
- Update official skills/workflows
- Update agents, scripts, MCPs
- Add new files from official repo
- Make backup before changes

### ❌ Updates DON'T:
- Change folder structure
- Delete user files
- Overwrite user modifications
- Change `sql-library/queries/`
- Change `incubator/` or `reports/`
- Change `temp-storage/`

## Restoration

To restore from backup:

1. **Download ZIP from Drive**
2. **Extract** to Desktop:
   ```bash
   # Windows
   Extract to C:\Users\%USERNAME%\Desktop\
   
   # macOS/Linux
   unzip DCCrazy_Backup_*.zip -d ~/Desktop/
   ```
3. **Rename** folder to `dcc`
4. **Open** in Claude Code
5. **Verify**:
   ```bash
   node scripts/verify-setup.js
   ```

## Best Practices

### When to Backup:
- **Weekly** - Security routine
- **Before updates** - Remember to backup first
- **After big changes** - New workflows, important skills
- **Before reformatting** - Preserve all work

### Update Frequency:
- Check monthly or when issues reported
- Review CHANGELOG before approving
- Local modifications are preserved automatically

## Tips

- Backups keep last 5 versions automatically
- Modified files won't be overwritten - merge manually if needed
- Always read CHANGELOG before updating
- Update only applies with explicit user approval
- Backup size is typically 15-50MB (varies by content)

## Troubleshooting

### "Not a git repository"
**Solution:** DCCrazy must be cloned from GitHub, not downloaded as ZIP.

### Conflicts in pull
If conflicts occur, script aborts and restores backup.

### Modify updated file
If you want to override your modified version with official:
```bash
# Compare versions
git diff HEAD .backup/update_YYYYMMDD_HHMMSS/path/to/file

# If want official version
cp .backup/update_YYYYMMDD_HHMMSS/path/to/file path/to/file
```

### Insufficient Drive space
- Check manifest size before backup
- Clean old backups first
- Clean `temp-storage/` if needed

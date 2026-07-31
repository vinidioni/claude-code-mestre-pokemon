---
name: dccrazyUpdater
description: Update DCCrazy from GitHub repository preserving user modifications
triggers:
  - update dccrazy
  - dccrazy update
  - check for updates
  - check updates
  - dccrazy update
---

# Skill: DCCrazy Updater

## When to Use

When you want to:
- **Check for updates** to DCCrazy on GitHub
- **Update the toolkit** (workflows, skills, scripts, agents, MCPs)
- **Sync with the latest version** preserving your local modifications

## What is DCCrazy

**DCCrazy** is the DCC toolkit - workflows, skills, scripts and utilities maintained in the GitHub repository. This skill allows you to update your local copy without losing your customizations.

## Update Flow

### Step 1: Check for Updates

The system:
1. Fetches updates from remote (`git fetch`)
2. Compares local version vs. remote version
3. Reads the `CHANGELOG.md` from the official repository
4. Shows the user:
   - Current version vs. new version
   - List of new commits
   - Summary of changes

### Step 2: User Approval

**BEFORE any changes**, the system asks:

```
📦 Update Available

Current version: 1.0.0
New version: 1.1.0
Commits behind: 5

📝 Main changes:
• feat: new documentation skill
• fix: fix in code review workflow
• feat: new reports agent

📁 Files that will be affected:
• skills/doc-generator/SKILL.md (new)
• workflows/agents/code-review.yaml (updated)
• scripts/backup.py (updated)

⚠️  Your modified files will be preserved:
• skills/cooper/SKILL.md (you edited - won't be updated)

Do you want to proceed with the update? (y/n)
```

**Without explicit approval, NO changes are made.**

### Step 3: Automatic Backup

If approved:
1. Creates backup in `.backup/update_YYYYMMDD_HHMMSS/`
2. Copies all files that will be modified
3. Preserves current state for rollback if necessary

### Step 4: File Analysis

The system classifies each file:

| Situation | Action | Notification |
|----------|--------|-------------|
| Official file exists, user did NOT modify | ✅ Updates | Silent |
| Official file exists, user modified | ⏸️ Doesn't update | "⚠️ [file]: you modified - not updated" |
| File is NEW in official repo | ➕ Adds | "✅ New: [file] added" |
| File was removed from official repo | 🚫 Keeps local | "⚠️ [file]: removed from official, kept local" |

**How it detects modifications:**
- Compares hash of local file with hash of file in last official release
- If different → user modified
- If equal → can update

### Step 5: Apply Updates

Executes changes:
1. Updates non-modified files
2. Adds new files
3. NEVER removes files
4. NEVER changes folder structure

### Step 6: Final Report

```
✅ Update Complete!

📊 Summary:
• Files updated: 12
• New files: 3
• Files preserved (you modified): 2
  - skills/cooper/SKILL.md
  - workflows/agents/my-workflow.yaml
• Files removed from official (kept local): 1
  - skills/old-skill/SKILL.md

⚠️  Recommended Actions:
For the files you modified, consider reviewing the updates:
  git diff HEAD .backup/update_20250731_143022/skills/cooper/SKILL.md

🔄 Rollback available at:
  .backup/update_20250731_143022/

📚 New features:
  Read the full CHANGELOG: docs/CHANGELOG.md
```

## Important Rules

### ✅ WHAT THE UPDATE DOES:
- Updates official skills (that you didn't modify)
- Updates official workflows
- Updates agents
- Updates scripts
- Updates MCP servers
- Adds new files from official repo
- Makes backup before any changes

### ❌ WHAT THE UPDATE DOESN'T DO:
- **NEVER** changes folder structure
- **NEVER** deletes user files
- **NEVER** overwrites user modifications
- **NEVER** changes files in `sql-library/queries/`
- **NEVER** changes files in `incubator/`
- **NEVER** changes files in `reports/`
- **NEVER** changes `temp-storage/`

### 🔒 GUARANTEED PRESERVATION:
If you modified any system file, it **won't be updated** automatically. You will be notified and can:
1. Keep your version (default)
2. View diff and apply manually
3. Overwrite with official version (if desired)

## Activation Commands

```
"Update DCCrazy"
"Check for DCC updates"
"Is there an update for DCCrazy?"
"Check available updates"
"Toolkit update"
```

## Equivalent Command

```bash
python scripts/maintenance/check-updates.py
```

## Troubleshooting

### "Not a git repository"
```
❌ This directory is not a git repository.
```
**Solution:** DCCrazy needs to have been cloned from GitHub (`git clone`), not downloaded as ZIP.

### Conflicts in pull
If there are conflicts, the script aborts and restores the backup.

### Modified file not updated
If you want to update a file you modified:
```bash
# Compare versions
git diff HEAD .backup/update_YYYYMMDD_HHMMSS/path/to/file

# If you want to overwrite with official
cp .backup/update_YYYYMMDD_HHMMSS/path/to/file path/to/file
```

## Notes

- Backups are saved in `.backup/update_YYYYMMDD_HHMMSS/`
- Only the last 5 backups are kept automatically
- Always read the CHANGELOG before updating
- Updates are only applied with explicit user approval

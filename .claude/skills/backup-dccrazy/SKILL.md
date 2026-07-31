---
name: backupDccrazy
description: Backup DCCrazy to Google Drive with complete manifest and structure preservation
---

# Skill: Backup DCCrazy

## When to Use

When you want to:
- **Backup DCCrazy** to Google Drive
- **Create a security copy** of the local installation
- **Sync with the cloud** for access from other devices
- **Export data** before an update or reformatting

## What is Backed Up

The backup includes **everything**, preserving the exact structure:

| Content | Description |
|---------|-------------|
| **Workflows** | `.claude/workflows/` - All YAML agents |
| **Skills** | `.claude/skills/` - Modular skills and documentation |
| **Hooks** | `.claude/hooks/` - Automation and security |
| **Memory** | `.claude/memory/` - Persistent memories |
| **Configurations** | `.env`, `.mcp.json`, `settings.local.json` |
| **SQL Library** | `sql-library/` - Queries and encyclopedia |
| **Reports** | `reports/` - Generated reports |
| **Dev Docs** | `incubator/` - Development documentation |
| **Scripts** | `scripts/` - Python utilities |
| **Templates** | `templates/` - Project templates |

**Automatically ignored:**
- `node_modules/` - Dependencies (can be reinstalled)
- `.git/` - Git history (preserved in clone)
- `__pycache__/` - Python cache
- `.backup/` - Previous local backups

## Basic Usage

### Full backup
```
"backup dccrazy"
"backup to google drive"
"save dcc to drive"
"export data"
```

### Check last backup
```
"when was the last backup"
"backup status"
"backup manifest"
```

## Features

- ✅ **Generates complete manifest** with date, version and content
- ✅ **Lists all directories and files** with sizes
- ✅ **Creates ZIP file** for easy upload
- ✅ **Calculates total space** that will be used
- ✅ **Clear instructions** for manual upload or MCP
- ✅ **Preserves exact structure** of DCCrazy

## Equivalent Command

```bash
python scripts/google/backup-to-drive.py
```

## Backup Process

1. **Generates manifest** with metadata:
   - Date and time of backup
   - DCCrazy version
   - Installation path
   - Directory list
   - File list with sizes
   - Total calculated space

2. **Creates ZIP file**:
   - Name: `DCCrazy_Backup_YYYYMMDD_HHMMSS.zip`
   - Efficient compression
   - Excludes unnecessary files

3. **Upload instructions**:
   - If Google Workspace MCP is configured: automatic backup
   - If not: step-by-step manual upload instructions

## Manifest Structure

```json
{
  "backup_date": "2026-07-27T14:30:00",
  "version": "1.0",
  "dccastanho_path": "/Users/name/Desktop/dcc",
  "contents": {
    "directories": 45,
    "files": 320,
    "total_size_mb": 15.5
  }
}
```

## Location in Drive

Backup is saved in:
```
My Drive/
└── DCCrazy_Backup/
    └── DCCrazy_Backup_20250727_143022.zip
```

## Backup Restoration

To restore from a backup:

1. **Download the ZIP from Drive**
2. **Extract** to Desktop:
   ```bash
   # Windows
   Extract to C:\Users\%USERNAME%\Desktop\
   
   # macOS/Linux
   unzip DCCrazy_Backup_*.zip -d ~/Desktop/
   ```
3. **Rename** the extracted folder to `dcc`
4. **Open Claude Code** in the folder
5. **Verify installation**:
   ```bash
   node scripts/verify-setup.js
   ```

## Troubleshooting

### "Google Workspace MCP not configured"
**Solution:** The backup creates the ZIP locally and provides instructions for manual upload.

To configure automated MCP:
1. See `docs/guides/google-workspace.md`
2. Configure OAuth on Google Cloud
3. Update `.mcp.json`

### "Insufficient space in Drive"
**Check:**
- Backup size in manifest
- Available space in Drive
- Clean old backups if necessary

### "Error creating ZIP"
**Possible causes:**
- Write permissions in directory
- Very large files
- Insufficient disk space

**Solution:**
```bash
# Check available space
df -h .  # macOS/Linux
dir      # Windows

# Clean temp-storage/ if necessary
python scripts/maintenance/cleanup-temp.py --execute
```

## Best Practices

### When to backup:
- **Weekly** - Security routine
- **Before updates** - Remember python scripts/maintenance/check-updates.py
- **After big changes** - New workflows, important skills
- **Before reformatting** - Preserve all work

### Backup organization in Drive:
```
DCCrazy_Backup/
├── 2026-07-01/           # Month backups
│   ├── DCCrazy_Backup_20260701_090000.zip
│   └── DCCrazy_Backup_20260715_143022.zip
├── 2026-06/              # Old backups
└── latest -> symlink     # Link to latest (optional)
```

## Next Steps After Backup

```bash
# Check created backup
ls -la .backup/

# View manifest
cat .backup/manifest.json

# Confirm in Google Drive (if MCP configured)
"list files in drive"
```

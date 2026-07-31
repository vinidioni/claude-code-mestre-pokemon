# Backup DCCrazy - Advanced

## Manual Script Execution

For more control or automation:

```bash
# Standard backup
python scripts/google/backup-to-drive.py

# From root directory
python scripts/google/backup-to-drive.py
```

## Backup Automation

### Cron/Linux - Weekly Backup

```bash
# Edit crontab
crontab -e

# Backup every Monday at 9am
0 9 * * 1 cd ~/Desktop/dcc && python scripts/google/backup-to-drive.py > /tmp/dcc-backup.log 2>&1
```

### Windows Task Scheduler

1. Open `Task Scheduler`
2. Create task: `DCCrazy Weekly Backup`
3. Trigger: Weekly, Monday, 09:00
4. Action: Start program
5. Configuration:
   - Program: `python`
   - Arguments: `scripts/google/backup-to-drive.py`
   - Start in: `C:\Users\%USERNAME%\Desktop\dcc`

### Automation Script (Shell)

```bash
#!/bin/bash
# dcc-backup.sh - Put in cron

DCC_DIR="$HOME/Desktop/dcc"
LOG_FILE="/tmp/dcc-backup.log"

# Go to DCC directory
cd "$DCC_DIR" || exit 1

# Execute backup
python scripts/google/backup-to-drive.py >> "$LOG_FILE" 2>&1

# Send notification (if D-Chat MCP configured)
if [ $? -eq 0 ]; then
    echo "✅ DCCrazy backup completed successfully"
    # Optional: notify via dchat
else
    echo "❌ DCCrazy backup failed"
fi
```

## Advanced Manifest Structure

The manifest can be extended to include:

```json
{
  "backup_date": "2026-07-27T14:30:00",
  "version": "1.0",
  "dccastanho_path": "/Users/name/Desktop/dcc",
  "environment": {
    "node_version": "20.11.0",
    "python_version": "3.11.4",
    "claude_version": "0.2.29"
  },
  "contents": {
    "directories": 48,
    "files": 342,
    "total_size_mb": 18.5,
    "breakdown": {
      ".claude/": "5.2 MB",
      "scripts/": "1.8 MB",
      "sql-library/": "8.5 MB",
      "docs/": "2.1 MB",
      "templates/": "0.9 MB"
    }
  },
  "mcp_servers": ["cooper", "dchat", "gattaran"],
  "last_query": "2026-07-27T10:00:00"
}
```

## Selective Restoration

Sometimes you don't need to restore everything:

### Restore only skills:
```bash
# Extract only skills from ZIP
unzip DCCrazy_Backup_*.zip "*/.claude/skills/*" -d ~/Desktop/dcc-temp/

# Copy to current installation
cp -r ~/Desktop/dcc-temp/.claude/skills/* ~/.claude/skills/
```

### Restore only queries:
```bash
unzip DCCrazy_Backup_*.zip "*/sql-library/*" -d ~/Desktop/dcc-temp/
cp -r ~/Desktop/dcc-temp/sql-library/* ~/Desktop/dcc/sql-library/
```

### Restore only configurations:
```bash
unzip DCCrazy_Backup_*.zip "*/.env" "*/.mcp.json" -d ~/Desktop/dcc-temp/
cp ~/Desktop/dcc-temp/.env ~/Desktop/dcc/
cp ~/Desktop/dcc-temp/.mcp.json ~/Desktop/dcc/
```

## Incremental Backup (Advanced)

For faster backups, incremental backup can be implemented:

```python
# scripts/advanced/incremental-backup.py

import hashlib
import json
from pathlib import Path

def get_file_hash(filepath):
    """Calculate file hash to detect changes"""
    return hashlib.md5(open(filepath, 'rb').read()).hexdigest()

def incremental_backup():
    # Load previous manifest
    last_manifest = load_last_manifest()
    
    # Compare hashes
    changed_files = []
    for file in find_all_files():
        if get_file_hash(file) != last_manifest.get(file, {}).get('hash'):
            changed_files.append(file)
    
    # Backup only modified files
    create_incremental_zip(changed_files)
```

## Sync with Git

Backup is complementary to Git, not a replacement:

| Aspect | Git | ZIP Backup |
|---------|-----|------------|
| Purpose | Versioning | Complete snapshot |
| History | Complete | Only last N |
| Files | Source code | Everything (includes .env) |
| Recovery | Granular | Complete |

**Recommendation:**
```bash
# Git commit (code)
git add .
git commit -m "[backup] backup started"

# Local backup (everything including configs)
python scripts/google/backup-to-drive.py

# Commit after backup
git add .backup/
git commit -m "[backup] manifest updated"
```

## Retention Management

Keep only the last N backups to save space:

```bash
# Keep only last 5 backups
ls -t DCCrazy_Backup_*.zip | tail -n +6 | xargs rm

# Automated in backup-dccrazy
def cleanup_old_backups(backup_dir, keep=5):
    backups = sorted(backup_dir.glob("DCCrazy_Backup_*.zip"))
    for old_backup in backups[:-keep]:
        old_backup.unlink()
        print(f"Removed: {old_backup.name}")
```

## D-Chat Integration

Notify when backup completes:

```python
# At the end of backup-to-drive.py
from dchat_mcp_processor import send_message

send_message(
    user_id="your_user_id",
    message=f"✅ DCCrazy backup completed!\n📦 {total_size_mb} MB\n📅 {backup_date}"
)
```

## Integrity Verification

Verify if backup is intact:

```bash
# Test ZIP
unzip -t DCCrazy_Backup_*.zip

# Verify manifest
python -c "import json; json.load(open('.backup/manifest.json'))"

# Compare counts
ls -R ~/Desktop/dcc | wc -l
unzip -l DCCrazy_Backup_*.zip | wc -l
```

## Advanced Troubleshooting

### Corrupted ZIP
```bash
# Repair
cd ~/Desktop/dcc
zip -FF DCCrazy_Backup_20250727_143022.zip --out fixed.zip

# Or recreate
python scripts/google/backup-to-drive.py
```

### Windows Permissions
```powershell
# Run as Administrator if necessary
# Or adjust permissions
icacls "C:\Users\name\Desktop\dcc" /grant %username%:F
```

### Very Large Files
```bash
# Split into parts
zip -s 100m DCCrazy_Backup.zip --out split.zip

# Result:
# DCCrazy_Backup.zip
# DCCrazy_Backup.z01
# DCCrazy_Backup.z02
```

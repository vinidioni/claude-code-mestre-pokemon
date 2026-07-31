# Backup DCCrazy - Examples

## Example 1: Simple Backup

```
User: "backup dccrazy"

Claude: I'll create a complete backup of your DCCrazy.

📋 Generating backup manifest...
📁 Directories: 48
📄 Files: 342
📊 Total size: 18.5 MB

✅ Manifest saved: .backup/manifest.json

📦 Creating local backup: DCCrazy_Backup_20250727_143022.zip
✅ Backup created: C:\Users\name\Desktop\DCCrazy_Backup_20250727_143022.zip
📊 Size: 12.3 MB (compressed)

⚠️  Google Workspace MCP not configured

📤 Manual Upload:
   1. Open drive.google.com
   2. Create "DCCrazy_Backup" folder (if doesn't exist)
   3. Drag the ZIP to the folder
   4. Wait for upload to complete

💡 Tip: Configure MCP for automatic future backup.
   See: docs/guides/google-workspace.md
```

## Example 2: Check Last Backup

```
User: "when was the last backup"

Claude: I'll check the backup history.

📦 Backups found:

Local (.backup/):
├── 20250727_143022/     → 3 days ago
│   └── manifest.json
└── 20250720_090000/     → 10 days ago

ZIPs available:
├── DCCrazy_Backup_20250727_143022.zip (12.3 MB)
└── DCCrazy_Backup_20250720_090000.zip (11.8 MB)

💡 Recommendation: A weekly backup is ideal.
   Last backup was 3 days ago.
```

## Example 3: With MCP Configured

```
User: "backup to google drive"

Claude: I'll backup and send to your Drive.

📋 Generating manifest...
✅ Manifest: 342 files, 18.5 MB

📦 Compressing...
✅ ZIP created: 12.3 MB

🔄 Sending to Google Drive...
📁 Destination: DCCrazy_Backup/
⬆️  Uploading: DCCrazy_Backup_20250727_143022.zip
✅ Upload completed!

📋 Summary:
- File: DCCrazy_Backup_20250727_143022.zip
- Size: 12.3 MB
- Location: My Drive/DCCrazy_Backup/

🔗 View in Drive: drive.google.com/drive/u/0/my-drive
```

## Example 4: Backup Before Update

```
User: "backup before updating"

Claude: Excellent practice! I'll backup before the update.

💾 Creating security backup...
📋 Manifest: 342 files
📦 ZIP: 12.3 MB
✅ Backup created successfully!

📝 Note: Backup saved in .backup/update_20250727_backup/
   This backup will be kept during the update.

Can I proceed with the update now?
"yes"

[Proceeds with check-updates.py]
```

## Example 5: Error - No Space

```
User: "backup"

Claude: Trying to create backup...

❌ Error: Insufficient disk space
   Required: ~20 MB
   Available: 5 MB

💡 Solutions:
1. Clean temporary files:
   python scripts/maintenance/cleanup-temp.py --execute

2. Remove old local backups:
   ls -la .backup/
   rm -rf .backup/backup_2025*/

3. Free up disk space

Want to try cleaning temporary files first?
```

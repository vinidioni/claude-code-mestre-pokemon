# DCCrazy Updater - Examples

## Example 1: Check for Updates

```
User: "Is there an update for DCCrazy?"

Claude: I'll check if there are updates available.

🔍 Searching for updates...

📦 Update available for DCCrazy!
   Your version: a1b2c3d4
   Latest version: e5f6g7h8
   Commits behind: 3

📝 New commits:
   • feat: new reports workflow
   • fix: fix cooper skill
   • docs: update README

📁 Files that will be changed:
   • .claude/workflows/agents/report-agent.yaml
   • .claude/skills/cooper/SKILL.md
   • README.md

Do you want to update DCCrazy? (y/n):
```

## Example 2: Complete Update

```
User: "Update DCCrazy"

Claude: I'll check and update DCCrazy for you.

🔍 Searching for updates...

📦 Update available!
   Commits behind: 5

Do you want to update DCCrazy? (y/n): y

💾 Creating backup at: .backup/update_20250727_143022
  ✅ Backup: .env
  ✅ Backup: .mcp.json
  ✅ Backup: settings.local.json
   3 file(s) saved

⬇️  Updating repository...
  ✅ Repository updated

📦 Dependency changes detected!
Do you want to install updated dependencies? (y/n): y
📦 Installing Node.js dependencies...
  ✅ Node.js OK

🔄 Restoring local configurations...
  ✅ Restored: .env
  ✅ Restored: .mcp.json
  ✅ Restored: settings.local.json

============================================================
✅ DCC updated successfully!
============================================================

Next steps:
  • Verify everything works: node scripts/verify-setup.js
  • Read what's new: git log --oneline -10
  • Backup saved at: .backup/update_20250727_143022
```

## Example 3: Already Updated

```
User: "Check if there's an update"

Claude: I'll check for DCCrazy updates.

🔍 Searching for updates...

✅ Your DCCrazy is up to date!
   Version: e5f6g7h8
```

## Example 4: No Remote Configured

```
User: "Update dccrazy"

Claude: I'll try to update DCCrazy.

🔍 Searching for updates...

❌ No remote configured.
   Configure remote with: git remote add origin <url>

Can I help you configure the remote now?
```

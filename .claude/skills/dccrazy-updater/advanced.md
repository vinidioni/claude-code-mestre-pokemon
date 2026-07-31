# DCCrazy Updater - Advanced

## Understanding the Preservation System

### How Modification Detection Works

The updater compares the MD5 hash of each file with the version from the last official release:

```
File: skills/cooper/SKILL.md
├── Hash in official release: a1b2c3d4...
├── Local user hash:          e5f6g7h8...
└── Result: DIFFERENT → Preserve (don't update)
```

### Decision Flow

```
Does file exist in official repo?
├── NO → Keeps local (warns it was removed from official)
└── YES → Did user modify it?
    ├── YES → Preserves (warns it wasn't updated)
    └── NO → Updates normally
```

## Protected Files (Never Changed)

The updater NEVER touches:

```
sql-library/queries/     # User queries
incubator/               # Personal projects
reports/                 # Generated reports
temp-storage/            # Temporary files
.env                     # User credentials
.claude/memory/          # Personal memories (except templates)
```

## Merge Strategies

### When You Want to Apply an Update to a Modified File

#### Option 1: Overwrite (loses your modifications)
```bash
# After update, overwrite with official version
cp .backup/update_20250731_143022/skills/cooper/SKILL.md .claude/skills/cooper/SKILL.md
```

#### Option 2: Manual Merge (preserves your modifications)
```bash
# Compare versions
diff .backup/update_20250731_143022/skills/cooper/SKILL.md .claude/skills/cooper/SKILL.md

# Manually edit merging the changes
# Then mark as "official" for future updates:
# (copy official hash to a .dcc-hash file)
```

#### Option 3: Create Personal Copy
```bash
# Rename your modified version
mv .claude/skills/cooper/SKILL.md .claude/skills/cooper/SKILL.md.mine

# Copy the official one
mv .backup/update_20250731_143022/skills/cooper/SKILL.md .claude/skills/cooper/SKILL.md

# Now you have both versions
```

## Automation with Cron/Scheduler

### Linux/macOS (cron):
```bash
# Check for updates every Monday at 9am (check only, no apply)
0 9 * * 1 cd ~/Desktop/dcc && python scripts/maintenance/check-updates.py --check-only
```

### Windows (Task Scheduler):
```
Program: python
Arguments: scripts/maintenance/check-updates.py --check-only
Start in: C:\Users\%USERNAME%\Desktop\dcc
```

## Update Rollback

If something goes wrong after an update:

```bash
# 1. Identify the most recent backup
ls -la .backup/ | head -10

# 2. Restore specific files from backup
cp .backup/update_20250731_143022/.claude/skills/cooper/SKILL.md .claude/skills/cooper/

# 3. Or restore everything (CAUTION: loses recent modifications!)
# Backup current state first!
cp -r . .backup/emergency-backup-$(date +%Y%m%d-%H%M%S)

# 4. Restore from update backup
cp -r .backup/update_20250731_143022/* .
```

## Script Customization

### Additional Parameters (for future implementation):

```python
# Around line 300, main() function
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--check-only', action='store_true',
                   help='Only check, do not update')
parser.add_argument('--force', action='store_true',
                   help='Update without asking (use with caution)')
parser.add_argument('--preserve-all', action='store_true',
                   help='Never overwrite, even if not modified')
args = parser.parse_args()
```

## Tips for Official Repository Maintainers

### Before pushing updates:
1. Test on clean installation
2. Check if existing workflows weren't broken
3. Document breaking changes in `CHANGELOG.md`
4. Update version at the beginning of CHANGELOG

### Communicating breaking changes:
```bash
# Commit with breaking change tag
git commit -m "feat!: new configuration format

BREAKING CHANGE: .mcp.json now uses v2 format.
Run 'python scripts/migrate-mcp.py' after updating."
```

## CI/CD Integration

For repositories using DCCrazy as a template:

```yaml
# .github/workflows/check-dccrazy-updates.yml
name: Check DCCrazy Updates

on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9am

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for DCCrazy updates
        run: |
          git remote add upstream https://github.com/original/dccrazy.git
          git fetch upstream
          git log HEAD..upstream/main --oneline
```

## Advanced Troubleshooting

### Problem: File should have been updated but wasn't
```bash
# Check if file is in .gitignore
cat .gitignore | grep file-name

# Check current hash
md5sum .claude/skills/cooper/SKILL.md

# Compare with hash from last update backup
md5sum .backup/update_*/.claude/skills/cooper/SKILL.md
```

### Problem: Backup is corrupted
```bash
# List all available backups
ls -lt .backup/

# Use a previous backup
cp -r .backup/update_20250730_120000/.claude/skills/cooper .
```

### Problem: Want to ignore updates for a specific file
```bash
# Create a .dcc-ignore file at root
echo ".claude/skills/my-personal-skill/" >> .dcc-ignore
```

**Note:** The `.dcc-ignore` file is not natively supported yet, but can be implemented in the future.

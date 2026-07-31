# DCCrazy - Development Toolkit

**Unified skill** for managing the DCCrazy toolkit.

## Overview

This single skill provides all DCCrazy management functionality:

| Capability | Description | Scripts |
|------------|-------------|---------|
| 🚀 **Onboarding** | First-time setup and configuration | `.dccrazy-first-run` |
| 🔄 **Updates** | Check and apply updates from GitHub | `check-updates.py` |
| 💾 **Backup** | Backup to Google Drive with manifest | `backup-to-drive.py` |

## Activation Triggers

The skill activates when you mention:
- **Onboarding**: "analyze the dcc folder", "dcc-first-run", "configure dccrazy"
- **Updates**: "atualizar dccrazy", "check updates", "tem atualização"
- **Backup**: "fazer backup", "backup dccrazy", "salvar no google drive"

## Scripts

### Onboarding
```bash
python scripts/install/dccrazy-install.py
```

### Check Updates
```bash
python scripts/maintenance/check-updates.py
```

### Backup
```bash
python scripts/google/backup-to-drive.py
```

## Examples

```
"Analyze the DCC folder on my desktop"
"Update DCCrazy"
"Backup DCCrazy to Google Drive"
"Check for updates"
```

## Features

- ✅ Preserves local modifications during updates
- ✅ Automatic backup before updates
- ✅ Complete manifest with all metadata
- ✅ 5 required credentials: GitHub, Cooper, D-Chat, Gattaran, Google

## Related Documentation

- [SKILL.md](SKILL.md) - Full skill documentation
- [CLAUDE.md](../../../CLAUDE.md) - Project documentation

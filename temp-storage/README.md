# 🗄️ Temp Storage

Temporary storage for short-duration files and backups.

---

## 📁 Structure

```
temp-storage/
├── backup/              # Backups with 90-day retention
├── screenshots/         # Screenshots with 30-day retention
├── txt/                 # Analyses, page content, etc (30 days)
└── README.md           # This file
```

---

## 📋 Retention Rules

| Folder | Retention Period | Deletion |
|-------|------------------|----------|
| `backup/` | **90 days** | With user approval |
| `screenshots/` | **30 days** | Automatic |
| `txt/` | **30 days** | Automatic |
| Other files | **30 days** | Automatic |

---

## 🧹 Automatic Cleanup

To run cleanup of expired files:

```bash
# List expired files (without deleting)
claude workflow run cleanup-temp --list

# Execute cleanup (backups require confirmation)
claude workflow run cleanup-temp --execute
```

---

## 📝 What to Store in Each Folder

### `backup/`
- Backups of important files before modifications
- Configuration snapshots
- Temporary data exports

### `screenshots/`
- Screenshots for quick reference
- Visual evidence of analyses
- Dashboard or report prints

### `txt/`
- Temporary text analyses
- Copied page content
- Command logs or outputs
- Documentation drafts

---

## ⚠️ Important

- This folder is for **temporary storage only**
- Files are **automatically deleted** after the retention period
- **Do not store** important files here without permanent backup
- Backups in `backup/` folder require **manual approval** for deletion

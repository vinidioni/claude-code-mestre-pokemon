# 🛠️ Scripts

Utility scripts organized by functionality.

---

## 📁 Structure

```
scripts/
├── README.md              # This file
├── setup/                 # Installation and initial setup
│   ├── install.js
│   ├── validate.js
│   ├── verify-setup.js
│   ├── setup.ps1
│   └── setup.sh
├── auth/                  # Authentication and authorization
│   ├── auth-google.py
│   ├── auth-google-full.sh
│   ├── setup-google-auth.sh
│   └── test-google-mcp.sh
├── analysis/              # Data analysis and processing
│   ├── analyze_skill.py
│   ├── fetch-skillshub.py
│   └── test-skillshub.py
├── dchat/                 # DChat and messaging
│   ├── dchat_mcp_processor.py
│   └── dchat_summarizer.py
├── google/                # Google Workspace (backup, docs)
│   ├── backup-to-drive.py
│   └── generate-pdf-manual.py
├── maintenance/           # Repository maintenance
│   ├── check-updates.py
│   └── update-encyclopedia.py
├── install/               # Distributable project installer
│   └── dccrazy-install.py
└── utils/                 # Miscellaneous utilities
    └── fetch-intranet.py
```

---

## 📂 Categories

### `setup/` - Installation & Setup
Scripts for initial project setup and validation.

| Script | Purpose |
|--------|---------|
| `install.js` | Install infrastructure in new repo |
| `validate.js` | Validate installation |
| `verify-setup.js` | Verify setup is correct |
| `setup.ps1` | PowerShell setup script |
| `setup.sh` | Bash setup script |

### `auth/` - Authentication
Google Workspace and authentication scripts.

| Script | Purpose |
|--------|---------|
| `auth-google.py` | Google OAuth flow |
| `auth-google-full.sh` | Complete Google auth setup |
| `setup-google-auth.sh` | Configure Google auth |
| `test-google-mcp.sh` | Test Google MCP connection |

### `analysis/` - Data Analysis
Skills and data processing scripts.

| Script | Purpose |
|--------|---------|
| `analyze_skill.py` | Analyze Claude skills |
| `fetch-skillshub.py` | Fetch SkillsHub data |
| `test-skillshub.py` | Test SkillsHub integration |

### `dchat/` - DChat Integration
DiDi Chat automation and processing.

| Script | Purpose |
|--------|---------|
| `dchat_mcp_processor.py` | DChat MCP message processor |
| `dchat_summarizer.py` | Summarize DChat conversations |

### `google/` - Google Workspace
Google Drive and Docs automation.

| Script | Purpose |
|--------|---------|
| `backup-to-drive.py` | Backup files to Google Drive |
| `generate-pdf-manual.py` | Generate PDF manuals |

### `maintenance/` - Maintenance
Repository maintenance and updates.

| Script | Purpose |
|--------|---------|
| `check-updates.py` | Check for available updates |
| `update-encyclopedia.py` | Update table encyclopedia |

### `install/` - Distribution
Installer for distributing the infrastructure.

| Script | Purpose |
|--------|---------|
| `dccrazy-install.py` | Install DCCrazy in new repos |

### `utils/` - Utilities
Miscellaneous helper scripts.

| Script | Purpose |
|--------|---------|
| `fetch-intranet.py` | Fetch content from intranet |

---

## 🚀 Usage

### Run a Script

```bash
# Python scripts
python scripts/maintenance/check-updates.py

# Node.js scripts
node scripts/setup/validate.js

# Shell scripts
bash scripts/auth/setup-google-auth.sh
```

### Add a New Script

1. Choose the appropriate category folder
2. Use descriptive name in `kebab-case`
3. Add entry to the table in README.md
4. Include header documentation in the script

---

## 📝 Conventions

- **File names:** `kebab-case.extension`
- **Extensions:** `.py`, `.js`, `.sh`, `.ps1`
- **Documentation:** All scripts must have header comments
- **Language:** English for script names and comments

---

Last updated: 2026-07-23

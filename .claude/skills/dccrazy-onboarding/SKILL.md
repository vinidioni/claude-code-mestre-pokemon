---
name: dccrazyOnboarding
description: Interactive onboarding for first DCCrazy installation - guided credentials configuration and system introduction
triggers:
  - analyze the dcc folder on my desktop and trigger dcc-first-run
  - analyze the dcc folder
  - analyze the folder
  - trigger dcc-first-run
  - trigger dccrazy-first-run
  - dccrazy-first-run
  - first setup
  - configure dccrazy
  - dccrazy installation
---

# Skill: DCCrazy Onboarding

## When to Use

This skill is activated when the user requests:
- "Analyze the DCC folder on my desktop and trigger dcc-first-run"
- "Analyze the folder"
- "Configure DCCrazy"
- "First setup"

The file `.dccrazy-first-run` in the root indicates it's the first execution.

## Onboarding Flow

### Step 1: Detection
The system checks for the existence of `.dccrazy-first-run` after the user requests:
> "Analyze the DCC folder on my desktop and trigger dcc-first-run"

If the file is present, the full onboarding starts.

### Step 2: Welcome Message

```
🎉 Welcome to DCCrazy!

DCCrazy is an automation and productivity toolkit for Claude Code.
It includes ready-to-use workflows, specialized skills, integrations with
external services (GitHub, DiDi Docs, D-Chat, etc.) and tools to
organize your work.

📁 Folder Organization:

.claude/        → System brain (skills, workflows, configurations)
agents/         → Specialized agents documentation
docs/           → Guides and complete documentation
incubator/      → Projects in development (backlog and in-progress)
mcp-servers/    → Connectors with external services
reports/        → Generated reports (weekly, monthly, draft)
scripts/        → Tools and utilities
sql-library/    → SQL queries organized by category
templates/      → Base templates for new projects
temp-storage/   → Temporary files

🔧 How to Pin the Folder in VS Code:

To ensure DCCrazy works properly every time you open VS Code,
follow these steps:

1. Open VS Code
2. Click on File → Open Folder
3. Navigate to Desktop and select the "dcc" folder
4. Click on File → Save Workspace As...
5. Save as "DCCrazy" on your Desktop

Next time, open VS Code through the "DCCrazy.code-workspace" file
on your Desktop. This way, all DCC operations will be
automatically associated with this folder.
```

**Question:** "Did you understand how to pin the folder in VS Code? Need help with any step?"

If not understood, repeat the explanation with more details.

### Step 3: Credentials Explanation

```
🔐 Required Credentials Configuration

For DCCrazy to work fully, we need to configure 5
access credentials. They are stored locally in the
.env file (never sent to GitHub).

The 5 required credentials:

1. GITHUB_TOKEN          → GitHub access (repositories, issues, PRs)
2. COOPER_TOKEN          → Cooper access (DiDi documentation)
3. DCHAT_TOKEN           → D-Chat access (internal messages)
4. GATTARAN_TOKEN        → Gattaran access (order management)
5. GOOGLE_CLIENT_SECRET  → Google Workspace access (Gmail, Drive, Calendar)

It's not possible to use DCCrazy without these credentials configured.
I'll guide you to get each one, one at a time.

Press Enter when you're ready to start.
```

### Step 4: Credentials Collection (One by One)

#### 4.1 GitHub Token

```
📋 Credential 1 of 5: GitHub

What it is: Allows Claude to access GitHub repositories, create
issues, analyze PRs and manage code.

How to get it:
1. Go to https://github.com/settings/tokens
2. Click on "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Claude Code DCC")
4. Select scopes: repo, read:user, read:org
5. Click on "Generate token"
6. Copy the generated token (starts with ghp_)

⚠️  The token is only shown once! Copy it immediately.

Questions about how to get it? I can explain again.

Type "obtained" when you have the token, or paste the token directly:
```

**Validation:** Checks if it starts with `ghp_` or `github_pat_`

#### 4.2 Cooper Token (DiDi)

```
📋 Credential 2 of 5: Cooper (DiDi Docs)

What it is: Allows access to DiDi internal documentation (Docs2).

How to get it:
1. Go to https://mcphub.intra.xiaojukeji.com/
2. Login with your DiDi credentials
3. Find "Cooper" server in the list
4. Click on "访问令牌" (Access Token)
5. Click on "创建令牌" (Create Token)
6. Copy the generated token

⚠️  Tip: If the token doesn't appear, disable the page translator -
    the error only appears in the original language.

This credential is required for DiDi employees.

Type "obtained" when you have the token, or paste the token directly:
```

#### 4.3 D-Chat Token (DiDi)

```
📋 Credential 3 of 5: D-Chat

What it is: Allows sending and receiving messages through D-Chat (DiDi
internal communication system) via Claude Code.

How to get it:
1. Go to https://mcphub.intra.xiaojukeji.com/
2. Find "D-Chat" server in the list
3. Click on "访问令牌" (Access Token)
4. Click on "创建令牌" (Create Token)
5. Copy the generated token

Note: You also need to have SmartWork CLI installed for
D-Chat to work fully.

Type "obtained" when you have the token, or paste the token directly:
```

#### 4.4 Gattaran Token (DiDi)

```
📋 Credential 4 of 5: Gattaran

What it is: Allows querying and managing orders in the Gattaran system
(DiDi Food Order Management).

How to get it:
1. Go to https://mcphub.intra.xiaojukeji.com/
2. Find "Gattaran" server in the list
3. Click on "访问令牌" (Access Token)
4. Click on "创建令牌" (Create Token)
5. Copy the generated token

Type "obtained" when you have the token, or paste the token directly:
```

#### 4.5 Google Client Secret

```
📋 Credential 5 of 5: Google Workspace

What it is: Allows Claude to access Gmail, Google Calendar and
Google Drive from your Google account.

How to get it:
1. Go to https://console.cloud.google.com
2. Create a new project (or use an existing one)
3. Enable the necessary APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen (type: Desktop)
6. Download the JSON file (will be something like client_secret_xxx.json)
7. Open the file and copy the entire JSON content

The content should have this format:
{
  "installed": {
    "client_id": "...",
    "project_id": "...",
    "auth_uri": "...",
    "token_uri": "...",
    ...
  }
}

Type "obtained" when you have the JSON, or paste the complete content:
```

**Validation:** Checks if it's a valid JSON with Google structure

### Step 5: MCP Configuration

After all credentials are collected:

```
✅ All credentials collected!

Now I'll configure the MCP integrations automatically...
```

The system:
1. Creates the `.env` file with all credentials
2. Updates `.mcp.json` enabling the 5 integrations
3. Validates the configuration

### Step 6: Welcome and Update Explanation

```
🎉 Setup Complete!

Welcome to DCCrazy, [user name]!

Your environment is ready to use. Here's what you can do:

🚀 First Steps:
• /skill list              → Lists all available skills
• /workflow                → Runs automation workflows
• /dev-docs init [name]    → Starts a project with Dev Docs

🔄 DCCrazy Updates:

To keep your DCCrazy updated with the latest improvements:

1. Say: "Update DCCrazy" or "Check for updates"
2. The system checks the official repository on GitHub
3. Shows what changed (CHANGELOG)
4. Asks for your approval before applying
5. Updates only: skills, workflows, agents, scripts, MCPs
6. Never deletes your files or changes folder structure
7. Preserves your modifications (if you changed a skill, it's
   not overwritten, but you are notified about the update)

📚 Documentation:
• README.md                → Complete overview
• docs/guides/             → Detailed guides
• CLAUDE.md                → Complete technical documentation

✨ DCCrazy is ready to use!
```

### Step 7: Release

Removes the `.dccrazy-first-run` file and releases the user.

## If User Closes in the Middle

If the user closes VS Code during onboarding:
1. The `.dccrazy-first-run` file still exists
2. When reopening and typing the prompt again, onboarding restarts from the beginning
3. Credentials already saved in `.env` are preserved

## Official Activation Prompt

To start the configuration, say:
> **"Analyze the DCC folder on my desktop and trigger dcc-first-run"**

Alternatives that also work:
- "Analyze the folder"
- "Configure DCCrazy"
- "First DCCrazy setup"

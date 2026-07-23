# 🔐 Google Workspace MCP Configuration

This document guides you through configuring integration with Google Workspace (Gmail, Calendar, Drive).

## ✅ Configuration Status

```
[✅] Project created in Google Cloud Console
[✅] APIs enabled (Gmail, Calendar, Drive)
[✅] OAuth credentials created
[✅] Client secrets downloaded
[✅] MCP configuration updated
[✅] Initial authentication (COMPLETED - 2024-07-07)
[✅] Tokens saved and ready for use
```

## 📁 File Locations

- **Client Secrets:** `C:\Users\viniciuscastanho\.google\client_secret.json`
- **MCP Configuration:** `.mcp.json`
- **Access token:** Will be saved automatically after authentication

## 🚀 How to Authenticate

### Method 1: Via Claude Code (Recommended)

```bash
# Run in terminal
export GOOGLE_CLIENT_SECRETS="C:\Users\viniciuscastanho\.google\client_secret.json"
mcp-server-google-workspace
```

This will open a browser for you to authorize access.

### Method 2: Authentication Script

Run the script we created:

```bash
bash scripts/auth/setup-google-auth.sh
```

### Method 3: Manual

1. Run the MCP server:
```bash
mcp-server-google-workspace
```

2. Open the link displayed in the terminal (usually `http://localhost:3000`)

3. Log in with your Google account

4. Authorize permissions:
   - ✅ View and send emails (Gmail)
   - ✅ View and edit events (Calendar)
   - ✅ View and manage files (Drive)

5. The token will be saved automatically

## 🔧 Required Permissions

The MCP will request access to:

| Service | Permission | Usage |
|---------|-----------|-------|
| Gmail | `https://www.googleapis.com/auth/gmail.modify` | Read and send emails |
| Calendar | `https://www.googleapis.com/auth/calendar` | Read and create events |
| Drive | `https://www.googleapis.com/auth/drive.file` | Read and write files |

## 🧪 Testing the Connection

After authenticating, test with:

```bash
# List emails (last 5)
claude "list my last 5 emails"

# Create event
claude "create an event in my calendar tomorrow at 2pm called 'DCC Meeting'"

# Save report to Drive
claude "save the report reports/2024-07/weekly-report.md to my Drive in the 'Reports' folder"
```

## 📋 Available Workflows

Once configured, you can use:

### Send Report by Email
```bash
claude "execute send-report-email --to=client@example.com --report=reports/2024-07/weekly-report.md"
```

### Create Review Event
```bash
claude "execute schedule-review --date=2024-07-15 --time=10:00"
```

### Backup to Drive
```bash
claude "execute backup-reports --folder=DCC-Reports"
```

## 🐛 Troubleshooting

### Error: "Token expired"
```bash
# Renew the token
rm ~/.config/google/mcp-token.json
mcp-server-google-workspace
```

### Error: "Invalid client"
- Check if `client_secret.json` is in the correct path
- Confirm you downloaded the correct file (Desktop App, not Web)

### Error: "Access denied"
- Check if APIs are enabled in Google Cloud Console
- Confirm you added your email as a "Test user" in OAuth consent screen

### Error: "Redirect URI mismatch"
- In Google Cloud Console, go to Credentials > OAuth 2.0 Client IDs
- Add `http://localhost:3000/oauth2callback` in "Authorized redirect URIs"

## 🔒 Security

- **Never commit** the `client_secret.json`
- **Never commit** access tokens
- Files are already in `.gitignore`
- Tokens expire after 7 days (requires re-authentication)

## 📚 Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [MCP Google Workspace Docs](https://github.com/modelcontextprotocol/servers/tree/main/src/google-workspace)
- [Gmail API Docs](https://developers.google.com/gmail/api/guides)
- [Calendar API Docs](https://developers.google.com/calendar/api/guides/overview)

---

**Last updated:** 2024-07-07  
**MCP Version:** 1.0.0

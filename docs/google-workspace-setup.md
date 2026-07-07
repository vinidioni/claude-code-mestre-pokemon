# 🔐 Configuração do Google Workspace MCP

Este documento guia a configuração da integração com Google Workspace (Gmail, Calendar, Drive).

## ✅ Status da Configuração

```
[✅] Projeto criado no Google Cloud Console
[✅] APIs ativadas (Gmail, Calendar, Drive)
[✅] Credenciais OAuth criadas
[✅] Client secrets baixado
[✅] Configuração do MCP atualizada
[✅] Autenticação inicial (CONCLUÍDA - 2024-07-07)
[✅] Tokens salvos e prontos para uso
```

## 📁 Local dos Arquivos

- **Client Secrets:** `C:\Users\viniciuscastanho\.google\client_secret.json`
- **Configuração MCP:** `.mcp.json`
- **Token de acesso:** Será salvo automaticamente após autenticação

## 🚀 Como Autenticar

### Método 1: Via Claude Code (Recomendado)

```bash
# Execute no terminal
export GOOGLE_CLIENT_SECRETS="C:\Users\viniciuscastanho\.google\client_secret.json"
mcp-server-google-workspace
```

Isso abrirá um navegador para você autorizar o acesso.

### Método 2: Script de Autenticação

Execute o script que criamos:

```bash
bash scripts/setup-google-auth.sh
```

### Método 3: Manual

1. Execute o servidor MCP:
```bash
mcp-server-google-workspace
```

2. Abra o link exibido no terminal (geralmente `http://localhost:3000`)

3. Faça login com sua conta Google

4. Autorize as permissões:
   - ✅ Ver e enviar emails (Gmail)
   - ✅ Ver e editar eventos (Calendar)
   - ✅ Ver e gerenciar arquivos (Drive)

5. O token será salvo automaticamente

## 🔧 Permissões Necessárias

O MCP solicitará acesso a:

| Serviço | Permissão | Uso |
|---------|-----------|-----|
| Gmail | `https://www.googleapis.com/auth/gmail.modify` | Ler e enviar emails |
| Calendar | `https://www.googleapis.com/auth/calendar` | Ler e criar eventos |
| Drive | `https://www.googleapis.com/auth/drive.file` | Ler e escrever arquivos |

## 🧪 Testando a Conexão

Após autenticar, teste com:

```bash
# Listar emails (últimos 5)
claude "liste meus últimos 5 emails"

# Criar evento
claude "crie um evento na minha agenda amanhã às 14h chamado 'Reunião DCC'"

# Salvar relatório no Drive
claude "salve o relatório reports/2024-07/weekly-report.md no meu Drive na pasta 'Relatórios'"
```

## 📋 Workflows Disponíveis

Após configurado, você pode usar:

### Enviar Relatório por Email
```bash
claude "execute send-report-email --to=cliente@example.com --report=reports/2024-07/weekly-report.md"
```

### Criar Evento de Review
```bash
claude "execute schedule-review --date=2024-07-15 --time=10:00"
```

### Backup no Drive
```bash
claude "execute backup-reports --folder=Relatórios-DCC"
```

## 🐛 Troubleshooting

### Erro: "Token expired"
```bash
# Renove o token
rm ~/.config/google/mcp-token.json
mcp-server-google-workspace
```

### Erro: "Invalid client"
- Verifique se `client_secret.json` está no caminho correto
- Confirme que baixou o arquivo correto (Desktop App, não Web)

### Erro: "Access denied"
- Verifique se as APIs estão ativadas no Google Cloud Console
- Confirme que adicionou seu email como "Test user" no OAuth consent screen

### Erro: "Redirect URI mismatch"
- No Google Cloud Console, vá em Credentials > OAuth 2.0 Client IDs
- Adicione `http://localhost:3000/oauth2callback` em "Authorized redirect URIs"

## 🔒 Segurança

- **Nunca commite** o `client_secret.json`
- **Nunca commite** tokens de acesso
- Os arquivos já estão no `.gitignore`
- Tokens expiram após 7 dias (requer reautenticação)

## 📚 Recursos

- [Google Cloud Console](https://console.cloud.google.com/)
- [MCP Google Workspace Docs](https://github.com/modelcontextprotocol/servers/tree/main/src/google-workspace)
- [Gmail API Docs](https://developers.google.com/gmail/api/guides)
- [Calendar API Docs](https://developers.google.com/calendar/api/guides/overview)

---

**Última atualização:** 2024-07-07  
**Versão MCP:** 1.0.0

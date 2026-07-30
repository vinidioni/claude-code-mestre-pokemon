# Skill: dchat-notify

## Descrição
Envia notificações formatadas para canais e grupos no D-Chat, com templates comuns e mentions.

## Quando Usar
- Quando o usuário quer notificar um canal/grupo
- Keywords: "notificar", "avisa no canal", "alerta time", "notifica equipe", "avisar grupo"

## Ferramentas MCP Disponíveis

### send_message
Envia notificação formatada para canal.

**Parâmetros:**
- `target_type` (string): "group" | "channel"
- `target` (string): nome do canal/grupo
- `message` (string): conteúdo da notificação
- `format` (string): "markdown" recomendado para notificações
- `mentions` (array, opcional): lista de usernames para mention

**Exemplo:**
```json
{
  "target_type": "group",
  "target": "SSI AI Initiatives",
  "message": "🚀 **Deploy Concluído**\n\nVersão 2.5.0 em produção.\nChangelog: [link]",
  "format": "markdown",
  "mentions": ["maurojunior", "joao.silva"]
}
```

## Templates de Notificação

### Deploy
```markdown
🚀 **Deploy Concluído**

- Versão: {version}
- Ambiente: {environment}
- Status: ✅ Sucesso
- Link: {changelog_url}
```

### Alerta
```markdown
⚠️ **Alerta - {severity}**

{message}

Impacto: {impact}
Ação necessária: {action}
```

### Status
```markdown
📊 **Status Update**

{tittle}: {status}

Detalhes: {details}
```

## Uso

### Notificar time
```
Usuário: "Notifica o time de AI que o projeto foi aprovado"
→ send_message com target="SSI AI Initiatives", message formatada
```

### Alerta com mention
```
Usuário: "Avisa no grupo Engenharia que tem incidente e menciona o João"
→ send_message com mentions=["joao.silva"]
```

### Atualização de status
```
Usuário: "Manda status no canal geral sobre o backup"
→ Usa template Status
```

## Dicas
- Canais são grupos públicos listados em `list_chats`
- Mentions usam @username e geram notificação push
- Markdown suporta: **bold**, *italic*, `code`, [links](url)
- Emojis são recomendados para visibilidade

## Integração
- Combina com `dchat-send`: Notificar canal + mensagem direta
- Combina com `backup-dccrazy`: Notificar após backup
- Combina com `dccrazy-updater`: Avisar sobre atualizações

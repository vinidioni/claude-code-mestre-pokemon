# Exemplos - D-Chat Notify

## Cenário 1: Notificação de Deploy

```
Usuário: "Notifica o time de Engenharia que o deploy foi concluído"

Ação:
→ Skill: dchat-notify
→ Tool: send_message (template Deploy)
→ Mensagem:
  "🚀 **Deploy Concluído**

  - Versão: 2.5.0
  - Ambiente: Produção
  - Status: ✅ Sucesso
  - Changelog: [ver mais]"
```

## Cenário 2: Alerta com Mention

```
Usuário: "Avisa no canal geral que tem incidente e menciona o João e a Maria"

Ação:
→ Skill: dchat-notify
→ Tool: send_message
→ Params:
  {
    "target": "Geral",
    "message": "⚠️ **Incidente Detectado**\n\nAPI de pagamentos fora do ar.",
    "mentions": ["joao.silva", "maria.oliveira"]
  }
```

## Cenário 3: Status de Backup

```
Usuário: "Notifica o time que o backup foi concluído"

Ação:
→ Skill: dchat-notify (combinado com backup-dccrazy)
→ Mensagem:
  "📊 **Backup Concluído**

  - Tamanho: 18.5 MB
  - Data: 2026-07-28
  - Destino: Google Drive
  - Status: ✅ Sucesso"
```

## Cenário 4: Atualização de Projeto

```
Usuário: "Manda no canal de AI que o projeto foi aprovado pelo comitê"

Ação:
→ Skill: dchat-notify
→ Mensagem:
  "🎉 **Projeto Aprovado!**

  O comitê aprovou o projeto 'AI Assistant'.
  Próximos passos na reunião de amanhã às 10h."
```

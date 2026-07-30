# Skill: dchat-send

## Descrição
Envia mensagens diretas para usuários ou grupos no D-Chat (DiDi's internal messaging).

## Quando Usar
- Quando o usuário quer enviar mensagem para alguém
- Keywords: "manda mensagem", "enviar mensagem", "manda no chat", "dchat", "mandar msg"

## Ferramentas MCP Disponíveis

### send_message
Envia mensagem para usuário ou grupo.

**Parâmetros:**
- `target_type` (string): "user" | "group"
- `target` (string): username ou nome do grupo
- `message` (string): conteúdo da mensagem
- `format` (string, opcional): "text" | "markdown" (padrão: "text")

**Exemplo:**
```json
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Reunião adiada para 15h",
  "format": "text"
}
```

## Uso

### Enviar para usuário
```
Usuário: "Manda mensagem pro João dizendo que o relatório está pronto"
→ send_message com target="joao.silva", message="Relatório está pronto"
```

### Enviar para grupo
```
Usuário: "Avisa no grupo 'Engenharia' que o deploy foi cancelado"
→ send_message com target_type="group", target="Engenharia", message="..."
```

### Com formatação
```
Usuário: "Manda mensagem formatada para o time"
→ send_message com format="markdown", message="## Alerta\nDeploy cancelado"
```

## Dicas
- Usernames geralmente são `nome.sobrenome` ou `firstname`
- Nomes de grupo são case-insensitive
- Mensagens longas são automaticamente divididas
- Rate limit: 10 mensagens/minuto

## Integração
- Combina com `cooper-write`: Enviar link de documento criado
- Combina com `gattaran-viewer`: Notificar sobre status de order

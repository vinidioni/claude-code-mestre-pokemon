# Exemplos - D-Chat Search

## Cenário 1: Busca Simples

```
Usuário: "Procura no chat 'SSI AI' mensagens sobre 'reunião'"

Ação:
→ Skill: dchat-search
→ Tool: search_messages
→ Params:
  {
    "target_type": "group",
    "target": "SSI AI Initiatives",
    "query": "reunião",
    "limit": 10
  }

Resultado:
"Encontradas 5 mensagens:

1. 2026-07-25 14:30 - @maurojunior
   'A reunião foi remarcada para terça'

2. 2026-07-25 14:35 - @joao.silva
   'Ok, vou atualizar o calendar'"
```

## Cenário 2: Busca com Data

```
Usuário: "Busca mensagens do João sobre o projeto desde semana passada"

Ação:
→ Skill: dchat-search
→ Params:
  {
    "target_type": "user",
    "target": "joao.silva",
    "query": "projeto",
    "since": "2026-07-21T00:00:00Z"
  }
```

## Cenário 3: Histórico Recente

```
Usuário: "Pega as últimas 20 mensagens do grupo Engenharia"

Ação:
→ Skill: dchat-search
→ Tool: get_messages
→ Params:
  {
    "target_type": "group",
    "target": "Engenharia",
    "limit": 20
  }
```

## Cenário 4: Listar Chats

```
Usuário: "Quais chats eu tenho disponível?"

Ação:
→ Skill: dchat-search
→ Tool: list_chats

Resultado:
"Chats disponíveis:
- SSI AI Initiatives (grupo)
- Engenharia (grupo)
- maurojunior (user)
- joao.silva (user)"
```

## Cenário 5: Busca Global

```
Usuário: "Procura em todos os chats mensagens sobre 'deploy ontem'"

Ação:
→ Skill: dchat-search
→ Tool: search_messages (sem target)
→ Params:
  {
    "query": "deploy",
    "since": "2026-07-27T00:00:00Z"
  }
```

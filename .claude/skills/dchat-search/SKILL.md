# Skill: dchat-search

## Descrição
Busca mensagens no histórico do D-Chat por texto, data, usuário ou canal.

## Quando Usar
- Quando o usuário quer encontrar mensagens antigas
- Keywords: "buscar mensagem", "procurar no chat", "histórico dchat", "mensagens antigas", "achar conversa"

## Ferramentas MCP Disponíveis

### search_messages
Busca mensagens por texto com filtros.

**Parâmetros:**
- `target_type` (string): "user" | "group"
- `target` (string): username ou nome do grupo (opcional para busca global)
- `query` (string): termo de busca
- `since` (string, opcional): data ISO (ex: "2026-07-20T00:00:00Z")
- `until` (string, opcional): data ISO
- `limit` (number, opcional): máximo de resultados (padrão: 20)

**Exemplo:**
```json
{
  "target_type": "group",
  "target": "SSI AI Initiatives",
  "query": "reunião",
  "since": "2026-07-20T00:00:00Z",
  "limit": 10
}
```

### get_messages
Obtém mensagens recentes de um chat.

**Parâmetros:**
- `target_type` (string): "user" | "group"
- `target` (string): username ou nome do grupo
- `limit` (number, opcional): quantidade (padrão: 50)
- `before` (string, opcional): mensagem ID para paginação

### list_chats
Lista todos os chats disponíveis (cache 5 min).

## Uso

### Busca simples
```
Usuário: "Procura no chat 'AI' mensagens sobre 'meeting'"
→ search_messages com target="SSI AI Initiatives", query="meeting"
```

### Busca com data
```
Usuário: "Busca mensagens do João sobre o projeto desde semana passada"
→ search_messages com target="joao.silva", query="projeto", since="2026-07-21"
```

### Histórico recente
```
Usuário: "Pega as últimas mensagens do grupo Engenharia"
→ get_messages com target="Engenharia", limit=20
```

### Listar chats
```
Usuário: "Quais chats eu tenho disponível?"
→ list_chats
```

## Formato de Resultados

```markdown
Encontradas 5 mensagens:

**1. 2026-07-25 14:30 - @maurojunior**
> "A reunião foi remarcada para terça"

**2. 2026-07-25 14:35 - @joao.silva**
> "Ok, vou atualizar o calendar"
```

## Dicas
- Busca é case-insensitive e fuzzy
- Use datas ISO ou termos relativos ("ontem", "semana passada")
- Resultados são ordenados por mais recentes
- Cache de mensagens melhora performance em buscas repetidas

## Integração
- Combina com `dchat-send`: Responder a mensagem encontrada
- Combina com `dchat-notify`: Compartilhar resultado com time
- Combina com `cooper-write`: Salvar histórico como documento

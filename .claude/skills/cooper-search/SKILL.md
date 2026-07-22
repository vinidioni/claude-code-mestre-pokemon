# Skill: cooper-search

## Descrição
Busca documentos na plataforma Cooper (DiDi Documentation).

## Quando Usar
- Quando o usuário quer encontrar documentos no Cooper
- Quando precisa buscar informações na base de conhecimento da DiDi
- Keywords: "cooper", "buscar documento", "procurar no cooper", "docs didi"

## Ferramentas MCP Disponíveis

### cooper_search
Busca documentos por palavra-chave.

**Parâmetros:**
- `query` (string, obrigatório): Termo de busca
- `limit` (number, opcional): Número máximo de resultados (padrão: 10)

**Exemplo:**
```json
{
  "query": "onboarding processo",
  "limit": 5
}
```

### cooper_list_spaces
Lista espaços/workspaces disponíveis.

**Uso:**
- Para descobrir onde criar/documentar
- Para navegar na estrutura organizacional

## Exemplos de Uso

### Buscar documentos
```
Usuário: "Busca no Cooper sobre onboarding"
→ Chamar cooper_search com query="onboarding"
```

### Listar espaços
```
Usuário: "Quais espaços tenho no Cooper?"
→ Chamar cooper_list_spaces
```

## Dicas
- Use termos em inglês ou chinês se não encontrar em português
- A busca é fuzzy (encontra resultados parciais)
- Resultados incluem título, URL e snippet

# Exemplos - GitHub

## Cenário 1: Listar Issues Abertas

```
Usuário: "Quais issues abertas temos no projeto?"

Ação:
→ Skill: github
→ Tool: list_issues
→ Params:
  {
    "owner": "vinidioni",
    "repo": "dcc",
    "state": "open"
  }

Resultado:
"Issues abertas (3):

1. #42 - Atualizar documentação do Cooper
   Labels: documentation, enhancement
   Created: 2026-07-20

2. #38 - Bug no backup automático
   Labels: bug
   Created: 2026-07-18

3. #35 - Nova skill para SQL
   Labels: feature
   Created: 2026-07-15"
```

## Cenário 2: Criar Issue

```
Usuário: "Cria uma issue para implementar integração com GitLab"

Ação:
→ create_issue
→ Params:
  {
    "owner": "vinidioni",
    "repo": "dcc",
    "title": "Implementar integração com GitLab MCP",
    "body": "## Objetivo\nAdicionar suporte ao GitLab MCP...",
    "labels": ["enhancement", "mcp"]
  }

Resultado: ✅ Issue #45 criada
```

## Cenário 3: Ver Pull Requests

```
Usuário: "Mostra os PRs pendentes"

Ação:
→ list_pull_requests
→ Params:
  {
    "state": "open"
  }

Resultado:
"Pull Requests abertos (2):

1. #44 - Adicionar skill everything-search
   Autor: vinidioni
   Branch: feature/everything-search → main

2. #41 - Fix: Corrige bug no cooper-read
   Autor: vinidioni
   Branch: fix/cooper-read → main"
```

## Cenário 4: Buscar Repositórios

```
Usuário: "Procura repositórios de MCP servers populares"

Ação:
→ search_repositories
→ Params:
  {
    "query": "mcp server language:typescript stars:>100",
    "sort": "stars",
    "order": "desc"
  }

Resultado:
"Repositórios encontrados:
1. modelcontextprotocol/servers - ⭐ 15.2k
2. ..."
```

## Cenário 5: Ver Conteúdo de Arquivo

```
Usuário: "Mostra o conteúdo do README principal"

Ação:
→ get_file_contents
→ Params:
  {
    "path": "README.md",
    "branch": "main"
  }

Resultado: Conteúdo do README exibido
```

## Cenário 6: Criar Branch e PR

```
Usuário: "Cria um branch para a nova feature e abre PR"

Fluxo:
1. create_branch
   → branch_name="feature/new-skill",
   → from_branch="main"

2. push_files (se necessário)

3. create_pull_request
   → title="Add new skill for X"
   → body="Descrição..."
   → head="feature/new-skill"
   → base="main"

Resultado: PR #46 criada
```

## Cenário 7: Notificar Time sobre Issue

```
Usuário: "Verifica se tem issue crítica e notifica o time"

Fluxo:
1. github → list_issues com label="critical"
2. Se encontrar:
   → dchat-notify → Envia mensagem no grupo

Mensagem: "🚨 Issue crítica #47 aberta: [título]"
```

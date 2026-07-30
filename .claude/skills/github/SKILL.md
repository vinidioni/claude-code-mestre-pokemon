# Skill: github

## Descrição
Interage com GitHub API para repositórios, issues, pull requests, commits e mais.

## Quando Usar
- Quando precisa consultar ou gerenciar recursos do GitHub
- Keywords: "github", "repositório", "pull request", "issue", "commit", "branch", "release"

## Ferramentas MCP Disponíveis

### Repositórios
- `create_or_update_file` - Cria ou atualiza arquivo em repo
- `push_files` - Faz push de múltiplos arquivos
- `search_repositories` - Busca repositórios públicos
- `get_file_contents` - Obtém conteúdo de arquivo
- `list_branches` - Lista branches

### Issues
- `create_issue` - Cria nova issue
- `list_issues` - Lista issues (abertas/fechadas)
- `update_issue` - Atualiza issue existente
- `add_issue_comment` - Adiciona comentário
- `search_issues` - Busca issues

### Pull Requests
- `create_pull_request` - Cria novo PR
- `list_pull_requests` - Lista PRs
- `update_pull_request` - Atualiza PR
- `merge_pull_request` - Faz merge de PR
- `add_pull_request_comment` - Comenta em PR

### Commits & Code
- `list_commits` - Lista commits de branch
- `get_commit` - Detalhes de commit específico
- `create_branch` - Cria novo branch

## Uso

### Buscar repositório
```
Usuário: "Procura repositórios sobre 'machine learning' no GitHub"
→ search_repositories com query="machine learning"
```

### Listar issues
```
Usuário: "Quais issues abertas temos no repo dcc?"
→ list_issues com state="open"
```

### Criar issue
```
Usuário: "Cria uma issue para implementar o novo feature X"
→ create_issue com title e body
```

### Ver PRs
```
Usuário: "Mostra os pull requests pendentes"
→ list_pull_requests com state="open"
```

### Ver código
```
Usuário: "Mostra o conteúdo do README.md"
→ get_file_contents com path="README.md"
```

## Dicas

- **Repositório atual:** Usa `owner/repo` format (ex: `vinidioni/dcc`)
- **Filtros de issue:** `state=open|closed|all`, `labels=bug,feature`
- **Busca:** Use `search_repositories` para encontrar repos públicos
- **Autenticação:** Token já configurado no MCP

## Limitações

- Acesso apenas a repos públicos ou privados onde o token tem permissão
- Rate limits da API GitHub aplicam-se
- Algumas operações requerem permissões específicas do token

## Integração

- Combina com `conventional-commits`: Criar commits padronizados
- Combina com `dchat-notify`: Notificar time sobre novos PRs/issues
- Combina com `everything-search`: Encontrar arquivos locais para commitar

## Troubleshooting

**"Bad credentials"**
- Verifique se GITHUB_TOKEN está configurado em `.env`
- Token precisa de permissões: `repo`, `issues`, `pull_requests`

**"Not found"**
- Repositório pode ser privado e token sem acesso
- Verifique nome do repo (owner/repo)

**"Rate limit exceeded"**
- Aguarde alguns minutos
- Considere usar token com rate limit maior

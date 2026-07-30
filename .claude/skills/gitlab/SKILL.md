# Skill: gitlab

## Descrição
Integração com GitLab API para repositórios, issues, merge requests, commits e pipelines.

## Quando Usar
- Quando precisa gerenciar projetos no GitLab
- Keywords: "gitlab", "repositório", "merge request", "mr", "issue", "commit", "pipeline", "projeto"

## Ferramentas MCP Disponíveis

### Projetos
- `get_project` - Obtém informações de um projeto
- `list_projects` - Lista projetos acessíveis
- `create_project` - Cria novo projeto
- `fork_project` - Faz fork de projeto

### Issues
- `list_issues` - Lista issues do projeto
- `create_issue` - Cria nova issue
- `update_issue` - Atualiza issue existente
- `close_issue` - Fecha issue

### Merge Requests
- `list_merge_requests` - Lista MRs
- `create_merge_request` - Cria novo MR
- `merge_merge_request` - Aprova e faz merge
- `get_merge_request` - Detalhes de MR

### Commits
- `list_commits` - Lista commits de branch
- `get_commit` - Detalhes de commit específico

## Uso

### Listar projetos
```
Usuário: "Lista meus projetos no GitLab"
→ list_projects
```

### Criar issue
```
Usuário: "Cria uma issue no projeto X sobre bug Y"
→ create_issue com title e description
```

### Merge Request
```
Usuário: "Cria um MR da branch feature para main"
→ create_merge_request
```

## Integração

- Combina com `github`: Comparar mesmo projeto nos dois
- Combina com `conventional-commits`: Commits padronizados
- Combina com `dchat-notify`: Notificar time sobre MRs

## Diferenças GitLab vs GitHub

| Feature | GitLab | GitHub |
|---------|--------|--------|
| MR/Issue | Merge Request | Pull Request |
| CI/CD | GitLab CI integrado | Actions |
| Container Registry | Built-in | Packages |
| Wiki | Built-in | Wiki (separado) |

## Configuração

### GitLab.com (público)
```env
GITLAB_TOKEN=seu-token-aqui
```

### GitLab Self-Hosted (interno)
```env
GITLAB_TOKEN=seu-token
GITLAB_API_URL=https://gitlab.interno.com/api/v4
```

## Troubleshooting

**"Unauthorized"**
- Verificar se GITLAB_TOKEN está configurado
- Token precisa ter scopes: `api`, `read_repository`, `write_repository`

**"Project not found"**
- Verificar nome do projeto (formato: `namespace/project-name`)
- Pode ser privado e token sem acesso

**GitLab interno DiDi?**
- Verificar URL da API interna em `GITLAB_API_URL`
- Pode requerer VPN ou acesso interno

## Limitações

- Free tier tem rate limits
- Algumas operações requerem permissões de maintainer/owner
- GitLab interno (se existir) pode ter endpoints diferentes

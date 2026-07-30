# Exemplos - GitLab

## Cenário 1: Listar Projetos

```
Usuário: "Lista meus projetos no GitLab"

Ação:
→ Skill: gitlab
→ Tool: list_projects

Resultado:
"Projetos GitLab (5):

1. 🚀 meu-usuario/project-api
   Descrição: API REST para serviço X
   Última atividade: 2 dias atrás

2. 📱 meu-usuario/app-mobile
   Descrição: Aplicativo mobile React Native
   Última atividade: 1 semana atrás

3. 🌐 meu-usuario/website
   Descrição: Site institucional
   Última atividade: 3 dias atrás"
```

## Cenário 2: Criar Issue

```
Usuário: "Cria uma issue no projeto-api sobre implementar autenticação"

Ação:
→ create_issue
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "title": "Implementar autenticação JWT",
    "description": "## Objetivo\nAdicionar autenticação JWT para endpoints protegidos.\n\n## Tarefas\n- [ ] Configurar middleware\n- [ ] Criar endpoint de login\n- [ ] Proteger rotas sensíveis",
    "labels": ["enhancement", "backend"]
  }

Resultado: ✅ Issue #42 criada
```

## Cenário 3: Criar Merge Request

```
Usuário: "Cria um MR da branch feature-auth para main no projeto-api"

Ação:
→ create_merge_request
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "source_branch": "feature-auth",
    "target_branch": "main",
    "title": "Adiciona autenticação JWT",
    "description": "Implementa autenticação JWT conforme issue #42"
  }

Resultado:
"✅ Merge Request !15 criado:
- Branch: feature-auth → main
- Status: Open (aguardando review)"
```

## Cenário 4: Listar Issues Abertas

```
Usuário: "Quais issues abertas temos no projeto?"

Ação:
→ list_issues
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "state": "opened"
  }

Resultado:
"Issues abertas (3):

1. #42 - Implementar autenticação JWT
   Labels: enhancement, backend
   Criada: 2 dias atrás

2. #38 - Corrigir bug no endpoint de usuários
   Labels: bug
   Criada: 1 semana atrás

3. #35 - Melhorar documentação da API
   Labels: documentation
   Criada: 2 semanas atrás"
```

## Cenário 5: Aprovar Merge Request

```
Usuário: "Aprova e faz merge do MR !15"

Ação:
→ merge_merge_request
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "merge_request_iid": 15
  }

Resultado:
"✅ Merge Request !15 mergeado com sucesso!
- Branch feature-auth foi mergeada em main
- Commit: a1b2c3d"
```

## Cenário 6: Ver Commits Recentes

```
Usuário: "Mostra os últimos commits da branch main"

Ação:
→ list_commits
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "ref_name": "main",
    "limit": 5
  }

Resultado:
"Commits recentes (5):

1. a1b2c3d - feat: adiciona autenticação JWT
   Autor: João Silva - 2 horas atrás

2. b2c3d4e - fix: corrige bug no login
   Autor: Maria Santos - 1 dia atrás

3. c3d4e5f - docs: atualiza README
   Autor: João Silva - 2 dias atrás

4. d4e5f6g - refactor: melhora estrutura
   Autor: Pedro Costa - 3 dias atrás

5. e5f6g7h - chore: atualiza dependências
   Autor: Maria Santos - 4 dias atrás"
```

## Cenário 7: GitLab vs GitHub (Mesmo Projeto)

```
Usuário: "Compara como está o projeto no GitLab vs GitHub"

Fluxo:
1. gitlab → list_issues (estado no GitLab)
2. github → list_issues (estado no GitHub)
3. Comparar:
   - Quantidade de issues
   - Status dos MRs/PRs
   - Atividade recente

Resultado:
"📊 Comparação GitLab vs GitHub:

GitLab:
- Issues: 12 abertas
- MRs: 3 pendentes
- Último commit: 2 horas atrás

GitHub:
- Issues: 8 abertas
- PRs: 5 pendentes
- Último commit: 5 horas atrás

💡 Nota: Projetos parecem não estar sincronizados"
```

## Cenário 8: Fechar Issue Resolvida

```
Usuário: "Fecha a issue #38 que já foi resolvida"

Ação:
→ close_issue
→ Params:
  {
    "project_id": "meu-usuario/project-api",
    "issue_iid": 38
  }

Resultado: ✅ Issue #38 fechada
```

## Cenário 9: Notificar Time sobre MR Pendente

```
Usuário: "Verifica MRs pendentes e notifica o time"

Fluxo:
1. gitlab → list_merge_requests
   → state: "opened"
   → project_id: "meu-usuario/project-api"

2. Identificar MRs antigos (>3 dias)

3. dchat-notify → Envia no grupo
   "⚠️ MRs aguardando review:
   - !15: Adiciona autenticação JWT (5 dias)
   - !12: Atualiza documentação (3 dias)"

Resultado: Time notificado
```

## Cenário 10: Criar Projeto Novo

```
Usuário: "Cria um novo projeto no GitLab chamado 'novo-servico'"

Ação:
→ create_project
→ Params:
  {
    "name": "novo-servico",
    "description": "Microserviço para processamento de pedidos",
    "visibility": "private",
    "initialize_with_readme": true
  }

Resultado:
"✅ Projeto criado:
- Nome: novo-servico
- URL: https://gitlab.com/meu-usuario/novo-servico
- Visibilidade: Privado
- README: Inicializado"
```

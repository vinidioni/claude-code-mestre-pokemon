---
name: finishing-a-development-branch
description: Finalizar uma branch de desenvolvimento - merge, cleanup e documentação
parent: superpowers
triggers:
  - finalizar branch
  - mergear branch
  - completar desenvolvimento
  - fechar branch
  - branch pronta
---

# Skill: Finishing a Development Branch

## Propósito

Finalizar uma branch de desenvolvimento de forma limpa: merge, cleanup e documentação adequada.

## Quando Usar

- Código foi revisado e aprovado
- Testes passam
- É hora de mergear para main
- Quando quer fechar um ciclo de desenvolvimento

## Checklist de Finalização

### Pré-Merge
```
- [ ] Revisão de código aprovada
- [ ] Todos comentários respondidos
- [ ] CI passando (build, test, lint)
- [ ] Branch atualizada com main (rebased ou merged)
- [ ] Sem conflitos
- [ ] Verificação final completa
```

### Merge
```
- [ ] Mensagem de commit clara
- [ ] Referência a issue/PR
- [ ] Descrição do que foi feito
```

### Pós-Merge
```
- [ ] Branch deletada (local e remote)
- [ ] Tag criada (se release)
- [ ] Changelog atualizado
- [ ] Documentação atualizada
- [ ] Notificação à equipe
```

## Mensagem de Merge

### Estrutura
```
[tipo] Descrição curta

Descrição detalhada do que foi implementado,
por que foi feito assim, e qual problema resolve.

Closes #[número da issue]

Co-Authored-By: Reviewer Name <reviewer@email.com>
```

### Exemplos

**Simples:**
```
[feat] Add user authentication

Implement JWT-based authentication with login/logout endpoints.
Includes password hashing and token refresh.

Closes #123
```

**Complexo:**
```
[feat] Implement caching layer with Redis

Add Redis-based caching to reduce database load:
- Cache GET requests for 5 minutes
- Invalidate on POST/PUT/DELETE
- Fallback to database if Redis unavailable

Benchmarks show 80% reduction in response time
for frequently accessed data.

Closes #456
Co-Authored-By: Maria Silva <maria@example.com>
```

## Processo de Merge

### Opção 1: Merge Commit
```bash
# Na branch principal
git checkout main
git pull origin main
git merge --no-ff feature/auth -m "[feat] Add user authentication

Implement JWT-based authentication.

Closes #123"
git push origin main
```

### Opção 2: Squash Merge
```bash
# Na branch principal
git checkout main
git pull origin main
git merge --squash feature/auth
git commit -m "[feat] Add user authentication

Implement JWT-based authentication.

Closes #123"
git push origin main
```

### Opção 3: Rebase + Fast-forward
```bash
# Na feature branch
git checkout feature/auth
git rebase main

# Resolver conflos se necessário
git rebase --continue

# Na main
git checkout main
git merge feature/auth --ff-only
git push origin main
```

## Cleanup

### Deletar Branch
```bash
# Local
git branch -d feature/auth

# Remote
git push origin --delete feature/auth
```

### Verificar Limpeza
```bash
# Branches locais mergeadas
git branch --merged

# Branches remotas
git branch -r --merged

# Limpar branches locais deletadas no remote
git fetch --prune
```

## Documentação

### Atualizar Changelog
```markdown
## [Unreleased]

### Added
- User authentication system with JWT (#123)
- Login/logout endpoints
- Password hashing with bcrypt
```

### Atualizar README (se necessário)
```markdown
## Authentication

The app uses JWT-based authentication. See [docs/auth.md](docs/auth.md) for details.
```

## Template de Finalização

```markdown
## ✅ Finalização: [Nome da Branch]

### Resumo
- **Branch:** feature/[nome]
- **Merge Commit:** abc123
- **Data:** YYYY-MM-DD

### O que foi implementado
[Resumo de 2-3 frases]

### Decisões técnicas importantes
- [Decisão 1]
- [Decisão 2]

### Próximos passos
- [ ] Monitorar métricas
- [ ] Coletar feedback
- [ ] [Outra ação]

### Arquivos alterados
```
- src/auth/
- tests/auth/
- docs/auth.md
```
```

## Comandos

```
"Finalizar branch"
"Mergear para main"
"Branch pronta"
"Completar desenvolvimento"
```

---

**Parte do:** Superpowers Framework
**Último passo do ciclo de desenvolvimento**

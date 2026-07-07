---
name: conventionalCommits
description: Padrão Conventional Commits para mensagens de commit estruturadas e automação
---

# Skill: Conventional Commits

## Quando Usar

Ao escrever mensagens de commit que:
- Precisam gerar changelogs automaticamente
- São analisadas por ferramentas de CI/CD
- Seguem padrões de projeto (Angular, ESLint, etc.)
- Facilitam code review e histórico

## Uso Básico

Formato da mensagem:
```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

## Tipos Comuns

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (espaços, ponto-e-vírgula) |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Adicionar ou corrigir testes |
| `chore` | Tarefas de manutenção |

## Exemplos Rápidos

```bash
feat: adicionar login com OAuth
git commit -m "feat(api): adicionar endpoint de autenticação"
git commit -m "fix: corrigir null pointer em UserService

corpo explicando o bug e a solução

Fixes #123"
```

## Recursos Adicionais

- Para exemplos detalhados: `@.claude/skills/conventional-commits/examples.md`
- Para casos avançados (breaking changes, scopes): `@.claude/skills/conventional-commits/advanced.md`
- Site oficial: https://www.conventionalcommits.org/

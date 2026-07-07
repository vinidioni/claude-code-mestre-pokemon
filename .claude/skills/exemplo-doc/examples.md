# Exemplos Detalhados: Skill de Exemplo

Este arquivo contém exemplos práticos de como criar skills modulares.

## Exemplo 1: Skill para Code Review

### SKILL.md
```markdown
---
name: codeReviewPatterns
description: Padrões e checklists para code review efetivo
---

# Skill: Code Review Patterns

## Quando Usar

Ao revisar código de pull requests ou fazer pair review.

## Uso Básico

Mencione "code review" ou "revisar código" para ativar.

## Checklist Rápido

- [ ] Código funciona como esperado
- [ ] Testes cobrem o novo comportamento
- [ ] Nomenclatura é clara
- [ ] Sem código duplicado
- [ ] Tratamento de erros adequado

## Recursos Adicionais

- Para checklists completos: `@examples.md`
```

### skill-rules.json
```json
{
  "skills": [
    {
      "name": "codeReviewPatterns",
      "triggers": ["code review", "revisar código", "pr review"],
      "filePatterns": ["**/*.pr", "**/pull_request*"],
      "description": "Padrões para code review",
      "priority": "high"
    }
  ]
}
```

## Exemplo 2: Skill para React

### SKILL.md
```markdown
---
name: reactComponentPatterns
description: Padrões para componentes React performáticos
---

# Skill: React Component Patterns

## Quando Usar

Ao criar ou refatorar componentes React.

## Uso Básico

Mencione "react", "componente", "tsx" para ativar.

## Regras Rápidas

1. Componentes são Server Components por padrão
2. Use 'use client' apenas quando necessário
3. Extraia lógica em hooks customizados
4. Props interfaces sempre definidas

## Recursos Adicionais

- Para padrões avançados: `@advanced.md`
```

## Padrões de Trigger

### Palavras-chave Efetivas

**Boas triggers:**
- Específicas: "conventional commit", "react hook", "api rest"
- Verbos + substantivos: "revisar código", "documentar api"
- Siglas: "PR", "REST", "CI/CD"

**Triggers a evitar:**
- Genéricas demais: "código", "fazer", "usar"
- Muito curtas: "go", "do", "run"
- Ambíguas: "check", "fix", "update"

## Padrões de FilePattern

```json
{
  "filePatterns": [
    "**/*.tsx",           // Arquivos TypeScript React
    "**/api/**",          // Pastas de API
    "**/.github/**",      // Configurações GitHub
    "**/test/**",         // Pastas de teste
    "**/*.{test,spec}.js" // Arquivos de teste
  ]
}
```

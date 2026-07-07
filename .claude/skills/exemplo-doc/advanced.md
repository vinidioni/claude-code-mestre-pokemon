# Casos Avançados: Skill de Exemplo

Este arquivo cobre edge cases e padrões avançados para skills modulares.

## Prioridade de Skills

Quando múltiplas skills podem ativar, use `priority` para ordenar:

```json
{
  "skills": [
    {
      "name": "criticalSecurity",
      "triggers": ["security", "vulnerabilidade"],
      "priority": "critical"
    },
    {
      "name": "generalCoding",
      "triggers": ["código", "programar"],
      "priority": "low"
    }
  ]
}
```

**Níveis de prioridade:** `critical` > `high` > `medium` > `low`

## Condições Complexas

### Múltiplos Triggers

Uma skill pode ter múltiplos triggers que funcionam em OR:

```json
{
  "name": "databasePatterns",
  "triggers": [
    "sql",
    "query",
    "database",
    "migration",
    "schema",
    " prisma "
  ]
}
```

### Combinação de Triggers e FilePatterns

Triggers e filePatterns funcionam em AND quando ambos presentes:

```json
{
  "name": "reactTesting",
  "triggers": ["testar", "testing"],
  "filePatterns": ["**/*.test.tsx", "**/*.spec.tsx"]
}
```

Esta skill só ativa se:
1. Uma das palavras-chave for mencionada, E
2. O arquivo aberto for um teste React

## Skills Condicionais

Para skills que não devem carregar automaticamente:

```json
{
  "name": "expensiveAnalysis",
  "triggers": ["análise profunda"],
  "filePatterns": [],
  "description": "Análise que consome muitos tokens",
  "priority": "low",
  "requireExplicitTrigger": true
}
```

Com `requireExplicitTrigger: true`, a skill só ativa quando explicitamente mencionada.

## Organização de Skills por Domínio

```
.claude/skills/
├── frontend/
│   ├── react/SKILL.md
│   ├── vue/SKILL.md
│   └── css/SKILL.md
├── backend/
│   ├── api-design/SKILL.md
│   ├── database/SKILL.md
│   └── security/SKILL.md
└── devops/
    ├── ci-cd/SKILL.md
    └── docker/SKILL.md
```

## Debugging de Ativação

Se uma skill não estiver ativando:

1. Verifique `skill-rules.json` - nome da skill corresponde?
2. Teste triggers - são específicos o suficiente?
3. Verifique filePatterns - padrão glob está correto?
4. Verifique prioridade - outra skill está sobrescrevendo?

## Schema de Validação

Opcional: crie `skill-rules-schema.json` para validação:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "triggers"],
        "properties": {
          "name": { "type": "string" },
          "triggers": {
            "type": "array",
            "items": { "type": "string" }
          },
          "filePatterns": {
            "type": "array",
            "items": { "type": "string" }
          },
          "priority": {
            "type": "string",
            "enum": ["critical", "high", "medium", "low"]
          }
        }
      }
    }
  }
}
```

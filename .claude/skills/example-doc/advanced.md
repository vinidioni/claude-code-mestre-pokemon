# Advanced Cases: Example Skill

This file covers edge cases and advanced patterns for modular skills.

## Skill Priority

When multiple skills can activate, use `priority` to order them:

```json
{
  "skills": [
    {
      "name": "criticalSecurity",
      "triggers": ["security", "vulnerability"],
      "priority": "critical"
    },
    {
      "name": "generalCoding",
      "triggers": ["code", "programming"],
      "priority": "low"
    }
  ]
}
```

**Priority levels:** `critical` > `high` > `medium` > `low`

## Complex Conditions

### Multiple Triggers

A skill can have multiple triggers that work in OR:

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

### Combining Triggers and FilePatterns

Triggers and filePatterns work in AND when both are present:

```json
{
  "name": "reactTesting",
  "triggers": ["test", "testing"],
  "filePatterns": ["**/*.test.tsx", "**/*.spec.tsx"]
}
```

This skill only activates if:
1. One of the keywords is mentioned, AND
2. The open file is a React test

## Conditional Skills

For skills that should not load automatically:

```json
{
  "name": "expensiveAnalysis",
  "triggers": ["deep analysis"],
  "filePatterns": [],
  "description": "Analysis that consumes many tokens",
  "priority": "low",
  "requireExplicitTrigger": true
}
```

With `requireExplicitTrigger: true`, the skill only activates when explicitly mentioned.

## Skill Organization by Domain

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

## Activation Debugging

If a skill is not activating:

1. Check `skill-rules.json` - does the skill name match?
2. Test triggers - are they specific enough?
3. Check filePatterns - is the glob pattern correct?
4. Check priority - is another skill overwriting it?

## Validation Schema

Optional: create `skill-rules-schema.json` for validation:

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

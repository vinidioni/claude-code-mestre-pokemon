# Detailed Examples: Example Skill

This file contains practical examples of how to create modular skills.

## Example 1: Skill for Code Review

### SKILL.md
```markdown
---
name: codeReviewPatterns
description: Patterns and checklists for effective code review
---

# Skill: Code Review Patterns

## When to Use

When reviewing pull request code or doing pair review.

## Basic Usage

Mention "code review" or "review code" to activate.

## Quick Checklist

- [ ] Code works as expected
- [ ] Tests cover the new behavior
- [ ] Naming is clear
- [ ] No duplicate code
- [ ] Proper error handling

## Additional Resources

- For complete checklists: `@examples.md`
```

### skill-rules.json
```json
{
  "skills": [
    {
      "name": "codeReviewPatterns",
      "triggers": ["code review", "review code", "pr review"],
      "filePatterns": ["**/*.pr", "**/pull_request*"],
      "description": "Patterns for code review",
      "priority": "high"
    }
  ]
}
```

## Example 2: Skill for React

### SKILL.md
```markdown
---
name: reactComponentPatterns
description: Patterns for performant React components
---

# Skill: React Component Patterns

## When to Use

When creating or refactoring React components.

## Basic Usage

Mention "react", "component", "tsx" to activate.

## Quick Rules

1. Components are Server Components by default
2. Use 'use client' only when necessary
3. Extract logic into custom hooks
4. Props interfaces always defined

## Additional Resources

- For advanced patterns: `@advanced.md`
```

## Trigger Patterns

### Effective Keywords

**Good triggers:**
- Specific: "conventional commit", "react hook", "rest api"
- Verbs + nouns: "review code", "document api"
- Acronyms: "PR", "REST", "CI/CD"

**Triggers to avoid:**
- Too generic: "code", "make", "use"
- Too short: "go", "do", "run"
- Ambiguous: "check", "fix", "update"

## FilePattern Patterns

```json
{
  "filePatterns": [
    "**/*.tsx",           // TypeScript React files
    "**/api/**",          // API folders
    "**/.github/**",      // GitHub configurations
    "**/test/**",         // Test folders
    "**/*.{test,spec}.js" // Test files
  ]
}
```

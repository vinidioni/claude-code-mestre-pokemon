---
name: exampleDoc
description: Skill template demonstrating the progressive disclosure pattern for documentation
---

# Skill: Example Documentation

## When to Use

Use this skill when you need:
- Example of how to structure a modular skill
- Template for creating new skills
- Reference for the progressive disclosure pattern

## Basic Usage

To activate this skill, mention:
```
"documentation example" or "how to create a skill"
```

The skill loads automatically when:
- You are in `.claude/skills/`
- You mention keywords like "example", "template", "skill"

## Skill Structure

```
example-doc/
├── SKILL.md          # This file (essential)
├── examples.md       # Detailed examples (@file to load)
└── advanced.md       # Advanced cases (@file to load)
```

## Principle: Progressive Disclosure

1. **SKILL.md** always loads - keep it short (<50 lines)
2. **examples.md** loads on demand - complete examples
3. **advanced.md** loads on demand - edge cases

## Creation Checklist

- [ ] SKILL.md with name, description, when to use, basic usage
- [ ] Rule added to `skill-rules.json`
- [ ] Tested automatic activation
- [ ] (Optional) examples.md with detailed cases
- [ ] (Optional) advanced.md with complex cases

## Additional Resources

- For detailed examples: `@.claude/skills/example-doc/examples.md`
- For advanced cases: `@.claude/skills/example-doc/advanced.md`
- To understand skill-rules: `@.claude/skills/skill-rules.json`

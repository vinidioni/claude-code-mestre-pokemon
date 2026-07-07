---
name: exemploDoc
description: Template de skill demonstrando o padrão de progressive disclosure para documentação
---

# Skill: Exemplo de Documentação

## Quando Usar

Use esta skill quando precisar de:
- Exemplo de como estruturar uma skill modular
- Template para criar novas skills
- Referência do padrão de progressive disclosure

## Uso Básico

Para ativar esta skill, mencione:
```
"exemplo de documentação" ou "como criar uma skill"
```

A skill carrega automaticamente quando:
- Você está em `.claude/skills/`
- Menciona palavras-chave como "exemplo", "template", "skill"

## Estrutura da Skill

```
exemplo-doc/
├── SKILL.md          # Este arquivo (essencial)
├── examples.md       # Exemplos detalhados (@file para carregar)
└── advanced.md       # Casos avançados (@file para carregar)
```

## Princípio: Progressive Disclosure

1. **SKILL.md** sempre carrega - mantenha curto (<50 linhas)
2. **examples.md** carrega sob demanda - exemplos completos
3. **advanced.md** carrega sob demanda - edge cases

## Checklist de Criação

- [ ] SKILL.md com nome, descrição, quando usar, uso básico
- [ ] Adicionada regra em `skill-rules.json`
- [ ] Testada ativação automática
- [ ] (Opcional) examples.md com casos detalhados
- [ ] (Opcional) advanced.md com casos complexos

## Recursos Adicionais

- Para exemplos detalhados: `@.claude/skills/exemplo-doc/examples.md`
- Para casos avançados: `@.claude/skills/exemplo-doc/advanced.md`
- Para entender skill-rules: `@.claude/skills/skill-rules.json`

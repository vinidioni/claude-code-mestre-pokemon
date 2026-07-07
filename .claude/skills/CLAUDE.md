# Skills Modulares - Documentação de Contexto

> Este CLAUDE.md carrega automaticamente quando você trabalha em `.claude/skills/`. Ele estende o CLAUDE.md raiz com detalhes específicos para criação de skills modulares.

## Propósito

Skills são capacidades especializadas que podem ser carregadas sob demanda. Diferente de workflows (que são processos completos), skills são recursos de conhecimento que o Claude consulta quando relevante.

## Estrutura de Pasta

```
.claude/skills/
├── CLAUDE.md              # Este arquivo
├── skill-rules.json       # Regras de ativação automática
└── [nome-da-skill]/       # Uma pasta por skill
    ├── SKILL.md           # Documentação principal (curta)
    ├── examples.md        # Exemplos de uso (carregado sob demanda)
    └── advanced.md        # Detalhes avançados (carregado sob demanda)
```

## Progressive Disclosure

As skills usam o padrão de "progressive disclosure":

1. **SKILL.md** (sempre carregado) - Contém apenas o essencial:
   - Nome e descrição
   - Quando usar
   - Uso básico
   - 2-3 exemplos simples

2. **examples.md** (carregado via @file) - Exemplos detalhados

3. **advanced.md** (carregado via @file) - Casos complexos e edge cases

## Convenções

### Nomenclatura
- **Pastas**: `kebab-case`
- **Nome da skill** (dentro do SKILL.md): camelCase descritivo
- **Arquivos**: `lowercase.md`

### SKILL.md Template

```markdown
---
name: nomeDaSkill
description: Uma linha descrevendo o propósito
---

# Nome da Skill

## Quando Usar
Descreva em 1-2 linhas quando esta skill é relevante.

## Uso Básico
```
Comando ou padrão básico
```

## Exemplos Rápidos

### Exemplo 1: Caso comum
```
Exemplo simples
```

### Exemplo 2: Variação
```
Outro exemplo simples
```

## Recursos Adicionais
- Para exemplos detalhados: `@examples.md`
- Para casos avançados: `@advanced.md`
```

## Como Criar uma Nova Skill

1. Crie a pasta `.claude/skills/[nome-da-skill]/`
2. Crie `SKILL.md` seguindo o template acima
3. Adicione `examples.md` se necessário
4. Adicione `advanced.md` para casos complexos
5. Atualize `skill-rules.json` com a regra de ativação
6. Teste a ativação automática

## skill-rules.json

Define quando cada skill deve ativar automaticamente:

```json
{
  "skills": [
    {
      "name": "nomeDaSkill",
      "triggers": [
        "palavra-chave-1",
        "palavra-chave-2"
      ],
      "filePatterns": ["*.ext"],
      "description": "Quando ativar esta skill"
    }
  ]
}
```

## Boas Práticas

1. **Mantenha SKILL.md curto** - Máximo 50 linhas
2. **Use exemplos concretos** - Código real, não pseudocódigo
3. **Divida em arquivos** - Não coloque tudo em SKILL.md
4. **Documente limitações** - O que a skill NÃO faz
5. **Teste triggers** - Verifique se ativação funciona

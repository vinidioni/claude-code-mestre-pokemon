# Memória do Repositório DCC

Este arquivo indexa todas as memórias persistentes do projeto.

> 📝 **Nota:** Memórias são armazenadas automaticamente em `.claude/memory/`
> Este arquivo serve como índice para referência rápida.

## Índice de Memórias

### Preferências do Usuário
*Memórias do tipo `user` serão listadas aqui*

### Decisões do Projeto
*Memórias do tipo `project` serão listadas aqui*

### Feedbacks
*Memórias do tipo `feedback` serão listadas aqui*

### Referências
*Memórias do tipo `reference` serão listadas aqui*

---

## Como Criar Memórias

Quando quiser que eu lembre de algo importante:

```
Você: Lembre-se de sempre usar [alguma coisa]
```

O Claude criará automaticamente um arquivo em `.claude/memory/`.

## Estrutura de Memórias

```markdown
---
name: nome-curto
description: Descrição em uma linha
metadata:
  type: user | project | feedback | reference
---

Conteúdo detalhado.

**Por que:** Explicação da importância

**Como aplicar:** Instruções práticas

Relacionado: [[outra-memoria]]
```

---

*Última atualização: 2024-07-07*

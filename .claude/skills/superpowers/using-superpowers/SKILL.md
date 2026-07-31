---
name: using-superpowers
description: Bootstrap do Superpowers - ativa todas as skills quando detecta desenvolvimento
parent: superpowers
triggers:
  - detecta desenvolvimento automatico
  - modo superpowers ativo
  - iniciando sessao superpowers
---

# Skill: Using Superpowers (Bootstrap)

## Propósito

Bootstrap do framework Superpowers. Ativada automaticamente quando detecta que você está começando a desenvolver algo.

## Comportamento

Quando você diz coisas como:
- "Vamos fazer..."
- "Preciso criar..."
- "Quero implementar..."

O Superpowers **pausa** e não pula direto para o código.

## O que acontece:

```
Usuário: "Vamos fazer um React todo list"

Claude (Superpowers Ativado):
🦸 Modo Superpowers Ativado!

Antes de escrevermos código, vamos entender o que você quer:

1. Que tipo de "todo list"? Simples ou avançada?
2. Backend próprio ou local storage?
3. Já existe projeto React ou começamos do zero?
4. Estilo preferido (Tailwind, Material-UI)?

[Vai para brainstorming → specification → plano → execução]
```

## Skills Disponíveis

| Skill | Uso | Trigger |
|-------|-----|---------|
| brainstorming | Explorar opções | "brainstorming" |
| specification | Criar spec | "vamos especificar" |
| writing-plans | Criar plano | "criar plano" |
| executing-plans | Implementar | "executar plano" |
| dispatching-parallel-agents | Paralelismo | "paralelizar" |
| test-driven-development | TDD | "tdd" |
| systematic-debugging | Debug | "debugar" |

## Ciclo Completo

```
[Detecta intenção de desenvolver]
           ↓
   [brainstorming] - Explorar opções
           ↓
   [specification] - Especificar em chunks
           ↓
   [writing-plans] - Criar plano de tasks
           ↓
   [executing-plans] - Implementar com TDD
           ↓
      [Subagentes] - Delegar quando útil
           ↓
       [Code Review] - Revisar código
           ↓
      [Finalização] - Entregar
```

## Para Desativar

Se quiser pular o processo Superpowers:
```
"Ignorar Superpowers, só quero codar"
"Modo direto"
```

## Para Ativar Manualmente

```
"Ativar Superpowers"
"Modo Superpowers"
```

---

**Parte do:** Superpowers Framework
**Esta skill:** Ativa automaticamente ou manualmente

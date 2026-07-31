---
name: specification
description: Criar especificações claras antes de codar - quebra em chunks digeríveis
parent: superpowers
triggers:
  - especificar
  - vamos especificar
  - preciso de uma spec
  - especificacao do projeto
  - documentar requisitos
---

# Skill: Specification

## Propósito

criar especificações de software que sejam:
- ✂️ **Digeríveis** - mostradas em pedaços pequenos o suficiente para revisar
- 📝 **Claras** - sem ambiguidade sobre o que deve ser construído
- ✅ **Aprováveis** - usuário revisa e aprova antes da implementação

## Metodologia

### Chunk Size Rule

> Nunca mostre mais conteúdo do que caberia em **um post de blog curto**.

Se você precisar rolar muito para ler, está muito grande. Quebre em partes menores.

### Estrutura da Especificação

```markdown
## 📋 Especificação: [Nome do Projeto]

### 🎯 Visão Geral (1-2 frases)
[Isto é um resumo que qualquer pessoa entende]

### 📦 Funcionalidades Principais
[3-7 features, não mais]

1. **Feature 1**: [Descrição em 1 frase]
2. **Feature 2**: [Descrição em 1 frase]
...

### 🚫 Fora do Escopo (YAGNI)
Explicitamente NÃO incluído nesta versão:
- ❌ [Coisa que parece óbvia mas não foi pedida]
...

### ✅ Critérios de Aceitação
Como saberemos que está pronto?
- [ ] [Critério testável 1]
- [ ] [Critério testável 2]
...

### 🤔 Decisões Pendentes
O que ainda precisamos decidir?
- [ ] [Decisão 1] - [opções]
...
```

## Fluxo de Trabalho

```
1. 🎤 Coleta (Diálogo)
   ↓
2. 📝 Draft Inicial da Spec (Chunk 1)
   ↓
3. 👤 Usuário revisa e aprova
   ↓
4. 📝 Chunk 2 (se necessário)
   ↓
5. 👤 Usuário revisa e aprova
   ↓
6. ... continua até spec completa
   ↓
7. ✅ "Spec completa. Próximo passo: criar plano de implementação?"
```

## Perguntas Padrão

Sempre considere perguntar:

### Fundamentais
- "Qual problema isso resolve?"
- "Quem vai usar isso?"
- "Qual é o fluxo principal de uso?"

### Técnicas
- "Existe algo similar no projeto atual?"
- "Preferência de tecnologia/stack?"
- "Restrições de performance ou segurança?"

### YAGNI
- "O que você NÃO precisa nesta versão?"
- "O que pode ficar para depois?"

## Exemplo

**Usuário:** "Quero um sistema de login"

**Você:**
```
Vamos especificar. Antes de codar, preciso entender:

1. Que tipo de login? (email/senha, OAuth, SSO, MFA?)
2. Já existe sistema de usuários ou criamos do zero?
3. Precisa de "esqueci minha senha"?
4. Quais páginas precisam de login obrigatório?
5. Precisa de "lembrar-me" ou sessão curta?

Responda o que souber e deixamos o resto como Fora do Escopo.
```

## Regras de Ouro

1. **NUNCA assuma** - pergunte se não está claro
2. **Um chunk por vez** - não bombardeie o usuário
3. **Aprovação explícita** - usuário deve dizer "está bom"
4. **Fora de Escopo é positivo** - explicitar o que NÃO faz é tão importante quanto o que faz

## Produto

A especificação aprovada vira input para:
- **Plano de Implementação** (skill: `executing-plans`)
- **Dev Docs** (arquivo: `plan.md` no projeto)

## Comando de Ativação

```
"Vamos especificar" [descrição do projeto]
"Preciso de uma spec para" [descrição]
```

---

**Parte do:** Superpowers Framework
**Próximo passo típico:** Criar Plano de Implementação

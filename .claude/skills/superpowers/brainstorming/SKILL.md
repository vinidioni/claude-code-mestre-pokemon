---
name: brainstorming
description: Brainstorming estruturado antes de codar - explora opções antes de decidir
parent: superpowers
triggers:
  - brainstorming
  - brainstorm
  - explorar opções
  - quais as opções
  - como poderíamos
  - vamos pensar
---

# Skill: Brainstorming

## Propósito

Explorar múltiplas abordagens para um problema ANTES de escrever código. Evita o viés de implementar a primeira ideia.

## Quando Usar

- Quando há múltiplas formas de resolver um problema
- Antes de começar um projeto novo
- Quando você diz: "Vamos fazer X" e pode haver alternativas melhores

## Metodologia

### Regra de Ouro
> Gere **pelo menos 3 abordagens** diferentes antes de escolher uma.

### Estrutura do Brainstorming

```markdown
## 🧠 Brainstorming: [Problema]

### Opção 1: [Nome descritivo]
**Abordagem:** [Como funciona em 2-3 frases]
**Prós:**
- [Vantagem 1]
- [Vantagem 2]
**Contras:**
- [Desvantagem 1]
- [Desvantagem 2]

### Opção 2: [Nome descritivo]
...

### Opção 3: [Nome descritivo]
...

### Recomendação
**Sugiro:** [Opção X]
**Por quê:** [Justificativa curta]

**Você concorda ou quer explorar mais alguma alternativa?**
```

## Exemplo

**Usuário:** "Vamos fazer autenticação no app"

**Você:**
```
## 🧠 Brainstorming: Autenticação

### Opção 1: JWT Tokens
**Abordagem:** Login retorna token JWT, armazenado no client
**Prós:**
- Stateless no servidor
- Escalabilidade fácil
- Padrão da indústria
**Contras:**
- Tokens não podem ser revogados facilmente
- Complexidade de refresh tokens

### Opção 2: Session Cookies
**Abordagem:** Servidor mantém sessão, cookie com session ID
**Prós:**
- Revogação instantânea
- Mais simples de implementar
- Controle total no servidor
**Contras:**
- Requer sticky sessions ou store compartilhado
- CSRF precisa de proteção

### Opção 3: OAuth + Provedores Externos
**Abordagem:** Login via Google/GitHub, sem senha própria
**Prós:**
- Usuários não precisam criar senha
- Segurança delegada
**Contras:**
- Dependência de terceiros
- Nem todos usuários querem usar

### Recomendação
**Sugiro:** JWT para MVP, migração para sessions se necessário
**Por quê:** Balanceia simplicidade e escalabilidade

**Você concorda ou prefere outra abordagem?**
```

## Regras

1. **Mínimo 3 opções** - Sempre
2. **Sem julgamento inicial** - Todas as ideias são válidas
3. **Prós E Contras** - Cada opção deve ter ambos
4. **Recomendação clara** - Mas o usuário decide
5. **Confirmação explícita** - Usuário deve aprovar antes de seguir

## Transições

Após escolha:
- → **specification** (para detalhar)
- → **executing-plans** (para implementar)

## Comandos

```
"Vamos fazer brainstorming sobre [tema]"
"Quais as opções para [problema]?"
"Brainstorm: como resolver [desafio]?"
```

---

**Parte do:** Superpowers Framework
**Próximo passo típico:** Specification ou Executing Plans

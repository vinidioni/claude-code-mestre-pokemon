---
name: executing-plans
description: Executar planos de implementação passo a passo com TDD e revisões
parent: superpowers
triggers:
  - executar plano
  - implementar plano
  - seguir plano
  - vamos implementar
  - mão na massa
  - codar
---

# Skill: Executing Plans

## Propósito

Executar um plano de implementação de forma sistemática, seguindo boas práticas (TDD, YAGNI, DRY) e revisando cada passo.

## Quando Usar

- Já existe um plano aprovado
- É hora de escrever código
- Você tem tasks definidas para seguir

## Metodologia

### Ciclo de Execução

```
┌─────────────────────────────────────────┐
│  1. PICK                                │
│     Escolha próxima task não feita     │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  2. UNDERSTAND                          │
│     Leia a task. Entenda o objetivo.   │
│     Pergunte se não estiver claro.     │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  3. TDD CYCLE                           │
│     🛑 RED: Escreva teste que falha    │
│     ✅ GREEN: Faça passar (mínimo)     │
│     🔧 REFACTOR: Melhore código        │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  4. COMMIT                              │
│     Commit claro com mensagem descritiva│
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  5. REVIEW                              │
│     Pare. Veja o que foi feito.         │
│     Ainda faz sentido?                  │
└──────────────┬──────────────────────────┘
               ↓
       Mais tasks? → Volta ao 1
       Tudo feito? → FIM
```

## TDD - Test Driven Development

### Regra
> **NUNCA** escreva código de produção sem um teste falhando primeiro.

### Ciclo Red-Green-Refactor

1. **RED** (1 min)
   - Escreva o teste mínimo
   - Rode → deve FALHAR
   - Se passar, teste está errado

2. **GREEN** (1-5 min)
   - Escreva código mínimo para passar
   - Pode ser feio, pode ser hardcoded
   - Rode → deve PASSAR

3. **REFACTOR** (2-10 min)
   - Melhore o código
   - Mantenha testes passando
   - Elimine duplicação

## YAGNI - You Aren't Gonna Need It

### Regra
> Não adicione funcionalidade que você **acha** que vai precisar.

### Checklist YAGNI
- [ ] Está na especificação aprovada?
- [ ] É necessário para esta task?
- [ ] Sem isso, algo quebra?

Se todas forem NÃO → não implemente.

## DRY - Don't Repeat Yourself

### Regra
> Cada pedaço de conhecimento deve ter uma única representação.

### Quando Refatorar
- Mesma lógica em 2+ lugares
- Código copiado/colado
- Estruturas idênticas

## Exemplo de Sessão

**Plano:**
1. Criar model User
2. Criar endpoint POST /users
3. Adicionar validação

**Execução:**

```
## 🚀 Executando: Task 1 - Model User

### 1. PICK
Task 1 selecionada

### 2. UNDERSTAND
Objetivo: Criar modelo de usuário com campos básicos
Campos: name, email, password_hash

### 3. TDD CYCLE

**RED:**
```python
def test_user_creation():
    user = User(name="John", email="john@example.com")
    assert user.name == "John"
    assert user.email == "john@example.com"
```
Rode → ❌ FAIL (User não existe)

**GREEN:**
```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
```
Rode → ✅ PASS

**REFACTOR:**
Adicionar validação básica, tipagem

### 4. COMMIT
```
[superpowers] Add User model with basic fields

- Name and email required
- Type hints added
- Test coverage
```

### 5. REVIEW
✅ Task completa. Próxima: Task 2
```

## Progress Tracking

```markdown
## 📊 Progresso do Plano

- [x] Task 1: Model User
- [ ] Task 2: Endpoint POST
- [ ] Task 3: Validação

**Status:** 1/3 completo (33%)
```

## Comandos

```
"Executar plano"
"Vamos implementar"
"Seguir o plano"
"Próxima task"
```

---

**Parte do:** Superpowers Framework
**Requer:** Plano aprovado
**Produz:** Código testado e commitado

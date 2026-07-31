---
name: test-driven-development
description: TDD puro - Red, Green, Refactor cycle
parent: superpowers
triggers:
  - tdd
  - test driven development
  - test first
  - red green refactor
  - escrever teste primeiro
  - desenvolvimento guiado por testes
---

# Skill: Test Driven Development (TDD)

## Propósito

Desenvolver software através de ciclos curtos de testes: escrever teste que falha, fazer passar, refatorar.

## O Ciclo TDD

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│   RED   │ →  │  GREEN  │ →  │ REFACTOR│
│  (falha)│    │ (passa) │    │(melhora)│
└─────────┘    └─────────┘    └─────────┘
      ↑                            │
      └────────────────────────────┘
```

## As Três Leis do TDD

1. **Não escreva código de produção** sem um teste falhando primeiro
2. **Não escreva mais teste** do que o suficiente para falhar
3. **Não escreva mais código** do que o suficiente para passar

## Fases em Detalhe

### 1. RED (1-3 minutos)

**Objetivo:** Criar um teste que falhe.

**Checklist:**
- [ ] Teste é mínimo (testa uma coisa só)
- [ ] Nome descritivo do comportamento
- [ ] Rode → deve FALHAR (vermelho)

**Exemplo:**
```python
# Teste ANTES do código existir
def test_user_has_name():
    user = User("John")  # ❌ NameError: User não existe
    assert user.name == "John"
```

### 2. GREEN (1-5 minutos)

**Objetivo:** Fazer o teste passar com código mínimo.

**Regras:**
- Pode ser feio
- Pode ser hardcoded
- Pode copiar do teste
- NÃO pense em design, só faça passar

**Exemplo:**
```python
class User:
    def __init__(self, name):
        self.name = name  # ✅ Simples, funciona
```

### 3. REFACTOR (2-10 minutos)

**Objetivo:** Melhorar código mantendo testes passando.

**O que fazer:**
- Renomear variáveis
- Extrair métodos
- Eliminar duplicação
- Melhorar estrutura

**O que NÃO fazer:**
- Adicionar funcionalidade
- Mudar comportamento
- Quebrar testes

**Exemplo:**
```python
# Antes
class User:
    def __init__(self, name):
        self.name = name

# Depois (refatorado)
from dataclasses import dataclass

@dataclass
class User:
    name: str
```

## Tamanho dos Passos

| Fase | Tempo Máximo | Por quê? |
|------|-------------|----------|
| RED | 3 min | Teste deve ser simples |
| GREEN | 5 min | Só o mínimo para passar |
| REFACTOR | 10 min | Se maior, quebre em mais ciclos |

## Exemplo Completo

**Feature:** Calcular desconto

```python
# CICLO 1

## RED
# test_discount.py
def test_ten_percent_discount():
    price = 100
    discount = calculate_discount(price, percentage=10)
    assert discount == 10  # 10% de 100

# Rode → ❌ NameError: calculate_discount não existe

## GREEN
# discount.py
def calculate_discount(price, percentage):
    return price * (percentage / 100)  # ✅ Funciona

# Rode → ✅ PASS

## REFACTOR
# Nada a refatorar ainda

---

# CICLO 2

## RED
def test_zero_discount():
    discount = calculate_discount(100, 0)
    assert discount == 0

# Rode → ✅ PASS (já funciona)

## GREEN
# Nada a adicionar

## REFACTOR
# Nada a refatorar

---

# CICLO 3

## RED
def test_maximum_discount_cap():
    discount = calculate_discount(100, 50)  # 50%
    assert discount == 50  # Mas regra: máximo 30%
    # Esperamos que quebre se não tiver limite

## GREEN
def calculate_discount(price, percentage):
    actual_percentage = min(percentage, 30)  # Limite de 30%
    return price * (actual_percentage / 100)

## REFACTOR
# Extrair constante
MAX_DISCOUNT_PERCENT = 30

def calculate_discount(price, percentage):
    return price * (min(percentage, MAX_DISCOUNT_PERCENT) / 100)
```

## TDD no Fluxo Superpowers

```
specification → executing-plans → TDD cycles → code review
                     ↑___________________________↓
```

## Quando NÃO Usar TDD

- Prototipagem rápida (vai jogar fora)
- Exploração de API desconhecida
- Scripts descartáveis

**Mas:** Quando for manter o código, adicione testes depois.

## Comandos

```
"Vamos fazer TDD"
"Test first"
"Red green refactor"
"Próximo ciclo TDD"
```

---

**Parte do:** Superpowers Framework
**Baseado em:** Kent Beck - Test Driven Development

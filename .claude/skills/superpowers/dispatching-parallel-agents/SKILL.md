---
name: dispatching-parallel-agents
description: Dispatch agentes paralelos para executar múltiplas tarefas simultaneamente
parent: superpowers
triggers:
  - executar em paralelo
  - agentes paralelos
  - dispatch paralelo
  - dividir tarefas
  - paralelizar
  - subagentes simultaneos
---

# Skill: Dispatching Parallel Agents

## Propósito

Executar múltiplas tarefas independentes em paralelo usando subagentes, reduzindo tempo total de execução.

## Quando Usar

- Tarefas são **independentes** (não têm dependências entre si)
- Você tem **pelo menos 3 tasks** para executar
- As tasks são **complexas o suficiente** para valer o overhead

## Quando NÃO Usar

- Tasks têm dependências (B depende de A)
- Tasks são muito simples (overhead > benefício)
- Você precisa de coordenação fina entre tasks

## Metodologia

### Princípio
> Máximo de **5 agentes paralelos** por vez. Mais que isso = caos.

### Estrutura

```markdown
## ⚡ Dispatch Paralelo

### Tasks Identificadas
1. **Task A** - [Descrição breve]
2. **Task B** - [Descrição breve]
3. **Task C** - [Descrição breve]

### Verificação de Independência
- ✅ Task A não depende de B ou C
- ✅ Task B não depende de A ou C
- ✅ Task C não depende de A ou B

### Dispatches
```
[Agente 1] → Task A
[Agente 2] → Task B  
[Agente 3] → Task C
```

### Aguardando Resultados...
```

### Resultados
| Task | Status | Output |
|------|--------|--------|
| A | ✅ | [Resumo] |
| B | ✅ | [Resumo] |
| C | ❌ | [Erro, se houver] |

### Próximos Passos
- [O que fazer com os resultados]
```

## Implementação no DCCrazy

Use a função `Agent()` com `run_in_background: true`:

```python
# Exemplo conceitual
results = await parallel([
    lambda: agent("Implementar Componente A", ...),
    lambda: agent("Implementar Componente B", ...),
    lambda: agent("Implementar Componente C", ...)
])
```

## Exemplo

**Contexto:** Implementar CRUD completo

**Você:**
```
## ⚡ Dispatch Paralelo

### Tasks Identificadas
1. **Task A** - Criar endpoints da API
2. **Task B** - Criar componentes de formulário
3. **Task C** - Criar testes unitários

### Verificação de Independência
- ✅ API pode ser criada sem UI
- ✅ UI pode usar mocks da API
- ✅ Testes podem ser escritos com interfaces definidas

### Dispatches
Vou lançar 3 subagentes simultaneamente...

[Aguardando...]

### Resultados
| Task | Status | Output |
|------|--------|--------|
| API | ✅ | 4 endpoints criados em `src/api/` |
| UI | ✅ | 3 componentes em `src/components/` |
| Tests | ✅ | 12 testes em `src/__tests__/` |

### Integração
Agora vou integrar os componentes com a API...
```

## Limites

| Métrica | Limite | Por quê |
|---------|--------|---------|
| Max agentes | 5 | Coordenação torna-se complexa |
| Min tasks | 3 | Pouco benefício em paralelizar menos |
| Timeout | 10 min | Evita agentes presos |

## Erros Comuns

1. **Dependências escondidas** - Verifique duas vezes
2. **Conflitos de arquivo** - Agents escrevendo no mesmo lugar
3. **Recursos limitados** - CPU/memória insuficiente

## Comandos

```
"Executar em paralelo"
"Dividir em subagentes"
"Paralelizar estas tasks"
```

---

**Parte do:** Superpowers Framework
**Usa:** Agent() com paralelismo
**Cuidado:** Verifique independência primeiro!

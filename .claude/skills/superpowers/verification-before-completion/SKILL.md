---
name: verification-before-completion
description: Verificação antes de completar - checklist final de qualidade
parent: superpowers
triggers:
  - verificar antes de completar
  - checklist final
  - pronto para entregar
  - completar tarefa
  - finalizar
  - verificacao final
---

# Skill: Verification Before Completion

## Propósito

Garantir que o trabalho está realmente completo e de qualidade antes de marcar como "feito".

## Quando Usar

- Antes de marcar task como completa
- Antes de fazer commit final
- Antes de solicitar revisão
- Antes de fazer deploy

## Checklist de Verificação

### ✅ Funcionalidade
```
- [ ] Código faz o que a especificação pede
- [ ] Casos principais funcionam
- [ ] Edge cases são tratados
- [ ] Erros são tratados graciosamente
- [ ] Mensagens de erro são claras
```

### ✅ Qualidade de Código
```
- [ ] Nomenclatura é clara e consistente
- [ ] Funções são pequenas e focadas
- [ ] Não há código duplicado (DRY)
- [ ] Comentários explicam o "por quê", não o "o quê"
- [ ] Código morto foi removido
```

### ✅ Testes
```
- [ ] Testes passam (todos)
- [ ] Cobertura é adequada
- [ ] Testes são legíveis
- [ ] Testes são confiáveis (não flaky)
```

### ✅ Documentação
```
- [ ] README atualizado (se necessário)
- [ ] Changelog atualizado
- [ ] Comentários em código complexo
- [ ] APIs documentadas
```

### ✅ Performance
```
- [ ] Não há regressões de performance
- [ ] Não há queries N+1
- [ ] Memória é gerenciada adequadamente
```

### ✅ Segurança
```
- [ ] Não há vulnerabilidades óbvias
- [ ] Input é validado
- [ ] Dados sensíveis estão protegidos
- [ ] Não há segredos no código
```

### ✅ Integração
```
- [ ] Branch está atualizada com main
- [ ] Conflitos foram resolvidos
- [ ] CI passa
```

## Processo de Verificação

```markdown
## 🔍 Verificação Final: [Nome da Task]

### Teste Manual
```
Cenário 1: [Descrição]
- [ ] Passou

Cenário 2: [Descrição]
- [ ] Passou

Edge Case: [Descrição]
- [ ] Passou
```

### Testes Automatizados
```
npm test
- [ ] Todos passam (X/X)
```

### Lint/Type Check
```
npm run lint
- [ ] Sem erros

npm run type-check
- [ ] Sem erros
```

### Revisão Final
- [ ] Li meu próprio código
- [ ] Faria sentido para outra pessoa?
- [ ] Estou orgulhoso deste trabalho?

**Status:** ☐ Aprovado para entrega ☐ Precisa de ajustes
```

## Decisão

### ✅ Aprovado
Se todos os checks passarem:
```
✅ Verificação completa!
- Todos testes passam
- Código revisado
- Documentação atualizada

Próximo passo: [commit/PR/revisão]
```

### ❌ Precisa de Ajustes
Se algo falhar:
```
❌ Verificação encontrou problemas:

Problemas:
1. [Problema 1]
2. [Problema 2]

Ajustes necessários:
- [ ] [Ajuste 1]
- [ ] [Ajuste 2]

Vou corrigir e verificar novamente.
```

## Exemplo

**Task:** Implementar busca de usuários

**Verificação:**
```
## 🔍 Verificação Final: Busca de Usuários

### Teste Manual
```
Busca por nome exato: "John Doe"
- [x] Retorna usuário correto

Busca parcial: "John"
- [x] Retorna todos que contêm "John"

Busca sem resultados: "XYZ123"
- [x] Retorna lista vazia (não erro)

Busca com caracteres especiais: "João"
- [x] Funciona corretamente

Performance com 1000 usuários
- [x] < 100ms
```

### Testes Automatizados
```
npm test -- search.test.js
✓ should find exact match (45ms)
✓ should find partial matches (32ms)
✓ should return empty for no matches (12ms)
✓ should handle special characters (28ms)
✓ should be performant (156ms)
```

### Lint
```
✓ Sem erros
```

### Revisão Final
- [x] Código lido
- [x] Faz sentido
- [x] Orgulhoso do trabalho

**Status:** ✅ Aprovado para entrega
```

## Comandos

```
"Verificar antes de completar"
"Checklist final"
"Pronto para entregar"
"Verificação completa"
```

---

**Parte do:** Superpowers Framework
**Última etapa antes de:** finishing-a-development-branch

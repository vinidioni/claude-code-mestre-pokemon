---
name: requesting-code-review
description: Solicitar e conduzir revisões de código efetivas
parent: superpowers
triggers:
  - revisar codigo
  - code review
  - revisar
  - revisao de codigo
  - analisar mudancas
  - verificar implementacao
---

# Skill: Requesting Code Review

## Propósito

Conduzir revisões de código que realmente melhorem a qualidade, não apenas aprovem mudanças.

## Quando Usar

- Antes de mergear código
- Após implementar feature
- Quando quer feedback sobre abordagem
- Antes de commit final

## Metodologia

### Preparação (Reviewer)

Antes de revisar, entenda:

```markdown
## 📝 Contexto da Revisão

### O que está sendo mudado?
[Descrição de alto nível]

### Por que está sendo mudado?
[Motivação, problema que resolve]

### Como foi testado?
- [ ] Testes automatizados
- [ ] Teste manual
- [ ] Review visual

### Áreas de foco
[Onde o reviewer deve prestar atenção extra]
```

### Checklist de Revisão

```markdown
## ✅ Checklist de Code Review

### Corretude
- [ ] Código faz o que a especificação diz
- [ ] Edge cases são tratados
- [ ] Erros são tratados adequadamente

### Qualidade
- [ ] Nomenclatura é clara
- [ ] Funções são pequenas e focadas
- [ ] Não há duplicação (DRY)
- [ ] Complexidade é adequada

### Testes
- [ ] Testes cobrem casos principais
- [ ] Testes cobrem edge cases
- [ ] Testes são legíveis

### Documentação
- [ ] Código complexo tem comentários
- [ ] Mudanças em APIs são documentadas
- [ ] README atualizado se necessário

### Performance
- [ ] Não há queries N+1
- [ ] Não há loops desnecessários
- [ ] Memória é usada eficientemente
```

## Padrões de Comentário

### Bom Comentário
```
❓ Por que usar `==` ao invés de `===` aqui?
   Parece que pode haver coerção de tipos.
   ```suggestion
   if (value === expected) {
   ```
```

### Comentário Construtivo
```
💭 Considerar extrair isso para uma função:
   ```javascript
   // Antes
   const result = data.filter(x => x.active).map(x => x.name).join(', ');
   
   // Sugestão
   const activeNames = getActiveNames(data);
   ```
   Isso tornaria o código mais legível e testável.
```

### Comentário Educacional
```
📚 Nota: O padrão utilizado aqui é conhecido como 
   "Strategy Pattern". Muito bom para extensibilidade!
   
   Mais sobre isso: [link para docs]
```

## Tipos de Feedback

| Tipo | Prefixo | Quando Usar |
|------|---------|-------------|
 **Blocking** 🔴 | | | Must fix before merge |
 **Suggestion** 💭 | | | Good idea but optional |
 **Question** ❓ | | | Need clarification |
 **Praise** 🌟 | | | Good work, acknowledge it |
 **Nitpick** 📝 | | | Minor style issue |

## Exemplo de Sessão

**Autor:**
```
Olá! Este PR adiciona autenticação JWT.

Contexto: Usuários precisam fazer login para acessar área restrita.
Foi testado com: Testes unitários + teste manual no Postman.

Por favor, foque em:
1. Segurança do token (armazenamento)
2. Validação de input
3. Tratamento de erros
```

**Reviewer:**
```
🔴 Bloqueante: O token está sendo salvo em localStorage, 
   que é vulnerável a XSS. Considerar cookies httpOnly.

💭 Sugestão: Extrair validação de email para função reutilizável.
   ```suggestion
   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   ```

❓ Dúvida: O que acontece se o token estiver expirado?
   Não encontrei handler para isso.

🌟 Elogio: Gostei da estrutura do middleware, bem limpo!
```

## Resposta do Autor

```
Obrigado pela revisão!

🔴 Token: Concordo, vou migrar para cookies httpOnly.
💭 Validação: Boa ideia, vou extrair em utils/validation.js.
❓ Expiração: Adicionei handler no commit abc123, 
   verifique por favor se está adequado.
```

## Revisão via Subagente

Para revisões grandes, delegue a um subagente:

```
🤖 Subagente: Revisão de Código

Contexto: PR #123 adiciona sistema de cache.
Objetivo: Encontrar problemas de concorrência e eficiência.

Input: 
- Arquivos: src/cache/*.ts
- Testes: src/cache/*.test.ts

Checklist:
- [ ] Race conditions
- [ ] Memory leaks
- [ ] Invalidação adequada
- [ ] Testes de carga

Output:
- Lista de issues encontrados
- Severidade de cada uma

Timeout: 10 minutos
```

## Comandos

```
"Revisar código"
"Code review"
"Analisar mudanças"
"Solicitar revisão"
"Verificar implementação"
```

---

**Parte do:** Superpowers Framework
**Relacionado:** receiving-code-review

---
name: receiving-code-review
description: Receber e responder a revisões de código - como lidar com feedback
parent: superpowers
triggers:
  - receber revisao
  - responder revisao
  - feedback recebido
  - comentarios no pr
  - revisao concluida
---

# Skill: Receiving Code Review

## Propósito

Receber feedback de revisão de código de forma construtiva e responder adequadamente.

## Mentalidade

> **O reviewer não é seu inimigo.**
> Comentários são sobre o código, não sobre você.

## Tipos de Comentários e Como Responder

### 🔴 Blocking (Must Fix)

**Exemplo:**
```
🔴 Segurança: SQL injection vulnerability here.
```

**Sua resposta:**
```
✅ Corrigido no commit abc123.
Mudei para parameterized queries:
```python
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```
Obrigado por pegar isso!
```

### 💭 Suggestion (Opcional)

**Exemplo:**
```
💭 Considerar extrair isso para uma função helper.
```

**Sua resposta (se concordar):**
```
✅ Boa ideia! Extraí em commit def456.
Ficou muito mais limpo.
```

**Sua resposta (se não concordar):**
```
💭 Entendo a sugestão, mas prefiro manter inline porque:
1. É usado apenas aqui
2. Adicionaria indireção
3. Tornaria menos legível

Posso manter assim?
```

### ❓ Question (Dúvida)

**Exemplo:**
```
❓ Por que usar var ao invés de let/const?
```

**Sua resposta:**
```
❓ Boa pergunta! Usei var porque:
1. Esse código roda em ambiente ES5 legacy
2. Precisa de hoisting behavior
3. Testei e let quebra compatibilidade

Deixei comentário explicando no código: commit ghi789
```

### 🌟 Praise (Elogio)

**Exemplo:**
```
🌟 Gostei muito da abstração aqui!
```

**Sua resposta:**
```
🌟 Obrigado! Fiquei pensando bastante em como estruturar.
```

## Checklist de Resposta

Para cada comentário:
- [ ] Li e entendi o ponto
- [ ] Decidi: aceitar, discutir, ou explicar por que não
- [ ] Implementei mudança OU respondi justificando
- [ ] Commit reference (se aplicável)

## Padrões de Resposta

### Aceitar Sugestão
```
✅ Corrigido em [commit].
[Explicação breve do que mudou]
Obrigado!
```

### Discutir
```
💭 Entendo o ponto, mas penso diferente porque:
1. [Razão 1]
2. [Razão 2]

O que acha de [alternativa]?
```

### Pedir Clareza
```
❓ Não entendi completamente.
Você pode dar um exemplo do que espera?
```

### Explicar Decisão
```
📚 Decisão foi intencional porque:
[Contexto que o reviewer pode não ter]
```

## Anti-Padrões

❌ **Defensivo:**
```
"Isso funciona, não precisa mudar."
```

❌ **Ignorar:**
```
[Não responde comentários]
```

❌ **Fazer sem entender:**
```
[Muda código sem entender por que]
```

## Fluxo Completo

```
1. Receber comentários
        ↓
2. Ler todos (sem reagir imediatamente)
        ↓
3. Categorizar: Blocker / Suggestion / Question
        ↓
4. Responder mais simples primeiro
        ↓
5. Implementar correções
        ↓
6. Responder complexos com código atualizado
        ↓
7. Solicitar re-revisão
```

## Comandos

```
"Como responder esta revisão"
"Recebi feedback"
"Revisão concluída"
"Responder comentários"
```

---

**Parte do:** Superpowers Framework
**Par:** requesting-code-review

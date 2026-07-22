# 🧠 Sistema de Feedback - DCCrazy

> Sistema de aprendizado contínuo baseado nas preferências do usuário.

---

## O Que É

O DCCrazy aprende com você. Quando detecta padrões nas suas interações, ele pergunta se quer que aquilo seja lembrado para próximas vezes.

**Exemplo prático:**

```
Você cria uma query e usa date_trunc() para agrupar por mês.

DCC: "Percebi que você prefere date_trunc() ao invés de strftime().
      Quer que eu sugira isso nas próximas queries?"

Você: "Sim"

DCC: [salva em .claude/memory/feedback-system.md]

---
name: preferencia-agrupamento-mensal
type: feedback
---
Usuário prefere usar date_trunc('month', coluna) para agrupar por mês.
Sempre sugerir date_trunc primeiro ao invés de strftime().
```

Da próxima vez que você criar uma query com agrupamento mensal:
```
DCC: "Para agrupar por mês, você costuma usar date_trunc().
      Quer que eu use dessa forma?"
```

---

## Como Funciona

### 1. Detecção de Padrões

O DCCrazy observa:
- Como você escreve queries (estilo, funções preferidas)
- Como você organiza arquivos
- Quais workflows usa mais
- Correções que você faz manualmente

### 2. Pergunta ao Usuário

Nunca aprende silenciosamente. Sempre pergunta:
- "Quer que eu lembre disso?"
- "Posso sugerir isso da próxima vez?"
- "Isso é um padrão seu?"

### 3. Armazenamento

Feedbacks são salvos em:
```
.claude/memory/feedback-system.md
```

Formato:
```markdown
---
name: nome-do-feedback
type: feedback
---
Descrição do que foi aprendido.
Instruções de como aplicar.
```

### 4. Aplicação Futura

Nas próximas interações similares, o DCCrazy:
1. Consulta o feedback-system.md
2. Verifica se há padrão aplicável
3. Sugere baseado no aprendizado anterior

---

## Tipos de Feedback

| Tipo | Quando é Registrado |
|------|---------------------|
| **Preferência de código** | Estilo de escrita, funções favoritas |
| **Organização** | Como prefere estruturar arquivos |
| **Correção** | Quando corrige algo que o DCC fez |
| **Automação** | Tarefas que você faz repetidamente |

---

## Gerenciando Feedbacks

### Ver todos os feedbacks

```bash
cat .claude/memory/feedback-system.md
```

### Remover um feedback

Edite o arquivo e delete a seção correspondente.

### Corrigir um feedback

Peça ao DCC:
"Atualize o feedback X para dizer Y"

---

## Exemplos de Feedbacks Úteis

```markdown
---
name: preferencia-sql-cte
type: feedback
---
Usuário prefere usar CTEs (WITH) ao invés de subqueries.
Sempre sugerir estrutura com CTE primeiro.

---
name: organizacao-relatorios
type: feedback
---
Usuário sempre nomeia relatórios como: {tipo}-report-YYYY-MM-DD.md
Sugerir esse padrão ao criar novos relatórios.

---
name: correcao-descricao-queries
type: feedback
---
Usuário sempre adiciona descrição detalhada nas queries.
Alertar se uma query nova estiver sem descrição no cabeçalho.
```

---

**Arquivo:** `.claude/memory/feedback-system.md`  
**Sem limite de armazenamento** (por enquanto)

# 📋 Convenção de Queries - DCCrazy

> Regras obrigatórias para criação e organização de queries no DCCrazy.

---

## 🗂️ Estrutura de Pastas

Toda query NOVA deve ser salva em:

```
analytics/
└── queries/
    ├── presto/           # Queries genéricas Presto
    │   ├── README.md     # Índice das queries
    │   └── *.sql
    └── data-e/           # Queries específicas Data-E
        ├── README.md     # Índice das queries
        └── *.sql
```

**⚠️ REGRA FUNDAMENTAL:**
- Se a query acessa dados do **Data-E** → Salvar em `analytics/queries/data-e/`
- Se é uma query **genérica Presto** → Salvar em `analytics/queries/presto/`

Nunca salve queries na raiz de `analytics/queries/` - sempre escolha a subpasta correta.

---

## 📝 Template Obrigatório

Toda query deve seguir este cabeçalho:

```sql
/*
================================================================================
QUERY: [nome-descritivo]
================================================================================
DESCRIÇÃO:
    [Explique o que esta query faz em 2-3 linhas]

AUTOR:
    [Seu nome] ([email])

DATA DE CRIAÇÃO:
    [YYYY-MM-DD]

ÚLTIMA ATUALIZAÇÃO:
    [YYYY-MM-DD] - [Breve descrição do que mudou]

PARÂMETROS:
    - [parametro1]: [descrição] (obrigatório/opcional)
    - [parametro2]: [descrição] (obrigatório/opcional)

TABELAS UTILIZADAS:
    - [database.schema.tabela]: [breve descrição do que contém]

RETORNO:
    [Descreva as colunas retornadas e seus significados]

EXEMPLO DE USO:
    [Mostre um exemplo de como executar esta query]

NOTAS:
    - [Qualquer observação importante, performance, limitações, etc]
    - [Outra nota se necessário]
================================================================================
*/

-- SUA QUERY AQUI

```

---

## ✅ Checklist Antes de Salvar

Antes de salvar uma nova query, verifique:

- [ ] **Local correto:** Está em `presto/` ou `data-e/`?
- [ ] **Cabeçalho completo:** Todos os campos do template estão preenchidos?
- [ ] **Nome descritivo:** O nome do arquivo explica o que a query faz?
- [ ] **Índice atualizado:** Adicionou ao README.md da pasta?
- [ ] **Testada:** A query executa sem erros?
- [ ] **Performance:** Há índices sendo usados nos filtros?

---

## 📛 Nomenclatura de Arquivos

Use `kebab-case` descritivo:

✅ **Bom:**
- `usuarios-ativos-por-mes.sql`
- `faturamento-diario-com-parcelas.sql`
- `pedidos-cancelados-ultimos-7-dias.sql`

❌ **Evitar:**
- `query1.sql` (não descritivo)
- `User_Active.sql` (snake_case + inglês inconsistente)
- `teste.sql` (temporário virou permanente)

---

## 📚 Manutenção do Índice

Cada pasta (`presto/` e `data-e/`) deve ter um `README.md` com índice:

```markdown
# Queries Presto

## Índice

### Usuários
| Query | Descrição | Autor | Data |
|-------|-----------|-------|------|
| [usuarios-ativos-por-mes.sql](./usuarios-ativos-por-mes.sql) | Lista usuários ativos mensalmente | Vinicius Castanho | 2024-07-22 |

### Financeiro
| Query | Descrição | Autor | Data |
|-------|-----------|-------|------|
| [faturamento-diario-com-parcelas.sql](./faturamento-diario-com-parcelas.sql) | Receita diária com detalhamento de parcelas | Vinicius Castanho | 2024-07-20 |
```

**Sempre que criar uma query nova, adicione ao índice!**

---

## 🤖 Integração com DCC

O DCCrazy irá:

1. **Sugerir pasta correta** quando você criar uma query
2. **Verificar cabeçalho** e alertar se estiver incompleto
3. **Perguntar** se quer adicionar ao índice
4. **Atualizar Enciclopédia** quando detectar tabelas novas

---

## 📝 Exemplo Completo

```sql
/*
================================================================================
QUERY: usuarios-ativos-por-mes
================================================================================
DESCRIÇÃO:
    Lista usuários que realizaram pelo menos uma ação no app
    no mês de referência, com detalhamento de cidade.

AUTOR:
    Vinicius Castanho (viniciuscastanho@didiglobal.com)

DATA DE CRIAÇÃO:
    2024-07-22

ÚLTIMA ATUALIZAÇÃO:
    2024-07-22 - Criação inicial

PARÂMETMETROS:
    - mes_referencia: Mês no formato 'YYYY-MM' (obrigatório)
    - cidade: Nome da cidade para filtro (opcional)

TABELAS UTILIZADAS:
    - analytics.users_activity: Log de atividades dos usuários
    - analytics.users_profile: Dados cadastrais dos usuários

RETORNO:
    - user_id: ID do usuário
    - cidade: Cidade do usuário
    - total_acoes: Quantidade de ações no período
    - ultima_acao: Data da última ação

EXEMPLO DE USO:
    -- Todos os usuários ativos em julho/2024
    SELECT * FROM (
        [colar query aqui]
    ) WHERE mes_referencia = '2024-07';

NOTAS:
    - A query usa partições por data, mantenha filtros temporais
    - Evite SELECT *, liste apenas colunas necessárias
================================================================================
*/

SELECT
    u.user_id,
    p.cidade,
    COUNT(*) as total_acoes,
    MAX(u.event_time) as ultima_acao
FROM analytics.users_activity u
JOIN analytics.users_profile p ON u.user_id = p.user_id
WHERE date_format(u.event_time, '%Y-%m') = '${mes_referencia}'
  AND (${cidade} IS NULL OR p.cidade = ${cidade})
GROUP BY 1, 2
ORDER BY 3 DESC;
```

---

**Última atualização:** 2024-07-22  
**Versão:** 1.0

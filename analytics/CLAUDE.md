# 📊 Analytics - Queries e Assets Analíticos

> **Contexto específico**: Este CLAUDE.md carrega automaticamente quando você trabalha na pasta `analytics/`.

---

## Propósito

Esta pasta armazena **queries SQL reutilizáveis** e **templates analíticos** para análise de dados. É o repositório central para assets de BI e analytics.

---

## Estrutura

```
analytics/
├── queries/                    # Queries SQL reutilizáveis
│   ├── data-e/                # Queries para Data-E (sem CTEs)
│   ├── presto/                # Queries para Presto/Trino
│   ├── bigquery/              # Queries para BigQuery
│   └── README.md              # Catálogo de queries
├── templates/                  # Templates de queries base
│   └── query-template.sql
└── CLAUDE.md                  # Este arquivo
```

---

## Convenções

### Nomenclatura de Arquivos
- Use `kebab-case` para nomes de arquivos
- Sem números de versão (use git)
- Extensão `.sql` para queries

### Header Padrão
```sql
-- ============================================================================
-- QUERY: [Nome Descritivo]
-- ============================================================================
-- Descrição: breve explicação do que a query faz
-- Fonte: [tabela principal]
-- Destino: [onde o resultado é usado]
-- Data de teste: YYYY-MM-DD
-- Resultado esperado: descrição do output esperado
-- ============================================================================
-- Parâmetros:
--   ${parametro} - descrição
-- ============================================================================

-- Query aqui...
```

### Data-E Específico
- **NÃO use CTEs** (WITH clauses) - use subqueries
- Documente limitações conhecidas
- Inclua comentários sobre otimizações

---

## Como Usar

### Adicionar Nova Query

1. Escolha a pasta adequada (`data-e/`, `presto/`, `bigquery/`)
2. Crie o arquivo seguindo o header padrão
3. Atualize `queries/README.md` com a nova query
4. Teste antes de commitar
5. Commit com tag `[query]`:
   ```
   [query] Adiciona query de funil de groceries para Data-E

   - Métricas: paid orders, cancelamentos, UA, duty types
   - Dimensões: cidade, vehicle type, work type, rider type
   - Testado em 2026-07-13

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

### Modificar Query Existente

1. Atualize a query
2. Atualize a seção "Data de teste" no header
3. Documente mudanças significativas nos comentários
4. Commit com tag `[query]`

---

## Catálogo de Queries

Consulte [`queries/README.md`](./queries/README.md) para o catálogo completo.

### Data-E

| Query | Descrição | Status |
|-------|-----------|--------|
| [`groceries-funnel.sql`](./queries/data-e/groceries-funnel.sql) | Funil de orders groceries (biz_line=3) | ✅ Testado 2026-07-13 |

---

## Templates

Use os templates em `templates/` como ponto de partida para novas queries.

---

## Dicas

### Performance
- Filtre nas tabelas fonte antes de joins
- Evite SELECT * em queries de produção
- Use índices quando disponíveis

### Legibilidade
- Indentação de 4 espaços
- Comentários em seções complexas
- Alias descritivos

### Versionamento
- Uma query por arquivo
- Commits atômicos
- Descrições claras no commit message

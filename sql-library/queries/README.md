# 📊 SQL Library - Queries

Catálogo de queries SQL reutilizáveis para análise de dados.

---

## 📁 Estrutura

```
queries/
├── data-e/              # Queries produtivas Data-E (sem CTEs, sem variáveis)
│   └── *.sql
├── data-e-test/         # Queries para teste local (sem CTEs, com variáveis parametrizadas)
│   └── *.sql
├── presto/              # Queries periódicas/scheduled no Presto
│   └── *.sql
├── draft/               # Queries pontuais/rascunho (descartáveis)
│   └── *.sql
└── README.md            # Este arquivo
```

---

## 📋 Regras por Pasta

| Pasta | CTEs | Variáveis Parametrizadas | Uso |
|-------|------|-------------------------|-----|
| `data-e/` | ❌ Não permitido | ❌ Não permitido | Queries prontas para upload no Data-E |
| `data-e-test/` | ❌ Não permitido | ✅ Permitido | Testes e validações locais |
| `presto/` | ✅ Conforme necessidade | ✅ Conforme necessidade | Queries periódicas agendadas |
| `draft/` | ✅ Liberado | ✅ Liberado | Rascunhos temporários, análises pontuais |

**Fluxo de trabalho:**
1. Desenvolver em `draft/` ou `data-e-test/`
2. Validar e refinar
3. Copiar para `data-e/` (remover variáveis e CTEs se houver)
4. Subir no Data-E

---

## 📋 Queries Disponíveis

### Presto

Queries para análise de aftersales em Groceries/99Compras.

| Query | Descrição | Status |
|-------|-----------|--------|
| [`grocery_aftersales_3cenarios.sql`](presto/grocery_aftersales_3cenarios.sql) | Verifica existência dos 3 cenários de aftersales | ✅ Testado |
| [`grocery_aftersales_amostras_completa.sql`](presto/grocery_aftersales_amostras_completa.sql) | 5 exemplos de cada cenário (status descritivo + reembolso) | ✅ Testado |
| [`grocery_aftersales_matriz_agregada.sql`](presto/grocery_aftersales_matriz_agregada.sql) | Matriz agregada status x reembolso (período parametrizado) | ✅ Testado |
| [`groceries-duties.sql`](presto/groceries-duties.sql) | Análise de duties (d-duty) em orders groceries | ✅ Testado |

**Detalhes: Aftersales Analysis**
- **Objetivo**: Analisar tickets de aftersales do time de CX vs status de orders e reembolsos
- **Tabelas**: `dwd_crm_ticket_capital_di`, `dwd_order_wide_d_increment`, `dwd_order_refund_apply_d_increment`
- **Cenários analisados**:
  1. Ticket aftersales + Order completada/cancelada/em andamento
  2. Ticket aftersales + Com/Sem reembolso
  3. Status detalhados de orders (completada, cancelada por tipo, em andamento)
- **Período de teste**: 13-19 Jul 2026 (1.064 tickets analisados)
- **Parâmetros**:
  - `${START}` - Data inicial (ex: 2026-07-13)
  - `${END}` - Data final (ex: 2026-07-19)

### Data-E

| Query (Data-E) | Query (Teste) | Descrição | Status |
|----------------|---------------|-----------|--------|
| [`groceries-funnel.sql`](data-e/groceries-funnel.sql) | [`groceries-funnel-teste.sql`](data-e-test/groceries-funnel-teste.sql) | Funil de orders groceries (biz_line=3) | ✅ Testado |

**Detalhes: Groceries Funnel**
- **Objetivo**: Análise de funil de orders para groceries com métricas por dimensões
- **Tabelas**: `dwd_order_wide_d_increment`, `dim_regional`, `courier_matrix_classification`
- **Dimensões**: cidade, schedule, pooling, vehicle type, work type, rider type, incentive type
- **Métricas**: paid orders, canceled orders, completed orders, aftersales, UA, duty types
- **Data de teste**: 2026-07-13 (3078 paid orders, 370 cancelamentos, 8 d-duty)
- **Parâmetros** (versão de teste):
  - `${start_date}` - Data inicial (ex: 2026-07-01)
  - `${end_date}` - Data final (ex: 2026-07-13)

---

## 🎯 Convenções de Nomenclatura

### Arquivos
- Nome descritivo em `kebab-case`
- Extensão `.sql`
- Sem números de versão (usar git para versionamento)

### Queries
- Header padronizado com descrição, parâmetros e data de teste
- Comentários explicativos para lógica complexa
- **Data-E/Data-E-Test**: Subqueries em vez de CTEs (obrigatório)
- **Presto/Draft**: CTEs permitidos quando necessário

### Parâmetros
- Usar `${nome_do_parametro}` para placeholders
- Documentar no header da query

---

## 📝 Adicionar Nova Query

1. Escolha a pasta adequada seguindo as regras da tabela acima
2. Crie o arquivo seguindo o template:

```sql
-- ============================================================================
-- QUERY: [Nome Descritivo]
-- ============================================================================
-- Descrição breve do que a query faz
-- Data de teste: YYYY-MM-DD
-- Resultado esperado: descrição
-- ============================================================================
-- Parâmetros:
--   ${parametro} - descrição
-- ============================================================================

-- Query aqui...
```

3. Atualize este README com a nova query
4. Commit com tag `[query]`

**Dúvida sobre qual pasta usar?** Pergunte ao usuário.

---

## 🔍 Boas Práticas

### Performance
- Usar filtros nas tabelas fonte (WHERE) antes de joins
- Preferir subqueries a CTEs quando possível (especialmente para Data-E)
- Evitar SELECT * em queries de produção

### Legibilidade
- Indentação consistente (4 espaços)
- Comentários em seções complexas
- Alias descritivos para tabelas

### Manutenção
- Documentar mudanças no header
- Incluir data de última atualização
- Manter testes/documentação atualizados

---

## 📚 Query Repository

Para queries de referência catalogadas (alto valor, exemplos de filtros/tabelas), consulte:
[`../repository/README.md`](../repository/README.md)

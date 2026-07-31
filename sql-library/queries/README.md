# 📊 SQL Library - Queries

Catalog of reusable SQL queries for data analysis.

---

## 📁 Structure

```
queries/
├── data-e/              # Productive Data-E queries (no CTEs, no variables)
│   └── *.sql
├── data-e-test/         # Local test queries (no CTEs, with parameterized variables)
│   └── *.sql
├── presto/              # Scheduled/periodic queries in Presto
│   └── *.sql
├── draft/               # One-off/draft queries (disposable)
│   └── *.sql
└── README.md            # This file
```

---

## 📋 Rules by Folder

| Folder | CTEs | Parameterized Variables | Usage |
|-------|------|------------------------|-------|
| `data-e/` | ❌ Not allowed | ❌ Not allowed | Queries ready for upload to Data-E |
| `data-e-test/` | ❌ Not allowed | ✅ Allowed | Local tests and validations |
| `presto/` | ✅ As needed | ✅ As needed | Scheduled periodic queries |
| `draft/` | ✅ Allowed | ✅ Allowed | Temporary drafts, one-off analyses |

**Workflow:**
1. Develop in `draft/` or `data-e-test/`
2. Validate and refine
3. Copy to `data-e/` (remove variables and CTEs if any)
4. Upload to Data-E

---

## 📋 Available Queries

### Presto

Queries for aftersales analysis in Groceries/99Compras.

| Query | Description | Status |
|-------|-------------|--------|
| [`grocery_aftersales_3cenarios.sql`](presto/grocery_aftersales_3cenarios.sql) | Checks existence of 3 aftersales scenarios | ✅ Tested |
| [`grocery_aftersales_amostras_completa.sql`](presto/grocery_aftersales_amostras_completa.sql) | 5 examples of each scenario (descriptive status + refund) | ✅ Tested |
| [`grocery_aftersales_matriz_agregada.sql`](presto/grocery_aftersales_matriz_agregada.sql) | Aggregated status x refund matrix (parameterized period) | ✅ Tested |
| [`groceries-duties.sql`](presto/groceries-duties.sql) | Duty analysis (d-duty) in grocery orders | ✅ Tested |

**Details: Aftersales Analysis**
- **Objective**: Analyze CX team aftersales tickets vs order status and refunds
- **Tables**: `dwd_crm_ticket_capital_di`, `dwd_order_wide_d_increment`, `dwd_order_refund_apply_d_increment`
- **Analyzed scenarios**:
  1. Aftersales ticket + Order completed/cancelled/in progress
  2. Aftersales ticket + With/Without refund
  3. Detailed order statuses (completed, cancelled by type, in progress)
- **Test period**: Jul 13-19, 2026 (1,064 tickets analyzed)
- **Parameters**:
  - `${START}` - Start date (ex: 2026-07-13)
  - `${END}` - End date (ex: 2026-07-19)

### Data-E

| Query (Data-E) | Query (Test) | Description | Status |
|----------------|--------------|-------------|--------|
| [`groceries-funnel.sql`](data-e/groceries-funnel.sql) | [`groceries-funnel-teste.sql`](data-e-test/groceries-funnel-teste.sql) | Groceries orders funnel (biz_line=3) | ✅ Tested |

**Details: Groceries Funnel**
- **Objective**: Orders funnel analysis for groceries with metrics by dimensions
- **Tables**: `dwd_order_wide_d_increment`, `dim_regional`, `courier_matrix_classification`
- **Dimensions**: city, schedule, pooling, vehicle type, work type, rider type, incentive type
- **Metrics**: paid orders, canceled orders, completed orders, aftersales, UA, duty types
- **Test date**: 2026-07-13 (3078 paid orders, 370 cancellations, 8 d-duty)
- **Parameters** (test version):
  - `${start_date}` - Start date (ex: 2026-07-01)
  - `${end_date}` - End date (ex: 2026-07-13)

---

## 🎯 Naming Conventions

### Files
- Descriptive name in `kebab-case`
- `.sql` extension
- No version numbers (use git for versioning)

### Queries
- Standardized header with description, parameters and test date
- Explanatory comments for complex logic
- **Data-E/Data-E-Test**: Subqueries instead of CTEs (required)
- **Presto/Draft**: CTEs allowed when necessary

### Parameters
- Use `${parameter_name}` for placeholders
- Document in query header

---

## 📝 Adding New Query

1. Choose the appropriate folder following the rules in the table above
2. Create the file following the template:

```sql
-- ============================================================================
-- QUERY: [Descriptive Name]
-- ============================================================================
-- Brief description of what the query does
-- Test date: YYYY-MM-DD
-- Expected result: description
-- ============================================================================
-- Parameters:
--   ${parameter} - description
-- ============================================================================

-- Query here...
```

3. Update this README with the new query
4. Commit with tag `[query]`

**Not sure which folder to use?** Ask the user.

---

## 🔍 Best Practices

### Performance
- Use filters on source tables (WHERE) before joins
- Prefer subqueries to CTEs when possible (especially for Data-E)
- Avoid SELECT * in production queries

### Readability
- Consistent indentation (4 spaces)
- Comments in complex sections
- Descriptive aliases for tables

### Maintenance
- Document changes in header
- Include last updated date
- Keep tests/documentation updated

---

## 📚 Query Repository

For catalogued reference queries (high value, filter/table examples), see:
[`../repository/README.md`](../repository/README.md)

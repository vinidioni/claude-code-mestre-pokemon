# 📚 SQL Library - Repository

Cataloged reference query repository.

---

## 🎯 Purpose

This folder stores **currently used high-value queries** for consultation and reuse. These queries demonstrate:

- Efficient use of filters and conditions
- Relevant table combinations
- Best practice patterns
- Solutions for recurring problems

---

## 📁 Structure

```
repository/
├── crm/                   # Customer Experience and CRM
│   ├── cx-aftersales-tickets.sql
│   └── cx-aftersales-refunds.sql
├── groceries/             # Grocery, shops and aftersales analysis
│   ├── rider-cancellation-analysis-capivara-v1.sql
│   ├── rider-cancellation-analysis-capivara-v2.sql
│   ├── d-duty-cancellation-analysis-detailed.sql
│   ├── duty-analysis-overview.sql
│   ├── duty-analysis-with-values.sql
│   └── shop-order-items-analysis.sql
└── README.md
```

---

## 📋 Cataloged Queries

### Groceries (Grocery, Shops and Aftersales)

| Query | Context | Main Tables | Value |
|-------|---------|-------------|-------|
| [`rider-cancellation-analysis-capivara-v1.sql`](groceries/rider-cancellation-analysis-capivara-v1.sql) | Cancellation analysis with rider experience classification | dwd_order_wide_d_increment, dwd_order_cancel_duty_d_increment, dwd_rider_shift_record_d_whole | Advanced window functions for cumulative calculation by rider |
| [`rider-cancellation-analysis-capivara-v2.sql`](groceries/rider-cancellation-analysis-capivara-v2.sql) | Enhanced version with governance and operations metrics | + dim_food_governance_rider_base, courier_matrix_classification | Complex joins with multiple classification dimensions |
| [`d-duty-cancellation-analysis-detailed.sql`](groceries/d-duty-cancellation-analysis-detailed.sql) | Detailed D-Duty analysis with pivot by reasons | dwd_order_wide_d_increment, dwd_order_cancel_duty_d_increment | Pivot technique for categorizing 30+ cancellation reasons |
| [`duty-analysis-overview.sql`](groceries/duty-analysis-overview.sql) | Consolidated view by responsibility type (B/C/D/P Duty) | dwd_order_wide_d_increment, dwd_rider_shift_record_d_whole, dwd_shop_base_d_whole | Standardized duty classification with multiple dimensions |
| [`duty-analysis-with-values.sql`](groceries/duty-analysis-with-values.sql) | Duty analysis with financial values and UA | + GMV and Unassigned metrics | Value calculation in complex scenarios with elegant conditionals |
| [`shop-order-items-analysis.sql`](groceries/shop-order-items-analysis.sql) | Items per order and average ticket metrics | dwm_shop_wide_d_whole | Average and total calculations from DWM table |

### CRM (Customer Experience)

| Query | Context | Main Tables | Value |
|-------|---------|-------------|-------|
| [`cx-aftersales-tickets.sql`](crm/cx-aftersales-tickets.sql) | CRM ticket extraction related to aftersales | dwd_crm_ticket_capital_di | Window functions for deduplication and advanced exclusion filters |
| [`cx-aftersales-refunds.sql`](crm/cx-aftersales-refunds.sql) | Post-sale refund analysis | dwd_order_refund_apply_d_increment | Operator and refund result categorization |

---

## 📝 How to Catalog a Query

1. **Copy** the query from the `queries/` folder or another source
2. **Rename** if necessary to a descriptive name in `kebab-case`
3. **Add header** with value context:

```sql
-- ============================================================================
-- REPOSITORY QUERY: [Descriptive Name]
-- ============================================================================
-- Context: [Where/when this query is used]
-- Value: [Why this query is valuable as reference]
-- Origin: [Link or reference to original query]
-- ============================================================================
-- Main tables: [list of tables used]
-- Key filters: [description of applied filters]
-- ============================================================================

-- Query here...
```

4. **Organize** into thematic subfolder if applicable
5. **Update** this README with the query entry

---

## 🔍 Cataloging Criteria

Catalog queries that meet at least one criterion:

- ✅ **Frequent reuse** - Query used regularly in analyses
- ✅ **Didactic complexity** - Demonstrates well-applied advanced patterns
- ✅ **Data integration** - Connects multiple sources elegantly
- ✅ **Problem solving** - Resolves edge cases or specific scenarios
- ✅ **Base for variations** - Serves as template for similar queries

---

## ⚠️ Important

- **Do not modify** queries in active use without checking dependencies
- **Keep synchronized** with the original version when applicable
- **Document changes** in the query header

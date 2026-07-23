# 📋 Query Convention

> Mandatory rules for creating and organizing queries.

---

## 🗂️ Folder Structure

Every NEW query must be saved in:

```
sql-library/
└── queries/
    ├── presto/           # Generic Presto queries
    │   ├── README.md     # Query index
    │   └── *.sql
    ├── data-e/           # Data-E specific queries
    │   ├── README.md     # Query index
    │   └── *.sql
    ├── data-e-test/      # Data-E test queries
    ├── draft/            # Temporary/draft queries
    └── repository/       # Reference queries
```

**⚠️ FUNDAMENTAL RULE:**
- If query accesses **Data-E** data → Save in `sql-library/queries/data-e/`
- If query is **Presto generic** → Save in `sql-library/queries/presto/`
- If query is **for testing** → Save in `sql-library/queries/data-e-test/`
- If query is **temporary** → Save in `sql-library/queries/draft/`

Never save queries in root of `sql-library/queries/` - always choose the correct subfolder.

---

## 📝 Mandatory Template

Every query must follow this header:

```sql
/*
================================================================================
QUERY: [descriptive-name]
================================================================================
DESCRIPTION:
    [Explain what this query does in 2-3 lines]

AUTHOR:
    [Your name] ([email])

CREATION DATE:
    [YYYY-MM-DD]

LAST UPDATE:
    [YYYY-MM-DD] - [Brief description of what changed]

PARAMETERS:
    - [parameter1]: [description] (required/optional)
    - [parameter2]: [description] (required/optional)

TABLES USED:
    - [database.schema.table]: [brief description of what it contains]

RETURN:
    [Describe returned columns and their meanings]

USAGE EXAMPLE:
    [Show an example of how to execute this query]

NOTES:
    - [Any important observation, performance, limitations, etc]
    - [Another note if necessary]
================================================================================
*/

-- YOUR QUERY HERE

```

---

## ✅ Checklist Before Saving

Before saving a new query, check:

- [ ] **Correct location:** Is it in `presto/`, `data-e/`, `data-e-test/`, or `draft/`?
- [ ] **Complete header:** Are all template fields filled?
- [ ] **Descriptive name:** Does filename explain what query does?
- [ ] **Index updated:** Added to folder README.md?
- [ ] **Tested:** Does query execute without errors?
- [ ] **Performance:** Are indexes being used in filters?

---

## 📛 File Naming

Use descriptive `kebab-case`:

✅ **Good:**
- `active-users-by-month.sql`
- `daily-revenue-with-installments.sql`
- `canceled-orders-last-7-days.sql`

❌ **Avoid:**
- `query1.sql` (not descriptive)
- `User_Active.sql` (snake_case + inconsistent English)
- `test.sql` (temporary became permanent)

---

## 📚 Index Maintenance

Each folder (`presto/`, `data-e/`, etc.) must have a `README.md` with index:

```markdown
# Presto Queries

## Index

### Users
| Query | Description | Author | Date |
|-------|-------------|--------|------|
| [active-users-by-month.sql](./active-users-by-month.sql) | Lists monthly active users | Vinicius Castanho | 2024-07-22 |

### Financial
| Query | Description | Author | Date |
|-------|-------------|--------|------|
| [daily-revenue-with-installments.sql](./daily-revenue-with-installments.sql) | Daily revenue with installment details | Vinicius Castanho | 2024-07-20 |
```

**Whenever you create a new query, add to index!**

---

## 🤖 Integration

The system will:

1. **Suggest correct folder** when you create a query
2. **Check header** and alert if incomplete
3. **Ask** if you want to add to index
4. **Update Encyclopedia** when detecting new tables

---

## 📝 Complete Example

```sql
/*
================================================================================
QUERY: active-users-by-month
================================================================================
DESCRIPTION:
    Lists users who performed at least one action in the app
    in reference month, with city breakdown.

AUTHOR:
    Vinicius Castanho (viniciuscastanho@didiglobal.com)

CREATION DATE:
    2024-07-22

LAST UPDATE:
    2024-07-22 - Initial creation

PARAMETERS:
    - reference_month: Month in 'YYYY-MM' format (required)
    - city: City name for filter (optional)

TABLES USED:
    - analytics.users_activity: User activities log
    - analytics.users_profile: User registration data

RETURN:
    - user_id: User ID
    - city: User city
    - total_actions: Number of actions in period
    - last_action: Date of last action

USAGE EXAMPLE:
    -- All active users in July/2024
    SELECT * FROM (
        [paste query here]
    ) WHERE reference_month = '2024-07';

NOTES:
    - Query uses date partitions, keep temporal filters
    - Avoid SELECT *, list only necessary columns
================================================================================
*/

SELECT
    u.user_id,
    p.city,
    COUNT(*) as total_actions,
    MAX(u.event_time) as last_action
FROM analytics.users_activity u
JOIN analytics.users_profile p ON u.user_id = p.user_id
WHERE date_format(u.event_time, '%Y-%m') = '${reference_month}'
  AND (${city} IS NULL OR p.city = ${city})
GROUP BY 1, 2
ORDER BY 3 DESC;
```

---

**Last updated:** 2024-07-22  
**Version:** 1.0

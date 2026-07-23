# 📚 SQL Library - Queries and SQL Assets

> **Specific context**: This CLAUDE.md loads automatically when you work in the `sql-library/` folder.

---

## Purpose

This folder stores **reusable SQL queries**, **reference assets**, and **analytical documentation** for data analysis. It's the main repository for cataloguing and organizing queries.

---

## Structure

```
sql-library/
├── encyclopedia/               # Dictionary of data and references
│   └── README .md
├── queries/                    # Reusable SQL queries
│   ├── data -e/                # Productive queries (no CTEs, no variables)
│   ├── data -e-test/         # Test queries (no CTEs, with variables)
│   ├── presto/                # Scheduled queries
│   ├── draft/                 # Temporary/draft queries
│   └── README .md              # Query catalog
├── repository/                 # Catalogued reference queries
│   └── README .md
└── CLAUDE .md                  # This file
```

---

## Rules by Folder

| Folder | CTEs | Variables | Usage |
|-------|------|-----------|-----|
| `queries/data -e/` | ❌ Not allowed | ❌ Not allowed | Ready for production |
| `queries/data -e-test/` | ❌ Not allowed | ✅ Allowed | Local testing |
| `queries/presto/` | ✅ Allowed | ✅ Allowed | Scheduled queries |
| `queries/draft/` | ✅ Allowed | ✅ Allowed | Temporary drafts |
| `repository/` | Per pattern | Per pattern | High-value reference |

---

## Conventions

### File Naming
- Use `kebab-case ` for file names
- Do not use version numbers in filenames (use git)
- Extension `.sql ` for queries

### Standard Header

```sql
-- ============================================================================
-- QUERY: [Descriptive Name]
-- ============================================================================
-- Description: brief explanation of what the query does
-- Source: [main table]
-- Destination: [where output is used]
-- Test date: YYY-YY-MM-DD
-- Expected result: description of expected output
-- ============================================================================
-- Parameter s:
--   ${parameter} - description
-- ============================================================================

-- Query here ...
```

### Queries -E Specific

- **Do NOT use CTEs ** ( WITH clause es) - use subqueries
- **Do NOT use parameterized variables ** in final version
- Known limitation documents
- Include optimisation comment s

---

## How to Use

### Add New Query

1. ** Choose appropriate folder ** follow the table rules
2. Create file following the standard header
3. Update `query /README .md ` with new query
4. Test before commit
5. Commit tag `[query ] involves forcing suggestions`
   ```
   [query ] Add groceries funnel query for Queries E

   - Metrics : paid orders, cancellations, UA, duty types
   - Dimension s: city, vehicle type, work type, rider type
   - Tested on 20 26-07-13

  Co-Authored -By: Claude <noreply anthropic.com>
   ```

**Doub t which folder to use ?** Ask the user.

### Requests for Reference

1. Copy high -value query repository /`
2. Add context in header (origin, value, key tables)
3. Organise into sub folder if applicable
4. Update repository /README .md `

---

## Query Catalog

Full active query catalog: [query /README .md ]( ./query /README .md )

Full reference query catalog: [repository /README .md ]( ./repository /README .md )

---

## Tips

### Performance
- Filter on source tables before joins
- Avoid SELECT * in production queries
- Use available indexes

### Readability
- 4 -space indentation
- Comment s in complex section s
- Descriptive alias es

### Version control
- One query per file
- Atomic commit s
- Clear description s in commit message s

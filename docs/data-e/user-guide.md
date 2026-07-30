---
source: "https://cooper.didichuxing.com/knowledge/2203778693031/2203778843852"
document_type: "User Guide"
version: "Current"
extracted_at: "2026-07-28"
language: "en-US (English)"
status: "Active"
sync: "manual"
last_sync: "2026-07-28"
---

# Data E User Instructions

> **Purpose**: Quick start guide and FAQ for Data-E platform users
> **Audience**: New and existing DiDi employees using Data E
> **Source**: DiDi Cooper Knowledge Base

---

## Table of Contents

1. [What is Data E](#what-is-data-e)
2. [Quick Start Guide](#quick-start-guide)
3. [Function Introduction](#function-introduction)
4. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
5. [Troubleshooting](#troubleshooting)
6. [Version History](#data-e-version-history)

---

## What is Data E

**Data E** is DiDi's unified data query and visualization platform that enables employees to:

- ✅ Access data tables across the organization
- ✅ Write and execute SQL queries
- ✅ Create visual reports and dashboards
- ✅ Request access to new data sources
- ✅ Collaborate on data analysis

### Why Use Data E?

| Problem | Data E Solution |
|---------|----------------|
| Can't find data tables | Unified search across all DiDi data |
| Need to write complex SQL | Visual Canvas mode + SQL editor |
| Waiting for data access | Self-service table requests |
| Results are hard to share | Built-in sharing and collaboration |

---

## Quick Start Guide

### Step 1: Access Data E

1. Log into DiDi internal tools
2. Navigate to **Data E** (数易)
3. You'll land on the **Homepage** with your recent tables

### Step 2: Find Your Data

**Option A - Quick Search:**
1. Click the search icon (🔍) or press the shortcut key
2. Type a table name or keyword
3. Select from results

**Option B - Advanced Search:**
1. Click "Advanced Search"
2. Apply filters:
   - Department (负责部门)
   - Project (项目)
   - Update Cycle (更新周期)
   - Application Scenario (应用场景)
3. Browse filtered results

### Step 3: Preview Data

1. Click on a table name
2. View the **1000-row preview** instantly
3. Use column filters (🔽 icon) to narrow down
4. Click columns to sort

### Step 4: Query Data

**Method 1 - SQL Editor:**
1. Click "SQL Query" (SQL查询)
2. Write your query
3. Click "Run" (运行)

**Method 2 - Canvas Mode:**
1. Click "Canvas" (画布)
2. Drag and drop tables
3. Configure joins visually
4. Generate SQL automatically

### Step 5: Save & Share

1. Save query to **My Station** (我的站)
2. Name your query for easy retrieval
3. Share link with team members
4. Export results (CSV, Excel)

---

## Function Introduction

### 1. Homepage Dashboard

| Feature | Description | How to Access |
|---------|-------------|---------------|
| Frequent Tables | Tables you use most often | Homepage → Top section |
| Recent Views | Recently accessed tables | Homepage → "Last Viewed" |
| My Station | Personal workspace | Homepage → "My Station" tab |
| Quality Checks | Data validation tools | Homepage → "Quality" section |

### 2. Search Capabilities

**Basic Search:**
- Searches: Table names, descriptions, tags
- Results: Direct links to tables
- Speed: < 2 seconds

**Advanced Search:**
- Filters by: Storage type, project, update frequency
- Boolean logic: AND, OR between filters
- Results: Summarized with metadata

### 3. Visualization Features

| Feature | Use Case | Example |
|---------|----------|---------|
| 1000-row Preview | Quick data check | Preview daily report |
| Column Filtering | Narrow results | Filter by city=chennai |
| Sorting | Organize data | Sort by date descending |
| Export | Use in Excel | Export 1000 rows to CSV |

### 4. Request New Tables

**When to Use:**
- You need data not currently available
- Cross-department data access
- New project data requirements

**Process:**
1. Click "Request New Table" (申请新表)
2. Fill the form:
   - Required elements (fields you need)
   - Title (table name)
   - Storage key (location)
   - Application scenario (why you need it)
   - Category (data type)
   - Update method (frequency)
   - Responsible department (owner)
3. Submit request
4. Track status in "My Requests"

**Approval Time:**
- Standard: 1-2 business days
- Urgent: Contact data owner directly

---

## Frequently Asked Questions (FAQ)

### Q1: How do I find a specific table?
> **A**: Use the search bar at the top. Enter partial table names, keywords, or even column names. Results show table descriptions to help you identify the right one.

### Q2: Can I download large datasets?
> **A**: The preview shows 1000 rows maximum. For full datasets:
> - Export query results (if < 10,000 rows)
> - Contact data owner for bulk data access
> - Use DiDi's data transfer tools for larger exports

### Q3: Why can't I see certain tables?
> **A**: Possible reasons:
> - **No permission** → Request access via "New Table Request"
> - **Table doesn't exist** → Check spelling or ask the data owner
> - **Department restriction** → Contact the owning department

### Q4: How do I know if data is fresh?
> **A**: Check these indicators:
> - **Last Updated** timestamp on table preview
> - **Update Cycle** information in table metadata
> - "Recently Updated Tables" section in My Station

### Q5: Can I write complex SQL (joins, subqueries)?
> **A**: Yes! The SQL editor supports:
> - Multiple table joins
> - Subqueries and CTEs
> - Window functions
> - Aggregate functions
> - Custom expressions

### Q6: What if my query times out?
> **A**: Try these optimizations:
> - Add `WHERE` clauses to filter early
> - Use `LIMIT` for testing
> - Avoid `SELECT *` - specify columns
> - Check if indexes exist on filtered columns
> - Run during off-peak hours

### Q7: How do I save my queries?
> **A**: After running a query:
> 1. Click "Save" 💾 icon
> 2. Name your query descriptively
> 3. Choose location in My Station
> 4. Add tags for easier search

### Q8: Can I share queries with my team?
> **A**: Yes:
> - **Share link**: Copy URL from browser (others need table permissions)
> - **Export**: Download results and share file
> - **Save to shared workspace**: If your team has a shared station

### Q9: Is there training for new users?
> **A**: Yes:
> - Onboarding session: Contact Data Platform team
> - Video tutorials: Check DiDi Learning platform
> - Office hours: Weekly Q&A sessions (check internal calendar)

### Q10: How do I request support?
> **A**:
> 1. Check this FAQ first
> 2. Ask in #data-help Slack channel
> 3. Email: data-platform@didiglobal.com
> 4. For urgent issues: Contact your department's data steward

---

## Troubleshooting

### Problem: Search returns no results
**Check:**
- ✓ Try different keywords (English/Chinese)
- ✓ Clear filters if using Advanced Search
- ✓ Check spelling
- ✓ Ask in Slack if table name is correct

### Problem: Cannot execute query
**Common causes:**
- Syntax error → SQL editor highlights errors
- Missing permissions → Request table access
- Table doesn't exist → Check table name
- Timeout → Optimize query (see Q6)

### Problem: Data looks outdated
**Actions:**
- Check "Last Updated" timestamp
- Confirm update cycle (daily/hourly/weekend delays)
- Contact data owner for urgency

### Problem: Export fails
**Try:**
- Reduce result size with filters
- Try different format (CSV vs Excel)
- Check browser download permissions

---

## Data E Version History

| Version | Release Date | Key Changes |
|---------|--------------|-------------|
| V3.12 | Current | Enhanced homepage, quick visualization, table request |
| V3.11 | 2025 | Improved search, better mobile support |
| V3.10 | 2025 | Canvas mode improvements |
| V3.0 | 2024 | Major redesign, new UI |
| V2.x | 2023 | Legacy version (deprecated) |

*For detailed changelog, see internal release notes*

---

## Best Practices

### Naming Queries
✅ Good:
> `monthly_active_users_2026`
> `driver_churn_analysis_chennai`

❌ Avoid:
> `query1`
> `temp_query`
> `test`

### Query Performance
✅ Do:
> `SELECT user_id, city, order_date FROM orders WHERE order_date >= '2026-01-01'`

❌ Avoid:
> `SELECT * FROM orders WHERE YEAR(order_date) = 2026` -- Function on column

### Collaboration
✅ Share knowledge:
> - Comment queries with business logic
> - Tag saved queries appropriately
> - Document complex transformations

---

## Quick Reference Card

| Task | Path | Shortcut |
|------|------|----------|
| Search tables | Top bar | Ctrl/Cmd + J |
| Quick preview | Click table name | - |
| Open SQL editor | "SQL Query" button | - |
| Save query | 💾 icon | Ctrl/Cmd + S |
| Request table | "New Table Request" | - |
| View history | "My Station" → "Last Viewed" | - |

---

## Related Resources

- **Product Manual**: [V3.12 Technical Reference](./v3.12-manual.md)
- **SQL Help**: [SQL Encyclopedia](../../.claude/skills/sql-encyclopedia/SKILL.md)
- **Internal Help**: Slack #data-help or data-platform@didiglobal.com

---

*Last synced: 2026-07-28*
*Next review: 2026-08-28*
*Maintainer: Data Platform Team*

---

> 💡 **Tip**: Bookmark frequently used tables in "My Station" for quick access without searching!

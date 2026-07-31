---
source: "https://cooper.didichuxing.com/knowledge/2199579337142/2203684467436"
document_type: "Product Manual"
version: "3.12"
extracted_at: "2026-07-28"
language: "zh-CN (Chinese)"
status: "Active"
sync: "manual"
last_sync: "2026-07-28"
---

# 数易 (Data-E) V3.12 Product Manual

> **数易** (Shù Yì) = Data-E - DiDi's Data Query and Visualization Platform
> **Version**: 3.12
> **Source**: DiDi Cooper Knowledge Base

---

## Overview

Data-E (数易) is DiDi's internal data platform for querying, visualizing, and managing data tables across the organization. It provides a unified interface for data discovery, SQL querying, and dashboard creation.

---

## Key Features

### 1. Homepage - Table Management
**Function**: Central hub for accessing your data resources

Features:
- **My Frequent Tables** (我高频使用的表) - Quick access to commonly used tables
- **Last Viewed** (最近查看的表) - Recently accessed tables for quick return
- **Adaptive History** - Learning-based recommendations based on usage patterns
- **My Repositories** (我的收藏) - Personal workspace for saved tables and queries

### 2. Quick Search
**Function**: Intelligent search across all platform resources

Capabilities:
- Search by table name, keywords, or description
- Search through canvas, files, and index hits
- Filters by category (department, project, update cycle, application)

How to use:
1. Click search icon or press shortcut
2. Enter table name or keyword
3. View results from canvas history, files, and indexed tables

### 3. Advanced Search
**Function**: Refined filtering for complex queries

Filter Options:
- **Storage** (存储) - Data storage type
- **Project** (项目) - Associated project
- **Update Cycle** (更新周期) - Refresh frequency (daily, hourly, real-time)
- **Application** (应用) - Business use case

### 4. Visualization - Published Functional Viewer
**Function**: Instant data preview and interaction

Features:
- **Quick View** (快捷可视化) - Instant visualization of query results
- **Index Display** (索引展示) - Shows table indexes and schemas
- **1000-row Preview** - View first 1000 rows directly in browser
- **Interactive Filtering** - Apply filters on columns without writing SQL
- **Canvas Mode** - Visual drag-and-drop query builder

### 5. Repository Management - "My Station" (我的站)
**Function**: Personal workspace organization

Sections:
- **My Tables** (我的表) - Tables you own or have access to
- **Last Viewed** (最近查看) - Recent browsing history
- **Common Quality Checks** (质量常用) - Data quality validation tools
- **Recently Updated Tables** (最近更新表) - Tables with recent data updates

### 6. New Table Request
**Function**: Request access to new tables

Request Form Fields:
- **Elements** (要素) - Required data elements/fields
- **Title** (标题) - Table name or identifier
- **Storage Key** (存储键) - Storage location/path
- **Application Scenario** (应用场景) - Business use case description
- **Category** (分类) - Data category (user, order, driver, etc.)
- **Currency/Type** (币种) - Currency or data type
- **Update Method** (更新方式) - Update frequency and method
- **Responsible Department** (负责部门) - Owner team

---

## What's New in V3.12

### New Features:
1. **Enhanced Homepage Table Management**
   - Redesigned workspace with better organization
   - Improved navigation between personal and shared tables

2. **Optimized Intelligent Search**
   - Better search relevance for Chinese and English terms
   - Faster indexing of new tables

3. **Quick Data Visualization**
   - View up to 1000 rows instantly
   - Column filters without SQL knowledge
   - Exportable previews

4. **Streamlined Table Request Process**
   - Simplified form for requesting new table access
   - Better tracking of request status

### Improvements:
- Performance improvements for large table queries
- Better mobile responsiveness
- Enhanced security for sensitive data tables

---

## User Workflows

### For New Users:
1. Access Data-E via internal DiDi tools
2. Start with Quick Search to find relevant tables
3. Use "My Station" to save frequently accessed tables
4. Learn SQL or use Canvas mode for queries

### For Data Analysts:
1. Search for required tables using keywords
2. Preview data with 1000-row viewer
3. Write SQL or use Canvas for complex queries
4. Save results to personal workspace
5. Request new tables if needed via the form

### For Data Engineers:
1. Monitor "Recently Updated Tables" for data freshness
2. Use Advanced Search with filters for specific projects
3. Access Quality Checks tools for data validation
4. Submit table requests for cross-department data needs

---

## Access & Permissions

- **Who can access**: DiDi employees with data permissions
- **Permissions**: Access is role-based and table-specific
- **Request process**: Use the "New Table Request" feature for access to restricted tables

---

## Related Documents

- User Guide: [Data E Quick Start](../user-guide.md)
- Version History: See internal changelog
- SQL Best Practices: [SQL Encyclopedia](../../.claude/skills/sql-encyclopedia/SKILL.md)

---

## Notes for Users

> ⚠️ **Data Privacy**: All queries and access are logged for compliance
> 
> 💡 **Performance**: Large queries (>1M rows) may take time - consider using filters
> 
> 🔄 **Updates**: Tables refresh based on their update cycle (check metadata)

---

*Last synced: 2026-07-28*
*Next review: 2026-08-28*
*Maintainer: Data Platform Team*

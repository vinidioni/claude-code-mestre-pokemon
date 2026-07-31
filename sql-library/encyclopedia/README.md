# 📚 Table Encyclopedia - DCCrazy

> Auto-generated database table documentation system.

---

## What It Is

The Encyclopedia is a JSON file (`sql-library/encyclopedia/tables.json`) that automatically maps the tables you query. It serves as a quick reference for:

- Knowing which tables you've already used
- Documenting the schema (columns and types)
- Describing the purpose of each table
- Avoiding repeated `DESCRIBE` queries

---

## How It Works

### Automatic Detection

When you execute a query in DCCrazy:

1. DCC analyzes the SQL query
2. Extracts table names (FROM, JOIN, INTO)
3. Checks if the table is already in the encyclopedia
4. If NEW: adds automatically
5. If already exists: updates the last query date

### Usage

```bash
# Analyze a specific query
python scripts/update-encyclopedia.py --query "SELECT * FROM users"

# Scan ALL queries in the directory
python scripts/update-encyclopedia.py --scan-all

# List all documented tables
python scripts/update-encyclopedia.py --list

# Add manual description
python scripts/update-encyclopedia.py --table users --describe "App users table"
```

---

## File Structure

```json
{
  "_metadata": {
    "version": "1.0",
    "created_at": "2024-07-22",
    "updated_at": "2024-07-22",
    "description": "Auto-generated table encyclopedia"
  },
  "tables": {
    "analytics.users_activity": {
      "description": "User activity log in the app",
      "columns": {
        "user_id": "bigint - User ID",
        "event_time": "timestamp - Event date/time",
        "event_type": "string - Type of action performed"
      },
      "first_query": "2024-07-22T10:00:00",
      "last_query": "2024-07-22T15:30:00"
    }
  }
}
```

---

## Integration with Workflows

Use the dedicated workflow:

```bash
claude workflow run update-table-encyclopedia --query="SELECT * FROM orders"
```

Or let DCC ask:

```
You: "Create a query that joins users with orders"
DCC: [creates query]
DCC: "Detected new tables: users, orders. Add to encyclopedia?"
You: "Yes"
DCC: [updates tables.json]
```

---

## Best Practices

1. **Always add descriptions** when a new table is detected
2. **Keep columns updated** if the schema changes
3. **Use as reference** before querying unknown tables
4. **Don't manually edit** the `_metadata` - it's auto-generated

---

**File:** `sql-library/encyclopedia/tables.json`  
**Script:** `scripts/maintenance/update-encyclopedia.py`

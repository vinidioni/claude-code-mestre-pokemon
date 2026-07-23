# 🧠 Feedback System

> Continuous learning system based on user preferences.

---

## What It Is

The system learns from you. When it detects patterns in your interactions, it asks if you want that to be remembered for next times.

**Practical example:**

```
You create a query and use date_trunc() to group by month.

System: "I noticed you prefer date_trunc() over strftime().
      Want me to suggest this in future queries?"

You: "Yes"

System: [saves to .claude/memory/feedback-system.md]

---
name: monthly-grouping-preference
type: feedback
---
User prefers to use date_trunc('month', column) to group by month.
Always suggest date_trunc first instead of strftime().
```

Next time you create a query with monthly grouping:
```
System: "To group by month, you usually use date_trunc().
      Want me to use it this way?"
```

---

## How It Works

### 1. Pattern Detection

The system observes:
- How you write queries (style, preferred functions)
- How you organize files
- Which workflows you use most
- Corrections you make manually

### 2. Asks the User

Never learns silently. Always asks:
- "Want me to remember this?"
- "Can I suggest this next time?"
- "Is this a pattern of yours?"

### 3. Storage

Feedbacks are saved in:
```
.claude/memory/feedback-system.md
```

Format:
```markdown
---
name: feedback-name
type: feedback
---
Description of what was learned.
Instructions on how to apply.
```

### 4. Future Application

In similar future interactions, the system:
1. Consults feedback-system.md
2. Checks if there's an applicable pattern
3. Suggests based on previous learning

---

## Feedback Types

| Type | When Registered |
|------|-----------------|
| **Code preference** | Writing style, favorite functions |
| **Organization** | How you prefer to structure files |
| **Correction** | When you correct something the system did |
| **Automation** | Tasks you do repeatedly |

---

## Managing Feedbacks

### View all feedbacks

```bash
cat .claude/memory/feedback-system.md
```

### Remove a feedback

Edit the file and delete the corresponding section.

### Correct a feedback

Ask the system:
"Update feedback X to say Y"

---

## Useful Feedback Examples

```markdown
---
name: sql-cte-preference
type: feedback
---
User prefers to use CTEs (WITH) instead of subqueries.
Always suggest structure with CTE first.

---
name: reports-organization
type: feedback
---
User always names reports as: {type}-report-YYYY-MM-DD.md
Suggest this pattern when creating new reports.

---
name: query-description-correction
type: feedback
---
User always adds detailed description in queries.
Alert if a new query is missing description in header.
```

---

**File:** `.claude/memory/feedback-system.md`  
**No storage limit** (for now)

# code-review

Automated code review agent.

## Purpose

Performs comprehensive code review analyzing multiple dimensions:
- 🐛 Bugs and logic issues
- 🔒 Security vulnerabilities
- ⚡ Performance bottlenecks
- 📖 Readability and maintainability
- 🧪 Testability

## Usage

### Basic
```bash
# Review uncommitted changes
claude "execute code-review"

# Review specific file
claude "execute code-review --target=src/components/Button.tsx"

# Review directory
claude "execute code-review --target=src/api/"
```

### Specific Focus
```bash
# Only security
claude "execute code-review --focus=security"

# Only performance
claude "execute code-review --focus=performance"

# Only bugs
claude "execute code-review --focus=bugs"
```

### Filter Severity
```bash
# Only critical errors
claude "execute code-review --severity=error"

# Warnings and above
claude "execute code-review --severity=warning"
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| target | string | No | `git diff HEAD` | Analysis target |
| focus | string | No | `all` | Specific focus |
| severity | string | No | `all` | Minimum severity |

### Values for `target`
- `git diff` (default): unstaged changes
- `git diff HEAD`: changes since last commit
- File path: `src/api/users.ts`
- Directory path: `src/components/`

### Values for `focus`
- `all`: All dimensions
- `security`: Only security
- `performance`: Only performance
- `bugs`: Only bugs and logic
- `style`: Only style and readability

## Output

Report is generated in Markdown format with:

### 🔴 CRITICAL
Issues that must be fixed before merge.

### 🟡 IMPORTANT
Issues that should be fixed in current sprint.

### 🟢 SUGGESTION
Improvements to consider.

## Report Structure

```markdown
# Code Review Report

## Summary
- Files analyzed: 12
- Issues found: 8
- Critical: 2
- Important: 3
- Suggestions: 3

## Critical Issues

### 🔴 CRITICAL: SQL Injection Risk
**File:** `src/api/users.ts:45`
**Issue:** User input directly concatenated in SQL query
**Fix:** Use parameterized queries

## Important Issues

### 🟡 IMPORTANT: Memory Leak
**File:** `src/components/List.tsx:23`
**Issue:** Event listener not removed on unmount
**Fix:** Add cleanup in useEffect return

## Suggestions

### 🟢 SUGGESTION: Extract Function
**File:** `src/utils/helpers.ts:112`
**Suggestion:** This logic could be extracted into a separate function
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Code Review
        run: |
          claude "execute code-review --target=git diff HEAD"
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
claude "execute code-review --target=git diff --cached"
```

## Limitations

- Requires code to be syntactically valid
- Does not execute code (static analysis only)
- May produce false positives in complex codebases

---

**Version:** 1.0.0  
**Last updated:** 2024-07-15

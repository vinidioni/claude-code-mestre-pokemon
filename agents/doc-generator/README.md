# doc-generator

Automatically generates documentation from code.

## Purpose

Automates creation and maintenance of documentation:
- Professional README.md files
- API documentation (OpenAPI/Swagger)
- Changelogs from commits
- Contribution guides
- Architecture documentation
- Inline comments (JSDoc/TSDoc)

## Usage

### README
```bash
# Generate project README
claude "execute doc-generator --type=readme"

# Generate README for submodule
claude "execute doc-generator --type=readme --target=src/auth/"
```

### API Documentation
```bash
# Generate API docs
claude "execute doc-generator --type=api"

# Specific format
claude "execute doc-generator --type=api --output=docs/openapi.yaml"
```

### Changelog
```bash
# Since last tag
claude "execute doc-generator --type=changelog"

# Specific period
claude "execute doc-generator --type=changelog --since=v1.0.0"
```

### Contributing
```bash
claude "execute doc-generator --type=contributing"
```

### Architecture
```bash
claude "execute doc-generator --type=architecture"
```

### Inline Comments
```bash
# Entire project
claude "execute doc-generator --type=inline"

# Specific file
claude "execute doc-generator --type=inline --target=src/utils.ts"
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| type | string | Yes | `readme` | Documentation type |
| target | string | No | `.` | Generation target |
| output | string | No | (auto) | Output path |

### Documentation Types

| Type | Description | Default Output |
|------|-----------|---------------|
| readme | Project README.md | `README.md` |
| api | API documentation | `docs/api.md` |
| changelog | Changelog | `CHANGELOG.md` |
| contributing | Contribution guide | `CONTRIBUTING.md` |
| architecture | Architecture doc | `docs/architecture.md` |
| inline | JSDoc/TSDoc comments | (inline) |

## Templates

### Generated README

Automatically includes:
- Title and description
- Badges (if CI detected)
- Main features
- Technology stack
- Installation and configuration
- Usage examples
- Tests
- Folder structure
- Contributing
- License

### API Docs

Supports:
- REST API (Markdown or OpenAPI)
- GraphQL (schemas and examples)
- gRPC (protobuf docs)

### Changelog

Follows [Keep a Changelog](https://keepachangelog.com/):
- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

## Examples

### Before and After

**Project without README:**
```
src/
├── index.ts
├── api.ts
└── utils.ts
```

**After executing:**
```markdown
# My Project

## 🎯 Purpose
REST API for task management.

## 🚀 Technologies
- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma

## 📦 Installation
```bash
npm install
npm run migrate
npm run dev
```

## 🔧 Configuration
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
```

## 🚦 Usage
```bash
curl http://localhost:3000/api/tasks
```

## 📁 Structure
```
src/
├── index.ts      # Entry point
├── api.ts        # API routes
└── utils.ts      # Utilities
```
```

## Customization

To customize output, edit the workflow or create a new one based on the template.

## Tips

1. **Always review** - Generated documentation is a starting point
2. **Add context** - Include business-specific information
3. **Keep updated** - Regenerate periodically
4. **Use in CI** - Generate docs automatically on releases

## CI Integration

### GitHub Actions - Generate README
```yaml
name: Generate Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate README
        run: claude "execute doc-generator --type=readme"
      - name: Commit changes
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add README.md
          git commit -m "[doc] Update README automatically" || true
          git push
```

### GitHub Actions - Changelog
```yaml
name: Changelog
on:
  release:
    types: [created]
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Generate Changelog
        run: claude "execute doc-generator --type=changelog"
```

## Limitations

- Requires well-structured code for best results
- Does not replace business documentation
- Inline comments may need human review
- Stack detection limited to most common ones

## History

- 1.0.0 (2024-07-07) - Initial version

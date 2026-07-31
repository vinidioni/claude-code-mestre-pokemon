# Cooper - DiDi Documentation Platform

**Unified skill** for complete integration with DiDi's Cooper documentation platform.

## Overview

This single skill provides all Cooper functionality:

| Capability | Description | Tools |
|------------|-------------|-------|
| 🔍 **Search** | Find documents by keyword | `cooper_search`, `cooper_list_spaces` |
| 📖 **Read** | Extract document content | `cooper_get_document` |
| ✏️ **Write** | Create new documents | `cooper_create_document` |
| 🔗 **Parse URLs** | Extract IDs from links | Built-in parsing |
| 🖼️ **Images** | Extract and analyze images | `cooper_extract_images` |

## Activation Triggers

The skill activates when you mention:
- **General**: "cooper", "documento didi", "docs da didi"
- **Search**: "buscar no cooper", "procurar documento", "search cooper"
- **Read**: "ler documento cooper", "conteúdo cooper", "abrir doc"
- **Write**: "criar documento cooper", "salvar no cooper", "novo doc cooper"
- **Images**: "imagem cooper", "foto no documento", "extrair imagem cooper"
- **URLs**: "extrair id cooper", "parse url cooper"

## MCP Tools

### cooper_search
```json
{
  "query": "onboarding process",
  "limit": 5
}
```

### cooper_get_document
```json
{
  "docId": "2207291123516"
}
```

### cooper_create_document
```json
{
  "title": "Meeting Notes",
  "content": "## Agenda\n\n1. Review...",
  "spaceId": "space_123"
}
```

### cooper_list_spaces
List available workspaces.

### cooper_extract_images
```json
{
  "docId": "2207291123516",
  "analyzeContent": true
}
```

## URL Parsing

Automatically extracts IDs from:

| Type | Pattern | Example |
|------|---------|---------|
| Document | `/docs2/document/{id}` | `2207291123516` |
| Knowledge | `/docs2/knowledge/{id}` | `kb456` |
| Space | `/docs2/space/{id}` | `eng123` |
| Sheet | `/docs2/sheet/{id}` | `sheet789` |
| Wiki | `/wiki/{id}` | `wiki123` |

## Examples

```
"Search Cooper for API integration"
"Read document 2207291123516"
"Create a doc called 'Daily Meeting' in Cooper"
"Extract images from this Cooper document"
"Parse this Cooper URL"
```

## Related Documentation

- [MCP Server README](../../mcp-servers/cooper/README.md)
- [SKILL.md](SKILL.md) - Full skill documentation

## Authentication

Browser login required on first use. Session saved for ~24h.

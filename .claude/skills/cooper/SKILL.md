---
name: cooper
description: Complete integration with DiDi Cooper Documentation Platform - search, read, write, parse URLs, and extract images
triggers:
  - cooper
  - documento didi
  - docs da didi
  - docs2
  - didichuxing.com/docs
  - documentação interna
  - buscar no cooper
  - procurar documento cooper
  - search cooper
  - ler documento cooper
  - conteúdo cooper
  - criar documento cooper
  - salvar no cooper
  - extrair id cooper
  - parse url cooper
  - imagem cooper
  - foto no documento
---

# Cooper - DiDi Documentation Platform

Complete skill set for interacting with DiDi's Cooper documentation platform.

## Overview

| Capability | Description | Key Tools |
|------------|-------------|-----------|
| **Search** | Find documents by keyword | `cooper_search`, `cooper_list_spaces` |
| **Read** | Extract document content | `cooper_get_document` |
| **Write** | Create new documents | `cooper_create_document` |
| **Parse URLs** | Extract IDs from Cooper links | Built-in parsing |
| **Images** | Extract and analyze images | `cooper_extract_images` |

## Resource Hierarchy

```
Team Space (ex: Engineering, Product, Data)
├── Knowledge Base (ex: API Docs, Onboarding, Runbooks)
│   ├── Documents (docs2/document/{id})
│   ├── Sheets (docs2/sheet/{id})
│   └── Wikis (wiki/{id})
├── Files (docs2/file/{id})
└── Tags (cross-reference organization)
```

## MCP Tools Available

### cooper_search
Search documents by keyword.

**Parameters:**
- `query` (string, required): Search term
- `limit` (number, optional): Max results (default: 10)

**Example:**
```json
{
  "query": "onboarding process",
  "limit": 5
}
```

### cooper_get_document
Get full document content.

**Parameters:**
- `docId` (string, required): Document ID or full URL

**Formats accepted:**
- ID: `"2207291123516"`
- URL: `"https://cooper.didichuxing.com/docs2/document/2207291123516"`

**Returns:**
```json
{
  "id": "2207291123516",
  "title": "Document Title",
  "content": "Full text content...",
  "headings": [{"level": 1, "text": "Introduction"}],
  "author": "Author Name",
  "date": "2024-01-15",
  "url": "https://cooper.didichuxing.com/docs2/document/2207291123516"
}
```

### cooper_create_document
Create new document in Cooper.

**Parameters:**
- `title` (string, required): Document title
- `content` (string, required): Content (text or markdown)
- `spaceId` (string, optional): Target space/folder ID

**Example:**
```json
{
  "title": "Team Meeting Notes",
  "content": "## Agenda\n\n1. Review...",
  "spaceId": "space_123"
}
```

### cooper_list_spaces
List available workspaces/spaces.

**Use for:**
- Discover where to create documents
- Navigate organizational structure

### cooper_extract_images
Extract and analyze images from documents.

**Parameters:**
- `docId` (string, required): Document ID or URL
- `saveLocal` (boolean, optional): Save files locally
- `analyzeContent` (boolean, optional): Run OCR/analysis

## URL Parsing

Automatically extracts IDs from Cooper URLs:

| Type | URL Pattern | Extracted ID |
|------|-------------|--------------|
| Document | `/docs2/document/{id}` | documentId |
| Knowledge | `/docs2/knowledge/{id}` | knowledgeId |
| Space | `/docs2/space/{id}` | spaceId |
| Sheet | `/docs2/sheet/{id}` | sheetId |
| File | `/docs2/file/{id}` | fileId |
| Wiki | `/wiki/{id}` | wikiId |

**Examples:**
```
Input:  https://cooper.didichuxing.com/docs2/document/2207291123516
Output: { type: "document", id: "2207291123516" }

Input:  cooper.didichuxing.com/docs2/space/eng123
Output: { type: "space", id: "eng123" }
```

## Usage Examples

### Search and Read
```
User: "Search Cooper for API integration and show me the most relevant doc"
→ cooper_search with query="API integration"
→ cooper_get_document with the most relevant result
```

### Read by URL
```
User: "Read this document: https://cooper.didichuxing.com/docs2/document/2207291123516"
→ cooper_get_document with docId=URL
```

### Create Document
```
User: "Create a Cooper doc called 'Daily Meeting' with: ..."
→ cooper_create_document with title and content
```

### Extract Images
```
User: "Extract images from document 2207291123516"
→ cooper_extract_images with analyzeContent=true
```

### Navigate Spaces
```
User: "List my Cooper spaces"
→ cooper_list_spaces
```

## Image Analysis Pipeline

When extracting images with `analyzeContent=true`:

1. **Detect**: Identify all images in document (HTML `<img>`, `<figure>`)
2. **Extract**: Download and process images (PNG/JPG conversion)
3. **Analyze**: OCR + visual analysis (diagrams, charts, UI)
4. **Embed**: Integrate descriptions into conversation context

## Authentication

On first use, MCP opens Chrome browser for login. After DiDi account login, session is saved for future use. Session lasts ~24h, then requires re-login.

## Tips

- Document IDs can be extracted from URLs: `/docs2/document/2207291123516` → ID is `2207291123516`
- Use English or Chinese search terms based on your company's convention
- Markdown is supported in document creation (## for headers, - for lists)
- Without spaceId, documents are created in default space
- Browser opens for confirmation when creating - review before saving
- Images larger than 10MB may be resized
- OCR quality depends on image resolution (300+ DPI ideal)

## Integration with Other Skills

- **intranet-fetcher**: For content on SSO-protected pages
- **dchat-send**: Send document links via message
- **conventional-commits**: Document changes in Cooper

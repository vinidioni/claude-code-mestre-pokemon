# Skill: cooper-link-parser

## Descrição
Extrai resourceId, knowledgeId, spaceId e outros identificadores de URLs Cooper automaticamente. Parseia qualquer link da documentação DiDi.

## Quando Usar
- Quando o usuário cola uma URL do Cooper e precisa extrair o ID
- Keywords: "extrair id", "parse url", "id do link", "cooper url", "link cooper"

## Capacidades

### Extrair IDs de URLs

**Formatos suportados:**

| Tipo | URL Pattern | ID Extraído |
|------|-------------|-------------|
| Documento | `/docs2/document/{id}` | documentId |
| Knowledge | `/docs2/knowledge/{id}` | knowledgeId |
| Space/Workspace | `/docs2/space/{id}` | spaceId |
| Planilha | `/docs2/sheet/{id}` | sheetId |
| Arquivo | `/docs2/file/{id}` | fileId |
| Wiki | `/wiki/{id}` | wikiId |

**Exemplos:**

```
Input: "https://cooper.didichuxing.com/docs2/document/2207291123516"
Output: { type: "document", id: "2207291123516", spaceId: null }

Input: "https://cooper.didichuxing.com/docs2/space/abc123"
Output: { type: "space", id: "abc123", parent: null }

Input: "cooper.didichuxing.com/docs2/knowledge/kb456"
Output: { type: "knowledge", id: "kb456", category: null }
```

## Como Funciona

1. **Regex Pattern Matching**: Identifica o tipo de recurso pela estrutura da URL
2. **Extração**: Captura o ID usando grupos de captura
3. **Validação**: Verifica se o ID está no formato esperado
4. **Enriquecimento**: Adiciona metadados (tipo, parent, categoria quando disponível)

## Uso com Outras Skills

Combine com:
- **cooper-read**: Extrai ID → Lê documento
- **cooper-write**: Extrai spaceId → Cria documento no espaço correto
- **cooper-search**: Extrai contexto → Refina busca

## Exemplos de Uso

### Extrair ID de documento
```
Usuário: "Pega o conteúdo desse doc: https://cooper.didichuxing.com/docs2/document/2207291123516"
→ cooper-link-parser extrai: { type: "document", id: "2207291123516" }
→ cooper-read usa o ID para buscar conteúdo
```

### Criar no espaço correto
```
Usuário: "Cria um documento no mesmo espaço desse: https://cooper.didichuxing.com/docs2/space/eng123"
→ cooper-link-parser extrai: { type: "space", id: "eng123" }
→ cooper-write cria documento com spaceId="eng123"
```

### Múltiplos links
```
Usuário: "Analisa esses docs: [link1] [link2] [link3]"
→ cooper-link-parser extrai IDs de todos
→ cooper-read processa em batch
```

## Padrões de URL Suportados

```regex
# Documento
https?://cooper.didichuxing.com/docs2/document/(\d+)

# Knowledge Base
https?://cooper.didichuxing.com/docs2/knowledge/([a-zA-Z0-9_-]+)

# Space/Workspace
https?://cooper.didichuxing.com/docs2/space/([a-zA-Z0-9_-]+)

# Planilha
https?://cooper.didichuxing.com/docs2/sheet/([a-zA-Z0-9_-]+)

# Arquivo
https?://cooper.didichuxing.com/docs2/file/([a-zA-Z0-9_-]+)

# Wiki
https?://cooper.didichuxing.com/wiki/([a-zA-Z0-9_-]+)
```

## Dicas

- URLs sem protocolo (`http://`) são aceitas
- Query parameters são ignorados na extração
- Fragmentos (`#section`) são preservados para referência
- Short links são resolvidos quando possível

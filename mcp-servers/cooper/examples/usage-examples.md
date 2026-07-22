# Exemplos de Uso - MCP Cooper

## 📝 Criar Documento

### Via Script
```bash
node scripts/create-doc-api.js
```

### Via API Direta
```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "createCooperDocument",
      "arguments": {
        "spaceId": "0",
        "parentId": "0",
        "name": "Meu Documento",
        "content": "Conteúdo do documento"
      }
    }
  }'
```

---

## 🔍 Buscar Documentos

### Busca Simples
```bash
node scripts/search-groceries.js
```

### Busca por Palavra-chave
```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search",
      "arguments": {
        "key": "onboarding",
        "spaceId": "0",
        "pageNum": 0,
        "pageSize": 10
      }
    }
  }'
```

---

## 📖 Ler Documento

```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "readContent",
      "arguments": {
        "resourceId": "2208870008908",
        "appId": 2,
        "range": ""
      }
    }
  }'
```

---

## 🏢 Listar Espaços

```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "listCooperSpaces",
      "arguments": {
        "type": 1
      }
    }
  }'
```

**Tipos:**
- `1` - Espaços que eu possuo
- `2` - Espaços que eu participo

---

## 💬 Adicionar Comentário

```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "addPageComment",
      "arguments": {
        "pageId": "2208870008908",
        "commentContent": "Ótimo documento!"
      }
    }
  }'
```

---

## 📊 Criar Planilha

```bash
curl -XPOST 'http://10.88.128.45/cooper_mcp/mcp' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "createCooperSheet",
      "arguments": {
        "spaceId": "0",
        "parentId": "0",
        "name": "Minha Planilha"
      }
    }
  }'
```

---

## 🔧 Uso no Claude Code

### Exemplos de Prompts

**Buscar:**
```
"Busca no Cooper sobre onboarding de novos funcionários"
"Procura documentos de API gateway no Cooper"
```

**Ler:**
```
"Lê o documento 2208870008908 do Cooper"
"Pega o conteúdo do doc: https://cooper.didichuxing.com/didocs/2208870008908"
```

**Criar:**
```
"Cria um documento no Cooper chamado 'Reunião Daily' com a pauta: ..."
"Salva isso no Cooper: [conteúdo]"
```

---

## 📚 Dicas

1. **IDs de Documentos:** Podem ser extraídos das URLs
2. **Espaço Pessoal:** Use `spaceId: "0"` e `parentId: "0"`
3. **Limite de Caracteres:** Conteúdo muito grande pode ser truncado
4. **Unicode:** Evite acentos no conteúdo para evitar erros de encoding

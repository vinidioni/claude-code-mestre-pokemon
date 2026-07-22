# Skill: cooper-read

## Descrição
Lê e extrai conteúdo de documentos do Cooper.

## Quando Usar
- Quando o usuário quer ler um documento específico
- Quando precisa extrair informações de uma página do Cooper
- Keywords: "ler documento", "conteúdo do cooper", "abrir doc", "extrair texto"

## Ferramentas MCP Disponíveis

### cooper_get_document
Obtém o conteúdo completo de um documento.

**Parâmetros:**
- `docId` (string, obrigatório): ID do documento ou URL completa

**Formatos aceitos:**
- ID numérico: `"2207291123516"`
- URL completa: `"https://cooper.didichuxing.com/docs2/document/2207291123516"`

**Retorno:**
```json
{
  "id": "2207291123516",
  "title": "Título do Documento",
  "content": "Conteúdo completo em texto...",
  "headings": [
    {"level": 1, "text": "Introdução"},
    {"level": 2, "text": "Detalhes"}
  ],
  "author": "Nome do Autor",
  "date": "2024-01-15",
  "url": "https://cooper.didichuxing.com/docs2/document/2207291123516"
}
```

## Exemplos de Uso

### Ler por URL
```
Usuário: "Lê esse documento: https://cooper.didichuxing.com/docs2/document/2207291123516"
→ Chamar cooper_get_document com docId=URL completa
```

### Ler por ID
```
Usuário: "Pega o conteúdo do documento 2207291123516"
→ Chamar cooper_get_document com docId="2207291123516"
```

## Dicas
- O conteúdo é extraído em texto puro (sem formatação rica)
- Headings são extraídos para mostrar estrutura do documento
- Documentos muito grandes são truncados em 50k caracteres

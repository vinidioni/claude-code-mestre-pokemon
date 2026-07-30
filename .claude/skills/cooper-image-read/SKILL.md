# Skill: cooper-image-read

## Descrição
Extrai e analisa imagens de documentos Cooper. Pipeline completo: detectar → extrair → OCR/analisar → incorporar ao contexto.

## Quando Usar
- Quando o usuário quer analisar imagens de documentos Cooper
- Keywords: "imagem do cooper", "foto no documento", "screenshot cooper", "analizar imagem", "ler imagem"

## Pipeline de 4 Passos

### Passo 1: Detectar (Detect)
Identifica todas as imagens em um documento Cooper.

**Como:**
- Analisa o HTML/content do documento
- Encontra tags `<img>`, `<figure>`, embeds
- Lista imagens com posição e contexto

**Output:**
```json
{
  "documentId": "2207291123516",
  "images": [
    {
      "index": 1,
      "url": "https://static.didichuxing.com/...",
      "alt": "Diagrama de arquitetura",
      "context": "Seção 3: Arquitetura do Sistema"
    }
  ]
}
```

### Passo 2: Extrair (Extract)
Baixa e processa as imagens identificadas.

**Como:**
- Download da imagem via URL assinada
- Conversão para formato processável (PNG/JPG)
- Extração de metadata (dimensões, tipo, tamanho)
- Salvamento temporário em `temp-storage/images/`

**Output:**
```json
{
  "extracted": [
    {
      "index": 1,
      "localPath": "temp-storage/images/cooper_2207291123516_img1.png",
      "format": "png",
      "dimensions": "1200x800",
      "sizeKB": 245
    }
  ]
}
```

### Passo 3: OCR/Analisar (Analyze)
Processa conteúdo visual da imagem.

**Como:**
- OCR (Tesseract/optical character recognition) para texto
- Análise de descrição para diagramas/charts
- Detecção de elementos (tabelas, fluxogramas, UI)
- Extração de dados estruturados quando aplicável

**Output:**
```json
{
  "analysis": [
    {
      "index": 1,
      "type": "diagram",
      "description": "Fluxograma de processo de checkout",
      "ocrText": "Usuário → Carrinho → Pagamento → Confirmação",
      "detectedElements": ["arrows", "boxes", "labels"]
    }
  ]
}
```

### Passo 4: Incorporar (Embed)
Integra a análise ao contexto da conversa.

**Como:**
- Substitui placeholders de imagem por descrições
- Cria resumo estruturado do conteúdo visual
- Referencia imagens por índice quando necessário
- Oferece para salvar análise separadamente

**Output:**
```markdown
Documento 2207291123516 contém 3 imagens:

**Imagem 1** (Seção 3): Diagrama de arquitetura do sistema
- Tipo: Diagrama de fluxo
- Conteúdo: Mostra integração entre API Gateway, Auth Service e Database
- OCR: "API Gateway → Auth Service → Database"

**Imagem 2** (Seção 5): Screenshot da interface
...
```

## Ferramentas MCP Disponíveis

### cooper_extract_images
Extrai todas as imagens de um documento Cooper.

**Parâmetros:**
- `docId` (string, obrigatório): ID do documento ou URL
- `saveLocal` (boolean, opcional): Salvar arquivos localmente
- `analyzeContent` (boolean, opcional): Executar OCR/análise

**Retorno:**
```json
{
  "documentId": "2207291123516",
  "totalImages": 3,
  "images": [
    {
      "index": 1,
      "extracted": true,
      "localPath": "...",
      "analysis": {
        "type": "diagram",
        "description": "...",
        "ocrText": "..."
      }
    }
  ]
}
```

### cooper_analyze_image
Analisa uma imagem específica (por URL ou path local).

**Parâmetros:**
- `imageUrl` (string): URL da imagem
- `imagePath` (string): Path local da imagem
- `analysisType` (string): "ocr", "description", "full"

## Exemplos de Uso

### Extrair todas imagens de um doc
```
Usuário: "Extrai as imagens do documento 2207291123516"
→ cooper_extract_images com analyzeContent=true
→ Retorna lista com análise de cada imagem
```

### Analisar imagem específica
```
Usuario: "O que tem na imagem 2 do documento?"
→ Referencia imagem prévia
→ cooper_analyze_image com analysisType="full"
→ Descrição detalhada + OCR
```

### Combinar com leitura de documento
```
Usuário: "Lê o documento e descreve as imagens"
→ cooper_read obtém conteúdo textual
→ cooper_extract_images obtém e analisa imagens
→ Resposta combinada: texto + descrições visuais
```

## Integração com Outras Skills

Combine com:
- **cooper-read**: Extrai texto + imagens para análise completa
- **cooper-search**: Identifica docs com imagens relevantes
- **intranet-fetcher**: Para imagens em páginas protegidas por SSO

## Limitações

- Imagens muito grandes (>10MB) podem ser redimensionadas
- OCR depende de qualidade da imagem (300+ DPI ideal)
- Diagramas complexos podem precisar de descrição manual
- Certas imagens protegidas podem requerer autenticação adicional

## Dicas

- Sempre peça `analyzeContent=true` para extrair texto de imagens
- Imagens sem descrição ou alt text são marcadas como "untitled"
- Use índices ("imagem 1", "imagem 2") para referenciar em múltiplas perguntas
- Salve análises importantes com `salvar análise no espaço X`

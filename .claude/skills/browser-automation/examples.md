# Exemplos - Browser Automation (Híbrido)

## Cenário 1: Site Público com Playwright

```
Usuário: "Abre o Wikipedia e pesquisa 'Inteligência Artificial'"

Análise:
→ URL: wikipedia.org (público)
→ Backend: Playwright MCP

Ações:
1. browser_navigate
   → {"url": "https://wikipedia.org"}

2. browser_fill
   → {"element": "input[name='search']", "value": "Inteligência Artificial"}

3. browser_press_key
   → {"key": "Enter"}

4. browser_screenshot
   → {"name": "wikipedia_ia.png"}

Resultado:
✅ Página carregada, screenshot salvo
```

## Cenário 2: Intranet DiDi com Intranet-Fetcher

```
Usuário: "Analisa essa skill do Skillshub: https://skillshub.intra.xiaojukeji.com/skill/cooper"

Análise:
→ URL: xiaojukeji.com (intranet DiDi)
→ Backend: Intranet-Fetcher

Ações:
→ analyze (intranet-fetcher)
  → {"url": "https://skillshub.intra.xiaojukeji.com/skill/cooper"}

Backend:
1. Detecta domínio DiDi
2. Carrega cookies salvos (se houver)
3. Abre navegador visível se precisar de login
4. Usuário faz SSO (90s timeout)
5. Extrai conteúdo estruturado

Resultado:
✅ Conteúdo da skill extraído com metadados
```

## Cenário 3: Formulário Público

```
Usuário: "Preenche formulário de contato no site exemplo.com"

Análise:
→ URL: exemplo.com (público)
→ Backend: Playwright MCP

Ações:
1. browser_navigate
   → {"url": "https://exemplo.com/contato"}

2. browser_fill (nome)
   → {"element": "input#nome", "value": "João Silva"}

3. browser_fill (email)
   → {"element": "input#email", "value": "joao@email.com"}

4. browser_fill (mensagem)
   → {"element": "textarea#mensagem", "value": "Olá, gostaria de..."}

5. browser_click (enviar)
   → {"element": "button[type='submit']"}

6. browser_wait_for_selector (confirmação)
   → {"selector": "div.sucesso"}

Resultado:
✅ Formulário preenchido e enviado
```

## Cenário 4: Screenshot Comparativo

```
Usuário: "Compara versão mobile e desktop do nosso site"

Fluxo:
1. browser_navigate (desktop)
   → {"url": "https://nossosite.com"}

2. browser_set_viewport
   → {"width": 1920, "height": 1080}

3. browser_screenshot
   → {"name": "desktop.png"}

4. browser_set_viewport (mobile)
   → {"width": 375, "height": 667}

5. browser_screenshot
   → {"name": "mobile.png"}

Resultado:
✅ Dois screenshots: desktop.png e mobile.png
```

## Cenário 5: PDF de Documentação

```
Usuário: "Gera PDF da documentação do GitHub"

Análise:
→ URL: github.com (público)
→ Backend: Playwright MCP

Ações:
1. browser_navigate
   → {"url": "https://github.com/modelcontextprotocol/specification"}

2. browser_pdf
   → {"name": "mcp-spec.pdf"}

Resultado:
✅ PDF gerado: mcp-spec.pdf
```

## Cenário 6: Extração de Dados de Tabela

```
Usuário: "Extrai dados da tabela de preços do site"

Análise:
→ URL: site público
→ Backend: Playwright MCP

Ações:
1. browser_navigate
   → {"url": "https://site.com/precos"}

2. browser_evaluate (extrair dados)
   → {"script": "
       const rows = document.querySelectorAll('table.pricing tr');
       return Array.from(rows).map(row => {
         const cells = row.querySelectorAll('td');
         return {
           plano: cells[0]?.innerText,
           preco: cells[1]?.innerText
         };
       });
     "}

Resultado:
✅ Array com dados estruturados da tabela
```

## Cenário 7: Cooper (Intranet) - Análise Completa

```
Usuário: "Extrai conteúdo e tira screenshot desse documento Cooper"

Análise:
→ URL: cooper.didichuxing.com (intranet DiDi)
→ Backend: Intranet-Fetcher

Ações:
→ analyze (intranet-fetcher)
  → {
      "url": "https://cooper.didichuxing.com/docs2/document/123456",
      "extract_headings": true,
      "extract_code": true,
      "take_screenshot": true,
      "max_content_length": 50000
    }

Resultado:
✅ {
    "title": "Documento XYZ",
    "headings": [...],
    "content": "...",
    "code_blocks": [...],
    "screenshot": "/path/to/screenshot.png"
  }
```

## Cenário 8: Upload de Arquivo

```
Usuário: "Faz upload de relatório em formulário web"

Análise:
→ URL: site público com upload
→ Backend: Playwright MCP

Ações:
1. browser_navigate
   → {"url": "https://site.com/upload"}

2. browser_upload_file
   → {
       "element": "input[type='file']",
       "file_path": "C:\\Users\\...\\relatorio.pdf"
     }

3. browser_click (confirmar)
   → {"element": "button#upload"}

4. browser_wait_for_selector (sucesso)
   → {"selector": "div.upload-success"}

Resultado:
✅ Arquivo enviado com sucesso
```

## 📊 Resumo: Quando Usar Cada Backend

| Situação | Backend | Por Quê |
|----------|---------|---------|
| Google, GitHub, Wikipedia | **Playwright** | Público, rápido |
| Skillshub, Cooper, DiDi | **Intranet-Fetcher** | SSO obrigatório |
| Upload de arquivo | **Playwright** | Suporte nativo |
| Gerar PDF | **Playwright** | Feature exclusiva |
| Console logs | **Playwright** | Debug avançado |
| Sessão >24h | **Intranet-Fetcher** | Cookies persistentes |

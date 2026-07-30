# Skill: browser-automation

## Descrição
Automação de navegador unificada: sites públicos via Playwright MCP, intranet DiDi via intranet-fetcher (SSO).

## Quando Usar
- Quando precisa interagir com páginas web (navegar, clicar, extrair)
- Keywords: "navegar", "abrir site", "automação browser", "screenshot", "extrair página", "preencher formulário"

## 🎯 Roteamento Automático

Esta skill **escolhe automaticamente** o melhor backend baseado no domínio:

| Backend | Para Quando Usar | Exemplos de Domínios |
|---------|------------------|---------------------|
| **Playwright MCP** (oficial) | Sites públicos, sem login complexo | google.com, github.com, wikipedia.org |
| **Intranet-Fetcher** (nosso) | Intranet DiDi, SSO corporativo | *.xiaojukeji.com, *.didichuxing.com |

### Regras de Roteamento

```
URL contém:
├─ "xiaojukeji.com" → intranet-fetcher (SSO)
├─ "didichuxing.com" → intranet-fetcher (SSO)
├─ "didi.cn" → intranet-fetcher (SSO)
└─ outro domínio → Playwright MCP
```

## Ferramentas Disponíveis

### Via Playwright MCP (Sites Públicos)

| Ferramenta | Função | Exemplo |
|------------|--------|---------|
| `browser_navigate` | Navegar para URL | `{"url": "https://google.com"}` |
| `browser_click` | Clicar em elemento | `{"element": "button#submit"}` |
| `browser_fill` | Preencher input | `{"element": "input#search", "value": "query"}` |
| `browser_screenshot` | Tirar screenshot | `{"name": "pagina.png"}` |
| `browser_get_content` | Extrair HTML/texto | `{}` |
| `browser_evaluate` | Executar JavaScript | `{"script": "document.title"}` |
| `browser_select_option` | Selecionar dropdown | `{"element": "select#pais", "value": "BR"}` |
| `browser_upload_file` | Upload de arquivo | `{"element": "input#file", "file_path": "..."}` |
| `browser_press_key` | Teclas especiais | `{"key": "Enter"}` |
| `browser_wait_for_selector` | Esperar elemento | `{"selector": "div.loaded"}` |
| `browser_pdf` | Gerar PDF | `{"name": "pagina.pdf"}` |
| `browser_console_logs` | Capturar logs | `{}` |

### Via Intranet-Fetcher (Intranet DiDi)

| Ferramenta | Função | Exemplo |
|------------|--------|---------|
| `analyze` | Análise completa com SSO | `{"url": "https://skillshub..."}` |
| `screenshot` | Screenshot com sessão | `{"url": "...", "output_path": "..."}` |
| `extract_content` | Extrair texto/HTML | `{"url": "..."}` |

## Uso

### Site Público - Playwright
```
Usuário: "Abre o Google e pesquisa 'machine learning'"
→ browser_navigate (google.com)
→ browser_fill (input de busca)
→ browser_press_key (Enter)
→ browser_screenshot
```

### Intranet DiDi - Intranet-Fetcher
```
Usuário: "Analisa essa URL da skillshub"
→ Detecta "xiaojukeji.com"
→ Usa intranet-fetcher/analyze
→ Login SSO automático se necessário
```

### Screenshot Comparativo
```
Usuário: "Tira screenshot do GitHub e do Cooper"
→ github.com → Playwright
→ cooper.didichuxing.com → Intranet-Fetcher
```

## Dicas

- **Domínios DiDi**: Sempre usarão intranet-fetcher (sessão persistente)
- **Sites públicos**: Playwright é mais rápido (sem overhead de SSO)
- **Upload**: Playwright suporta upload de arquivos nativamente
- **PDF**: Apenas Playwright gera PDFs
- **Logs do console**: Playwright captura logs do browser

## Limitações

| Backend | Limitação |
|---------|-----------|
| Playwright | Não suporta SSO corporativo/autenticação interativa |
| Intranet-Fetcher | Requer login manual na primeira vez (~24h de sessão) |

## Integração

- Combina com `cooper-read`: Extrair conteúdo de docs Cooper
- Combina com `github`: Screenshot de PRs/issues
- Combina com `everything-search`: Abrir arquivos encontrados

## Troubleshooting

**"Timeout ao carregar página"**
- Verificar conexão com internet
- Página pode ter proteção anti-bot (tentar intranet-fetcher)

**"Elemento não encontrado"**
- Usar `browser_wait_for_selector` antes de interagir
- Verificar seletor CSS

**"SSO expirado" (intranet)**
- Abrir navegador visível e fazer login manual
- Cookies serão salvos para próximas vezes

## Comparação Rápida

| Feature | Playwright MCP | Intranet-Fetcher |
|---------|---------------|------------------|
| Sites públicos | ✅ | ✅ |
| SSO/Intranet | ❌ | ✅ |
| Upload arquivo | ✅ | ⚠️ Limitado |
| Gerar PDF | ✅ | ❌ |
| Console logs | ✅ | ❌ |
| Multi-abas | ✅ | ⚠️ Parcial |
| Sessão persistente | ❌ | ✅ (~24h) |

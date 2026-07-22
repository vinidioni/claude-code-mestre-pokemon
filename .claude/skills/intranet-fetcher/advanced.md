# Uso Avançado - intranet-fetcher

Guia avançado para uso profissional da skill de automação de intranet.

## Sumário

1. [Sistema de Sessões](#sistema-de-sessões)
2. [Múltiplas Páginas](#múltiplas-páginas)
3. [Execução de JavaScript](#execução-de-javascript)
4. [Automação em Lote](#automação-em-lote)
5. [Integração com Workflows](#integração-com-workflows)

---

## Sistema de Sessões

### Criar uma Nova Sessão

```python
from intranet_fetcher import SessionManager

# Criar sessão com nome personalizado
session = SessionManager.create(
    session_id="analise_skillshub",
    headless=False,
    viewport={"width": 1920, "height": 1080}
)

# A sessão persiste até ser fechada ou expirar
```

### Reutilizar Sessão Existente

```python
# Listar sessões ativas
sessions = SessionManager.list()
# ['analise_skillshub', 'cooper_docs', ...]

# Reconectar a sessão
session = SessionManager.connect("analise_skillshub")
```

### Persistência de Estado

```python
# Salvar estado completo (cookies, localStorage, sessionStorage)
session.save_state("/path/to/state.json")

# Restaurar estado
session.load_state("/path/to/state.json")
```

---

## Múltiplas Páginas

### Gerenciar Abas

```python
# Abrir nova aba
new_page = session.new_page("https://skillshub.intra.xiaojukeji.com")

# Listar todas as páginas
pages = session.list_pages()
# [
#   {"id": "page_1", "url": "...", "title": "..."},
#   {"id": "page_2", "url": "...", "title": "..."}
# ]

# Alternar entre páginas
session.switch_page("page_2")

# Fechar página específica
session.close_page("page_1")
```

### Trabalhar com Popups

```python
# Aguardar e capturar popup
with session.expect_popup() as popup_info:
    session.click("#open-popup-button")
popup = popup_info.value

# Interagir com popup
popup.click("#confirm")
```

---

## Execução de JavaScript

### Scripts Simples

```python
# Executar código na página
result = session.evaluate("""
    () => {
        return {
            title: document.title,
            url: window.location.href,
            timestamp: Date.now()
        };
    }
""")
```

### Scripts com Argumentos

```python
# Passar argumentos para o script
elements = session.evaluate(
    """
    (selector) => {
        return Array.from(document.querySelectorAll(selector))
            .map(el => ({
                text: el.innerText,
                href: el.href,
                id: el.id
            }));
    }
    """,
    "a.document-link"  # argumento
)
```

### Scripts Complexos

```python
# Extrair dados estruturados
data = session.evaluate("""
    () => {
        const skills = [];
        document.querySelectorAll('.skill-card').forEach(card => {
            skills.push({
                name: card.querySelector('.skill-name')?.innerText,
                version: card.querySelector('.version')?.innerText,
                description: card.querySelector('.desc')?.innerText,
                author: card.querySelector('.author')?.innerText
            });
        });
        return skills;
    }
""")
```

---

## Automação em Lote

### Análise de Múltiplas URLs

```python
from intranet_fetcher import BatchProcessor

urls = [
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    "https://skillshub.intra.xiaojukeji.com/skill/cooper",
    "https://skillshub.intra.xiaojukeji.com/skill/dchat-message"
]

processor = BatchProcessor(
    session_id="batch_analysis",
    delay_between_requests=2,  # segundos
    max_retries=3
)

results = processor.analyze(urls)
# Retorna lista de resultados estruturados
```

### Exportação de Dados

```python
# Exportar para múltiplos formatos
processor.export(results, format="json", path="./output.json")
processor.export(results, format="csv", path="./output.csv")
processor.export(results, format="markdown", path="./report.md")
```

---

## Integração com Workflows

### Uso em Workflows do Claude

```yaml
# .claude/workflows/agents/analyze-skillshub.yaml
name: analyze-skillshub
version: 1.0.0

tools:
  - intranet_fetcher

steps:
  - name: extrair_skills
    tool: intranet_fetcher
    action: batch_extract
    params:
      urls: "{{input.urls}}"
      extract:
        - title
        - description
        - version
        - code_examples

  - name: gerar_relatorio
    tool: report_generator
    action: create
    params:
      data: "{{steps.extrair_skills.output}}"
      template: skill-analysis
```

### Automação Agendada

```python
# Script para execução periódica (cron)
from intranet_fetcher import ScheduledTask

task = ScheduledTask(
    name="daily_skill_monitor",
    schedule="0 9 * * *",  # 9h todos os dias
    action=check_new_skills,
    notify_on_change=True
)

task.start()
```

---

## Padrões Avançados

### Retry com Backoff

```python
from intranet_fetcher.utils import retry_with_backoff

@retry_with_backoff(max_attempts=3, base_delay=1)
def fetch_with_retry(url):
    return session.navigate(url)
```

### Rate Limiting

```python
from intranet_fetcher.utils import RateLimiter

limiter = RateLimiter(max_requests=10, window=60)  # 10 req/min

for url in urls:
    with limiter:
        result = session.navigate(url)
```

### Cache de Respostas

```python
from intranet_fetcher.cache import ResponseCache

cache = ResponseCache(ttl=3600)  # 1 hora

# Primeira chamada - busca na rede
result = cache.get_or_fetch(url, session.fetch)

# Segunda chamada - retorna do cache
result = cache.get_or_fetch(url, session.fetch)
```

---

## Debugging

### Modo Debug

```python
# Ativar modo debug (logs detalhados)
session = SessionManager.create(
    session_id="debug_session",
    debug=True,
    slow_mo=100  # Slow motion (ms)
)
```

### Screenshots em Cada Passo

```python
# Capturar screenshot após cada ação
session.enable_screenshot_tracing(
    output_dir="./screenshots",
    full_page=True
)
```

### Network Interception

```python
# Interceptar e logar requisições
session.intercept_network(
    patterns=["**/*.api.xiaojukeji.com/**"],
    callback=lambda req: print(f"Request: {req.url}")
)
```

---

Para exemplos práticos, consulte @file `examples.md`.

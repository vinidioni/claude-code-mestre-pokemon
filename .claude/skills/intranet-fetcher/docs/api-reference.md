# API Reference - intranet-fetcher

Referência completa da API da skill.

## Classes Principais

### `IntranetFetcher`

Classe principal para extração de conteúdo.

```python
from intranet_fetcher import IntranetFetcher, FetcherConfig

# Instância padrão
fetcher = IntranetFetcher()

# Com configuração customizada
config = FetcherConfig(
    headless=False,
    viewport={'width': 1920, 'height': 1080},
    login_timeout=120
)
fetcher = IntranetFetcher(config)
```

#### Métodos

##### `analyze()`

```python
async def analyze(
    self,
    url: str,
    extract_headings: bool = True,
    extract_code: bool = True,
    max_content_length: int = 15000,
    take_screenshot: bool = True,
    screenshot_path: Optional[str] = None,
    wait_time: Optional[int] = None
) -> AnalysisResult
```

Analisa uma URL e extrai conteúdo estruturado.

**Parâmetros:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `url` | `str` | - | URL a ser analisada |
| `extract_headings` | `bool` | `True` | Extrair headings H2/H3 |
| `extract_code` | `bool` | `True` | Extrair blocos de código |
| `max_content_length` | `int` | `15000` | Limite de caracteres do conteúdo |
| `take_screenshot` | `bool` | `True` | Tirar screenshot |
| `screenshot_path` | `Optional[str]` | `None` | Caminho customizado |
| `wait_time` | `Optional[int]` | `None` | Timeout para login |

**Retorna:** `AnalysisResult`

**Exemplo:**

```python
result = await fetcher.analyze(
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    extract_headings=True,
    extract_code=True,
    max_content_length=50000
)

print(result.title)
print(result.version)
print(result.content[:1000])
```

##### `screenshot()`

```python
async def screenshot(
    self,
    url: str,
    output_path: str,
    full_page: bool = True,
    selector: Optional[str] = None
) -> str
```

Tira screenshot de uma URL.

**Parâmetros:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `url` | `str` | - | URL alvo |
| `output_path` | `str` | - | Caminho para salvar |
| `full_page` | `bool` | `True` | Capturar página completa |
| `selector` | `Optional[str]` | `None` | Seletor CSS do elemento |

**Retorna:** `str` - Caminho do arquivo salvo

**Exemplo:**

```python
# Screenshot da página completa
path = await fetcher.screenshot(
    "https://skillshub.intra.xiaojukeji.com",
    "./screenshot.png",
    full_page=True
)

# Screenshot de elemento específico
path = await fetcher.screenshot(
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    "./skill_detail.png",
    selector=".skill-content"
)
```

##### `analyze_sync()`

Versão síncrona de `analyze()` para uso em scripts.

```python
result = fetcher.analyze_sync(url, **kwargs)
```

---

### `SessionManager`

Gerencia múltiplas sessões de navegador.

```python
from intranet_fetcher import SessionManager

manager = SessionManager()

# Listar sessões existentes
sessions = manager.list()
for session in sessions:
    print(f"{session.id}: {session.domain}")

# Criar nova sessão
session = manager.create(
    session_id="minha_sessao",
    domain="skillshub.intra.xiaojukeji.com"
)
```

#### Métodos

##### `list()`

```python
def list(self) -> List[SessionInfo]
```

Lista todas as sessões disponíveis.

**Retorna:** `List[SessionInfo]`

##### `create()`

```python
def create(
    self,
    session_id: Optional[str] = None,
    domain: Optional[str] = None,
    viewport: Optional[Dict[str, int]] = None
) -> ManagedSession
```

Cria uma nova sessão.

**Parâmetros:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `session_id` | `Optional[str]` | gerado | ID da sessão |
| `domain` | `Optional[str]` | `None` | Domínio alvo |
| `viewport` | `Optional[Dict]` | `1920x1080` | Viewport |

**Retorna:** `ManagedSession`

##### `connect()`

```python
def connect(self, session_id: str) -> Optional[ManagedSession]
```

Reconecta a uma sessão existente.

**Retorna:** `ManagedSession` ou `None`

##### `delete()`

```python
def delete(self, session_id: str) -> bool
```

Remove uma sessão.

**Retorna:** `bool` - Sucesso da operação

---

### `ManagedSession`

Sessão de navegador gerenciada.

```python
async with session:
    # Usar sessão
    page_id = await session.new_page("https://...")
    # ...
```

#### Métodos

##### `start()`

```python
async def start(self) -> ManagedSession
```

Inicializa a sessão.

##### `new_page()`

```python
async def new_page(self, url: Optional[str] = None) -> str
```

Cria uma nova página/aba.

**Retorna:** `str` - ID da página

##### `switch_page()`

```python
def switch_page(self, page_id: str) -> bool
```

Alterna para uma página existente.

##### `list_pages()`

```python
def list_pages(self) -> List[Dict[str, Any]]
```

Lista todas as páginas.

**Retorna:**
```python
[
    {'id': 'page_1', 'url': '...', 'active': True},
    {'id': 'page_2', 'url': '...', 'active': False}
]
```

##### `close_page()`

```python
async def close_page(self, page_id: Optional[str] = None)
```

Fecha uma página.

##### `save_state()`

```python
async def save_state(self, path: Optional[str] = None)
```

Salva estado completo da sessão (cookies, storage).

##### `close()`

```python
async def close(self, save_cookies: bool = True)
```

Encerra a sessão.

---

### `InteractiveSession`

Extensão de `ManagedSession` com métodos de interação.

```python
from intranet_fetcher import InteractiveSession

session = InteractiveSession(...)
await session.start()

# Navegar
await session.navigate("https://skillshub.intra.xiaojukeji.com")

# Interagir
await session.type('input[name="search"]', "cooper")
await session.press("Enter")
await session.click(".search-button")

# Aguardar
await session.wait_for(".results")

# Extrair
content = await session.extract_content()
```

#### Métodos de Interação

##### `navigate()`

```python
async def navigate(self, url: str, wait_until: str = 'networkidle')
```

Navega para URL.

##### `click()`

```python
async def click(self, selector: str)
```

Clica em elemento.

##### `type()`

```python
async def type(self, selector: str, text: str, clear: bool = True)
```

Digita texto em campo.

##### `press()`

```python
async def press(self, key: str)
```

Pressiona tecla.

##### `wait_for()`

```python
async def wait_for(
    self,
    selector: str,
    state: str = 'visible',
    timeout: int = 30000
)
```

Aguarda elemento.

**States:** `visible`, `hidden`, `attached`, `detached`

##### `evaluate()`

```python
async def evaluate(self, expression: str, *args) -> Any
```

Executa JavaScript.

**Exemplo:**
```python
result = await session.evaluate("""
    () => {
        return {
            title: document.title,
            url: window.location.href
        };
    }
""")
```

##### `extract_content()`

```python
async def extract_content(self, max_length: int = 10000) -> Dict[str, Any]
```

Extrai conteúdo da página.

**Retorna:**
```python
{
    'title': '...',
    'url': '...',
    'content': '...',
    'headings': {
        'h1': [...],
        'h2': [...],
        'h3': [...]
    }
}
```

---

### `BatchProcessor`

Processamento em lote de URLs.

```python
from intranet_fetcher import BatchProcessor

processor = BatchProcessor(
    delay_between_requests=2.0,
    max_retries=3
)

results = processor.process_sync([
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    "https://skillshub.intra.xiaojukeji.com/skill/cooper",
])

# Exportar
processor.export(results, format='csv', path='./results.csv')
```

#### Métodos

##### `process()`

```python
async def process(
    self,
    urls: List[str],
    **analyze_kwargs
) -> List[Dict[str, Any]]
```

Processa lista de URLs.

**Retorna:**
```python
[
    {
        'success': True,
        'url': '...',
        'data': {...},
        'timestamp': '...'
    },
    {
        'success': False,
        'url': '...',
        'error': '...'
    }
]
```

##### `export()`

```python
def export(
    self,
    results: List[Dict[str, Any]],
    format: str = 'json',
    path: Optional[str] = None
) -> str
```

Exporta resultados.

**Formatos:** `json`, `csv`, `markdown`

---

### `DocumentationPipeline`

Pipeline configurável para processamento.

```python
from intranet_fetcher import DocumentationPipeline, PipelineStep

pipeline = DocumentationPipeline([
    PipelineStep('extract', 'fetch_and_parse', {
        'include_metadata': True
    }),
    PipelineStep('structure', 'structure_content', {
        'remove_ads': True
    }),
    PipelineStep('export', 'save_to_formats', {
        'formats': ['json', 'markdown']
    })
])

result = pipeline.run("https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch")
```

#### Métodos

##### `add_step()`

```python
def add_step(self, name: str, action: str, **params)
```

Adiciona etapa ao pipeline.

**Ações disponíveis:**
- `fetch_and_parse` - Extrair conteúdo
- `structure_content` - Estruturar e limpar
- `generate_summary` - Gerar resumo
- `save_to_formats` - Exportar
- `custom_transform` - Transformação customizada

---

## Data Classes

### `FetcherConfig`

```python
@dataclass
class FetcherConfig:
    cookies_dir: Path = DEFAULT_COOKIES_DIR
    login_timeout: int = 90
    headless: bool = False
    viewport: Dict[str, int] = {'width': 1920, 'height': 1080}
    user_agent: Optional[str] = None
    slow_mo: Optional[int] = None
```

### `AnalysisResult`

```python
@dataclass
class AnalysisResult:
    url: str
    title: str
    main_title: str
    version: Optional[str]
    description: Optional[str]
    headings: Dict[str, List[str]]
    content: str
    code_examples: List[str]
    meta: Dict[str, Any]
    screenshot_path: Optional[str]
    output_path: Optional[str]
```

### `SessionInfo`

```python
@dataclass
class SessionInfo:
    id: str
    created_at: str
    last_used: str
    domain: str
    pages_count: int
    viewport: Dict[str, int]
```

---

## Constantes

### Domínios Suportados

```python
IntranetFetcher.SUPPORTED_DOMAINS = [
    'xiaojukeji.com',
    'didichuxing.com',
    'didi.cn',
    'didiglobal.com',
    'didipay.com',
    'didifinance.com',
    'didistatic.com',
]
```

### Diretórios Padrão

```python
DEFAULT_COOKIES_DIR = Path.home() / '.claude' / 'intranet_cookies'
```

---

## Exceções

A biblioteca pode lançar as seguintes exceções:

- `RuntimeError` - Sessão não iniciada
- `ValueError` - Parâmetros inválidos
- `TimeoutError` - Timeout em operações
- Exceções do Playwright - Erros de navegação

# Troubleshooting - intranet-fetcher

Guia de resolução de problemas comuns.

## Sumário

1. [Problemas de Autenticação](#problemas-de-autenticação)
2. [Erros de Navegação](#erros-de-navegação)
3. [Problemas de Extração](#problemas-de-extração)
4. [Erros de Sessão](#erros-de-sessão)
5. [Performance](#performance)

---

## Problemas de Autenticação

### "Página de login não detectada"

**Sintoma:**
Script não detecta que está na página de login e não pausa para autenticação.

**Causas possíveis:**
1. Título da página não contém keywords padrão
2. Login é feito via popup/modal
3. URL de login tem formato diferente

**Soluções:**

```python
# Verificar título manualmente
fetcher = IntranetFetcher()
result = fetcher.analyze_sync(url, wait_time=120)  # Aumentar timeout

# Ou forçar modo de espera
import asyncio
async with session:
    await session.start()
    await session.navigate(url)
    await asyncio.sleep(5)  # Aguardar carregamento

    # Verificar se precisa de login
    title = await session.evaluate('() => document.title')
    print(f"Título atual: {title}")

    # Aguardar manualmente se necessário
    if 'sua_keyword' in title.lower():
        print("Aguardando login manual...")
        await asyncio.sleep(90)
```

### "Sessão expirada rapidamente"

**Sintoma:**
Precisa fazer login a cada execução, cookies não persistem.

**Causas:**
1. Cookies estão sendo salvos em local diferente do carregado
2. Sessão do servidor expira muito rápido
3. Cookies de sessão vs persistentes

**Soluções:**

```python
# Verificar onde cookies estão sendo salvos
from intranet_fetcher import DEFAULT_COOKIES_DIR
print(f"Diretório de cookies: {DEFAULT_COOKIES_DIR}")

# Listar cookies existentes
import os
cookies = list(DEFAULT_COOKIES_DIR.glob('*.json'))
print(f"Cookies disponíveis: {cookies}")

# Verificar conteúdo
cookie_file = DEFAULT_COOKIES_DIR / 'skillshub.intra.xiaojukeji.com.json'
if cookie_file.exists():
    import json
    with open(cookie_file) as f:
        cookies = json.load(f)
        print(f"Número de cookies: {len(cookies)}")
        for c in cookies[:3]:
            print(f"  - {c.get('name')}: expires={c.get('expires')}")
```

### "Não consigo fazer login a tempo"

**Sintoma:**
Timeout de 90 segundos é insuficiente para completar autenticação 2FA.

**Solução:**

```bash
# Aumentar timeout via CLI
python scripts/fetch-intranet.py <url> --wait 180

# Ou no código
fetcher = IntranetFetcher(
    FetcherConfig(login_timeout=180)
)
```

---

## Erros de Navegação

### "Timeout ao navegar para URL"

**Sintoma:**
```
Error: Timeout 60000ms exceeded
```

**Causas:**
1. Página muito lenta
2. Recursos bloqueados
3. Proxy/firewall

**Soluções:**

```python
# Aumentar timeout
result = await fetcher.analyze(
    url,
    # Internamente usa page.goto com timeout=60000
)

# Usar espera diferente
async with session:
    await session.start()
    page = session.get_page()
    await page.goto(url, wait_until='domcontentloaded', timeout=120000)
    await asyncio.sleep(5)  # Aguardar JS carregar
```

### "net::ERR_CONNECTION_REFUSED"

**Sintoma:**
Não consegue conectar ao domínio.

**Verificações:**

```bash
# Testar conectividade
curl -I https://skillshub.intra.xiaojukeji.com

# Verificar DNS
nslookup skillshub.intra.xiaojukeji.com

# Verificar proxy
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

**Solução:**

```python
# Configurar proxy no Playwright
browser = await p.chromium.launch(
    proxy={
        'server': 'http://proxy.company.com:8080',
        'username': 'user',
        'password': 'pass'
    }
)
```

### "Navigation failed because page crashed"

**Causas:**
1. Memória insuficiente
2. Página com muito JavaScript
3. Recurso causando crash

**Soluções:**

```python
# Reiniciar sessão
await session.close()
await session.start()

# Usar modo headless (menos recursos)
config = FetcherConfig(headless=True)

# Limitar recursos do navegador
browser = await p.chromium.launch(
    args=[
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--js-flags=--max-old-space-size=512'
    ]
)
```

---

## Problemas de Extração

### "Conteúdo extraído está vazio"

**Sintoma:**
`result.content` vem vazio ou quase vazio.

**Causas:**
1. Página carrega conteúdo dinamicamente (SPA)
2. Seletores não encontram elemento principal
3. Conteúdo em iframe

**Diagnóstico:**

```python
# Verificar o que está na página
async with session:
    await session.start()
    await session.navigate(url)

    # Verificar título
    title = await session.evaluate('() => document.title')
    print(f"Título: {title}")

    # Verificar body length
    body_length = await session.evaluate(
        '() => document.body.innerText.length'
    )
    print(f"Tamanho do body: {body_length}")

    # Verificar se há iframes
    iframe_count = await session.evaluate(
        '() => document.querySelectorAll("iframe").length'
    )
    print(f"Iframes: {iframe_count}")

    # Listar possíveis containers de conteúdo
    selectors = ['main', 'article', '.content', '#content', '[class*="content"]']
    for sel in selectors:
        exists = await session.evaluate(
            f'() => !!document.querySelector("{sel}")'
        )
        print(f"  {sel}: {'✓' if exists else '✗'}")
```

**Solução:**

```python
# Aguardar carregamento dinâmico
await session.wait_for_load_state('networkidle')
await asyncio.sleep(3)  # Extra buffer

# Extrair diretamente do body se necessário
content = await session.evaluate('() => document.body.innerText')
```

### "Headings não estão sendo extraídos"

**Causa:**
Headings estão em elementos não-padrão ou gerados dinamicamente.

**Solução:**

```python
# Extrair com seletores customizados
custom_headings = await session.evaluate("""
    () => {
        // Tentar múltiplos seletores
        const h2s = [
            ...document.querySelectorAll('h2'),
            ...document.querySelectorAll('.section-title'),
            ...document.querySelectorAll('[class*="heading"]')
        ].map(el => el.innerText.trim()).filter(t => t);

        return [...new Set(h2s)];  // Remover duplicatas
    }
""")
```

### "Código não está sendo extraído"

**Causa:**
Blocos de código usam classes ou elementos diferentes.

**Solução:**

```python
# Procurar em múltiplos seletores
code_blocks = await session.evaluate("""
    () => {
        const selectors = [
            'pre code',
            '.code-block',
            '.highlight',
            '[class*="code"]',
            'pre'
        ];

        const blocks = [];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.innerText.length > 20) {
                    blocks.push(el.innerText.trim());
                }
            });
        });

        return [...new Set(blocks)];
    }
""")
```

---

## Erros de Sessão

### "Session not started"

**Sintoma:**
```
RuntimeError: Sessão não iniciada. Chame start() primeiro.
```

**Solução:**

```python
# Opção 1: Usar async context manager
async with session:
    await session.new_page(url)
    # ...

# Opção 2: Chamar start explicitamente
await session.start()
await session.new_page(url)
# ...
await session.close()
```

### "Cannot connect to existing session"

**Sintoma:**
`manager.connect()` retorna `None`.

**Causa:**
Arquivo de sessões foi corrompido ou deletado.

**Solução:**

```python
from intranet_fetcher import DEFAULT_COOKIES_DIR

# Verificar arquivo de sessões
sessions_file = DEFAULT_COOKIES_DIR / 'sessions.json'
print(f"Arquivo existe: {sessions_file.exists()}")

# Recriar se necessário
if sessions_file.exists():
    import json
    with open(sessions_file) as f:
        try:
            data = json.load(f)
            print(f"Sessões: {list(data.keys())}")
        except json.JSONDecodeError:
            print("Arquivo corrompido - deletando...")
            sessions_file.unlink()
```

---

## Performance

### "Processamento muito lento"

**Causas e soluções:**

```python
# 1. Reduzir tempo de espera
config = FetcherConfig(
    login_timeout=60  # Se já estiver logado
)

# 2. Usar headless mode
config = FetcherConfig(headless=True)

# 3. Processar em paralelo (com cuidado)
async def process_batch(urls):
    tasks = [fetcher.analyze(url) for url in urls]
    return await asyncio.gather(*tasks, return_exceptions=True)

# 4. Desativar recursos desnecessários
browser = await p.chromium.launch(
    args=[
        '--disable-images',  # Não carregar imagens
        '--disable-javascript',  # Cuidado! Pode quebrar sites SPA
    ]
)
```

### "Memory leak ao processar muitas URLs"

**Causa:**
Browsers não sendo fechados corretamente.

**Solução:**

```python
# Sempre fechar recursos
async def safe_process(url):
    fetcher = IntranetFetcher()
    try:
        return await fetcher.analyze(url)
    finally:
        # Cleanup é automático com async context managers
        pass

# Ou para processamento em lote
async def process_many(urls):
    for url in urls:
        async with IntranetFetcher() as fetcher:
            result = await fetcher.analyze(url)
            # Processar...
            # Fetcher é automaticamente fechado
```

---

## Debug Mode

Ativar logs detalhados:

```python
import logging

# Logging do Playwright
logging.basicConfig(level=logging.DEBUG)

# Ou modo verbose na skill
fetcher = IntranetFetcher()

# Adicionar prints estratégicos
async def debug_analyze(url):
    print(f"[DEBUG] Iniciando análise de {url}")

    async with async_playwright() as p:
        print("[DEBUG] Playwright iniciado")

        browser = await p.chromium.launch(headless=False)
        print("[DEBUG] Browser lançado")

        context = await browser.new_context()
        print("[DEBUG] Contexto criado")

        page = await context.new_page()
        print("[DEBUG] Página criada")

        await page.goto(url)
        print(f"[DEBUG] Navegou para {url}")
        print(f"[DEBUG] Título: {await page.title()}")

        # ... continuar com logs
```

---

## Reportar Problemas

Se encontrar um bug não documentado:

1. **Coletar informações:**
```python
# Salvar estado para análise
import json
from intranet_fetcher import DEFAULT_COOKIES_DIR

info = {
    'os': sys.platform,
    'cookies_dir': str(DEFAULT_COOKIES_DIR),
    'cookies_exist': list(DEFAULT_COOKIES_DIR.glob('*.json')),
}
print(json.dumps(info, indent=2))
```

2. **Screenshots de erro:**
```python
try:
    result = await fetcher.analyze(url)
except Exception as e:
    # Screenshot é salvo automaticamente em /tmp/
    print(f"Erro: {e}")
    print("Verifique screenshots em /tmp/intranet_error_*.png")
```

3. **Abrir issue** com:
   - Versão da skill
   - Comando/script usado
   - Output completo do erro
   - Screenshots se relevante

#!/usr/bin/env python3
"""
Módulo principal do IntranetFetcher
"""
import asyncio
import json
import sys
from pathlib import Path
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
from dataclasses import dataclass, asdict
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Diretório padrão para cookies
DEFAULT_COOKIES_DIR = Path.home() / '.claude' / 'intranet_cookies'
DEFAULT_COOKIES_DIR.mkdir(parents=True, exist_ok=True)


@dataclass
class FetcherConfig:
    """Configuração do fetcher"""
    cookies_dir: Path = DEFAULT_COOKIES_DIR
    login_timeout: int = 90
    headless: bool = False
    viewport: Dict[str, int] = None
    user_agent: Optional[str] = None
    slow_mo: Optional[int] = None

    def __post_init__(self):
        if self.viewport is None:
            self.viewport = {"width": 1920, "height": 1080}


@dataclass
class AnalysisResult:
    """Resultado da análise de uma URL"""
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


class IntranetFetcher:
    """
    Classe principal para extração de conteúdo da intranet DiDi.

    Features:
    - Autenticação manual com persistência de cookies
    - Extração estruturada de conteúdo
    - Screenshots e capturas de tela
    - Suporte a múltiplos domínios
    """

    SUPPORTED_DOMAINS = [
        'xiaojukeji.com',
        'didichuxing.com',
        'didi.cn',
        'didiglobal.com',
        'didipay.com',
        'didifinance.com',
        'didistatic.com',
    ]

    def __init__(self, config: Optional[FetcherConfig] = None):
        self.config = config or FetcherConfig()
        self._sessions: Dict[str, Any] = {}

    def _get_cookie_file(self, url: str) -> Path:
        """Gera caminho do arquivo de cookies baseado no domínio."""
        domain = urlparse(url).netloc.replace(':', '_')
        return self.config.cookies_dir / f"{domain}.json"

    def _is_supported_domain(self, url: str) -> bool:
        """Verifica se o domínio é suportado."""
        domain = urlparse(url).netloc.lower()
        return any(sd in domain for sd in self.SUPPORTED_DOMAINS)

    async def _load_cookies(self, context: BrowserContext, url: str) -> bool:
        """Carrega cookies salvos para o contexto."""
        cookie_file = self._get_cookie_file(url)
        if not cookie_file.exists():
            return False

        try:
            with open(cookie_file, 'r', encoding='utf-8') as f:
                cookies = json.load(f)
                await context.add_cookies(cookies)
            return True
        except Exception as e:
            print(f"[WARN] Erro ao carregar cookies: {e}")
            return False

    async def _save_cookies(self, context: BrowserContext, url: str):
        """Salva cookies do contexto."""
        cookie_file = self._get_cookie_file(url)
        try:
            cookies = await context.cookies()
            with open(cookie_file, 'w', encoding='utf-8') as f:
                json.dump(cookies, f, indent=2)
            print(f"[INFO] Cookies salvos: {cookie_file}")
        except Exception as e:
            print(f"[WARN] Erro ao salvar cookies: {e}")

    def _is_login_page(self, title: str, url: str) -> bool:
        """Detecta se está em página de login."""
        title_lower = title.lower()
        login_keywords = [
            'login', '登录', '统一登录', 'sign in',
            'auth', 'authentication', 'sso', 'didi'
        ]
        return any(kw in title_lower for kw in login_keywords)

    async def analyze(
        self,
        url: str,
        extract_headings: bool = True,
        extract_code: bool = True,
        max_content_length: int = 15000,
        take_screenshot: bool = True,
        screenshot_path: Optional[str] = None,
        wait_time: Optional[int] = None
    ) -> AnalysisResult:
        """
        Analisa uma URL e extrai conteúdo estruturado.

        Args:
            url: URL a ser analisada
            extract_headings: Extrair headings (H2/H3)
            extract_code: Extrair blocos de código
            max_content_length: Limite de caracteres do conteúdo
            take_screenshot: Tirar screenshot
            screenshot_path: Caminho customizado para screenshot
            wait_time: Tempo de espera para login manual

        Returns:
            AnalysisResult com dados estruturados
        """
        if not self._is_supported_domain(url):
            print(f"[WARN] Domínio não verificado: {urlparse(url).netloc}")

        wait_time = wait_time or self.config.login_timeout

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.config.headless,
                slow_mo=self.config.slow_mo,
                args=['--no-sandbox', '--disable-dev-shm-usage']
            )

            context = await browser.new_context(
                viewport=self.config.viewport,
                user_agent=self.config.user_agent
            )

            # Tentar carregar cookies existentes
            cookies_loaded = await self._load_cookies(context, url)
            if cookies_loaded:
                print(f"[INFO] Cookies carregados para {urlparse(url).netloc}")

            page = await context.new_page()

            print(f"[INFO] Navegando para: {url}")
            await page.goto(url, wait_until='networkidle', timeout=60000)
            await asyncio.sleep(2)

            title = await page.title()
            print(f"[INFO] Título: {title}")

            # Detectar e lidar com página de login
            if self._is_login_page(title, url):
                print("\n" + "="*60)
                print("🔐 LOGIN REQUERIDO")
                print("="*60)
                print(f"Por favor, faça login no navegador.")
                print(f"Aguardando {wait_time} segundos...")
                print("="*60 + "\n")

                await asyncio.sleep(wait_time)

                # Verificar se login foi feito
                new_title = await page.title()
                if not self._is_login_page(new_title, url):
                    print(f"[INFO] Login detectado: {new_title}")
                    await self._save_cookies(context, url)
                else:
                    print("[WARN] Ainda na página de login")

                # Recarregar página após login
                await page.goto(url, wait_until='networkidle', timeout=60000)
                await asyncio.sleep(2)
                title = await page.title()

            # Extrair conteúdo
            print("[INFO] Extraindo conteúdo...")
            result_data = await self._extract_content(
                page,
                extract_headings=extract_headings,
                extract_code=extract_code,
                max_content_length=max_content_length
            )

            # Tirar screenshot se solicitado
            screenshot_saved = None
            if take_screenshot:
                if screenshot_path is None:
                    filename = Path(urlparse(url).path).name or 'index'
                    screenshot_path = f'/tmp/intranet_{filename}.png'

                await page.screenshot(path=screenshot_path, full_page=True)
                screenshot_saved = screenshot_path
                print(f"[INFO] Screenshot: {screenshot_path}")

            await browser.close()

            return AnalysisResult(
                url=url,
                title=title,
                main_title=result_data.get('main_title', ''),
                version=result_data.get('version'),
                description=result_data.get('description'),
                headings=result_data.get('headings', {'h2': [], 'h3': []}),
                content=result_data.get('content', ''),
                code_examples=result_data.get('code_examples', []),
                meta=result_data.get('meta', {}),
                screenshot_path=screenshot_saved,
                output_path=None
            )

    async def _extract_content(
        self,
        page: Page,
        extract_headings: bool,
        extract_code: bool,
        max_content_length: int
    ) -> Dict[str, Any]:
        """Extrai conteúdo da página usando JavaScript."""

        return await page.evaluate(f"""() => {{
            const result = {{}};

            // Título principal
            const h1 = document.querySelector('h1');
            result.main_title = h1 ? h1.innerText.trim() : '';

            // Versão (padrão comum vX.Y.Z)
            const versionMatch = document.body.innerText.match(/v?\\d+\\.\\d+\\.\\d+/);
            result.version = versionMatch ? versionMatch[0] : null;

            // Descrição
            const descSelectors = [
                '.description', '[class*="desc"]',
                '.summary', '[class*="summary"]',
                'meta[name="description"]'
            ];
            result.description = '';
            for (const sel of descSelectors) {{
                const el = document.querySelector(sel);
                if (el) {{
                    result.description = (el.getAttribute('content') || el.innerText).trim();
                    if (result.description) break;
                }}
            }}

            // Headings
            result.headings = {{h2: [], h3: []}};
            if ({str(extract_headings).lower()}) {{
                result.headings.h2 = Array.from(document.querySelectorAll('h2'))
                    .map(h => h.innerText.trim())
                    .filter(t => t)
                    .slice(0, 20);
                result.headings.h3 = Array.from(document.querySelectorAll('h3'))
                    .map(h => h.innerText.trim())
                    .filter(t => t)
                    .slice(0, 30);
            }}

            // Conteúdo principal
            const mainSelectors = ['main', '.content', 'article', '[class*="content"]', '#content'];
            let content = '';
            for (const sel of mainSelectors) {{
                const el = document.querySelector(sel);
                if (el && el.innerText.length > content.length) {{
                    content = el.innerText.trim();
                }}
            }}
            if (!content) content = document.body.innerText.trim();
            result.content = content.substring(0, {max_content_length});

            // Exemplos de código
            result.code_examples = [];
            if ({str(extract_code).lower()}) {{
                result.code_examples = Array.from(document.querySelectorAll('pre, code, .code-block'))
                    .map(el => el.innerText.trim())
                    .filter(t => t.length > 10)
                    .slice(0, 15);
            }}

            // Metadados
            result.meta = {{}};
            document.querySelectorAll('meta').forEach(m => {{
                const name = m.getAttribute('name') || m.getAttribute('property');
                const content = m.getAttribute('content');
                if (name && content) result.meta[name] = content;
            }});

            return result;
        }}""")

    async def screenshot(
        self,
        url: str,
        output_path: str,
        full_page: bool = True,
        selector: Optional[str] = None
    ) -> str:
        """
        Tira screenshot de uma URL.

        Returns:
            Caminho do screenshot salvo
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.config.headless,
                args=['--no-sandbox']
            )

            context = await browser.new_context(viewport=self.config.viewport)
            await self._load_cookies(context, url)

            page = await context.new_page()
            await page.goto(url, wait_until='networkidle', timeout=60000)

            if selector:
                element = await page.query_selector(selector)
                if element:
                    await element.screenshot(path=output_path)
                else:
                    raise ValueError(f"Elemento não encontrado: {selector}")
            else:
                await page.screenshot(path=output_path, full_page=full_page)

            await browser.close()
            return output_path

    def analyze_sync(self, *args, **kwargs) -> AnalysisResult:
        """Versão síncrona do analyze."""
        return asyncio.run(self.analyze(*args, **kwargs))


# Para uso como script
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Intranet Fetcher')
    parser.add_argument('url', help='URL para analisar')
    parser.add_argument('--json', '-j', action='store_true', help='Saída JSON')
    parser.add_argument('--screenshot', '-s', help='Caminho do screenshot')
    parser.add_argument('--wait', '-w', type=int, default=90, help='Timeout login')

    args = parser.parse_args()

    fetcher = IntranetFetcher()
    result = fetcher.analyze_sync(
        args.url,
        screenshot_path=args.screenshot,
        wait_time=args.wait
    )

    if args.json:
        print(json.dumps(asdict(result), indent=2, ensure_ascii=False))
    else:
        print(f"\n{'='*60}")
        print(f"📄 {result.main_title or result.title}")
        print(f"{'='*60}")
        print(f"URL: {result.url}")
        if result.version:
            print(f"Versão: {result.version}")
        if result.description:
            desc = result.description[:200] + '...' if len(result.description) > 200 else result.description
            print(f"Descrição: {desc}")
        print(f"\nSeções H2: {len(result.headings['h2'])}")
        print(f"Exemplos de código: {len(result.code_examples)}")
        print(f"Conteúdo: {len(result.content)} caracteres")
        if result.screenshot_path:
            print(f"Screenshot: {result.screenshot_path}")

#!/usr/bin/env python3
"""
Gerenciamento de sessões persistentes para navegação na intranet.
"""
import asyncio
import json
import uuid
from pathlib import Path
from typing import Dict, Any, Optional, List, Callable
from dataclasses import dataclass, asdict
from datetime import datetime
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

from .fetcher import IntranetFetcher, FetcherConfig, DEFAULT_COOKIES_DIR


@dataclass
class SessionInfo:
    """Informações sobre uma sessão ativa"""
    id: str
    created_at: str
    last_used: str
    domain: str
    pages_count: int
    viewport: Dict[str, int]


class SessionManager:
    """
    Gerencia múltiplas sessões de navegador para diferentes domínios.

    Features:
    - Criar e gerenciar múltiplas sessões
    - Persistência de estado entre execuções
    - Reutilização de cookies
    - Listar e conectar a sessões existentes
    """

    SESSIONS_FILE = DEFAULT_COOKIES_DIR / 'sessions.json'

    def __init__(self, config: Optional[FetcherConfig] = None):
        self.config = config or FetcherConfig()
        self._sessions: Dict[str, Dict[str, Any]] = {}
        self._load_sessions_index()

    def _load_sessions_index(self):
        """Carrega índice de sessões do disco."""
        if self.SESSIONS_FILE.exists():
            try:
                with open(self.SESSIONS_FILE, 'r', encoding='utf-8') as f:
                    self._sessions = json.load(f)
            except Exception as e:
                print(f"[WARN] Erro ao carregar sessões: {e}")
                self._sessions = {}

    def _save_sessions_index(self):
        """Salva índice de sessões no disco."""
        try:
            with open(self.SESSIONS_FILE, 'w', encoding='utf-8') as f:
                json.dump(self._sessions, f, indent=2)
        except Exception as e:
            print(f"[WARN] Erro ao salvar sessões: {e}")

    def list(self) -> List[SessionInfo]:
        """Lista todas as sessões disponíveis."""
        sessions = []
        for session_id, data in self._sessions.items():
            sessions.append(SessionInfo(
                id=session_id,
                created_at=data.get('created_at', 'unknown'),
                last_used=data.get('last_used', 'unknown'),
                domain=data.get('domain', 'unknown'),
                pages_count=data.get('pages_count', 0),
                viewport=data.get('viewport', {'width': 0, 'height': 0})
            ))
        return sessions

    def create(
        self,
        session_id: Optional[str] = None,
        domain: Optional[str] = None,
        viewport: Optional[Dict[str, int]] = None
    ) -> 'ManagedSession':
        """
        Cria uma nova sessão gerenciada.

        Args:
            session_id: ID customizado (opcional)
            domain: Domínio alvo
            viewport: Dimensões da viewport

        Returns:
            ManagedSession pronta para uso
        """
        session_id = session_id or f"session_{uuid.uuid4().hex[:8]}"

        return ManagedSession(
            session_id=session_id,
            domain=domain,
            viewport=viewport or self.config.viewport,
            config=self.config,
            manager=self
        )

    def connect(self, session_id: str) -> Optional['ManagedSession']:
        """
        Reconecta a uma sessão existente.

        Args:
            session_id: ID da sessão

        Returns:
            ManagedSession ou None se não encontrada
        """
        if session_id not in self._sessions:
            return None

        session_data = self._sessions[session_id]
        return ManagedSession(
            session_id=session_id,
            domain=session_data.get('domain'),
            viewport=session_data.get('viewport', {'width': 1920, 'height': 1080}),
            config=self.config,
            manager=self,
            existing_data=session_data
        )

    def delete(self, session_id: str) -> bool:
        """Remove uma sessão."""
        if session_id in self._sessions:
            del self._sessions[session_id]
            self._save_sessions_index()
            return True
        return False

    def _update_session(self, session_id: str, data: Dict[str, Any]):
        """Atualiza dados de uma sessão no índice."""
        self._sessions[session_id] = {
            **self._sessions.get(session_id, {}),
            **data,
            'last_used': datetime.now().isoformat()
        }
        self._save_sessions_index()


class ManagedSession:
    """
    Sessão de navegador gerenciada com persistência.
    """

    def __init__(
        self,
        session_id: str,
        domain: Optional[str],
        viewport: Dict[str, int],
        config: FetcherConfig,
        manager: SessionManager,
        existing_data: Optional[Dict] = None
    ):
        self.id = session_id
        self.domain = domain
        self.viewport = viewport
        self.config = config
        self.manager = manager
        self.existing_data = existing_data or {}

        self._browser: Optional[Browser] = None
        self._context: Optional[BrowserContext] = None
        self._pages: Dict[str, Page] = {}
        self._active_page: Optional[str] = None
        self._playwright = None

    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def start(self):
        """Inicializa a sessão do navegador."""
        self._playwright = await async_playwright().start()

        self._browser = await self._playwright.chromium.launch(
            headless=self.config.headless,
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )

        self._context = await self._browser.new_context(
            viewport=self.viewport,
            user_agent=self.config.user_agent
        )

        # Carregar cookies se existirem
        if self.domain:
            cookie_file = self.config.cookies_dir / f"{self.domain}.json"
            if cookie_file.exists():
                with open(cookie_file, 'r', encoding='utf-8') as f:
                    cookies = json.load(f)
                    await self._context.add_cookies(cookies)

        # Registrar no manager
        self.manager._update_session(self.id, {
            'created_at': datetime.now().isoformat(),
            'domain': self.domain,
            'viewport': self.viewport,
            'pages_count': 0
        })

        print(f"[INFO] Sessão iniciada: {self.id}")
        return self

    async def new_page(self, url: Optional[str] = None) -> str:
        """Cria uma nova página/aba na sessão."""
        if not self._context:
            raise RuntimeError("Sessão não iniciada. Chame start() primeiro.")

        page = await self._context.new_page()
        page_id = f"page_{len(self._pages) + 1}"

        if url:
            await page.goto(url, wait_until='networkidle')

        self._pages[page_id] = page
        self._active_page = page_id

        self.manager._update_session(self.id, {
            'pages_count': len(self._pages)
        })

        return page_id

    def switch_page(self, page_id: str) -> bool:
        """Alterna para uma página existente."""
        if page_id in self._pages:
            self._active_page = page_id
            return True
        return False

    def get_page(self, page_id: Optional[str] = None) -> Page:
        """Obtém uma página específica ou a ativa."""
        target_id = page_id or self._active_page
        if not target_id:
            raise ValueError("Nenhuma página ativa")
        return self._pages[target_id]

    def list_pages(self) -> List[Dict[str, Any]]:
        """Lista todas as páginas da sessão."""
        pages = []
        for pid, page in self._pages.items():
            pages.append({
                'id': pid,
                'url': page.url,
                'active': pid == self._active_page
            })
        return pages

    async def close_page(self, page_id: Optional[str] = None):
        """Fecha uma página específica."""
        target_id = page_id or self._active_page
        if target_id and target_id in self._pages:
            await self._pages[target_id].close()
            del self._pages[target_id]

            if self._active_page == target_id:
                self._active_page = next(iter(self._pages), None)

            self.manager._update_session(self.id, {
                'pages_count': len(self._pages)
            })

    async def save_state(self, path: Optional[str] = None):
        """Salva estado completo da sessão."""
        if not self._context:
            return

        state = await self._context.storage_state()

        path = path or self.config.cookies_dir / f"{self.id}_state.json"
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)

        print(f"[INFO] Estado salvo: {path}")

    async def close(self, save_cookies: bool = True):
        """Encerra a sessão."""
        if save_cookies and self._context and self.domain:
            cookies = await self._context.cookies()
            cookie_file = self.config.cookies_dir / f"{self.domain}.json"
            with open(cookie_file, 'w', encoding='utf-8') as f:
                json.dump(cookies, f, indent=2)

        if self._browser:
            await self._browser.close()

        if self._playwright:
            await self._playwright.stop()

        print(f"[INFO] Sessão encerrada: {self.id}")


class InteractiveSession(ManagedSession):
    """
    Sessão com métodos adicionais para interação.
    """

    async def navigate(self, url: str, wait_until: str = 'networkidle'):
        """Navega para uma URL na página ativa."""
        page = self.get_page()
        await page.goto(url, wait_until=wait_until)

    async def click(self, selector: str):
        """Clica em um elemento."""
        page = self.get_page()
        await page.click(selector)

    async def type(self, selector: str, text: str, clear: bool = True):
        """Digita texto em um campo."""
        page = self.get_page()
        if clear:
            await page.fill(selector, text)
        else:
            await page.type(selector, text)

    async def press(self, key: str):
        """Pressiona uma tecla."""
        page = self.get_page()
        await page.press(self.get_page().url, key)

    async def wait_for(
        self,
        selector: str,
        state: str = 'visible',
        timeout: int = 30000
    ):
        """Aguarda um elemento aparecer."""
        page = self.get_page()
        await page.wait_for_selector(selector, state=state, timeout=timeout)

    async def wait_for_load_state(self, state: str = 'networkidle'):
        """Aguarda página carregar."""
        page = self.get_page()
        await page.wait_for_load_state(state)

    async def evaluate(self, expression: str, *args) -> Any:
        """Executa JavaScript na página."""
        page = self.get_page()
        return await page.evaluate(expression, *args)

    def query_selector(self, selector: str):
        """Seleciona um elemento."""
        page = self.get_page()
        return page.query_selector(selector)

    def query_selector_all(self, selector: str):
        """Seleciona múltiplos elementos."""
        page = self.get_page()
        return page.query_selector_all(selector)

    async def screenshot(
        self,
        path: Optional[str] = None,
        full_page: bool = True,
        selector: Optional[str] = None
    ) -> str:
        """Tira screenshot."""
        page = self.get_page()

        if path is None:
            path = f'/tmp/session_{self.id}_screenshot.png'

        if selector:
            element = await page.query_selector(selector)
            if element:
                await element.screenshot(path=path)
            else:
                raise ValueError(f"Elemento não encontrado: {selector}")
        else:
            await page.screenshot(path=path, full_page=full_page)

        return path

    async def extract_content(self, max_length: int = 10000) -> Dict[str, Any]:
        """Extrai conteúdo da página."""
        page = self.get_page()

        return await page.evaluate(f"""() => {{
            const main = document.querySelector('main') ||
                        document.querySelector('.content') ||
                        document.body;

            return {{
                title: document.title,
                url: window.location.href,
                content: main.innerText.substring(0, {max_length}),
                headings: {{
                    h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText),
                    h2: Array.from(document.querySelectorAll('h2')).map(h => h.innerText),
                    h3: Array.from(document.querySelectorAll('h3')).map(h => h.innerText)
                }}
            }};
        }}""")

#!/usr/bin/env python3
"""
Testes para a skill intranet-fetcher
"""
import unittest
import asyncio
import json
import tempfile
from pathlib import Path
from unittest.mock import Mock, patch, AsyncMock

# Adicionar scripts ao path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from fetcher import IntranetFetcher, FetcherConfig, AnalysisResult
from session import SessionManager, ManagedSession


class TestFetcherConfig(unittest.TestCase):
    """Testes para FetcherConfig"""

    def test_default_config(self):
        """Testa configuração padrão"""
        config = FetcherConfig()
        self.assertEqual(config.login_timeout, 90)
        self.assertFalse(config.headless)
        self.assertEqual(config.viewport['width'], 1920)
        self.assertEqual(config.viewport['height'], 1080)

    def test_custom_config(self):
        """Testa configuração customizada"""
        config = FetcherConfig(
            login_timeout=120,
            headless=True,
            viewport={'width': 1366, 'height': 768}
        )
        self.assertEqual(config.login_timeout, 120)
        self.assertTrue(config.headless)
        self.assertEqual(config.viewport['width'], 1366)


class TestIntranetFetcher(unittest.TestCase):
    """Testes para IntranetFetcher"""

    def setUp(self):
        """Setup para cada teste"""
        self.fetcher = IntranetFetcher()

    def test_supported_domains(self):
        """Testa lista de domínios suportados"""
        self.assertIn('xiaojukeji.com', IntranetFetcher.SUPPORTED_DOMAINS)
        self.assertIn('didichuxing.com', IntranetFetcher.SUPPORTED_DOMAINS)

    def test_is_supported_domain(self):
        """Testa detecção de domínios suportados"""
        # Domínios suportados
        self.assertTrue(
            self.fetcher._is_supported_domain("https://skillshub.intra.xiaojukeji.com")
        )
        self.assertTrue(
            self.fetcher._is_supported_domain("https://cooper.didichuxing.com")
        )

        # Domínios não suportados
        self.assertFalse(
            self.fetcher._is_supported_domain("https://google.com")
        )

    def test_is_login_page(self):
        """Testa detecção de página de login"""
        # Títulos de login
        self.assertTrue(self.fetcher._is_login_page("Login", ""))
        self.assertTrue(self.fetcher._is_login_page("统一登录", ""))
        self.assertTrue(self.fetcher._is_login_page("Didi SSO Login", ""))

        # Títulos normais
        self.assertFalse(self.fetcher._is_login_page("Skills Hub", ""))
        self.assertFalse(self.fetcher._is_login_page("Documentação", ""))

    def test_get_cookie_file(self):
        """Testa geração de caminho de arquivo de cookies"""
        url = "https://skillshub.intra.xiaojukeji.com/skill/test"
        cookie_file = self.fetcher._get_cookie_file(url)

        self.assertIn('skillshub.intra.xiaojukeji.com', str(cookie_file))
        self.assertTrue(str(cookie_file).endswith('.json'))


class TestAnalysisResult(unittest.TestCase):
    """Testes para dataclass AnalysisResult"""

    def test_result_creation(self):
        """Testa criação de resultado"""
        result = AnalysisResult(
            url="https://example.com",
            title="Test",
            main_title="Main Test",
            version="1.0.0",
            description="Description",
            headings={'h2': ['Section 1'], 'h3': []},
            content="Content",
            code_examples=["code"],
            meta={},
            screenshot_path=None,
            output_path=None
        )

        self.assertEqual(result.url, "https://example.com")
        self.assertEqual(result.version, "1.0.0")
        self.assertEqual(len(result.headings['h2']), 1)


class TestSessionManager(unittest.TestCase):
    """Testes para SessionManager"""

    def setUp(self):
        """Setup para cada teste"""
        with tempfile.TemporaryDirectory() as tmpdir:
            self.config = FetcherConfig(cookies_dir=Path(tmpdir))
            self.manager = SessionManager(self.config)

    def test_list_empty(self):
        """Testa listagem sem sessões"""
        sessions = self.manager.list()
        self.assertEqual(len(sessions), 0)

    def test_create_session(self):
        """Testa criação de sessão"""
        session = self.manager.create(
            session_id="test_session",
            domain="test.xiaojukeji.com"
        )

        self.assertEqual(session.id, "test_session")
        self.assertEqual(session.domain, "test.xiaojukeji.com")


class TestIntegration(unittest.TestCase):
    """Testes de integração (requer Playwright)"""

    @unittest.skip("Requer Playwright instalado")
    def test_full_workflow(self):
        """Testa fluxo completo (lento, requer navegador)"""
        # Este teste seria executado manualmente
        pass


class TestCLI(unittest.TestCase):
    """Testes para interface de linha de comando"""

    def test_argument_parsing(self):
        """Testa parsing de argumentos"""
        # Simular argumentos
        test_args = [
            "https://skillshub.intra.xiaojukeji.com/skill/test",
            "--json",
            "--wait", "120"
        ]

        # Este teste verificaria se os argumentos são parseados corretamente
        # Implementação depende de como o CLI é estruturado
        pass


def run_async_test(coro):
    """Helper para rodar corotinas em testes"""
    return asyncio.get_event_loop().run_until_complete(coro)


if __name__ == '__main__':
    unittest.main()

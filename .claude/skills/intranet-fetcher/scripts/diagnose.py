#!/usr/bin/env python3
"""
Script de diagnostico para verificar se o ambiente esta configurado corretamente
para executar o intranet-fetcher.
"""
import sys
import subprocess
from pathlib import Path


def print_section(title):
    print(f"\n{'='*60}")
    print(f"[CHECK] {title}")
    print(f"{'='*60}")


def check_python_version():
    """Verifica versao do Python."""
    print_section("Python Version")
    print(f"Version: {sys.version}")
    print(f"Executable: {sys.executable}")
    return sys.version_info >= (3, 8)


def check_playwright_installed():
    """Verifica se o Playwright esta instalado."""
    print_section("Playwright Installation")
    try:
        from playwright.sync_api import sync_playwright
        print("[OK] Playwright is installed and importable")
        return True
    except ImportError:
        print("[FAIL] Playwright NOT installed")
        print("   Install with: pip install playwright")
        return False


def check_chromium_installed():
    """Verifica se o Chromium esta instalado para o Playwright."""
    print_section("Chromium Browser")
    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            try:
                browser = p.chromium.launch()
                browser.close()
                print("[OK] Chromium is installed and working")
                return True
            except Exception as e:
                print(f"[FAIL] Chromium NOT installed or error: {e}")
                print("   Install with: python -m playwright install chromium")
                return False
    except Exception as e:
        print(f"[FAIL] Error checking Chromium: {e}")
        return False


def check_directories():
    """Verifica/cria diretorios necessarios."""
    print_section("Directory Structure")

    dirs_to_check = [
        Path.home() / '.claude' / 'intranet_cookies',
        Path.home() / '.claude' / 'intranet_logs',
    ]

    for dir_path in dirs_to_check:
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"[OK] {dir_path} - OK")
        except Exception as e:
            print(f"[FAIL] {dir_path} - Error: {e}")


def test_simple_browser_launch():
    """Testa abrir o navegador de forma simples."""
    print_section("Browser Launch Test")

    try:
        from playwright.sync_api import sync_playwright

        print("Launching browser (5 second test)...")

        with sync_playwright() as p:
            # Tenta abrir em modo visivel
            browser = p.chromium.launch(
                headless=False,
                args=['--start-maximized'],
                timeout=10000
            )
            print("[OK] Browser launched successfully!")

            # Cria pagina e navega para um site publico
            page = browser.new_page()
            page.goto('https://example.com', wait_until='domcontentloaded')
            print(f"[OK] Navigated to: {page.url}")
            print(f"[OK] Page title: {page.title()}")

            # Aguarda 3 segundos para voce ver
            import time
            print("Waiting 3 seconds so you can see the browser...")
            time.sleep(3)

            browser.close()
            print("[OK] Browser closed successfully")
            return True

    except Exception as e:
        print(f"[FAIL] Browser launch FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_async_version():
    """Testa a versao async que a skill usa."""
    print_section("Async Browser Test (like the skill uses)")

    try:
        import asyncio
        from playwright.async_api import async_playwright

        async def test():
            print("Launching async browser...")
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=False,
                    args=['--start-maximized']
                )
                print("[OK] Browser launched (async)")

                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080}
                )
                page = await context.new_page()

                await page.goto('https://example.com', wait_until='domcontentloaded')
                title = await page.title()
                print(f"[OK] Page loaded: {title}")

                await asyncio.sleep(3)
                await browser.close()
                print("[OK] Browser closed")

        asyncio.run(test())
        return True

    except Exception as e:
        print(f"[FAIL] Async test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    print("="*60)
    print("INTRANET-FETCHER DIAGNOSTIC TOOL")
    print("Verificando ambiente para acesso a intranet DiDi")
    print("="*60)

    results = {
        'python': check_python_version(),
        'playwright': check_playwright_installed(),
        'chromium': False,
        'directories': True,
        'browser_sync': False,
        'browser_async': False,
    }

    if results['playwright']:
        results['chromium'] = check_chromium_installed()
        check_directories()

        if results['chromium']:
            results['browser_sync'] = test_simple_browser_launch()
            results['browser_async'] = test_async_version()

    # Resumo
    print("\n" + "="*60)
    print("DIAGNOSTIC SUMMARY")
    print("="*60)

    for check, passed in results.items():
        status = "PASS" if passed else "FAIL"
        print(f"{check:20} {status}")

    print("\n" + "="*60)

    all_passed = all(results.values())
    if all_passed:
        print("ALL CHECKS PASSED!")
        print("   The intranet-fetcher skill should work correctly.")
        print("\n   Try running:")
        print("   python .claude/skills/intranet-fetcher/scripts/fetcher.py <URL>")
    else:
        print("SOME CHECKS FAILED")
        print("   Please fix the issues above before using the skill.")

    return 0 if all_passed else 1


if __name__ == '__main__':
    sys.exit(main())

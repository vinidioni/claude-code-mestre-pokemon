#!/usr/bin/env python3
"""
Exemplo de uso de sessão interativa
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from session import InteractiveSession, SessionManager


async def main():
    print("="*60)
    print("Exemplo de Sessão Interativa")
    print("="*60)

    # Criar manager
    manager = SessionManager()

    # Criar sessão
    session = manager.create(
        session_id="exemplo_interativo",
        domain="skillshub.intra.xiaojukeji.com"
    )

    # Usar context manager para garantir cleanup
    async with session:
        print("\n1. Abrindo skillshub...")
        await session.new_page("https://skillshub.intra.xiaojukeji.com")

        print("2. Aguardando carregamento...")
        await session.wait_for_load_state('networkidle')

        print("3. Extraindo conteúdo...")
        content = await session.extract_content()

        print(f"\n✅ Conteúdo extraído:")
        print(f"   Título: {content['title']}")
        print(f"   URL: {content['url']}")
        print(f"   Headings H2: {len(content['headings']['h2'])}")

        # Tirar screenshot
        print("\n4. Tirando screenshot...")
        screenshot_path = await session.screenshot(
            path='/tmp/session_example.png',
            full_page=True
        )
        print(f"   Screenshot: {screenshot_path}")

    print("\n5. Sessão fechada automaticamente")
    print("="*60)


if __name__ == '__main__':
    asyncio.run(main())

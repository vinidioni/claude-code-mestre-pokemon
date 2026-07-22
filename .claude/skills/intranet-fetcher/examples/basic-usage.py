#!/usr/bin/env python3
"""
Exemplo básico de uso da skill intranet-fetcher
"""
import sys
from pathlib import Path

# Adicionar scripts ao path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from fetcher import IntranetFetcher


def main():
    # URL para analisar
    url = "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch"

    print("="*60)
    print("Exemplo Básico - intranet-fetcher")
    print("="*60)
    print(f"\nAnalisando: {url}\n")

    # Criar fetcher
    fetcher = IntranetFetcher()

    # Analisar URL (versão síncrona para scripts)
    result = fetcher.analyze_sync(url)

    # Mostrar resultados
    print("✅ Análise concluída!\n")
    print(f"Título: {result.main_title or result.title}")
    print(f"Versão: {result.version or 'N/A'}")

    if result.description:
        print(f"\nDescrição: {result.description[:200]}...")

    print(f"\nEstatísticas:")
    print(f"  - Seções H2: {len(result.headings.get('h2', []))}")
    print(f"  - Exemplos de código: {len(result.code_examples)}")
    print(f"  - Conteúdo: {len(result.content)} caracteres")

    if result.screenshot_path:
        print(f"\nScreenshot: {result.screenshot_path}")

    print("\n" + "="*60)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Exemplo de análise em lote de múltiplas URLs
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from batch import BatchProcessor


def progress_callback(current, total, url):
    """Callback para mostrar progresso"""
    print(f"[{current}/{total}] {url}")


def main():
    # Lista de skills para analisar
    skills = [
        "xiaoju-fetch",
        "cooper",
        "cooper-doc-writer",
        "dchat-message",
    ]

    urls = [
        f"https://skillshub.intra.xiaojukeji.com/skill/{skill}"
        for skill in skills
    ]

    print("="*60)
    print("Análise em Lote - intranet-fetcher")
    print("="*60)
    print(f"\nAnalisando {len(urls)} skills...\n")

    # Criar processor
    processor = BatchProcessor(
        delay_between_requests=3,  # 3 segundos entre requisições
        max_retries=2,
        on_progress=progress_callback
    )

    # Processar
    results = processor.process_sync(urls)

    # Resumo
    successful = sum(1 for r in results if r['success'])
    failed = len(results) - successful

    print(f"\n{'='*60}")
    print("Resumo:")
    print(f"  ✓ Sucesso: {successful}")
    print(f"  ✗ Falhas: {failed}")

    # Exportar para CSV
    output_path = processor.export(results, format='csv')
    print(f"\n📄 CSV exportado: {output_path}")

    # Exportar para Markdown
    output_path = processor.export(results, format='markdown')
    print(f"📄 Markdown exportado: {output_path}")

    print("="*60)


if __name__ == '__main__':
    main()

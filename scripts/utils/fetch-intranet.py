#!/usr/bin/env python3
"""
Script de linha de comando para análise de URLs da intranet DiDi.

Uso:
    python scripts/fetch-intranet.py <url>
    python scripts/fetch-intranet.py https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch
    python scripts/fetch-intranet.py <url> --json --screenshot ./output.png

Parte da skill: intranet-fetcher v1.0.0
"""
import sys
import argparse
from pathlib import Path

# Adicionar scripts ao path
sys.path.insert(0, str(Path(__file__).parent.parent / '.claude' / 'skills' / 'intranet-fetcher' / 'scripts'))

from fetcher import IntranetFetcher, FetcherConfig
from dataclasses import asdict
import json


def main():
    parser = argparse.ArgumentParser(
        description='Analisa URLs da intranet DiDi (skillshub, cooper, etc.)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  # Análise simples
  python scripts/fetch-intranet.py https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch

  # Exportar como JSON
  python scripts/fetch-intranet.py <url> --json

  # Screenshot customizado
  python scripts/fetch-intranet.py <url> --screenshot ./minha_skill.png

  # Aumentar timeout de login
  python scripts/fetch-intranet.py <url> --wait 120

  # Análise completa com todos os artefatos
  python scripts/fetch-intranet.py <url> --json --screenshot --output-dir ./meus_dados
        """
    )

    parser.add_argument('url', help='URL da intranet DiDi para analisar')
    parser.add_argument(
        '--json', '-j',
        action='store_true',
        help='Saída em formato JSON (padrão: resumo formatado)'
    )
    parser.add_argument(
        '--screenshot', '-s',
        nargs='?',
        const='auto',
        help='Tirar screenshot. Pode especificar caminho ou usar padrão'
    )
    parser.add_argument(
        '--wait', '-w',
        type=int,
        default=90,
        help='Segundos para aguardar login manual (padrão: 90)'
    )
    parser.add_argument(
        '--output-dir', '-o',
        type=str,
        help='Diretório para salvar arquivos de saída'
    )
    parser.add_argument(
        '--headless',
        action='store_true',
        help='Executar em modo headless (sem interface gráfica)'
    )
    parser.add_argument(
        '--max-content',
        type=int,
        default=15000,
        help='Máximo de caracteres de conteúdo (padrão: 15000)'
    )
    parser.add_argument(
        '--no-code',
        action='store_true',
        help='Não extrair exemplos de código'
    )
    parser.add_argument(
        '--no-headings',
        action='store_true',
        help='Não extrair headings'
    )

    args = parser.parse_args()

    # Configurar
    config = FetcherConfig(
        headless=args.headless
    )

    fetcher = IntranetFetcher(config)

    # Determinar caminho do screenshot
    screenshot_path = None
    if args.screenshot:
        if args.screenshot == 'auto':
            from urllib.parse import urlparse
            from pathlib import Path
            parsed = urlparse(args.url)
            filename = Path(parsed.path).name or 'index'
            screenshot_path = f'/tmp/intranet_{filename}.png'
        else:
            screenshot_path = args.screenshot

    # Executar análise
    try:
        print(f"🔍 Analisando: {args.url}")
        print(f"   Aguardando até {args.wait}s para login se necessário\n")

        result = fetcher.analyze_sync(
            url=args.url,
            extract_headings=not args.no_headings,
            extract_code=not args.no_code,
            max_content_length=args.max_content,
            take_screenshot=args.screenshot is not None,
            screenshot_path=screenshot_path,
            wait_time=args.wait
        )

        # Criar diretório de saída se especificado
        if args.output_dir:
            output_dir = Path(args.output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)

            # Salvar JSON
            json_path = output_dir / 'result.json'
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(asdict(result), f, indent=2, ensure_ascii=False)
            print(f"💾 JSON salvo: {json_path}")

            # Salvar conteúdo em texto
            txt_path = output_dir / 'content.txt'
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write(f"Título: {result.main_title}\n")
                f.write(f"URL: {result.url}\n")
                f.write(f"Versão: {result.version or 'N/A'}\n")
                f.write(f"\n{'='*60}\n")
                f.write(result.content)
            print(f"💾 Texto salvo: {txt_path}")

            # Copiar screenshot se existir
            if result.screenshot_path:
                from shutil import copy
                screenshot_dest = output_dir / 'screenshot.png'
                copy(result.screenshot_path, screenshot_dest)
                print(f"💾 Screenshot salvo: {screenshot_dest}")

        # Output
        if args.json:
            print(json.dumps(asdict(result), indent=2, ensure_ascii=False))
        else:
            print_formatado(result)

    except KeyboardInterrupt:
        print("\n\n⚠️  Interrompido pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def print_formatado(result):
    """Imprime resultado formatado."""
    print("\n" + "="*70)
    print(f"📄 {result.main_title or result.title}")
    print("="*70)

    print(f"\n🔗 URL: {result.url}")

    if result.version:
        print(f"🏷️  Versão: {result.version}")

    if result.description:
        desc = result.description[:300]
        if len(result.description) > 300:
            desc += "..."
        print(f"\n📝 Descrição:")
        print(f"   {desc}")

    print(f"\n📊 Estatísticas:")
    print(f"   • Seções H2: {len(result.headings.get('h2', []))}")
    print(f"   • Seções H3: {len(result.headings.get('h3', []))}")
    print(f"   • Exemplos de código: {len(result.code_examples)}")
    print(f"   • Conteúdo: {len(result.content)} caracteres")

    if result.headings.get('h2'):
        print(f"\n📑 Seções principais:")
        for h2 in result.headings['h2'][:8]:
            print(f"   • {h2}")
        if len(result.headings['h2']) > 8:
            print(f"   ... e mais {len(result.headings['h2']) - 8}")

    if result.code_examples:
        print(f"\n💻 Primeiro exemplo de código:")
        example = result.code_examples[0][:200]
        if len(result.code_examples[0]) > 200:
            example += "..."
        print(f"   ```")
        for line in example.split('\n')[:5]:
            print(f"   {line}")
        print(f"   ```")

    if result.screenshot_path:
        print(f"\n📸 Screenshot: {result.screenshot_path}")

    print("\n" + "="*70)


if __name__ == '__main__':
    main()

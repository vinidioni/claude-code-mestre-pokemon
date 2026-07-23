#!/usr/bin/env python3
"""
Extrai todos os MCPs da lista para análise
"""
import sys
import json
from pathlib import Path

# Adicionar path da skill
sys.path.insert(0, str(Path.home() / 'Desktop' / 'dcc' / '.claude' / 'skills' / 'intranet-fetcher' / 'scripts'))

from fetcher import IntranetFetcher, FetcherConfig
import asyncio

MCPS = [
    ("数梦MCP (Shumeng/Data Dream)", "%E6%95%B0%E6%A2%A6MCP"),
    ("DiDi-MCP-Server", "DiDi-MCP-Server"),
    ("google-drive", "google-drive"),
    ("gitlab", "gitlab"),
    ("github", "github"),
    ("github-actions", "github-actions"),
    ("google-maps", "google-maps"),
    ("puppeteer", "puppeteer"),
    ("playwright", "playwright"),
    ("star", "star"),
    ("apollo-mcp", "apollo-mcp"),
    ("rider-feature-explanation", "rider-feature-explanation"),
    ("Apollo-mcp (2)", "Apollo-mcp"),
    ("replicate", "replicate"),
    ("bigdata-server-diag-mcp", "bigdata-server-diag-mcp"),
    ("everything-search", "everything-search"),
    ("mcp-deepwiki", "mcp-deepwiki"),
]

BASE_URL = "https://mcphub.intra.xiaojukeji.com/square"

async def extract_all():
    config = FetcherConfig(headless=False, login_timeout=30)
    fetcher = IntranetFetcher(config)
    results = []

    for idx, (nome, slug) in enumerate(MCPS, 1):
        url = f"{BASE_URL}/{slug}"
        print(f"\n{'='*60}")
        print(f"[{idx}/{len(MCPS)}] Extraindo: {nome}")
        print(f"{'='*60}")

        try:
            result = await fetcher.analyze(
                url=url,
                extract_headings=True,
                extract_code=True,
                max_content_length=15000,
                take_screenshot=False,
                wait_time=30
            )

            # Estruturar dados
            mcp_data = {
                "nome": nome,
                "slug": slug,
                "url": url,
                "titulo": result.main_title or result.title,
                "descricao": result.description or result.content[:500] if result.content else "",
                "funcionalidades": result.headings.get('h2', []) + result.headings.get('h3', []),
                "exemplos_codigo": result.code_examples[:5],
                "conteudo_completo": result.content[:3000],
                "status": "extraido"
            }
            results.append(mcp_data)
            print(f"✅ Sucesso: {mcp_data['titulo'][:50]}")

        except Exception as e:
            print(f"❌ Erro: {e}")
            results.append({
                "nome": nome,
                "slug": slug,
                "url": url,
                "status": "erro",
                "erro": str(e)
            })

        # Salvar progresso
        output = Path.home() / '.claude' / 'mcp_hub_full_extract.json'
        with open(output, 'w', encoding='utf-8') as f:
            json.dump({
                'total': len(MCPS),
                'completados': len(results),
                'mcps': results
            }, f, indent=2, ensure_ascii=False)

    return results

if __name__ == '__main__':
    print("🚀 Iniciando extração de todos os MCPs...")
    print(f"📋 Total: {len(MCPS)} MCPs")
    print("⚠️  Os cookies já estão salvos, então não precisa fazer login novamente.\n")

    results = asyncio.run(extract_all())

    print(f"\n{'='*60}")
    print("EXTRAÇÃO COMPLETA!")
    print(f"{'='*60}")
    print(f"Total extraídos: {len([r for r in results if r.get('status') == 'extraido'])}")
    print(f"Total com erro: {len([r for r in results if r.get('status') == 'erro'])}")
    print(f"\nDados salvos em: {Path.home() / '.claude' / 'mcp_hub_full_extract.json'}")

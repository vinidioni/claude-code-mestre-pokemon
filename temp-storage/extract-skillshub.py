#!/usr/bin/env python3
"""
Extract skills from DiDi Skillshub for analysis
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path.home() / 'Desktop' / 'dcc' / '.claude' / 'skills' / 'intranet-fetcher' / 'scripts'))

from fetcher import IntranetFetcher, FetcherConfig
import asyncio

SKILLS = [
    ("cooper", "cooper"),
    ("prompt_beautifier", "prompt_beautifier"),
    ("d-skills", "d-skills"),
    ("cooper-mcp-helper", "cooper-mcp-helper"),
    ("smartwork-cli", "smartwork-cli"),
    ("aidata-nlp-sql", "aidata-nlp-sql"),
    ("datatools", "datatools"),
    ("d-safe", "d-safe"),
    ("cooper-image-read", "cooper-image-read"),
]

BASE_URL = "https://skillshub.intra.xiaojukeji.com/skill"

async def extract_all():
    config = FetcherConfig(headless=False, login_timeout=30)
    fetcher = IntranetFetcher(config)
    results = []

    for idx, (nome, slug) in enumerate(SKILLS, 1):
        url = f"{BASE_URL}/{slug}"
        print(f"\n{'='*60}")
        print(f"[{idx}/{len(SKILLS)}] Extracting: {nome}")
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

            skill_data = {
                "name": nome,
                "slug": slug,
                "url": url,
                "title": result.main_title or result.title,
                "description": result.description or result.content[:800] if result.content else "",
                "features": result.headings.get('h2', []) + result.headings.get('h3', []),
                "code_examples": result.code_examples[:5],
                "full_content": result.content[:4000],
                "status": "extracted"
            }
            results.append(skill_data)
            print(f"[OK] Success: {skill_data['title'][:50]}")

        except Exception as e:
            print(f"[FAIL] Error: {e}")
            results.append({
                "name": nome,
                "slug": slug,
                "url": url,
                "status": "error",
                "error": str(e)
            })

        # Save progress
        output = Path.home() / '.claude' / 'skillshub_extract.json'
        with open(output, 'w', encoding='utf-8') as f:
            json.dump({
                'total': len(SKILLS),
                'completed': len(results),
                'skills': results
            }, f, indent=2, ensure_ascii=False)

    return results

if __name__ == '__main__':
    print("Starting Skillshub extraction...")
    print(f"Total: {len(SKILLS)} skills")
    print("Cookies should already be saved from previous login.\n")

    results = asyncio.run(extract_all())

    print(f"\n{'='*60}")
    print("EXTRACTION COMPLETE!")
    print(f"{'='*60}")
    print(f"Extracted: {len([r for r in results if r.get('status') == 'extracted'])}")
    print(f"Errors: {len([r for r in results if r.get('status') == 'error'])}")

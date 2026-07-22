#!/usr/bin/env python3
"""
Script para extrair multiplas skills do skillshub
"""
import asyncio
import json
import sys
from playwright.async_api import async_playwright

SKILLS = [
    "https://skillshub.intra.xiaojukeji.com/skill/dcc-dchat-publisher",
    "https://skillshub.intra.xiaojukeji.com/skill/at-me-todo",
    "https://skillshub.intra.xiaojukeji.com/skill/cs-daily-report",
    "https://skillshub.intra.xiaojukeji.com/skill/dchat-todo",
    "https://skillshub.intra.xiaojukeji.com/skill/dchat-message"
]

async def fetch_skill(page, url):
    """Extrai informacoes de uma skill"""
    try:
        await page.goto(url, wait_until='networkidle', timeout=60000)
        await asyncio.sleep(2)

        # Extrair metadados
        info = await page.evaluate('''() => {
            const title = document.title || 'No title';

            // Nome da skill
            const h1 = document.querySelector('h1');
            const skillName = h1 ? h1.innerText : '';

            // Versao
            const versionEl = Array.from(document.querySelectorAll('*')).find(
                el => el.innerText && el.innerText.match(/^v?\\d+\\.\\d+\\.\\d+$/)
            );
            const version = versionEl ? versionEl.innerText : '';

            // Descricao curta
            const descEl = document.querySelector('.description, [class*="desc"]');
            const description = descEl ? descEl.innerText.substring(0, 500) : '';

            // Headings estruturais
            const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText).slice(0, 15);
            const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText).slice(0, 20);

            // Conteudo principal
            const main = document.querySelector('main, .content, article') || document.body;
            const content = main ? main.innerText.substring(0, 8000) : '';

            // Codigo/exemplos
            const codeBlocks = Array.from(document.querySelectorAll('pre, code')).map(
                el => el.innerText.substring(0, 1000)
            ).slice(0, 5);

            return {
                title,
                skillName,
                version,
                description,
                headings: { h2: h2s, h3: h3s },
                content,
                codeExamples: codeBlocks
            };
        }''')

        info['url'] = url
        info['skillId'] = url.split('/skill/')[1]
        return info

    except Exception as e:
        return {
            'url': url,
            'skillId': url.split('/skill/')[1],
            'error': str(e)
        }

async def main():
    async with async_playwright() as p:
        # Usar persistent context para manter sessao
        from pathlib import Path
        user_data_dir = Path.home() / '.playwright_skillshub_data'
        user_data_dir.mkdir(exist_ok=True)

        browser = await p.chromium.launch(
            headless=False,
            args=['--no-sandbox'],
        )

        # Criar contexto com viewport padrao
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
        )
        page = await context.new_page()

        # Primeiro verificar se ja esta logado acessando uma pagina
        print("Verificando autenticacao...")
        await page.goto('https://skillshub.intra.xiaojukeji.com/', wait_until='networkidle', timeout=30000)
        await asyncio.sleep(3)

        # Verificar se esta na tela de login
        page_title = await page.title()
        if 'login' in page_title.lower() or 'auth' in page_title.lower() or '登录' in page_title:
            print("ATENCAO: Necessario login no skillshub!")
            print("Por favor, faca login manualmente no navegador que abriu.")
            print("Aguardando 60 segundos para login...")
            await asyncio.sleep(60)
            # Verificar novamente
            page_title = await page.title()
            if 'login' in page_title.lower() or '登录' in page_title:
                print("Ainda na tela de login. Cancelando...")
                await browser.close()
                return []

        print("Autenticado. Continuando com acesso as skills...")

        results = []
        for i, url in enumerate(SKILLS, 1):
            print(f"[{i}/{len(SKILLS)}] Fetching skill...")
            skill_data = await fetch_skill(page, url)
            results.append(skill_data)
            print(f"  Done: {skill_data.get('skillId', 'unknown')}")
            await asyncio.sleep(1)

        await browser.close()

        # Salvar resultados
        output = {
            'fetched_at': str(asyncio.get_event_loop().time()),
            'skills': results
        }

        with open('/tmp/skillshub_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print("\nAnalysis saved to: /tmp/skillshub_analysis.json")
        return results

if __name__ == '__main__':
    results = asyncio.run(main())

    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for r in results:
        print(f"\n{r.get('skillId', 'unknown')}:")
        print(f"  Name: {r.get('skillName', 'N/A')}")
        print(f"  Version: {r.get('version', 'N/A')}")
        if r.get('headings'):
            print(f"  Sections: {len(r['headings'].get('h2', []))} H2, {len(r['headings'].get('h3', []))} H3")
        if r.get('error'):
            print(f"  Error: {r['error']}")

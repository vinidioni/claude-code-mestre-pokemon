#!/usr/bin/env python3
"""
Analisa a estrutura e funcionamento da skill deskbee-book-room
"""
import asyncio
import json
from playwright.async_api import async_playwright

SKILL_URL = "https://skillshub.intra.xiaojukeji.com/skill/deskbee-book-room"

async def analyze_skill():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=['--no-sandbox'])
        context = await browser.new_context(viewport={'width': 1400, 'height': 900})
        page = await context.new_page()

        print("Acessando Skillshub...")
        await page.goto('https://skillshub.intra.xiaojukeji.com/', wait_until='networkidle', timeout=30000)
        await asyncio.sleep(2)

        # Verificar login
        if 'login' in page.url.lower() or 'sso' in page.url.lower():
            print("\n[!] Faca login no Skillshub (navegador aberto)")
            print("Aguardando 60s...")
            for i in range(60):
                await asyncio.sleep(1)
                if 'login' not in page.url.lower():
                    print("[OK] Logado!")
                    break

        print(f"\nAcessando skill: {SKILL_URL}")
        await page.goto(SKILL_URL, wait_until='networkidle', timeout=60000)
        await asyncio.sleep(3)

        # Extrair estrutura completa
        skill_data = await page.evaluate('''() => {
            // Titulo e identificacao
            const title = document.querySelector('h1')?.innerText?.trim() || '';
            const subtitle = document.querySelector('h2')?.innerText?.trim() || '';

            // Metadados
            const version = Array.from(document.querySelectorAll('*'))
                .find(el => el.innerText?.match(/^v?\d+\.\d+\.\d+$/))?.innerText || '';

            // Descricao completa
            let description = '';
            const descEl = document.querySelector('.description, [class*="desc"], .summary');
            if (descEl) description = descEl.innerText.trim();

            // Extrair todas as secoes H2 e H3 com conteudo
            const sections = [];
            const h2s = document.querySelectorAll('h2');

            h2s.forEach(h2 => {
                const section = {
                    title: h2.innerText.trim(),
                    content: '',
                    subsections: []
                };

                // Pegar conteudo ate o proximo H2
                let nextEl = h2.nextElementSibling;
                while (nextEl && nextEl.tagName !== 'H2') {
                    if (nextEl.tagName === 'H3') {
                        section.subsections.push({
                            title: nextEl.innerText.trim(),
                            content: ''
                        });
                    } else {
                        const text = nextEl.innerText?.trim();
                        if (text) {
                            if (section.subsections.length > 0) {
                                section.subsections[section.subsections.length - 1].content += text + '\n';
                            } else {
                                section.content += text + '\n';
                            }
                        }
                    }
                    nextEl = nextEl.nextElementSibling;
                }

                sections.push(section);
            });

            // Extrair tabelas (parametros, etc)
            const tables = [];
            document.querySelectorAll('table').forEach(table => {
                const rows = [];
                table.querySelectorAll('tr').forEach(tr => {
                    const row = [];
                    tr.querySelectorAll('td, th').forEach(cell => {
                        row.push(cell.innerText.trim());
                    });
                    if (row.length > 0) rows.push(row);
                });
                if (rows.length > 0) tables.push(rows);
            });

            // Extrair codigos/exemplos
            const codeBlocks = [];
            document.querySelectorAll('pre, code').forEach(block => {
                const text = block.innerText.trim();
                if (text.length > 10) codeBlocks.push(text);
            });

            // URLs importantes mencionadas
            const pageText = document.body.innerText;
            const urls = [];
            const urlMatches = pageText.match(/https?:\/\/[^\s<>"{}|\^`\[\]]+/g);
            if (urlMatches) {
                urlMatches.forEach(url => {
                    if (!urls.includes(url)) urls.push(url);
                });
            }

            // Referencias a outros arquivos
            const references = [];
            const refMatches = pageText.match(/references\/[\w\-]+\.md/g);
            if (refMatches) {
                refMatches.forEach(ref => {
                    if (!references.includes(ref)) references.push(ref);
                });
            }

            return {
                title,
                subtitle,
                version,
                description,
                sections,
                tables,
                codeBlocks,
                urls,
                references,
                fullText: pageText.substring(0, 5000)
            };
        }''')

        await browser.close()

        # Salvar analise
        with open('skill_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(skill_data, f, indent=2, ensure_ascii=False)

        return skill_data

if __name__ == '__main__':
    result = asyncio.run(analyze_skill())

    print("\n" + "="*70)
    print("ANALISE DA SKILL")
    print("="*70)
    print(f"\nTitulo: {result.get('title')}")
    print(f"Versao: {result.get('version')}")
    print(f"\nDescricao:\n{result.get('description', 'N/A')[:300]}...")
    print(f"\nSecoes ({len(result.get('sections', []))}):")
    for s in result.get('sections', []):
        print(f"  - {s['title']}")
        for sub in s.get('subsections', []):
            print(f"    * {sub['title']}")
    print(f"\nReferencias externas: {result.get('references', [])}")
    print(f"\nAnalise completa salva em: skill_analysis.json")

#!/usr/bin/env python3
"""
Script para acessar skillshub via Playwright
"""
import asyncio
import json
import sys
from playwright.async_api import async_playwright

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

async def fetch_skillshub():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            args=['--no-sandbox']
        )

        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800}
        )

        page = await context.new_page()

        print("Navigating to skillshub...")
        try:
            await page.goto(
                'https://skillshub.intra.xiaojukeji.com/skill/dchat-message',
                wait_until='networkidle',
                timeout=60000
            )

            await asyncio.sleep(3)

            title = await page.title()
            print(f"Title: {title}")

            headings = await page.evaluate('''() => {
                const h1 = document.querySelector('h1');
                const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText);
                const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
                return { h1: h1 ? h1.innerText : null, h2: h2s, h3: h3s };
            }''')

            print("Headings found:")
            print(json.dumps(headings, indent=2, ensure_ascii=False))

            content = await page.evaluate('''() => {
                const main = document.querySelector('main') ||
                            document.querySelector('.content') ||
                            document.querySelector('#content') ||
                            document.body;
                return main ? main.innerText.substring(0, 5000) : 'No content found';
            }''')

            await page.screenshot(path='/tmp/skillshub_screenshot.png', full_page=True)
            print("Screenshot saved: /tmp/skillshub_screenshot.png")

            with open('/tmp/skillshub_content.txt', 'w', encoding='utf-8') as f:
                f.write(f"Title: {title}\n\n")
                f.write(f"Headings: {json.dumps(headings, indent=2, ensure_ascii=False)}\n\n")
                f.write(content)
            print("Content saved: /tmp/skillshub_content.txt")

        except Exception as e:
            import traceback
            print(f"Error: {e}")
            traceback.print_exc()
            try:
                await page.screenshot(path='/tmp/skillshub_error.png')
                print("Error screenshot saved")
            except Exception as e2:
                print(f"Could not take screenshot: {e2}")

        finally:
            await browser.close()

if __name__ == '__main__':
    asyncio.run(fetch_skillshub())

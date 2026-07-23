#!/usr/bin/env python3
"""
Gera manual DCC em HTML para conversão em PDF
"""

import os
from pathlib import Path
from datetime import datetime
import re


def markdown_to_html(text):
    """Converte markdown básico para HTML"""
    # Escape HTML
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    # Código inline
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)

    # Negrito
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__([^_]+)__', r'<strong>\1</strong>', text)

    # Itálico
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    text = re.sub(r'_([^_]+)_', r'<em>\1</em>', text)

    return text


def process_markdown(content, base_level=1):
    """Processa markdown para HTML"""
    lines = content.split('\n')
    html_parts = []
    in_code_block = False
    code_buffer = []
    in_table = False
    table_buffer = []

    for line in lines:
        stripped = line.strip()

        # Blocos de código
        if stripped.startswith('```'):
            if in_code_block:
                code_text = '\n'.join(code_buffer)
                html_parts.append(f'<pre><code>{code_text}</code></pre>')
                code_buffer = []
                in_code_block = False
            else:
                in_code_block = True
            continue

        if in_code_block:
            code_buffer.append(line)
            continue

        # Títulos
        if stripped.startswith('# '):
            text = markdown_to_html(stripped[2:])
            html_parts.append(f'<h{base_level}>{text}</h{base_level}>')
        elif stripped.startswith('## '):
            text = markdown_to_html(stripped[3:])
            html_parts.append(f'<h{base_level+1}>{text}</h{base_level+1}>')
        elif stripped.startswith('### '):
            text = markdown_to_html(stripped[4:])
            html_parts.append(f'<h{base_level+2}>{text}</h{base_level+2}>')
        elif stripped.startswith('#### '):
            text = markdown_to_html(stripped[5:])
            html_parts.append(f'<h{base_level+3}>{text}</h{base_level+3}>')
        # Linha horizontal
        elif stripped == '---':
            html_parts.append('<hr>')
        # Listas
        elif stripped.startswith('- ') or stripped.startswith('* '):
            text = markdown_to_html(stripped[2:])
            html_parts.append(f'<li>{text}</li>')
        # Checkbox
        elif stripped.startswith('- [ ]'):
            text = markdown_to_html(stripped[5:])
            html_parts.append(f'<li style="list-style: none;">☐ {text}</li>')
        elif stripped.startswith('- [x]'):
            text = markdown_to_html(stripped[5:])
            html_parts.append(f'<li style="list-style: none;">☑ {text}</li>')
        # Tabelas
        elif stripped.startswith('|'):
            if '---' in stripped:
                continue
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if cells:
                row_html = ''.join([f'<td style="border: 1px solid #ddd; padding: 8px;">{markdown_to_html(c)}</td>' for c in cells])
                html_parts.append(f'<tr>{row_html}</tr>')
        # Citações
        elif stripped.startswith('>'):
            text = markdown_to_html(stripped[1:].strip())
            html_parts.append(f'<blockquote>{text}</blockquote>')
        # Links
        elif re.match(r'\[([^\]]+)\]\(([^)]+)\)', stripped):
            # Parágrafo com possíveis links
            text = stripped
            text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
            text = markdown_to_html(text)
            html_parts.append(f'<p>{text}</p>')
        # Texto normal
        elif stripped:
            text = markdown_to_html(stripped)
            html_parts.append(f'<p>{text}</p>')
        else:
            html_parts.append('<br>')

    return '\n'.join(html_parts)


def generate_html():
    base_dir = Path(__file__).parent.parent

    files = [
        ("1. README.md", base_dir / "README.md", "Visão Geral do DCC"),
        ("2. SETUP.md", base_dir / "SETUP.md", "Instalação Técnica"),
        ("3. manual-de-instalacao.md", base_dir / "docs" / "manual-de-instalacao.md", "Guia Conceitual"),
        ("4. CLAUDE.md", base_dir / "CLAUDE.md", "Documentação Completa"),
        ("5. guia-claude-code.md", base_dir / "docs" / "guia-claude-code.md", "Uso do Claude Code"),
        ("6. convenções.md", base_dir / "docs" / "convenções.md", "Padrões do Projeto"),
    ]

    html_content = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DCC Manual de Instalação</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}

        @media print {{
            .page-break {{
                page-break-before: always;
            }}
            body {{
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }}
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }}

        .cover {{
            text-align: center;
            padding: 100px 0;
            page-break-after: always;
        }}

        .cover h1 {{
            font-size: 42px;
            color: #0066cc;
            margin-bottom: 20px;
        }}

        .cover h2 {{
            font-size: 24px;
            color: #666;
            font-weight: normal;
            margin-bottom: 30px;
        }}

        .cover .subtitle {{
            font-size: 16px;
            color: #888;
            margin-bottom: 60px;
        }}

        .cover .version {{
            font-size: 14px;
            color: #aaa;
        }}

        .toc {{
            page-break-after: always;
        }}

        .toc h2 {{
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }}

        .toc-item {{
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-left: 4px solid #0066cc;
        }}

        .toc-item strong {{
            color: #0066cc;
            display: block;
            margin-bottom: 5px;
        }}

        .toc-item span {{
            color: #666;
            font-size: 14px;
        }}

        .section {{
            page-break-before: always;
        }}

        .section-header {{
            background: #0066cc;
            color: white;
            padding: 15px 20px;
            margin: -20px -20px 20px -20px;
        }}

        .section-header h1 {{
            margin: 0;
            font-size: 20px;
        }}

        h1 {{
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
            margin-top: 30px;
            font-size: 24px;
        }}

        h2 {{
            color: #333;
            margin-top: 25px;
            font-size: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }}

        h3 {{
            color: #444;
            margin-top: 20px;
            font-size: 16px;
        }}

        h4 {{
            color: #555;
            margin-top: 15px;
            font-size: 14px;
        }}

        pre {{
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 13px;
            border-left: 4px solid #0066cc;
        }}

        code {{
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }}

        pre code {{
            background: none;
            padding: 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
        }}

        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}

        th {{
            background: #0066cc;
            color: white;
        }}

        tr:nth-child(even) {{
            background: #f9f9f9;
        }}

        blockquote {{
            border-left: 4px solid #0066cc;
            margin: 15px 0;
            padding: 10px 20px;
            background: #f8f9fa;
            color: #555;
        }}

        ul, ol {{
            padding-left: 25px;
        }}

        li {{
            margin-bottom: 5px;
        }}

        hr {{
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
        }}

        a {{
            color: #0066cc;
            text-decoration: none;
        }}

        a:hover {{
            text-decoration: underline;
        }}

        .ascii-art {{
            font-family: 'Courier New', monospace;
            white-space: pre;
            font-size: 12px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }}
    </style>
</head>
<body>
    <div class="cover">
        <h1>DCC Claude Infrastructure</h1>
        <h2>Manual Completo de Instalação</h2>
        <div class="subtitle">Documentação consolidada em ordem de leitura recomendada</div>
        <div class="version">Versão 1.0 | {datetime.now().strftime('%B %Y')}</div>
    </div>

    <div class="toc">
        <h2>Sumário</h2>
'''

    # Adicionar itens do sumário
    for i, (filename, filepath, description) in enumerate(files, 1):
        html_content += f'''
        <div class="toc-item">
            <strong>{filename}</strong>
            <span>{description}</span>
        </div>
'''

    html_content += '''
        <div class="toc-item">
            <strong>7. CLAUDE.md Específicos</strong>
            <span>Documentação por contexto (workflows, skills, dev)</span>
        </div>
    </div>
'''

    # Adicionar conteúdo de cada arquivo
    for filename, filepath, description in files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            html_content += f'''
    <div class="section">
        <div class="section-header">
            <h1>{filename} — {description}</h1>
        </div>
'''
            html_content += process_markdown(content, base_level=1)
            html_content += '</div>\n'

        except Exception as e:
            html_content += f'<div class="section"><p>Erro ao ler {filename}: {e}</p></div>\n'

    # Seção final
    html_content += '''
    <div class="section">
        <div class="section-header">
            <h1>7. CLAUDE.md Específicos — Documentação por Contexto</h1>
        </div>

        <p>Além dos arquivos acima, o DCC possui documentação específica em subpastas que carregam automaticamente quando você trabalha em determinados contextos:</p>

        <table>
            <tr>
                <th>Contexto</th>
                <th>Arquivo</th>
                <th>Quando Usar</th>
            </tr>
            <tr>
                <td>Workflows</td>
                <td><code>.claude/workflows/CLAUDE.md</code></td>
                <td>Ao criar ou modificar workflows</td>
            </tr>
            <tr>
                <td>Skills</td>
                <td><code>.claude/skills/CLAUDE.md</code></td>
                <td>Ao desenvolver novas skills modulares</td>
            </tr>
            <tr>
                <td>Dev Docs</td>
                <td><code>dev/CLAUDE.md</code></td>
                <td>Ao usar o sistema de continuidade entre sessões</td>
            </tr>
            <tr>
                <td>Relatórios</td>
                <td><code>reports/CLAUDE.md</code></td>
                <td>Ao gerar ou consultar relatórios</td>
            </tr>
        </table>

        <h2>Como funciona a Documentação em Camadas</h2>

        <p>O DCC utiliza uma arquitetura de <strong>documentação em camadas</strong> com progressive disclosure:</p>

        <ol>
            <li><strong>CLAUDE.md raiz</strong> carrega sempre — visão geral e convenções universais</li>
            <li><strong>CLAUDE.md em subpastas</strong> carregam automaticamente quando você entra no contexto</li>
            <li>O Claude <strong>combina</strong> ambos os contextos quando relevante</li>
            <li>Use <code>@file</code> para referenciar CLAUDE.md de outros contextos quando necessário</li>
        </ol>

        <h2>Exemplo Prático</h2>

        <pre><code># Na raiz do projeto — só o CLAUDE.md raiz está ativo
claude "olá"

# Ao criar um workflow — o CLAUDE.md de .claude/workflows/ também carrega
claude "crie um workflow novo"
# Agora o Claude sabe os padrões específicos de workflows

# O mesmo acontece com skills, dev docs, etc.</code></pre>

        <h2>Ordem de Leitura Recomendada</h2>

        <ol>
            <li><strong>README.md</strong> — Visão geral e introdução</li>
            <li><strong>SETUP.md</strong> — Instalação técnica passo a passo</li>
            <li><strong>manual-de-instalacao.md</strong> — Guia conceitual da arquitetura</li>
            <li><strong>CLAUDE.md (raiz)</strong> — Documentação completa</li>
            <li><strong>guia-claude-code.md</strong> — Uso geral do Claude Code</li>
            <li><strong>convenções.md</strong> — Padrões do projeto</li>
            <li><strong>CLAUDE.md específicos</strong> — Conforme necessidade (workflows, skills, dev)</li>
        </ol>

        <hr>

        <p style="text-align: center; color: #666; margin-top: 40px;">
            <strong>DCC Claude Infrastructure v1.0.0</strong><br>
            Infraestrutura completa e pronta para uso!
        </p>
    </div>

</body>
</html>
'''

    # Salvar arquivo
    desktop = Path.home() / "Desktop"
    output_file = desktop / "DCC-Manual-de-Instalacao-Completo.html"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✅ HTML gerado com sucesso!")
    print(f"📄 Local: {output_file}")
    print(f"\n💡 Para criar o PDF:")
    print(f"   1. Abra o arquivo no navegador (Chrome, Edge, etc.)")
    print(f"   2. Pressione Ctrl+P (ou Cmd+P no Mac)")
    print(f"   3. Selecione 'Salvar como PDF'")
    print(f"   4. Configure margens e cabeçalho/rodapé se desejar")
    print(f"   5. Clique em Salvar")


if __name__ == "__main__":
    generate_html()

#!/usr/bin/env python3
"""
Pipeline de processamento para documentação.
"""
import json
from pathlib import Path
from typing import List, Dict, Any, Optional, Callable
from dataclasses import dataclass
from datetime import datetime

from .fetcher import IntranetFetcher


@dataclass
class PipelineStep:
    """Define uma etapa do pipeline."""
    name: str
    action: str
    params: Dict[str, Any]


class DocumentationPipeline:
    """
    Pipeline configurável para extração e processamento de documentação.

    Permite criar fluxos customizados de:
    - Extração de conteúdo
    - Limpeza e normalização
    - Transformação
    - Exportação
    """

    def __init__(self, steps: Optional[List[PipelineStep]] = None):
        self.steps = steps or []
        self.fetcher = IntranetFetcher()
        self._handlers: Dict[str, Callable] = {
            'fetch_and_parse': self._handle_fetch,
            'structure_content': self._handle_structure,
            'generate_summary': self._handle_summarize,
            'save_to_formats': self._handle_export,
            'custom_transform': self._handle_custom,
        }

    def add_step(self, name: str, action: str, **params):
        """Adiciona uma etapa ao pipeline."""
        self.steps.append(PipelineStep(name, action, params))
        return self

    def run(self, url: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Executa o pipeline em uma URL.

        Args:
            url: URL alvo
            context: Contexto inicial (opcional)

        Returns:
            Resultado final do pipeline
        """
        context = context or {}
        context['url'] = url
        context['started_at'] = datetime.now().isoformat()

        print(f"🚀 Iniciando pipeline para: {url}")
        print(f"   Etapas: {len(self.steps)}")

        for i, step in enumerate(self.steps, 1):
            print(f"\n[{i}/{len(self.steps)}] {step.name} ({step.action})")

            handler = self._handlers.get(step.action)
            if not handler:
                raise ValueError(f"Ação desconhecida: {step.action}")

            try:
                context = handler(context, step.params)
                context[f'{step.name}_completed'] = True
            except Exception as e:
                context[f'{step.name}_error'] = str(e)
                print(f"   ❌ Erro: {e}")
                raise

        context['completed_at'] = datetime.now().isoformat()
        print(f"\n✅ Pipeline concluído!")

        return context

    def _handle_fetch(self, context: Dict, params: Dict) -> Dict:
        """Extrai conteúdo da URL."""
        url = context['url']

        result = self.fetcher.analyze_sync(
            url,
            extract_headings=params.get('include_metadata', True),
            extract_code=True,
            max_content_length=params.get('max_length', 50000)
        )

        context['raw_content'] = {
            'title': result.main_title,
            'version': result.version,
            'description': result.description,
            'headings': result.headings,
            'content': result.content,
            'code_examples': result.code_examples,
            'meta': result.meta,
        }

        return context

    def _handle_structure(self, context: Dict, params: Dict) -> Dict:
        """Estrutura e limpa o conteúdo."""
        raw = context.get('raw_content', {})

        structured = {
            'metadata': {
                'title': raw.get('title'),
                'version': raw.get('version'),
                'url': context['url'],
                'extracted_at': datetime.now().isoformat(),
            },
            'content': {}
        }

        # Limpar conteúdo se solicitado
        content = raw.get('content', '')
        if params.get('remove_ads'):
            content = self._remove_ads(content)
        if params.get('normalize_headings'):
            content = self._normalize_headings(content)

        structured['content']['body'] = content
        structured['content']['sections'] = self._extract_sections(
            raw.get('headings', {}),
            content
        )
        structured['content']['code_examples'] = raw.get('code_examples', [])

        context['structured_content'] = structured
        return context

    def _handle_summarize(self, context: Dict, params: Dict) -> Dict:
        """Gera resumo do conteúdo."""
        structured = context.get('structured_content', {})
        content = structured.get('content', {}).get('body', '')

        max_length = params.get('max_length', 500)

        # Extrair primeiros parágrafos como resumo
        paragraphs = content.split('\n\n')[:3]
        summary = ' '.join(paragraphs)[:max_length]

        if len(summary) >= max_length:
            summary = summary[:max_length].rsplit(' ', 1)[0] + '...'

        structured['summary'] = summary
        context['structured_content'] = structured

        return context

    def _handle_export(self, context: Dict, params: Dict) -> Dict:
        """Exporta para múltiplos formatos."""
        formats = params.get('formats', ['json'])
        output_dir = Path(params.get('output_dir', './output'))
        output_dir.mkdir(parents=True, exist_ok=True)

        structured = context.get('structured_content', {})
        metadata = structured.get('metadata', {})

        # Gerar nome base
        safe_title = ''.join(
            c if c.isalnum() or c in '-_' else '_'
            for c in (metadata.get('title', 'document')[:30])
        )
        timestamp = datetime.now().strftime('%Y%m%d')
        base_name = f"{safe_title}_{timestamp}"

        exported_files = []

        for fmt in formats:
            if fmt == 'json':
                path = output_dir / f"{base_name}.json"
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(structured, f, indent=2, ensure_ascii=False)
                exported_files.append(str(path))

            elif fmt == 'markdown':
                path = output_dir / f"{base_name}.md"
                self._export_markdown(structured, path)
                exported_files.append(str(path))

            elif fmt == 'txt':
                path = output_dir / f"{base_name}.txt"
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(structured.get('content', {}).get('body', ''))
                exported_files.append(str(path))

        context['output_files'] = exported_files
        context['output_path'] = output_dir

        return context

    def _handle_custom(self, context: Dict, params: Dict) -> Dict:
        """Executa transformação customizada."""
        transform_fn = params.get('transform_function')
        if transform_fn and callable(transform_fn):
            context = transform_fn(context)
        return context

    def _remove_ads(self, content: str) -> str:
        """Remove conteúdo de anúncios (placeholder)."""
        # Implementação simplificada
        lines = content.split('\n')
        filtered = [
            line for line in lines
            if not any(keyword in line.lower() for keyword in ['ad', 'advertisement', 'sponsored'])
        ]
        return '\n'.join(filtered)

    def _normalize_headings(self, content: str) -> str:
        """Normaliza níveis de headings."""
        # Implementação simplificada
        return content

    def _extract_sections(self, headings: Dict, content: str) -> List[Dict]:
        """Extrai seções baseadas nos headings."""
        sections = []

        h2_list = headings.get('h2', [])
        for i, h2 in enumerate(h2_list):
            section = {
                'title': h2,
                'level': 2,
                'content': ''  # Seria extraído do conteúdo completo
            }
            sections.append(section)

        return sections

    def _export_markdown(self, structured: Dict, path: Path):
        """Exporta para Markdown."""
        metadata = structured.get('metadata', {})
        content = structured.get('content', {})

        lines = [
            f"# {metadata.get('title', 'Document')}",
            '',
            f"**URL:** {metadata.get('url', 'N/A')}",
            f"**Versão:** {metadata.get('version', 'N/A')}",
            f"**Extraído em:** {metadata.get('extracted_at', 'N/A')}",
            '',
            '---',
            '',
        ]

        if structured.get('summary'):
            lines.extend([
                '## Resumo',
                '',
                structured['summary'],
                '',
            ])

        lines.extend([
            '## Conteúdo',
            '',
            content.get('body', ''),
        ])

        if content.get('code_examples'):
            lines.extend([
                '',
                '## Exemplos de Código',
                ''
            ])
            for i, example in enumerate(content['code_examples'], 1):
                lines.extend([
                    f'### Exemplo {i}',
                    '',
                    '```',
                    example,
                    '```',
                    ''
                ])

        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))


# Pipelines pré-configurados

class SkillDocumentationPipeline(DocumentationPipeline):
    """Pipeline otimizado para documentação de skills."""

    def __init__(self):
        super().__init__([
            PipelineStep('extract', 'fetch_and_parse', {
                'include_metadata': True,
                'max_length': 100000
            }),
            PipelineStep('structure', 'structure_content', {
                'remove_ads': True,
                'normalize_headings': True
            }),
            PipelineStep('summarize', 'generate_summary', {
                'max_length': 500
            }),
            PipelineStep('export', 'save_to_formats', {
                'formats': ['json', 'markdown'],
                'output_dir': './skill_docs'
            })
        ])


class QuickExportPipeline(DocumentationPipeline):
    """Pipeline rápido para exportação simples."""

    def __init__(self, output_format='markdown'):
        super().__init__([
            PipelineStep('extract', 'fetch_and_parse', {
                'include_metadata': True,
                'max_length': 50000
            }),
            PipelineStep('export', 'save_to_formats', {
                'formats': [output_format],
                'output_dir': './quick_export'
            })
        ])

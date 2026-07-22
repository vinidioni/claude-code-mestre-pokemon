#!/usr/bin/env python3
"""
Análise em lote e processamento batch de URLs.
"""
import asyncio
import json
import csv
from pathlib import Path
from typing import List, Dict, Any, Optional, Callable
from dataclasses import asdict
from datetime import datetime
import time

from .fetcher import IntranetFetcher, AnalysisResult, FetcherConfig


class BatchProcessor:
    """
    Processa múltiplas URLs sequencialmente com controle de rate limit.

    Features:
    - Delay configurável entre requisições
    - Retry automático com backoff
    - Exportação múltiplos formatos
    - Progress reporting
    """

    def __init__(
        self,
        config: Optional[FetcherConfig] = None,
        delay_between_requests: float = 2.0,
        max_retries: int = 3,
        on_progress: Optional[Callable[[int, int, str], None]] = None
    ):
        self.config = config or FetcherConfig()
        self.fetcher = IntranetFetcher(config)
        self.delay = delay_between_requests
        self.max_retries = max_retries
        self.on_progress = on_progress

    async def process(
        self,
        urls: List[str],
        **analyze_kwargs
    ) -> List[Dict[str, Any]]:
        """
        Processa uma lista de URLs.

        Args:
            urls: Lista de URLs para analisar
            **analyze_kwargs: Argumentos adicionais para analyze()

        Returns:
            Lista de resultados (incluindo erros)
        """
        results = []
        total = len(urls)

        for i, url in enumerate(urls, 1):
            if self.on_progress:
                self.on_progress(i, total, url)
            else:
                print(f"[{i}/{total}] Processando: {url}")

            result = await self._process_single(url, **analyze_kwargs)
            results.append(result)

            # Delay entre requisições (exceto na última)
            if i < total:
                await asyncio.sleep(self.delay)

        return results

    async def _process_single(
        self,
        url: str,
        **analyze_kwargs
    ) -> Dict[str, Any]:
        """Processa uma única URL com retry."""
        for attempt in range(self.max_retries):
            try:
                result = await self.fetcher.analyze(url, **analyze_kwargs)
                return {
                    'success': True,
                    'url': url,
                    'data': asdict(result),
                    'attempt': attempt + 1,
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                if attempt < self.max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    print(f"  ⚠️  Erro (tentativa {attempt + 1}), aguardando {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    return {
                        'success': False,
                        'url': url,
                        'error': str(e),
                        'attempt': attempt + 1,
                        'timestamp': datetime.now().isoformat()
                    }

    def process_sync(self, *args, **kwargs) -> List[Dict[str, Any]]:
        """Versão síncrona do process."""
        return asyncio.run(self.process(*args, **kwargs))

    def export(
        self,
        results: List[Dict[str, Any]],
        format: str = 'json',
        path: Optional[str] = None
    ) -> str:
        """
        Exporta resultados para arquivo.

        Args:
            results: Lista de resultados
            format: 'json', 'csv', 'markdown'
            path: Caminho do arquivo (opcional)

        Returns:
            Caminho do arquivo salvo
        """
        if path is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            path = f'/tmp/batch_results_{timestamp}.{format}'

        if format == 'json':
            self._export_json(results, path)
        elif format == 'csv':
            self._export_csv(results, path)
        elif format == 'markdown':
            self._export_markdown(results, path)
        else:
            raise ValueError(f"Formato não suportado: {format}")

        return path

    def _export_json(self, results: List[Dict], path: str):
        """Exporta para JSON."""
        with open(path, 'w', encoding='utf-8') as f:
            json.dump({
                'exported_at': datetime.now().isoformat(),
                'total': len(results),
                'successful': sum(1 for r in results if r['success']),
                'failed': sum(1 for r in results if not r['success']),
                'results': results
            }, f, indent=2, ensure_ascii=False)

    def _export_csv(self, results: List[Dict], path: str):
        """Exporta para CSV."""
        # Flatten results for CSV
        flat_results = []
        for r in results:
            if r['success']:
                data = r['data']
                flat_results.append({
                    'url': r['url'],
                    'success': True,
                    'title': data.get('main_title', ''),
                    'version': data.get('version', ''),
                    'description': (data.get('description', '') or '')[:200],
                    'headings_h2_count': len(data.get('headings', {}).get('h2', [])),
                    'code_examples_count': len(data.get('code_examples', [])),
                    'content_length': len(data.get('content', '')),
                    'error': ''
                })
            else:
                flat_results.append({
                    'url': r['url'],
                    'success': False,
                    'title': '',
                    'version': '',
                    'description': '',
                    'headings_h2_count': 0,
                    'code_examples_count': 0,
                    'content_length': 0,
                    'error': r.get('error', 'Unknown error')
                })

        if flat_results:
            with open(path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=flat_results[0].keys())
                writer.writeheader()
                writer.writerows(flat_results)

    def _export_markdown(self, results: List[Dict], path: str):
        """Exporta para Markdown."""
        lines = [
            '# Relatório de Análise em Lote',
            '',
            f'**Gerado em:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
            f'**Total:** {len(results)} URLs',
            f'**Sucesso:** {sum(1 for r in results if r["success"])}',
            f'**Falhas:** {sum(1 for r in results if not r["success"])}',
            '',
            '---',
            ''
        ]

        for i, r in enumerate(results, 1):
            lines.append(f'## {i}. {r["url"]}')
            lines.append('')

            if r['success']:
                data = r['data']
                lines.append(f"**Título:** {data.get('main_title', 'N/A')}")
                if data.get('version'):
                    lines.append(f"**Versão:** {data['version']}")
                if data.get('description'):
                    desc = data['description'][:300]
                    lines.append(f"**Descrição:** {desc}...")
                lines.append(f"**Seções:** {len(data.get('headings', {}).get('h2', []))}")
                lines.append(f"**Exemplos de código:** {len(data.get('code_examples', []))}")
            else:
                lines.append(f"❌ **Erro:** {r.get('error', 'Unknown')}")

            lines.append('')
            lines.append('---')
            lines.append('')

        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))


class BatchAnalyzer:
    """
    Analisador avançado com comparação e relatórios.
    """

    def __init__(
        self,
        session_id: Optional[str] = None,
        output_dir: str = './analysis_output',
        config: Optional[FetcherConfig] = None
    ):
        self.session_id = session_id or f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.config = config or FetcherConfig()
        self.processor = BatchProcessor(config)

    def compare(
        self,
        urls: List[str],
        metrics: Optional[Dict[str, List[str]]] = None
    ) -> Dict[str, Any]:
        """
        Compara múltiplas URLs e gera relatório comparativo.

        Args:
            urls: Lista de URLs
            metrics: Métricas a extrair por categoria

        Returns:
            Relatório comparativo
        """
        if metrics is None:
            metrics = {
                'basic': ['title', 'version', 'description'],
                'structure': ['headings', 'code_examples']
            }

        print(f"🔍 Analisando {len(urls)} URLs...")
        results = self.processor.process_sync(urls)

        # Gerar análise comparativa
        comparison = self._generate_comparison(results, metrics)

        return {
            'session_id': self.session_id,
            'timestamp': datetime.now().isoformat(),
            'urls_analyzed': len(urls),
            'successful': sum(1 for r in results if r['success']),
            'comparison': comparison,
            'raw_results': results
        }

    def _generate_comparison(
        self,
        results: List[Dict],
        metrics: Dict[str, List[str]]
    ) -> Dict[str, Any]:
        """Gera análise comparativa."""
        successful = [r for r in results if r['success']]

        comparison = {
            'summary': {
                'total': len(results),
                'successful': len(successful),
                'failed': len(results) - len(successful)
            },
            'metrics': {}
        }

        # Analisar métricas básicas
        if 'basic' in metrics:
            comparison['metrics']['versions'] = [
                {'url': r['url'], 'version': r['data'].get('version')}
                for r in successful if r['data'].get('version')
            ]

        # Analisar estrutura
        if 'structure' in metrics:
            comparison['metrics']['structure'] = [
                {
                    'url': r['url'],
                    'headings_count': len(r['data'].get('headings', {}).get('h2', [])),
                    'code_examples_count': len(r['data'].get('code_examples', []))
                }
                for r in successful
            ]

        return comparison

    def export_report(
        self,
        report: Dict[str, Any],
        format: str = 'json',
        path: Optional[str] = None
    ) -> str:
        """Exporta relatório comparativo."""
        if path is None:
            path = self.output_dir / f"{self.session_id}_report.{format}"

        if format == 'json':
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)

        elif format == 'markdown':
            self._write_markdown_report(report, path)

        elif format == 'html':
            self._write_html_report(report, path)

        print(f"📄 Relatório exportado: {path}")
        return str(path)

    def _write_markdown_report(self, report: Dict, path: str):
        """Gera relatório em Markdown."""
        lines = [
            f'# Relatório de Análise: {report["session_id"]}',
            '',
            f'**Data:** {report["timestamp"]}',
            f'**URLs analisadas:** {report["urls_analyzed"]}',
            f'**Sucesso:** {report["comparison"]["summary"]["successful"]}',
            f'**Falhas:** {report["comparison"]["summary"]["failed"]}',
            '',
            '## Resumo Comparativo',
            ''
        ]

        # Adicionar tabela comparativa
        if 'structure' in report['comparison']['metrics']:
            lines.append('### Estrutura dos Documentos')
            lines.append('')
            lines.append('| URL | Headings | Exemplos de Código |')
            lines.append('|-----|----------|-------------------|')

            for item in report['comparison']['metrics']['structure']:
                lines.append(f"| {item['url']} | {item['headings_count']} | {item['code_examples_count']} |")

            lines.append('')

        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

    def _write_html_report(self, report: Dict, path: str):
        """Gera relatório em HTML."""
        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Análise: {report['session_id']}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        .header {{ background: #f0f0f0; padding: 20px; border-radius: 8px; }}
        .metric {{ display: inline-block; margin: 10px 20px; }}
        .metric-value {{ font-size: 24px; font-weight: bold; color: #333; }}
        .metric-label {{ color: #666; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
        th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
        th {{ background: #4CAF50; color: white; }}
        tr:nth-child(even) {{ background: #f2f2f2; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Análise: {report['session_id']}</h1>
        <p>Data: {report['timestamp']}</p>
        <div class="metric">
            <div class="metric-value">{report['urls_analyzed']}</div>
            <div class="metric-label">URLs Analisadas</div>
        </div>
        <div class="metric">
            <div class="metric-value">{report['comparison']['summary']['successful']}</div>
            <div class="metric-label">Sucesso</div>
        </div>
        <div class="metric">
            <div class="metric-value">{report['comparison']['summary']['failed']}</div>
            <div class="metric-label">Falhas</div>
        </div>
    </div>
</body>
</html>"""

        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)

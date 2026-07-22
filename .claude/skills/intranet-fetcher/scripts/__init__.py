"""
Intranet Fetcher - Automação de navegador para intranet DiDi

Uso básico:
    from intranet_fetcher import IntranetFetcher

    fetcher = IntranetFetcher()
    result = fetcher.analyze("https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch")
"""

from .fetcher import IntranetFetcher
from .session import SessionManager, InteractiveSession
from .batch import BatchAnalyzer, BatchProcessor
from .pipeline import DocumentationPipeline

__version__ = "1.0.0"
__author__ = "DCC Team"

__all__ = [
    "IntranetFetcher",
    "SessionManager",
    "InteractiveSession",
    "BatchAnalyzer",
    "BatchProcessor",
    "DocumentationPipeline",
]

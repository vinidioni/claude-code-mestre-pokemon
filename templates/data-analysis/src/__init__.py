"""
{{PROJECT_NAME}} - Data Analysis Package

{{DESCRIPTION}}
"""

__version__ = "1.0.0"
__author__ = "{{AUTHOR}}"

from .data_loader import DataLoader
from .analysis import Analyzer
from .visualization import Visualizer
from .utils import setup_logging, load_config

__all__ = [
    'DataLoader',
    'Analyzer',
    'Visualizer',
    'setup_logging',
    'load_config'
]

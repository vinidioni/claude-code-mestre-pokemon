"""
Visualization utilities for data analysis.
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Set default style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['dpi'] = 150


class Visualizer:
    """
    Creates data visualizations.
    """

    def __init__(self, output_dir: str = "reports/figures"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def save_figure(self, filename: str) -> None:
        """Save current figure to output directory."""
        filepath = self.output_dir / filename
        plt.savefig(filepath, bbox_inches='tight', dpi=150)
        logger.info(f"Saved figure to {filepath}")
        plt.close()

    def plot_distribution(self, df: pd.DataFrame, column: str, title: str = None) -> None:
        """
        Plot distribution of a numeric column.

        Args:
            df: DataFrame
            column: Column name
            title: Plot title
        """
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Histogram with KDE
        sns.histplot(data=df, x=column, kde=True, ax=axes[0])
        axes[0].set_title(f'Distribution of {column}')
        axes[0].set_xlabel(column)

        # Box plot
        sns.boxplot(data=df, y=column, ax=axes[1])
        axes[1].set_title(f'Box Plot of {column}')

        if title:
            fig.suptitle(title, fontsize=14, fontweight='bold')

        plt.tight_layout()
        self.save_figure(f'distribution_{column}.png')

    def plot_correlation_heatmap(self, corr_matrix: pd.DataFrame, title: str = "Correlation Matrix") -> None:
        """
        Plot correlation heatmap.

        Args:
            corr_matrix: Correlation matrix
            title: Plot title
        """
        plt.figure(figsize=(12, 10))

        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
        sns.heatmap(corr_matrix, mask=mask, annot=True, fmt='.2f',
                    cmap='coolwarm', center=0, square=True,
                    cbar_kws={"shrink": .8})

        plt.title(title, fontsize=14, fontweight='bold')
        plt.tight_layout()
        self.save_figure('correlation_heatmap.png')

    def plot_bar(self, df: pd.DataFrame, x_col: str, y_col: str,
                 title: str = None, horizontal: bool = False) -> None:
        """
        Plot bar chart.

        Args:
            df: DataFrame
            x_col: X-axis column
            y_col: Y-axis column
            title: Plot title
            horizontal: If True, create horizontal bar chart
        """
        plt.figure(figsize=(12, 6))

        if horizontal:
            sns.barplot(data=df, y=x_col, x=y_col, orient='h')
        else:
            sns.barplot(data=df, x=x_col, y=y_col)

        plt.title(title or f'{y_col} by {x_col}', fontsize=12, fontweight='bold')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        self.save_figure(f'bar_{x_col}_{y_col}.png')

    def plot_scatter(self, df: pd.DataFrame, x_col: str, y_col: str,
                     hue_col: str = None, title: str = None) -> None:
        """
        Plot scatter plot.

        Args:
            df: DataFrame
            x_col: X-axis column
            y_col: Y-axis column
            hue_col: Column for color grouping
            title: Plot title
        """
        plt.figure(figsize=(10, 8))

        sns.scatterplot(data=df, x=x_col, y=y_col, hue=hue_col,
                       alpha=0.6, edgecolor='none')

        plt.title(title or f'{y_col} vs {x_col}', fontsize=12, fontweight='bold')
        plt.xlabel(x_col)
        plt.ylabel(y_col)
        plt.tight_layout()
        self.save_figure(f'scatter_{x_col}_{y_col}.png')

    def plot_time_series(self, df: pd.DataFrame, date_col: str, value_col: str,
                        title: str = None) -> None:
        """
        Plot time series.

        Args:
            df: DataFrame
            date_col: Date column
            value_col: Value column
            title: Plot title
        """
        plt.figure(figsize=(14, 6))

        plt.plot(df[date_col], df[value_col], linewidth=1.5)
        plt.title(title or f'{value_col} over time', fontsize=12, fontweight='bold')
        plt.xlabel('Date')
        plt.ylabel(value_col)
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        self.save_figure(f'timeseries_{value_col}.png')

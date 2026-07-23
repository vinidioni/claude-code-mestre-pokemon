"""
Data analysis functions.
"""

import pandas as pd
import numpy as np
from scipy import stats
import logging
from typing import Dict, List, Tuple, Optional

logger = logging.getLogger(__name__)


class Analyzer:
    """
    Performs data analysis and statistical computations.
    """

    def __init__(self, df: pd.DataFrame):
        self.df = df
        logger.info(f"Analyzer initialized with {len(df)} rows")

    def summary_statistics(self) -> pd.DataFrame:
        """
        Generate summary statistics for numeric columns.

        Returns:
            DataFrame with statistics
        """
        logger.info("Generating summary statistics")

        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        summary = self.df[numeric_cols].describe()

        # Add additional statistics
        summary.loc['skew'] = self.df[numeric_cols].skew()
        summary.loc['kurtosis'] = self.df[numeric_cols].kurtosis()

        return summary

    def correlation_matrix(self) -> pd.DataFrame:
        """
        Calculate correlation matrix for numeric columns.

        Returns:
            Correlation matrix
        """
        logger.info("Calculating correlation matrix")
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        return self.df[numeric_cols].corr()

    def detect_outliers(self, column: str, method: str = 'iqr') -> pd.Series:
        """
        Detect outliers in a column.

        Args:
            column: Column name to analyze
            method: 'iqr' or 'zscore'

        Returns:
            Boolean series indicating outliers
        """
        logger.info(f"Detecting outliers in {column} using {method}")

        if method == 'iqr':
            Q1 = self.df[column].quantile(0.25)
            Q3 = self.df[column].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outliers = (self.df[column] < lower_bound) | (self.df[column] > upper_bound)

        elif method == 'zscore':
            z_scores = np.abs(stats.zscore(self.df[column].dropna()))
            outliers = pd.Series(False, index=self.df.index)
            outliers[self.df[column].notna()] = z_scores > 3

        else:
            raise ValueError(f"Unknown method: {method}")

        logger.info(f"Found {outliers.sum()} outliers")
        return outliers

    def group_by_analysis(self, group_col: str, agg_col: str, agg_func: str = 'mean') -> pd.DataFrame:
        """
        Perform groupby analysis.

        Args:
            group_col: Column to group by
            agg_col: Column to aggregate
            agg_func: Aggregation function

        Returns:
            Aggregated results
        """
        logger.info(f"Groupby analysis: {group_col} -> {agg_func}({agg_col})")
        result = self.df.groupby(group_col)[agg_col].agg(agg_func).reset_index()
        return result.sort_values(agg_col, ascending=False)

    def hypothesis_test(self, col1: str, col2: str, test: str = 'ttest') -> Tuple[float, float]:
        """
        Perform statistical hypothesis test.

        Args:
            col1: First column
            col2: Second column
            test: 'ttest' or 'mannwhitney'

        Returns:
            Tuple of (statistic, p_value)
        """
        logger.info(f"Performing {test} between {col1} and {col2}")

        data1 = self.df[col1].dropna()
        data2 = self.df[col2].dropna()

        if test == 'ttest':
            stat, p_value = stats.ttest_ind(data1, data2)
        elif test == 'mannwhitney':
            stat, p_value = stats.mannwhitneyu(data1, data2)
        else:
            raise ValueError(f"Unknown test: {test}")

        logger.info(f"Test result: statistic={stat:.4f}, p_value={p_value:.4f}")
        return stat, p_value

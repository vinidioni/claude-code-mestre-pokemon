"""
Data loading and preprocessing utilities.
"""

import pandas as pd
import logging
from pathlib import Path
from typing import Optional, Union

logger = logging.getLogger(__name__)


class DataLoader:
    """
    Handles data loading and basic preprocessing.
    """

    def __init__(self, raw_dir: str = "data/raw", processed_dir: str = "data/processed"):
        self.raw_dir = Path(raw_dir)
        self.processed_dir = Path(processed_dir)
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def load_csv(self, filename: str, **kwargs) -> pd.DataFrame:
        """
        Load CSV file from raw directory.

        Args:
            filename: Name of the CSV file
            **kwargs: Additional arguments for pd.read_csv

        Returns:
            DataFrame with loaded data
        """
        filepath = self.raw_dir / filename
        logger.info(f"Loading data from {filepath}")

        try:
            df = pd.read_csv(filepath, **kwargs)
            logger.info(f"Loaded {len(df)} rows and {len(df.columns)} columns")
            return df
        except FileNotFoundError:
            logger.error(f"File not found: {filepath}")
            raise
        except Exception as e:
            logger.error(f"Error loading file: {e}")
            raise

    def load_excel(self, filename: str, **kwargs) -> pd.DataFrame:
        """
        Load Excel file from raw directory.

        Args:
            filename: Name of the Excel file
            **kwargs: Additional arguments for pd.read_excel

        Returns:
            DataFrame with loaded data
        """
        filepath = self.raw_dir / filename
        logger.info(f"Loading Excel from {filepath}")

        try:
            df = pd.read_excel(filepath, **kwargs)
            logger.info(f"Loaded {len(df)} rows and {len(df.columns)} columns")
            return df
        except FileNotFoundError:
            logger.error(f"File not found: {filepath}")
            raise
        except Exception as e:
            logger.error(f"Error loading file: {e}")
            raise

    def save_processed(self, df: pd.DataFrame, filename: str) -> None:
        """
        Save processed DataFrame to processed directory.

        Args:
            df: DataFrame to save
            filename: Output filename
        """
        filepath = self.processed_dir / filename
        df.to_csv(filepath, index=False)
        logger.info(f"Saved processed data to {filepath}")

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Basic data cleaning operations.

        Args:
            df: Input DataFrame

        Returns:
            Cleaned DataFrame
        """
        logger.info("Starting data cleaning")

        # Remove duplicates
        initial_rows = len(df)
        df = df.drop_duplicates()
        logger.info(f"Removed {initial_rows - len(df)} duplicate rows")

        # Handle missing values (customize as needed)
        # df = df.dropna()  # or df.fillna(...)

        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')

        logger.info("Data cleaning completed")
        return df

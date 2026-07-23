#!/usr/bin/env python3
"""
{{PROJECT_NAME}} - {{DESCRIPTION}}

{{SHORT_DESCRIPTION}}

Usage:
    python main.py [OPTIONS]

Options:
    --help          Show this help message
    --verbose       Enable verbose logging
    --config FILE   Path to config file (default: config.json)

Author: {{AUTHOR}}
Date: {{DATE}}
"""

import argparse
import logging
import sys
from pathlib import Path
from typing import Optional

# Configure logging
def setup_logging(verbose: bool = False) -> logging.Logger:
    """Setup logging configuration."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    return logging.getLogger(__name__)


def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='{{PROJECT_DESCRIPTION}}',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
    python main.py
    python main.py --verbose
    python main.py --config custom-config.json
        '''
    )

    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )

    parser.add_argument(
        '--config', '-c',
        type=str,
        default='config.json',
        help='Path to configuration file (default: config.json)'
    )

    return parser.parse_args()


def load_config(config_path: str) -> dict:
    """Load configuration from JSON file."""
    import json

    config_file = Path(config_path)

    if not config_file.exists():
        logging.warning(f"Config file {config_path} not found. Using defaults.")
        return get_default_config()

    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        logging.error(f"Invalid JSON in config file: {e}")
        return get_default_config()


def get_default_config() -> dict:
    """Return default configuration."""
    return {
        "output_dir": "output",
        "log_level": "INFO",
        "max_retries": 3,
        "timeout": 30
    }


def main() -> int:
    """Main entry point."""
    args = parse_arguments()
    logger = setup_logging(args.verbose)

    try:
        # Load configuration
        config = load_config(args.config)
        logger.debug(f"Configuration loaded: {config}")

        # TODO: Implement your main logic here
        logger.info("Starting {{PROJECT_NAME}}...")

        # Example workflow
        if not validate_environment():
            logger.error("Environment validation failed")
            return 1

        result = process_data(config)

        if result:
            logger.info("Processing completed successfully")
            return 0
        else:
            logger.error("Processing failed")
            return 1

    except KeyboardInterrupt:
        logger.info("Operation cancelled by user")
        return 130
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        return 1


def validate_environment() -> bool:
    """Validate that the environment is properly configured."""
    # TODO: Add your validation logic
    required_vars = []

    for var in required_vars:
        if not os.getenv(var):
            logging.error(f"Required environment variable {var} not set")
            return False

    return True


def process_data(config: dict) -> bool:
    """Main data processing function."""
    # TODO: Implement your data processing logic
    logger = logging.getLogger(__name__)

    try:
        # Example processing steps
        logger.info("Step 1: Loading data...")
        # data = load_data()

        logger.info("Step 2: Processing...")
        # processed = transform_data(data)

        logger.info("Step 3: Saving results...")
        # save_results(processed, config['output_dir'])

        return True

    except Exception as e:
        logger.error(f"Processing error: {e}")
        return False


if __name__ == '__main__':
    import os
    sys.exit(main())

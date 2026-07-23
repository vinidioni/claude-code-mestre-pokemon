# Data Analysis Template

Template for data analysis projects with best practices.

---

## Structure

```
data-analysis/
├── README.md              # Project documentation
├── requirements.txt       # Python dependencies
├── config.yaml           # Configuration file
├── data/                 # Data directory
│   ├── raw/             # Raw data (read-only)
│   ├── processed/       # Cleaned/processed data
│   └── output/          # Analysis outputs
├── notebooks/           # Jupyter notebooks
│   └── 01-exploration.ipynb
├── src/                 # Source code
│   ├── __init__.py
│   ├── data_loader.py   # Data loading utilities
│   ├── analysis.py      # Analysis functions
│   ├── visualization.py # Plotting functions
│   └── utils.py         # Helper functions
├── tests/               # Test files
│   └── test_analysis.py
├── reports/             # Generated reports
│   └── figures/
└── .claude/
    └── CLAUDE.md        # Context for Claude
```

---

## Setup

1. Create project folder:
```bash
cp -r templates/data-analysis projects/my-analysis
cd projects/my-analysis
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure settings in `config.yaml`

---

## Workflow

1. **Data Collection**: Place raw data in `data/raw/`
2. **Exploration**: Use notebooks in `notebooks/` for EDA
3. **Processing**: Clean data using `src/data_loader.py`
4. **Analysis**: Run analysis with `src/analysis.py`
5. **Reporting**: Generate reports from `reports/`

---

## Best Practices

- Keep raw data immutable
- Version control your notebooks
- Document all transformations
- Use configuration files
- Write tests for core functions
- Create reproducible analyses

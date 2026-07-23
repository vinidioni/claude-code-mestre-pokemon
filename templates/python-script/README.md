# Python Script Template

Template for creating Python scripts with best practices.

---

## Structure

```
my-script/
├── README .md          # Script documentation
├── main .py             # Entry point
├── requirements.txt     # Dependencies
└── .claude/
    └── CLAUDE .md       # Context for Claude
```

---

## Setup

1. Create script folder:
```bash
cp -r templates/python-script projects/my-script
```

2. Install dependencies:
```bash
cd projects/my-script
pip install -r requirements.txt
```

---

## Usage

```bash
python main .py --help
```

---

## Best  practices

- Use `argparse ` for CLI arguments
- Add docstrings to functions
- Include type hints
- Use logging instead of print
- Handle exceptions gracefully

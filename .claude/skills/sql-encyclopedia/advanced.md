# SQL Encyclopedia - Avançado

## Uso Avançado do Script

### Scanear diretório específico

```bash
# Scanear apenas queries produtivas
python scripts/maintenance/update-encyclopedia.py --scan-all
# (usa diretório padrão sql-library/queries)

# Para scanear subdiretório específico, edite o script
# ou use filtro pós-scan
```

### Processar query complexa

```bash
# Query com múltiplos joins
python scripts/maintenance/update-encyclopedia.py --query "
  SELECT
    u.user_id,
    o.order_id,
    p.product_name
  FROM data_mart.users u
  JOIN data_mart.orders o ON u.id = o.id
  JOIN data_mart.products p ON o.product_id = p.id
  WHERE o.created_at > '2026-07-27'
"

# Detecta automaticamente: users, orders, products
```

### Exportação e Análise

```bash
# Ver estatísticas básicas
cat sql-library/encyclopedia/tables.json | jq '.tabelas | keys'

# Contar tabelas
cat sql-library/encyclopedia/tables.json | jq '.tabelas | length'

# Ver tabelas recentes
cat sql-library/encyclopedia/tables.json | jq '.tabelas | to_entries | 
  map(select(.value.ultima_consulta | contains("2026-07"))) | 
  map(.key)'
```

## Extender a Enciclopédia

### Adicionando metadados customizados

Edite o script `update-encyclopedia.py` para incluir mais campos:

```python
def get_table_schema(table_name: str) -> Optional[Dict]:
    return {
        "descricao": "",
        "colunas": {},
        "primeira_consulta": datetime.now().isoformat(),
        "ultima_consulta": datetime.now().isoformat(),
        # Novos campos sugeridos:
        "owner": "",           # Responsável pelo dado
        "tags": [],            # Tags para busca
        "queries_usando": [],  # Referências a queries
        "frequencia": 1        # Contador de uso
    }
```

### Analytics sobre Uso

Script para gerar relatório:

```python
#!/usr/bin/env python3
# scripts/analysis/encyclopedia-analytics.py

import json
from datetime import datetime, timedelta
from collections import Counter

ENCYCLOPEDIA_PATH = "sql-library/encyclopedia/tables.json"

with open(ENCYCLOPEDIA_PATH) as f:
    data = json.load(f)

tables = data['tabelas']

# Estatísticas
total = len(tables)
with_desc = sum(1 for t in tables.values() if t.get('descricao'))

# Tabelas por mês de primeira consulta
first_queries = [t['primeira_consulta'][:7] for t in tables.values()]
monthly = Counter(first_queries)

# Tabelas recentes (últimos 30 dias)
cutoff = datetime.now() - timedelta(days=30)
recent = [
    name for name, t in tables.items()
    if datetime.fromisoformat(t['ultima_consulta'].replace('Z', '+00:00')) > cutoff
]

print("=" * 50)
print("📊 SQL Encyclopedia Analytics")
print("=" * 50)
print(f"\nTotal tabelas: {total}")
print(f"Com descrição: {with_desc} ({with_desc/total*100:.1f}%)")
print(f"\nTabelas usadas nos últimos 30 dias: {len(recent)}")

print("\n📈 Novas tabelas por mês:")
for month, count in sorted(monthly.items()):
    print(f"  {month}: {count} tabelas")

print("\n📝 Tabelas sem descrição:")
for name, meta in tables.items():
    if not meta.get('descricao'):
        print(f"  • {name}")
```

## Integração com Workflows

### Workflow de Code Review SQL

```yaml
# workflow exemplo para revisar queries

steps:
  - name: check_tables
    prompt: |
      Analise a query SQL e verifique a enciclopédia:

      1. Extraia tabelas da query
      2. Consulte sql-library/encyclopedia/tables.json
      3. Verifique se tabelas estão documentadas
      4. Sugira melhorias baseadas em histórico

      Query: {query}

  - name: suggest_optimizations
    prompt: |
      Baseado nas tabelas usadas e suas descrições,
      sugira otimizações ou padrões conhecidos.
```

## Busca Avançada

### Scripts úteis

```bash
# Tabelas sem descrição
python -c "
import json
with open('sql-library/encyclopedia/tables.json') as f:
    data = json.load(f)
for name, meta in data['tabelas'].items():
    if not meta.get('descricao'):
        print(f'• {name}')
"

# Tabelas mais recentes
python -c "
import json
from datetime import datetime

with open('sql-library/encyclopedia/tables.json') as f:
    data = json.load(f)

sorted_tables = sorted(
    data['tabelas'].items(),
    key=lambda x: x[1]['ultima_consulta'],
    reverse=True
)

for name, meta in sorted_tables[:10]:
    print(f'{name} - {meta[\"ultima_consulta\"][:10]}')
"

# Tabelas por ambiente
python -c "
import json
with open('sql-library/encyclopedia/tables.json') as f:
    data = json.load(f)

environments = {}
for name in data['tabelas'].keys():
    env = name.split('.')[0] if '.' in name else 'other'
    environments[env] = environments.get(env, 0) + 1

for env, count in sorted(environments.items()):
    print(f'{env}: {count} tabelas')
"
```

## Manutenção

### Limpar tabelas antigas

```python
def cleanup_old_tables(days=180):
    """Remove tabelas não usadas há X dias"""
    from datetime import datetime, timedelta
    import json

    with open('sql-library/encyclopedia/tables.json') as f:
        data = json.load(f)

    cutoff = datetime.now() - timedelta(days=days)
    to_remove = []

    for name, meta in data['tabelas'].items():
        last_used = datetime.fromisoformat(
            meta['ultima_consulta'].replace('Z', '+00:00')
        )
        if last_used < cutoff:
            to_remove.append(name)

    print(f"Tabelas a remover (não usadas há {days} dias):")
    for name in to_remove:
        print(f"  • {name}")

    # Descomente para realmente remover:
    # for name in to_remove:
    #     del data['tabelas'][name]
    # with open('sql-library/encyclopedia/tables.json', 'w') as f:
    #     json.dump(data, f, indent=2)
```

### Backup da enciclopédia

```bash
# Backup mensal
BACKUP_FILE="sql-library/encyclopedia/tables.backup.$(date +%Y%m).json"
cp sql-library/encyclopedia/tables.json "$BACKUP_FILE"

# Manter apenas últimos 12 meses
ls -t sql-library/encyclopedia/tables.backup.*.json | tail -n +13 | xargs rm
```

## Integração com VS Code

### Task para atualizar

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Update SQL Encyclopedia",
      "type": "shell",
      "command": "python",
      "args": [
        "scripts/maintenance/update-encyclopedia.py",
        "--scan-all"
      ],
      "group": "build"
    }
  ]
}
```

### Snippet para queries

```json
// .vscode/sql.code-snippets
{
  "Query Header": {
    "prefix": "sqlheader",
    "body": [
      "-- Description: ${1:Query description}",
      "-- Tables: ${2:tab1, tab2}",
      "-- Author: ${3:Name}",
      "-- Date: $(date +%Y-%m-%d)",
      "",
      "${0:-- Your query here}"
    ]
  }
}
```

## Troubleshooting

### Corrigir JSON corrompido

```python
# scripts/fix-encyclopedia.py
import json

try:
    with open('sql-library/encyclopedia/tables.json') as f:
        data = json.load(f)
except json.JSONDecodeError as e:
    print(f"Erro no JSON: {e}")

    # Tenta carregar com tolerância
    import re
    with open('sql-library/encyclopedia/tables.json') as f:
        content = f.read()

    # Remove trailing commas
    content = re.sub(r',\s*}', '}', content)
    content = re.sub(r',\s*]', ']', content)

    data = json.loads(content)

    # Salva corrigido
    with open('sql-library/encyclopedia/tables.json', 'w') as f:
        json.dump(data, f, indent=2)

    print("JSON corrigido!")
```

### Resetar enciclopédia

```bash
# Backup primeiro
cp sql-library/encyclopedia/tables.json \\
  sql-library/encyclopedia/tables.reset-backup.json

# Reset
python -c "
import json
from datetime import datetime

reset = {
    '_metadata': {
        'version': '1.0',
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat(),
        'description': 'Enciclopédia resetada'
    },
    'tabelas': {}
}

with open('sql-library/encyclopedia/tables.json', 'w') as f:
    json.dump(reset, f, indent=2)

print('Enciclopédia resetada!')
"

# Re-popular
python scripts/maintenance/update-encyclopedia.py --scan-all
```

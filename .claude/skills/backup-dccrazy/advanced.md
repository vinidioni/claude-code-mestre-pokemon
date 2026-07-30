# Backup DCCrazy - Avançado

## Execução Manual do Script

Para maior controle ou automação:

```bash
# Backup padrão
python scripts/google/backup-to-drive.py

# Desde o diretório raiz
python scripts/google/backup-to-drive.py
```

## Automação de Backups

### Cron/Linux - Backup semanal

```bash
# Editar crontab
crontab -e

# Backup toda segunda-feira às 9h
0 9 * * 1 cd ~/Desktop/dcc && python scripts/google/backup-to-drive.py > /tmp/dcc-backup.log 2>&1
```

### Windows Task Scheduler

1. Abrir `Task Scheduler` (Agendador de Tarefas)
2. Criar tarefa: `DCCrazy Weekly Backup`
3. Trigger: Semanal, Segunda-feira, 09:00
4. Action: Iniciar programa
5. Configuração:
   - Programa: `python`
   - Argumentos: `scripts/google/backup-to-drive.py`
   - Iniciar em: `C:\Users\%USERNAME%\Desktop\dcc`

### Script de Automação (Shell)

```bash
#!/bin/bash
# dcc-backup.sh - Coloque no cron

DCC_DIR="$HOME/Desktop/dcc"
LOG_FILE="/tmp/dcc-backup.log"

# Vai para diretório do DCC
cd "$DCC_DIR" || exit 1

# Executa backup
python scripts/google/backup-to-drive.py >> "$LOG_FILE" 2>&1

# Envia notificação (se D-Chat MCP configurado)
if [ $? -eq 0 ]; then
    echo "✅ Backup do DCCrazy concluído com sucesso"
    # Opcional: notificar via dchat
else
    echo "❌ Falha no backup do DCCrazy"
fi
```

## Estrutura Avançada de Manifesto

O manifesto pode ser estendido para incluir:

```json
{
  "backup_date": "2026-07-27T14:30:00",
  "version": "1.0",
  "dccastanho_path": "/Users/name/Desktop/dcc",
  "environment": {
    "node_version": "20.11.0",
    "python_version": "3.11.4",
    "claude_version": "0.2.29"
  },
  "contents": {
    "directories": 48,
    "files": 342,
    "total_size_mb": 18.5,
    "breakdown": {
      ".claude/": "5.2 MB",
      "scripts/": "1.8 MB",
      "sql-library/": "8.5 MB",
      "docs/": "2.1 MB",
      "templates/": "0.9 MB"
    }
  },
  "mcp_servers": ["cooper", "dchat", "gattaran"],
  "last_query": "2026-07-27T10:00:00"
}
```

## Restauração Seletiva

Às vezes você não precisa restaurar tudo:

### Restaurar apenas skills:
```bash
# Extrair apenas skills do ZIP
unzip DCCrazy_Backup_*.zip "*/.claude/skills/*" -d ~/Desktop/dcc-temp/

# Copiar para instalação atual
cp -r ~/Desktop/dcc-temp/.claude/skills/* ~/.claude/skills/
```

### Restaurar apenas queries:
```bash
unzip DCCrazy_Backup_*.zip "*/sql-library/*" -d ~/Desktop/dcc-temp/
cp -r ~/Desktop/dcc-temp/sql-library/* ~/Desktop/dcc/sql-library/
```

### Restaurar apenas configurações:
```bash
unzip DCCrazy_Backup_*.zip "*/.env" "*/.mcp.json" -d ~/Desktop/dcc-temp/
cp ~/Desktop/dcc-temp/.env ~/Desktop/dcc/
cp ~/Desktop/dcc-temp/.mcp.json ~/Desktop/dcc/
```

## Backup Incremental (Avançado)

Para backups mais rápidos, pode-se implementar backup incremental:

```python
# scripts/advanced/incremental-backup.py

import hashlib
import json
from pathlib import Path

def get_file_hash(filepath):
    """Calcula hash do arquivo para detectar mudanças"""
    return hashlib.md5(open(filepath, 'rb').read()).hexdigest()

def incremental_backup():
    # Carrega manifesto anterior
    last_manifest = load_last_manifest()
    
    # Compara hashes
    changed_files = []
    for file in find_all_files():
        if get_file_hash(file) != last_manifest.get(file, {}).get('hash'):
            changed_files.append(file)
    
    # Backup apenas arquivos modificados
    create_incremental_zip(changed_files)
```

## Sincronização com Git

O backup é complementar ao Git, não substituto:

| Aspecto | Git | Backup ZIP |
|---------|-----|------------|
| Propósito | Versionamento | Snapshot completo |
| Histórico | Completo | Apenas últimos N |
| Arquivos | Código fonte | Tudo (inclui .env) |
| Recuperação | Granular | Completa |

**Recomendação:**
```bash
# Commit no Git (código)
git add .
git commit -m "[backup] backup iniciado"

# Backup local (tudo incluindo configs)
python scripts/google/backup-to-drive.py

# Commit após backup
git add .backup/
git commit -m "[backup] manifest updated"
```

## Gestão de Retenção

Manter apenas os últimos N backups para economizar espaço:

```bash
# Manter apenas últimos 5 backups
ls -t DCCrazy_Backup_*.zip | tail -n +6 | xargs rm

# Automatizado no backup-dccrazy
def cleanup_old_backups(backup_dir, keep=5):
    backups = sorted(backup_dir.glob("DCCrazy_Backup_*.zip"))
    for old_backup in backups[:-keep]:
        old_backup.unlink()
        print(f"Removido: {old_backup.name}")
```

## Integração com D-Chat

Notificar quando backup concluir:

```python
# No final do backup-to-drive.py
from dchat_mcp_processor import send_message

send_message(
    user_id="your_user_id",
    message=f"✅ Backup do DCCrazy concluído!\n📦 {total_size_mb} MB\n📅 {backup_date}"
)
```

## Verificação de Integridade

Verificar se o backup está íntegro:

```bash
# Testar ZIP
unzip -t DCCrazy_Backup_*.zip

# Verificar manifesto
python -c "import json; json.load(open('.backup/manifest.json'))"

# Comparar contagens
ls -R ~/Desktop/dcc | wc -l
unzip -l DCCrazy_Backup_*.zip | wc -l
```

## Troubleshooting Avançado

### ZIP corrompido
```bash
# Reparar
cd ~/Desktop/dcc
zip -FF DCCrazy_Backup_20250727_143022.zip --out fixed.zip

# Ou recriar
python scripts/google/backup-to-drive.py
```

### Permissões no Windows
```powershell
# Executar como Administrador se necessário
# Ou ajustar permissões
icacls "C:\Users\name\Desktop\dcc" /grant %username%:F
```

### Arquivos muito grandes
```bash
# Dividir em partes
zip -s 100m DCCrazy_Backup.zip --out split.zip

# Resultado:
# DCCrazy_Backup.zip
# DCCrazy_Backup.z01
# DCCrazy_Backup.z02
```

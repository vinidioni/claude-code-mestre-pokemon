# DCCrazy Updater - Avançado

## Execução Manual do Script

Para maior controle, execute o script Python diretamente:

```bash
# Verificar atualizações (modo interativo)
python scripts/maintenance/check-updates.py

# Desde o diretório raiz do DCC
python scripts/maintenance/check-updates.py
```

## Entendendo o Backup

### O que é backupado automaticamente:
| Arquivo | Conteúdo | Por que é importante |
|---------|----------|---------------------|
| `.env` | Credenciais (tokens, chaves) | Não commitado no git |
| `.mcp.json` | Configurações de MCP servers | Integrações personalizadas |
| `.claude/settings.local.json` | Preferências locais | Configurações do usuário |

### Estrutura do backup:
```
.backup/
└── update_20250727_143022/
    ├── .env
    ├── .mcp.json
    └── settings.local.json
```

### Restauração manual (se necessário):
```bash
# Lista backups disponíveis
ls -la .backup/

# Restaurar configurações específicas
cp .backup/update_20250727_143022/.env .
cp .backup/update_20250727_143022/.mcp.json .
```

## Automação com Cron/Agendador

### Linux/macOS (cron):
```bash
# Editar crontab
crontab -e

# Verificar atualizações toda segunda às 9h
0 9 * * 1 cd ~/Desktop/dcc && python scripts/maintenance/check-updates.py --check-only
```

### Windows (Task Scheduler):
1. Abrir `Task Scheduler`
2. Criar nova tarefa básica
3. Trigger: Semanalmente (segunda-feira, 9:00)
4. Action: Iniciar programa
5. Programa: `python`
6. Argumentos: `scripts/maintenance/check-updates.py --check-only`
7. Iniciar em: `C:\Users\%USERNAME%\Desktop\dcc`

## Resolução de Conflitos Avançada

### Quando ocorrem conflitos:
O script aborta automaticamente e restaura o backup. Para resolver:

```bash
# 1. Verifique o status
git status

# 2. Veja os conflitos
git diff --name-only --diff-filter=U

# 3. Para cada arquivo em conflito, escolha:
#    - Manter sua versão local:
git checkout --ours arquivo.txt
git add arquivo.txt

#    - Aceitar a versão do remote:
git checkout --theirs arquivo.txt
git add arquivo.txt

#    - Editar manualmente e depois:
git add arquivo.txt

# 4. Complete o merge
git commit -m "resolve: merge conflicts na atualização"
```

## Rollback de Atualização

Se algo der errado após atualização:

```bash
# 1. Identifique o commit anterior
git log --oneline -5

# 2. Faça reset para versão anterior
# (⚠️ CUIDADO: perde alterações não commitadas)
git reset --hard HEAD~1

# 3. Ou reverta commits específicos
git revert <commit-hash>

# 4. Restaure configurações do backup
cp .backup/update_20250727_143022/.env .
```

## Customização do Script

### Parâmetros adicionais (opcional):

Editar `check-updates.py` para adicionar flags:

```python
# Linha ~242, função main()
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--check-only', action='store_true',
                   help='Apenas verifica, não atualiza')
parser.add_argument('--force', action='store_true',
                   help='Atualiza sem perguntar')
parser.add_argument('--skip-deps', action='store_true',
                   help='Pula instalação de dependências')
args = parser.parse_args()
```

## Dicas para Mantenedores

### Antes de fazer push de atualizações:
1. Teste em instalação limpa
2. Verifique se não quebrou workflows existentes
3. Documente breaking changes no commit message
4. Atualize a versão no `package.json` se aplicável

### Comunicando breaking changes:
```bash
# Commit com tag de breaking change
git commit -m "feat!: novo formato de configuração

BREAKING CHANGE: .mcp.json agora usa formato v2.
Execute 'python scripts/migrate-mcp.py' após atualizar."
```

## Integração com CI/CD

Para repositórios que usam o DCCrazy como template:

```yaml
# .github/workflows/update-dccrazy.yml
name: Check DCCrazy Updates

on:
  schedule:
    - cron: '0 9 * * 1'  # Segunda 9h

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for DCCrazy updates
        run: |
          git remote add upstream https://github.com/original/dccrazy.git
          git fetch upstream
          git log HEAD..upstream/main --oneline
```

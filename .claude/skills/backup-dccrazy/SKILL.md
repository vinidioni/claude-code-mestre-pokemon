---
name: backupDccrazy
description: Faz backup do DCCrazy no Google Drive com manifesto completo e preservação de estrutura
---

# Skill: Backup DCCrazy

## Quando Usar

Quando você quiser:
- **Fazer backup do DCCrazy** no Google Drive
- **Criar cópia de segurança** da instalação local
- **Sincronizar com a nuvem** para acesso de outros dispositivos
- **Exportar dados** antes de uma atualização ou formatação

## O que é Backupado

O backup inclui **tudo**, preservando a estrutura exata:

| Conteúdo | Descrição |
|----------|-----------|
| **Workflows** | `.claude/workflows/` - Todos os agentes YAML |
| **Skills** | `.claude/skills/` - Skills modulares e documentação |
| **Hooks** | `.claude/hooks/` - Automação e segurança |
| **Memory** | `.claude/memory/` - Memórias persistentes |
| **Configurações** | `.env`, `.mcp.json`, `settings.local.json` |
| **SQL Library** | `sql-library/` - Queries e enciclopédia |
| **Reports** | `reports/` - Relatórios gerados |
| **Dev Docs** | `incubator/` - Documentação de desenvolvimento |
| **Scripts** | `scripts/` - Utilitários Python |
| **Templates** | `templates/` - Templates de projeto |

**Ignorados automaticamente:**
- `node_modules/` - Dependências (podem ser reinstaladas)
- `.git/` - Histórico git (preserva no clone)
- `__pycache__/` - Cache Python
- `.backup/` - Backups anteriores locais

## Uso Básico

### Fazer backup completo
```
"fazer backup do dccrazy"
"backup no google drive"
"salvar dcc no drive"
"exportar dados"
```

### Verificar último backup
```
"quando foi o último backup"
"status do backup"
"manifesto do backup"
```

## Funcionalidades

- ✅ **Gera manifesto completo** com data, versão e conteúdo
- ✅ **Lista todos os diretórios e arquivos** com tamanhos
- ✅ **Cria arquivo ZIP** para upload fácil
- ✅ **Calcula espaço total** que será ocupado
- ✅ **Instruções claras** para upload manual ou MCP
- ✅ **Preserva estrutura** exata do DCCrazy

## Comando Equivalente

```bash
python scripts/google/backup-to-drive.py
```

## Processo de Backup

1. **Gera manifesto** com metadados:
   - Data e hora do backup
   - Versão do DCCrazy
   - Caminho da instalação
   - Lista de diretórios
   - Lista de arquivos com tamanhos
   - Espaço total calculado

2. **Cria arquivo ZIP**:
   - Nome: `DCCrazy_Backup_YYYYMMDD_HHMMSS.zip`
   - Compactação eficiente
   - Exclui arquivos desnecessários

3. **Instruções de upload**:
   - Se MCP Google Workspace estiver configurado: backup automático
   - Se não: instruções passo a passo para upload manual

## Estrutura do Manifesto

```json
{
  "backup_date": "2026-07-27T14:30:00",
  "version": "1.0",
  "dccastanho_path": "/Users/name/Desktop/dcc",
  "contents": {
    "directories": 45,
    "files": 320,
    "total_size_mb": 15.5
  }
}
```

## Localização no Drive

O backup é salvo em:
```
Meu Drive/
└── DCCrazy_Backup/
    └── DCCrazy_Backup_20250727_143022.zip
```

## Restauração de Backup

Para restaurar a partir de um backup:

1. **Baixe o ZIP do Drive**
2. **Extraia** para Desktop:
   ```bash
   # Windows
   Extraia para C:\Users\%USERNAME%\Desktop\
   
   # macOS/Linux
   unzip DCCrazy_Backup_*.zip -d ~/Desktop/
   ```
3. **Renomeie** a pasta extraída para `dcc`
4. **Abra o Claude Code** na pasta
5. **Verifique a instalação**:
   ```bash
   node scripts/verify-setup.js
   ```

## Resolução de Problemas

### "MCP Google Workspace não configurado"
**Solução:** O backup cria o ZIP localmente e fornece instruções para upload manual.

Para configurar MCP automatizado:
1. Veja `docs/guides/google-workspace.md`
2. Configure OAuth no Google Cloud
3. Atualize `.mcp.json`

### "Espaço insuficiente no Drive"
**Verifique:**
- Tamanho do backup no manifesto
- Espaço disponível no Drive
- Limpe backups antigos se necessário

### "Erro ao criar ZIP"
**Possíveis causas:**
- Permissões de escrita no diretório
- Arquivos muito grandes
- Espaço em disco insuficiente

**Solução:**
```bash
# Verifique espaço disponível
df -h .  # macOS/Linux
dir      # Windows

# Limpe temp-storage/ se necessário
python scripts/maintenance/cleanup-temp.py --execute
```

## Boas Práticas

### Quando fazer backup:
- **Semanalmente** - Rotina de segurança
- **Antes de atualizações** - Relembre python scripts/maintenance/check-updates.py
- **Após mudanças grandes** - Novos workflows, skills importantes
- **Antes de formatar** - Preservar todo o trabalho

### Organização de backups no Drive:
```
DCCrazy_Backup/
├── 2026-07-01/           # Backups do mês
│   ├── DCCrazy_Backup_20260701_090000.zip
│   └── DCCrazy_Backup_20260715_143022.zip
├── 2026-06/              # Backups antigos
└── latest -> symlink     # Link para o último (opcional)
```

## Próximos Passos Após Backup

```bash
# Verifique o backup criado
ls -la .backup/

# Veja o manifesto
cat .backup/manifest.json

# Confirme no Google Drive (se MCP configurado)
"liste arquivos no drive"
```

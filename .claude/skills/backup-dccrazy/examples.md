# Backup DCCrazy - Exemplos

## Exemplo 1: Backup Simples

```
Usuário: "fazer backup do dccrazy"

Claude: Vou criar um backup completo do seu DCCrazy.

📋 Gerando manifesto do backup...
📁 Diretórios: 48
📄 Arquivos: 342
📊 Tamanho total: 18.5 MB

✅ Manifesto salvo: .backup/manifest.json

📦 Criando backup local: DCCrazy_Backup_20250727_143022.zip
✅ Backup criado: C:\Users\name\Desktop\DCCrazy_Backup_20250727_143022.zip
📊 Tamanho: 12.3 MB (compactado)

⚠️  MCP Google Workspace não configurado

📤 Upload Manual:
   1. Abra drive.google.com
   2. Crie pasta "DCCrazy_Backup" (se não existir)
   3. Arraste o ZIP para a pasta
   4. Aguarde o upload completar

💡 Dica: Configure o MCP para backup automático futuro.
   Veja: docs/guides/google-workspace.md
```

## Exemplo 2: Verificar Último Backup

```
Usuário: "quando foi o último backup"

Claude: Vou verificar o histórico de backups.

📦 Backups encontrados:

Local (.backup/):
├── 20250727_143022/     → Há 3 dias
│   └── manifest.json
└── 20250720_090000/     → Há 10 dias

ZIPs disponíveis:
├── DCCrazy_Backup_20250727_143022.zip (12.3 MB)
└── DCCrazy_Backup_20250720_090000.zip (11.8 MB)

💡 Recomendação: Um backup semanal é ideal.
   Último backup há 3 dias.
```

## Exemplo 3: Com MCP Configurado

```
Usuário: "backup no google drive"

Claude: Vou fazer o backup e enviar para o seu Drive.

📋 Gerando manifesto...
✅ Manifesto: 342 arquivos, 18.5 MB

📦 Compactando...
✅ ZIP criado: 12.3 MB

🔄 Enviando para Google Drive...
📁 Destino: DCCrazy_Backup/
⬆️  Enviando: DCCrazy_Backup_20250727_143022.zip
✅ Upload concluído!

📋 Resumo:
- Arquivo: DCCrazy_Backup_20250727_143022.zip
- Tamanho: 12.3 MB
- Local: Meu Drive/DCCrazy_Backup/

🔗 Ver no Drive: drive.google.com/drive/u/0/my-drive
```

## Exemplo 4: Backup Antes de Atualização

```
Usuário: "backup antes de atualizar"

Claude: Excelente prática! Vou fazer o backup antes da atualização.

💾 Criando backup de segurança...
📋 Manifesto: 342 arquivos
📦 ZIP: 12.3 MB
✅ Backup criado com sucesso!

📝 Nota: Backup salvo em .backup/update_20250727_backup/
   Este backup será mantido durante a atualização.

Agora posso prosseguir com a atualização?
"sim"

[Prossegue com check-updates.py]
```

## Exemplo 5: Erro - Sem Espaço

```
Usuário: "fazer backup"

Claude: Tentando criar backup...

❌ Erro: Espaço insuficiente em disco
   Necessário: ~20 MB
   Disponível: 5 MB

💡 Soluções:
1. Limpe arquivos temporários:
   python scripts/maintenance/cleanup-temp.py --execute

2. Remova backups antigos locais:
   ls -la .backup/
   rm -rf .backup/backup_2025*/

3. Libere espaço no disco

Deseja tentar limpar arquivos temporários primeiro?
```

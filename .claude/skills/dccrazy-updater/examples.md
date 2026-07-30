# DCCrazy Updater - Exemplos

## Exemplo 1: Verificar Atualizações

```
Usuário: "Tem atualização pro DCCrazy?"

Claude: Vou verificar se há atualizações disponíveis.

🔍 Buscando atualizações...

📦 Atualização disponível no DCCrazy!
   Sua versão: a1b2c3d4
   Versão mais recente: e5f6g7h8
   Commits atrás: 3

📝 Commits novos:
   • feat: novo workflow de relatórios
   • fix: corrige skill cooper
   • docs: atualiza README

📁 Arquivos que serão alterados:
   • .claude/workflows/agents/report-agent.yaml
   • .claude/skills/cooper/SKILL.md
   • README.md

Deseja atualizar o DCCrazy? (s/n):
```

## Exemplo 2: Atualização Completa

```
Usuário: "Atualiza o DCCrazy"

Claude: Vou verificar e atualizar o DCCrazy para você.

🔍 Buscando atualizações...

📦 Atualização disponível!
   Commits atrás: 5

Deseja atualizar o DCCrazy? (s/n): s

💾 Criando backup em: .backup/update_20250727_143022
  ✅ Backup: .env
  ✅ Backup: .mcp.json
  ✅ Backup: settings.local.json
   3 arquivo(s) salvos

⬇️  Atualizando repositório...
  ✅ Repositório atualizado

📦 Detectadas mudanças em dependências!
Deseja instalar as dependências atualizadas? (s/n): s
📦 Instalando dependências Node.js...
  ✅ Node.js OK

🔄 Restaurando configurações locais...
  ✅ Restaurado: .env
  ✅ Restaurado: .mcp.json
  ✅ Restaurado: settings.local.json

============================================================
✅ DCC atualizado com sucesso!
============================================================

Próximos passos:
  • Verifique se tudo funciona: node scripts/verify-setup.js
  • Leia as novidades: git log --oneline -10
  • Backup salvo em: .backup/update_20250727_143022
```

## Exemplo 3: Já Está Atualizado

```
Usuário: "Verifica se tem update"

Claude: Vou verificar atualizações do DCCrazy.

🔍 Buscando atualizações...

✅ Seu DCCrazy está atualizado!
   Versão: e5f6g7h8
```

## Exemplo 4: Sem Remote Configurado

```
Usuário: "Atualizar dccrazy"

Claude: Vou tentar atualizar o DCCrazy.

🔍 Buscando atualizações...

❌ Nenhum remote configurado.
   Configure o remote com: git remote add origin <url>

Posso ajudar a configurar o remote agora?
```

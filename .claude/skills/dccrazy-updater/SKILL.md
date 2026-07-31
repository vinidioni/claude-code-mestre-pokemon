---
name: dccrazyUpdater
description: Atualização do DCCrazy a partir do repositório GitHub com backup automático de configurações
---

# Skill: DCCrazy Updater

## Quando Usar

Quando você quiser:
- **Verificar se há atualizações** do DCCrazy no GitHub
- **Atualizar o kit de ferramentas** (workflows, skills, scripts)
- **Sincronizar com a versão mais recente** preservando suas configurações locais

## O que é o DCCrazy

O **DCCrazy** é o kit de ferramentas do DCC - workflows, skills, scripts e utilitários mantidos no repositório GitHub. Esta skill permite atualizar sua cópia local sem perder configurações pessoais (`.env`, `.mcp.json`, etc.).

## Uso Básico

### Verificar atualizações disponíveis
```
"Verificar atualizações do DCCrazy"
"Tem update pro DCC?"
"Checa se o dccrazy tá atualizado"
```

### Executar atualização completa
```
"Atualizar o DCCrazy"
"Atualiza o kit de ferramentas"
"Faz o update do DCC"
```

## Funcionalidades

- ✅ Verifica se há commits novos no GitHub
- ✅ Mostra changelog (até 10 commits)
- ✅ Lista arquivos que serão modificados
- ✅ **Guarda mudanças locais automaticamente** (git stash) antes de atualizar
- ✅ Faz backup automático de:
  - `.env` (credenciais)
  - `.mcp.json` (integrações)
  - `.claude/settings.local.json` (preferências locais)
- ✅ Executa `git pull` com segurança
- ✅ **Restaura suas mudanças locais** após atualização
- ✅ Detecta mudanças em dependências e pergunta se quer instalar
- ✅ Limpa backups antigos (mantém últimos 5)

## Comando Equivalente

```bash
python scripts/maintenance/check-updates.py
```

## Fluxo de Atualização

1. **Busca** atualizações no remote (`git fetch`)
2. **Compara** versão local vs. remota
3. **Mostra** o que vai mudar (commits e arquivos)
4. **Pergunta** confirmação antes de prosseguir
5. **Backup** das configurações locais (`.env`, `.mcp.json`)
6. **Guarda** suas mudanças locais (`git stash push`) - **novo!**
7. **Pull** das alterações (limpo, sem conflitos)
8. **Restaura** configurações do backup
9. **Recupera** suas mudanças locais (`git stash pop`) - **novo!**
10. **Opcional**: instala dependências atualizadas

### O que é guardado e recuperado?

✅ **Guardado no stash automaticamente** (arquivos rastreados pelo git):
- Skills modificados por você
- Workflows editados
- Arquivos de configuração alterados

❌ **Não precisa de stash** (já ignorados ou tratados como locais):
- **Todas as queries SQL**: `sql-library/queries/` (todos os subdiretórios)
- **Repositório de queries**: `sql-library/repository/`
- **Projetos em `incubator/`**
- **Arquivos em `temp-storage/`**
- **Relatórios em `reports/draft/`**
- **Extrações de KB**: `mcp-servers/cooper/kb-extracts/`

### Se houver conflito no pop

Se você e o repositório modificaram o **mesmo arquivo**, ocorrerá um conflito ao restaurar suas mudanças. O script informará:
- Quais arquivos estão em conflito
- Comandos para resolver: `git reset --hard HEAD` (descartar suas mudanças) ou resolver manualmente
- Seus arquivos originais continuam no stash: `git stash pop`

## Resolução de Problemas

### "Não é um repositório git"
```
❌ Este diretório não é um repositório git.
```
**Solução**: O DCCrazy precisa ter sido clonado do GitHub (`git clone`), não baixado como ZIP.

### "Nenhum remote configurado"
```
❌ Nenhum remote configurado.
```
**Solução**: Adicione o remote:
```bash
git remote add origin https://github.com/seu-usuario/dccrazy.git
```

### Conflitos no pull
Se houver conflitos, o script aborta e restaura o backup. Resolva manualmente:
```bash
git status
# Resolva os conflitos
git add .
git commit -m "resolve merge"
```

## Próximos Passos Após Atualização

Após atualizar com sucesso:
1. Execute: `node scripts/verify-setup.js` para verificar instalação
2. Execute: `python scripts/maintenance/check-updates.py` novamente para confirmar que está atualizado
3. Leia o changelog: `git log --oneline -10`

## Notas

- Backups são salvos em `.backup/update_YYYYMMDD_HHMMSS/`
- Apenas os últimos 5 backups são mantidos automaticamente
- O arquivo `.dcc-installed` é criado na primeira instalação, não remova

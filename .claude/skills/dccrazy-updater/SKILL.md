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
- ✅ Faz backup automático de:
  - `.env` (credenciais)
  - `.mcp.json` (integrações)
  - `.claude/settings.local.json` (preferências locais)
- ✅ Executa `git pull` com segurança
- ✅ Restaura configurações após atualização
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
5. **Backup** das configurações locais
6. **Pull** das alterações
7. **Restaura** configurações do backup
8. **Opcional**: instala dependências atualizadas

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

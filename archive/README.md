# Archive - Arquivos Temporários

Esta pasta contém arquivos temporários, backups e dados de análise que não fazem parte do código principal.

## 🗂️ Categorias

| Prefixo/Sufixo | Tipo | Prazo de Retenção | Pode Excluir? |
|----------------|------|-------------------|---------------|
| `analysis_*.txt` | Análises temporárias | 30 dias | ✅ Sim |
| `page_*.txt/png` | Scraping/ screenshots | 7 dias | ✅ Sim |
| `test_*.py` | Scripts de teste temporários | 30 dias | ✅ Sim |
| `*.backup.*` | Backups automáticos | 90 dias | ⚠️ Verificar necessidade |
| `*.old` | Versões antigas | 30 dias | ✅ Sim |

## 📝 Critérios de Exclusão

### ✅ Pode excluir imediatamente
- Arquivos de análise já consumidos (`analysis_*.txt`)
- Screenshots e dumps de páginas (`page_*`)
- Scripts de teste descartáveis (`test_*.py`)
- Arquivos com mais de 90 dias

### ⚠️ Verificar antes de excluir
- Backups de configurações importantes
- Logs de erros não resolvidos
- Migrações em andamento

### ❌ NÃO excluir
- Documentação de decisões arquiteturais
- Templates base de projetos
- Scripts de migração que ainda são referenciados

## 🧹 Limpeza Periódica

Recomenda-se revisar esta pasta mensalmente e excluir arquivos expirados.

```bash
# Comando para listar arquivos com mais de 30 dias
find archive/ -type f -mtime +30 -ls

# Comando para excluir arquivos expirados (use com cuidado)
find archive/ -type f -mtime +90 -delete
```

## 📋 Inventário Atual

| Data | Arquivo | Categoria | Expira em | Ação |
|------|---------|-----------|-----------|------|
| 2026-07-17 | `analysis_mcp_cooper_hub.txt` | Análise | 2026-08-16 | 🗑️ Excluir após 30 dias |
| 2026-07-17 | `analysis_skill_*.txt` (6 arquivos) | Análise | 2026-08-16 | 🗑️ Excluir após 30 dias |
| 2026-07-17 | `page_content.txt` | Screenshot | 2026-07-24 | 🗑️ Excluir após 7 dias |
| 2026-07-17 | `page_screenshot.png` | Screenshot | 2026-07-24 | 🗑️ Excluir após 7 dias |
| 2026-07-15 | `test_skillshub.py` | Teste | 2026-08-14 | 🗑️ Excluir após 30 dias |

---
**Revisado em:** 2026-07-17  
**Próxima revisão:** 2026-08-17

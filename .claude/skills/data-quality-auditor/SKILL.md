---
name: dataQualityAuditor
description: Auditoria de datasets - completude, consistência, acurácia e validade. DQS scoring e análise de valores ausentes
origin: alirezarezvani/claude-skills
version: 2.9.0
installed: 2026-07-07
---

# Skill: Data Quality Auditor

## Fonte
**Repositório:** [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)  
**Path:** `engineering/data-quality-auditor`  
**Versão:** 2.9.0  
**Instalação:** 2026-07-07

## Quando Usar

Para auditar datasets em busca de:
- **Completude**: Campos vazios/nulos
- **Consistência**: Formato e valores uniformes
- **Acurácia**: Precisão dos dados
- **Validade**: Conformidade com regras de negócio

## Capacidades

### Data Quality Scoring (DQS)
Score de 0-100 baseado em:
- Completude (% preenchido)
- Consistência (% uniforme)
- Acurácia (% correto)
- Validade (% válido)

### Análise de Valores Ausentes
Classificação MCAR/MAR/MNAR:
- **MCAR**: Missing Completely at Random
- **MAR**: Missing at Random
- **MNAR**: Missing Not at Random

### Ferramentas Python (no repo original)
1. **Data Profiler**: Análise exploratória com DQS scoring
2. **Missing Value Analyzer**: Classificação MCAR/MAR/MNAR
3. **Multi-Metric Analyzer**: Análise de qualidade multidimensional

## Uso Básico

Ative mencionando:
```
"auditar qualidade de dados", "data quality", "missing values",
"completude", "consistência", "DQS", "limpeza de dados"
```

## Exemplos

### Auditoria Completa
```
"Audite a qualidade deste dataset e gere um DQS score"
```

### Valores Ausentes
```
"Analise os valores ausentes e classifique como MCAR/MAR/MNAR"
```

### Recomendações
```
"Quais ações devo tomar para melhorar a qualidade destes dados?"
```

## Output Esperado

```markdown
## Data Quality Report

### DQS Score: 78/100

| Dimensão | Score | Status |
|----------|-------|--------|
| Completude | 85% | ✅ Bom |
| Consistência | 90% | ✅ Excelente |
| Acurácia | 65% | ⚠️ Regular |
| Validade | 72% | ✅ Bom |

### Missing Values Analysis
- MCAR: 5% (remover ok)
- MAR: 10% (imputação possível)
- MNAR: 3% (investigar)

### Recomendações
1. [Ação específica]
2. [Ação específica]
```

## Recursos

- **Documentação completa:** [GitHub](https://github.com/alirezarezvani/claude-skills/tree/main/engineering)
- **Autor:** Alireza Rezvani
- **Licença:** MIT

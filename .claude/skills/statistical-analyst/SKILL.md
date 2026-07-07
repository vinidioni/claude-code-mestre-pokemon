---
name: statisticalAnalyst
description: Análise estatística - teste de hipóteses, A/B testing, cálculo amostral, intervalos de confiança
origin: alirezarezvani/claude-skills
version: 2.9.0
installed: 2026-07-07
---

# Skill: Statistical Analyst

## Fonte
**Repositório:** [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)  
**Path:** `engineering/statistical-analyst`  
**Versão:** 2.9.0  
**Instalação:** 2026-07-07

## Quando Usar

Para análises estatísticas:
- **Teste de Hipóteses**: Z-test, t-test, chi-square
- **A/B Testing**: Design e análise de experimentos
- **Cálculo Amostral**: Tamanho da amostra e power analysis
- **Intervalos de Confiança**: Estimativas com margem de erro

## Capacidades

### Testes de Hipóteses
| Teste | Uso |
|-------|-----|
| Z-test | Amostras grandes, desvio padrão conhecido |
| t-test | Amostras pequenas, comparar médias |
| Chi-square | Categóricas, independência |

Todos com cálculo de **effect size** (tamanho do efeito).

### A/B Testing
- Design de experimentos
- Randomização
- Análise de resultados
- Interpretação de significância

### Cálculo de Tamanho Amostral
- Power analysis (80%, 90%, 95%)
- Effect size mínimo detectável
- Nível de significância (α)

### Intervalos de Confiança
- 95%, 99% de confiança
- Margem de erro
- Interpretação prática

## Uso Básico

Ative mencionando:
```
"teste de hipóteses", "A/B test", "significância estatística",
"tamanho da amostra", "p-value", "intervalo de confiança",
"chi-square", "z-test", "t-test"
```

## Exemplos

### A/B Testing
```
"Analise este experimento A/B: grupo A (n=1000, conversão=15%), grupo B (n=1000, conversão=18%)"
```

### Tamanho Amostral
```
"Qual tamanho da amostra preciso para detectar 5% de diferença com 80% power?"
```

### Teste de Hipótese
```
"Rode um t-test para comparar estas duas médias"
```

## Ferramentas Python (no repo original)
1. **Z-test/t-test/chi-square**: Com effect sizes
2. **Sample Size Calculator**: Com power analysis
3. **Confidence Interval**: Para proporções e médias

## Output Esperado

```markdown
## Statistical Analysis Report

### Test: Two-sample t-test
- H0: μA = μB
- H1: μA ≠ μB
- α = 0.05

### Results
- t-statistic: 2.45
- p-value: 0.014
- Effect size (Cohen's d): 0.11 (small)
- 95% CI: [0.02, 0.08]

### Conclusion
✅ Reject H0: Grupo B é significativamente melhor (p=0.014)
⚠️ Effect size pequeno: diferença prática limitada

### Recommendation
[Recomendação baseada nos dados]
```

## Recursos

- **Documentação completa:** [GitHub](https://github.com/alirezarezvani/claude-skills/tree/main/engineering)
- **Autor:** Alireza Rezvani
- **Licença:** MIT

---
name: businessInvestmentAdvisor
description: Análise de investimentos - ROI, IRR, NPV, payback, build vs buy, lease vs buy
origin: alirezarezvani/claude-skills
version: 2.9.0
installed: 2026-07-07
---

# Skill: Business Investment Advisor

## Fonte
**Repositório:** [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)  
**Path:** `finance/business-investment-advisor`  
**Versão:** 2.9.0  
**Instalação:** 2026-07-07

## Quando Usar

Para avaliar investimentos de capital:
- **ROI**: Return on Investment
- **IRR**: Internal Rate of Return
- **NPV**: Net Present Value
- **Payback Period**: Tempo de retorno
- **Build vs Buy**: Construir vs comprar
- **Lease vs Buy**: Alugar vs comprar

## Capacidades

### Tipos de Investimento
| Tipo | Análise |
|------|---------|
| Equipamentos | Capex, manutenção, depreciação |
| Real Estate | Compra vs aluguel, valorização |
| Novo negócio | Startup, expansão, diversificação |
| Contratação | Custo-benefício de novos hires |
| Tecnologia | Software, infraestrutura, cloud |

### Métricas Financeiras
- **ROI**: (Ganho - Investimento) / Investimento
- **IRR**: Taxa de retorno interna
- **NPV**: Valor presente líquido
- **Payback Period**: Meses/anos para recuperar

### Decisões Estratégicas
- **Build vs Buy**: Desenvolver interno vs comprar pronto
- **Lease vs Buy**: Alugar vs comprar ativos
- **Timing**: Quando investir
- **Risk-adjusted returns**: Retornos ajustados por risco

## Uso Básico

Ative mencionando:
```
"ROI", "IRR", "NPV", "payback", "investimento", "build vs buy",
"lease vs buy", "capex", "análise de investimento"
```

## Exemplos

### Avaliação Completa
```
"Avalie este investimento de $100k em novo software: economia anual $30k, duração 5 anos"
```

### Build vs Buy
```
"Devo construir esta feature ou comprar uma solução pronta?"
```

### Lease vs Buy
```
"Vale mais alugar ou comprar este equipamento de $50k?"
```

## Output Esperado

```markdown
## Investment Analysis Report

### Scenario: [Descrição]
- Investment: $100,000
- Duration: 5 years
- Annual savings: $30,000

### Financial Metrics
| Métrica | Valor | Benchmark | Status |
|---------|-------|-----------|--------|
| ROI | 50% | >20% | ✅ Excelente |
| IRR | 15.2% | >12% | ✅ Bom |
| NPV | $13,723 | >0 | ✅ Positivo |
| Payback | 3.3 anos | <5 anos | ✅ Aceitável |

### Sensitivity Analysis
- ROI se economia for 20% menor: 30%
- IRR se duração for 4 anos: 12.8%

### Recommendation
✅ **APROVADO**: Investimento financeiramente viável
⚠️ Monitorar economias reais vs projetadas
```

## Recursos

- **Documentação completa:** [GitHub](https://github.com/alirezarezvani/claude-skills/tree/main/finance)
- **Autor:** Alireza Rezvani
- **Licença:** MIT

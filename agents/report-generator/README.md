# report-generator

Conjunto de agentes para geração de relatórios diversos.

## Agentes Disponíveis

### report-weekly
Relatório semanal de atividades de desenvolvimento.

**Uso:**
```bash
# Semana atual
claude "execute report-weekly"

# Semana específica
claude "execute report-weekly --week=2024-W27"

# Semana anterior
claude "execute report-weekly --week=last"
```

**Output:**
- Commits por categoria
- Autores ativos
- Arquivos mais modificados
- Métricas de código
- Riscos identificados
- Destaques e próximos passos

**Formato:** `reports/YYYY-MM/weekly-report-WNN.md`

---

### report-project-health
Análise de saúde geral do projeto.

**Uso:**
```bash
claude "execute report-project-health"
```

**Métricas:**
- Cobertura de testes
- Débito técnico
- Dependências desatualizadas
- Complexidade ciclomática
- Code smells
- Duplicação de código

---

## Parâmetros Comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| output_format | string | `markdown` ou `json` |
| save | boolean | Salvar em arquivo (padrão: true) |

## Estrutura dos Relatórios

### Weekly Report

```markdown
# 📊 Relatório Semanal

**Período:** 01/07/2024 a 07/07/2024

## 🎯 Resumo Executivo
- Commits: 42 (+15% vs semana anterior)
- Autores: 5
- PRs mergeados: 8

## 📈 Atividades
### Commits por Categoria
- ✨ Features: 15
- 🐛 Bugfixes: 12
- 🔧 Refatorações: 10

### Principais Contribuidores
1. @alice (12 commits)
2. @bob (10 commits)

## 🚨 Pontos de Atenção
- Arquivo `src/api.ts` modificado 8 vezes
- 3 TODOs adicionados

## 🎯 Destaques
- Nova feature X entregue
- Refatoração do módulo Y concluída
```

## Integrações

### Slack
Envie relatórios automaticamente:
```bash
claude "execute report-weekly && curl -X POST -H 'Content-type: application/json' \
  --data '{\"text\":\"$(cat reports/.../weekly-report.md)\"}' \
  $SLACK_WEBHOOK_URL"
```

### Email (via Google Workspace)
```bash
claude "execute report-weekly" && \
  claude "envie o relatório reports/.../weekly-report.md para team@example.com"
```

## Automação

### Cron Job (Linux/Mac)
```bash
# Executar toda segunda-feira às 9h
0 9 * * 1 cd /path/to/project && claude "execute report-weekly"
```

### GitHub Actions
```yaml
name: Weekly Report
on:
  schedule:
    - cron: '0 9 * * 1'  # Segunda 9h
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Generate Report
        run: claude "execute report-weekly"
      - name: Upload
        uses: actions/upload-artifact@v3
        with:
          name: weekly-report
          path: reports/
```

## Dashboard

Para criar um dashboard consolidado:

```bash
# Executar todos os relatórios
claude "execute report-weekly"
claude "execute report-project-health"

# Consolidar em um dashboard
claude "consolide os relatórios em um dashboard.html"
```

## Extensão

Para criar um novo tipo de relatório:

1. Crie o workflow em `.claude/workflows/reports/report-[nome].yaml`
2. Documente em `agents/report-generator/report-[nome].md`
3. Adicione ao catálogo em `agents/README.md`

### Template de Novo Relatório

```yaml
name: report-[nome]
description: Descrição do relatório

parameters:
  - name: param
    type: string
    required: false
    default: ""

steps:
  - name: coleta_dados
    prompt: Colete dados necessários...

  - name: analise
    prompt: Analise os dados...

  - name: gerar_relatorio
    prompt: Gere relatório no formato...

settings:
  output_path: "reports/{date}/report-[nome]-{timestamp}.md"
```

## Histórico

- 1.0.0 (2024-07-07) - Versão inicial
  - report-weekly
  - report-project-health (planejado)

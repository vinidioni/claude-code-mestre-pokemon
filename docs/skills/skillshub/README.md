# SkillsHub DiDi - Documentação

> **SkillsHub** é a plataforma interna da DiDi para descoberta e uso de skills de IA.
> URL: https://skillshub.intra.xiaojukeji.com

## 📁 Estrutura

```
docs/skillshub/
├── README.md                      # Este arquivo
├── reference/                     # Referências externas (SkillsHub DiDi)
│   ├── skillshub-didi-skills.md  # Análise das skills do SkillsHub
│   └── skillshub-data.json       # Dados brutos da análise
└── [skill-name]/                  # Documentação específica por skill (se necessário)
```

> **Nota:** As skills do SkillsHub DiDi são **referências externas**, não skills criadas no DCC.
> Para nossas skills próprias, veja `.claude/skills/`.

## 🔍 Skills do SkillsHub DiDi (Referência)

Documentação de skills internas da DiDi para referência:

| Skill | Descrição | Categoria |
|-------|-----------|-----------|
| `gattaran-coupon-batch-auto` | Automação de cupons em lote | Gattaran |
| `gattaran-coupon-creator` | Criação de cupons | Gattaran |
| `gattaran-coupon-activity-batch` | Atividades de cupons em lote | Gattaran |
| `gattaran-exp-diff` | Comparação de experimentos | Gattaran |
| `city-budget-rpo` | Orçamento por cidade | Financeiro |
| `gtr-frontend-page-generator` | Geração de páginas frontend | Desenvolvimento |
| `lowcode-material-creator` | Criação de materiais low-code | Low-Code |
| `soda-ai-gattaran-workflow` | Workflow com IA SODA | Automação |

📄 Veja detalhes em: [reference/skillshub-didi-skills.md](reference/skillshub-didi-skills.md)

## 🏠 Nossas Skills (DCC)

Skills criadas e mantidas no DCC:

| Skill | Localização | Descrição |
|-------|-------------|-----------|
| `cooper` | `.claude/skills/cooper/` | Integração com Cooper (DiDi Docs) |
| `cooper-search` | `.claude/skills/cooper-search/` | Busca no Cooper |
| `cooper-read` | `.claude/skills/cooper-read/` | Leitura de documentos Cooper |
| `cooper-write` | `.claude/skills/cooper-write/` | Criação de documentos Cooper |
| `gattaran-viewer` | `.claude/skills/gattaran-viewer/` | Visualização de orders Gattaran |

## 🛠️ Scripts de Análise

```bash
# Extrair dados de skills do SkillsHub
python scripts/analysis/fetch-skillshub.py
```

## 🔗 Referências

- [Nossas Skills](../../.claude/skills/)
- [Memory: Gattaran Context](../../.claude/memory/gattaran-context.md)
- [MCP Server Gattaran](../../mcp-servers/gattaran/)
- [SkillsHub DiDi](https://skillshub.intra.xiaojukeji.com)

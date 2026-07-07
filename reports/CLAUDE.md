# Reports - Documentação de Contexto

> Este CLAUDE.md carrega automaticamente quando você trabalha em `reports/`. Ele estende o CLAUDE.md raiz com detalhes específicos para geração e organização de relatórios.

## Propósito

A pasta `reports/` armazena relatórios gerados automaticamente por agentes, organizados por mês para fácil consulta histórica.

## Estrutura de Pastas

```
reports/
├── CLAUDE.md              # Este arquivo
├── YYYY-MM/               # Relatórios do mês
│   ├── code-review-2024-01-15-143022.md
│   ├── security-audit-2024-01-20-091530.md
│   └── ...
└── templates/             # Templates de relatórios
    ├── code-review.md
    ├── security-audit.md
    └── weekly-summary.md
```

## Convenções

### Nomenclatura de Arquivos
`{tipo}-{timestamp}.md`

- **tipo**: kebab-case (ex: code-review, security-audit)
- **timestamp**: YYYY-MM-DD-HHMMSS

### Estrutura de Relatório

```markdown
# Título do Relatório

**Gerado em:** YYYY-MM-DD HH:MM  
**Por:** {nome-do-agente}  
**Alvo:** {caminho/arquivo analisado}

## Resumo Executivo

2-3 linhas com os achados mais importantes.

## Detalhes

### Seção 1
...

### Seção 2
...

## Recomendações

1. ...
2. ...

## Próximos Passos

- [ ] Ação recomendada
```

## Como Gerar um Relatório

### Via Workflow
```bash
claude workflow run code-review --target="src/"
```

### Via Agente
```bash
claude "execute o agente de security-audit no diretório src/api/"
```

## Boas Práticas

1. **Não edite relatórios gerados** - Eles são artefatos de auditoria
2. **Consulte histórico** - Compare relatórios mensais para identificar tendências
3. **Arquive relatórios antigos** - Após 12 meses, mova para `archive/`

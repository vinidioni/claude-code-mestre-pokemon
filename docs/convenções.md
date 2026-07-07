# 📋 Convenções do Repositório DCC

Este documento define as convenções para manter o repositório organizado e os agentes consistentes.

---

## Estrutura de Diretórios

```
dcc/
├── .claude/                    # Configurações e workflows do Claude
│   ├── workflows/              # Workflows versionados
│   │   ├── agents/             # Agentes reutilizáveis
│   │   ├── reports/            # Geradores de relatórios
│   │   └── tasks/              # Tarefas pontuais
│   ├── memory/                 # Memória persistente (não commitar)
│   └── settings.local.json     # Configurações locais
├── agents/                     # Documentação de agentes
│   ├── README.md               # Catálogo
│   └── [nome-do-agente]/       # Documentação específica
├── reports/                    # Relatórios gerados
│   ├── YYYY-MM/                # Por mês
│   └── templates/              # Templates de saída
├── templates/                  # Templates de projetos
│   ├── web-app/                # Next.js/React
│   ├── api-service/            # API Node/Python
│   └── python-script/          # Scripts Python
├── docs/                       # Documentação geral
├── archive/                    # Arquivos antigos
└── README.md                   # Entry point
```

---

## Nomenclatura

### Arquivos e Pastas
- Use `kebab-case` (minúsculas com hífen)
- Extensões sempre em minúsculas: `.yaml`, `.md`, `.json`
- Nomes descritivos e curtos

✅ **Bom:**
- `code-review.yaml`
- `report-weekly.yaml`
- `api-service/`

❌ **Evitar:**
- `CodeReview.yaml` (camelCase)
- `report_weekly.yml` (snake_case, extensão errada)
- `api_service/` (snake_case)

### Agentes
- Nomes em `kebab-case`
- Descreve a ação: `code-review`, `doc-generator`
- Evite verbos no início: ~~`analyze-code`~~ → `code-analyzer`

### Relatórios
- Formato: `{tipo}-report-YYYY-MM-DD.{ext}`
- Organizados em pastas por mês: `reports/2024-07/`

✅ **Bom:**
- `weekly-report-2024-07-07.md`
- `security-audit-2024-07-07.json`

---

## Commits

### Mensagens

```
[tipo] Descrição curta em português

Corpo detalhado se necessário. Explique o porquê,
não apenas o que foi feito.

- Pontos importantes
- Contexto de decisões

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Tipos

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `[agent]` | Novo agente ou atualização | `[agent] Adiciona detector de dead code` |
| `[report]` | Relatório gerado | `[report] Análise de saúde - Julho 2024` |
| `[template]` | Novo template | `[template] API NestJS com Prisma` |
| `[doc]` | Documentação | `[doc] Atualiza guia de workflows` |
| `[chore]` | Manutenção | `[chore] Limpa arquivos temporários` |
| `[fix]` | Correção em agente | `[fix] Corrige regex no code-review` |

### Exemplos

```bash
# Novo agente
git commit -m "[agent] Adiciona security-audit para análise de vulnerabilidades

Implementa detecção de:
- SQL Injection
- XSS
- Exposição de secrets

Co-Authored-By: Claude <noreply@anthropic.com>"

# Relatório
git commit -m "[report] Relatório semanal 2024-W27

- 15 commits
- 3 PRs mergeados
- Cobertura de testes: 87% (+2%)"

# Documentação
git commit -m "[doc] Adiciona convenções de nomenclatura

Define padrões para:
- Arquivos (kebab-case)
- Agentes (ação-descritiva)
- Commits ([tipo] descrição)"
```

---

## Workflows

### Estrutura de um Workflow

```yaml
# 1. Metadados
name: nome-do-agente
description: |
  Descrição clara do que o agente faz.
  Pode ter múltiplas linhas.

# 2. Parâmetros (opcional)
parameters:
  - name: parametro1
    type: string
    required: true
    description: Descrição do parâmetro
    default: valor-padrão

  - name: parametro2
    type: boolean
    required: false
    description: Flag opcional

# 3. Passos
steps:
  - name: nome-do-passo
    prompt: |
      Instruções claras para o agente.
      Use {parametro1} para interpolar.
      
      Contexto: {context}

  - name: verificacao
    prompt: |
      Verifique o resultado anterior.
      Confirme que atende aos critérios.
```

### Boas Práticas

1. **Descrições claras** - Explique o propósito em 1-2 frases
2. **Parâmetros tipados** - Defina type, required, default
3. **Passos pequenos** - Divida em etapas lógicas
4. **Prompts específicos** - Seja claro nas instruções
5. **Saída estruturada** - Use schemas quando possível

### Exemplo Completo

```yaml
name: code-review
description: |
  Executa revisão de código em múltiplas dimensões:
  bugs, segurança, performance e legibilidade.

parameters:
  - name: target
    type: string
    required: false
    default: "git diff"
    description: Alvo da análise (arquivo, diretório, ou git diff)

  - name: focus
    type: string
    required: false
    default: "all"
    description: Foco específico (all, security, performance)

steps:
  - name: scan
    prompt: |
      Analise o código: {target}
      Foco: {focus}
      
      Identifique problemas e categorize por severidade:
      - 🔴 Crítico
      - 🟡 Importante  
      - 🟢 Sugestão

  - name: consolidate
    prompt: |
      Consolid os achados em formato estruturado.
      Priorize por impacto e facilidade de correção.
```

---

## Documentação

### README de Agentes

Todo agente deve ter documentação em `agents/[nome]/README.md`:

```markdown
# nome-do-agente

## Propósito
Um parágrafo explicando o que o agente faz.

## Como Funciona
Breve descrição da lógica interna.

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| target | string | Não | git diff | Alvo da análise |

## Exemplos de Uso

### Básico
```bash
claude "execute nome-do-agente"
```

### Avançado
```bash
claude "execute nome-do-agente --target=src/api.ts --focus=security"
```

## Output

Descrição do formato de saída.

## Histórico de Versões

- 1.0.0 (2024-07-07) - Versão inicial
```

---

## Git

### Branches

Use prefixos para organização:

```
main                    # Branch principal
├── feature/[nome]       # Novas funcionalidades
├── agent/[nome]         # Novos agentes
├── fix/[nome]          # Correções
├── report/[periodo]    # Relatórios
└── docs/[assunto]      # Documentação
```

Exemplos:
- `feature/github-integration`
- `agent/security-audit`
- `report/2024-week27`
- `docs/api-reference`

### .gitignore

```gitignore
# Claude Code
.claude/memory/
.claude/cache/
*.log

# Relatórios processados (manter templates)
reports/*/processed/

# Dados sensíveis
.env
.env.local
secrets.json

# Temporários
*.tmp
.temp/
cache/
```

---

## Qualidade

### Antes de Commit

- [ ] Testei o agente/workflow
- [ ] Documentei no catálogo
- [ ] Segui as convenções de nomenclatura
- [ ] Mensagem de commit clara
- [ ] Não incluí arquivos desnecessários

### Checklist de Agentes

- [ ] Workflow funciona isoladamente
- [ ] Parâmetros bem definidos
- [ ] Prompts claros e específicos
- [ ] Documentação completa
- [ ] Exemplos de uso funcionam

---

## Memória

### Tipos

- **user** - Preferências pessoais
- **project** - Decisões do projeto
- **feedback** - Correções aprendidas
- **reference** - Links e recursos

### Formato

```markdown
---
name: nome-da-memoria
description: Uma linha sobre o que é
metadata:
  type: user | project | feedback | reference
---

Conteúdo detalhado.

**Por que:** Explicação da importância

**Como aplicar:** Instruções práticas

Relacionado: [[outra-memoria]]
```

---

**Atualizado em:** 2024-07-07  
**Versão:** 1.0

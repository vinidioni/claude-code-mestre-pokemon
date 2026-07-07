# 🤖 Catálogo de Agentes

Este diretório documenta todos os agentes disponíveis no repositório DCC.

## Índice

- [Como Usar](#como-usar)
- [Agentes Disponíveis](#agentes-disponíveis)
  - [Análise e Qualidade](#análise-e-qualidade-)
  - [Documentação](#documentação-)
  - [Relatórios](#relatórios-)
  - [Automação](#automação-)
- [Criando Novos Agentes](#criando-novos-agentes)

---

## Como Usar

### Via Claude Code (Interativo)
```bash
claude "execute o agente de code-review"
claude "execute o agente report-weekly --period=2024-01"
```

### Via Workflow (Direto)
```bash
claude workflow run .claude/workflows/agents/code-review.yaml
```

### Com Parâmetros
```bash
# Passando contexto adicional
claude "execute code-review focando em segurança no arquivo src/auth.ts"
```

---

## Agentes Disponíveis

### Análise e Qualidade 🔍

#### `code-review`
**Propósito:** Revisão completa de código com foco em múltiplas dimensões.

**Dimensões analisadas:**
- 🐛 Bugs e lógica
- 🔒 Segurança
- ⚡ Performance
- 🧪 Testabilidade
- 📖 Legibilidade

**Uso:**
```bash
# Revisar mudanças não commitadas
claude "execute code-review"

# Revisar arquivo específico
claude "execute code-review no arquivo src/api.ts"

# Foco em segurança
claude "execute code-review --focus=security"
```

**Local:** [`.claude/workflows/agents/code-review.yaml`](../.claude/workflows/agents/code-review.yaml)  
**Docs:** [`code-review/README.md`](./code-review/README.md)

---

#### `security-audit`
**Propósito:** Auditoria focada em vulnerabilidades de segurança.

**Detecta:**
- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF
- Exposição de dados sensíveis
- Dependências vulneráveis

**Uso:**
```bash
claude "execute security-audit"
claude "execute security-audit no diretório src/"
```

---

### Documentação 📝

#### `doc-generator`
**Propósito:** Gera documentação automaticamente a partir do código.

**Capacidades:**
- README.md a partir da estrutura
- Documentação de API (OpenAPI/Swagger)
- Changelogs a partir de commits
- Comentários JSDoc/TSDoc

**Uso:**
```bash
# Gerar README
claude "execute doc-generator --type=readme"

# Documentar API
claude "execute doc-generator --type=api-docs"

# Changelog
claude "execute doc-generator --type=changelog --since=v1.0.0"
```

**Local:** [`.claude/workflows/agents/doc-generator.yaml`](../.claude/workflows/agents/doc-generator.yaml)  
**Docs:** [`doc-generator/README.md`](./doc-generator/README.md)

---

### Relatórios 📊

#### `report-weekly`
**Propósito:** Gera relatório semanal de atividades do desenvolvimento.

**Inclui:**
- Commits e mudanças
- PRs abertos/mergeados
- Issues resolvidas
- Métricas de código (linhas, complexidade)
- Análise de tendências

**Output:** `reports/YYYY-MM/report-weekly-YYYY-MM-DD.md`

**Uso:**
```bash
# Relatório da semana atual
claude "execute report-weekly"

# Relatório de período específico
claude "execute report-weekly --week=2024-W01"
```

**Local:** [`.claude/workflows/reports/report-weekly.yaml`](../.claude/workflows/reports/report-weekly.yaml)  
**Docs:** [`report-generator/README.md`](./report-generator/README.md)

---

#### `report-project-health`
**Propósito:** Análise de saúde geral do projeto.

**Métricas:**
- Cobertura de testes
- Débito técnico
- Dependências desatualizadas
- Complexidade ciclomática
- Code smells

**Uso:**
```bash
claude "execute report-project-health"
claude "execute report-project-health --output=html"
```

---

### Automação ⚙️

#### `refactor-suggester`
**Propósito:** Sugere refatorações baseadas em padrões.

**Capacidades:**
- Detecta código duplicado
- Sugere extração de funções
- Identifica oportunidades de otimização
- Propõe modernização (ex: callbacks → async/await)

**Uso:**
```bash
# Analisar todo o projeto
claude "execute refactor-suggester"

# Foco em arquivo específico
claude "execute refactor-suggester --file=src/utils.ts"
```

---

## Criando Novos Agentes

### Passo a Passo

1. **Crie o workflow** em `.claude/workflows/agents/`:
```yaml
# .claude/workflows/agents/meu-agente.yaml
name: meu-agente
description: O que este agente faz

parameters:
  - name: parametro1
    type: string
    required: true
    description: Descrição do parâmetro

steps:
  - name: analise
    prompt: |
      Sua tarefa é {parametro1}
      
      Contexto: {context}
      
      Execute e retorne resultado estruturado.
```

2. **Documente** em `agents/meu-agente/README.md`:
```markdown
# meu-agente

## Propósito
...

## Parâmetros
...

## Exemplos de Uso
...
```

3. **Registre** neste catálogo (`agents/README.md`)

4. **Teste**:
```bash
claude "execute meu-agente --parametro1=valor"
```

5. **Commit**:
```bash
git add .
git commit -m "[agent] Adiciona meu-agente para [propósito]"
```

### Template de Workflow

Veja o template em [`.claude/workflows/agents/_template.yaml`](../.claude/workflows/agents/_template.yaml)

---

## Compartilhando Agentes

### Dentro deste Repositório
Agentes são automaticamente disponíveis para todos que usam este repo.

### Entre Repositórios
Copie o arquivo `.claude/workflows/agents/[nome].yaml` para outro projeto.

### Distribuição
Para compartilhar publicamente:
1. Publique o YAML em um gist/repo
2. Outros podem baixar e colocar em `.claude/workflows/agents/`

---

## Roadmap de Agentes

### Planejados
- [ ] `test-generator` - Gera testes automaticamente
- [ ] `dependency-analyzer` - Análise de dependências
- [ ] `api-consistency` - Verifica consistência de APIs
- [ ] `i18n-checker` - Verifica traduções incompletas
- [ ] `accessibility-audit` - Auditoria de acessibilidade

### Ideias
- [ ] `commit-message-writer` - Sugere mensagens de commit
- [ ] `pr-description-generator` - Gera descrições de PR
- [ ] `onboarding-helper` - Ajuda novos devs no projeto

---

**Última atualização:** 2024-07-07  
**Total de agentes:** 6

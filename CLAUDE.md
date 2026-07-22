# 🎯 Repositório DCC - Central de Desenvolvimento

> **Arquitetura de Documentação em Camadas**: Este CLAUDE.md é o ponto de entrada. Para contextos específicos, consulte os CLAUDE.md em subpastas (ex: `.claude/workflows/CLAUDE.md` para criar workflows). Eles carregam automaticamente quando você navega para essas pastas.

## Propósito

Este é o repositório central para desenvolvimento, automação e geração de relatórios usando Claude Code. Aqui armazenamos:

- **Agentes reutilizáveis** - Workflows para tarefas automatizadas
- **Skills modulares** - Capacidades especializadas carregadas sob demanda
- **Relatórios** - Documentação e análises geradas
- **Templates** - Projetos e configurações base
- **Conhecimento** - Guias e boas práticas

## Estrutura do Repositório

```
dcc/
├── .claude/                    # Configurações do Claude Code
│   ├── workflows/              # Workflows reutilizáveis (ver CLAUDE.md local)
│   │   ├── agents/             # Agentes especializados
│   │   ├── reports/            # Geradores de relatórios
│   │   └── tasks/              # Tarefas automatizadas
│   ├── skills/                 # Skills modulares (ver CLAUDE.md local)
│   ├── agents/                 # Agentes especializados (subagentes)
│   ├── output-styles/          # Estilos de output customizados
│   └── memory/                 # Memória persistente (auto)
├── agents/                     # Documentação de agentes
│   ├── README.md               # Catálogo de agentes
│   └── [nome-do-agente]/       # Docs específicas por agente
├── analytics/                  # Assets analíticos
│   ├── queries/                # Queries SQL reutilizáveis
│   │   ├── data-e/             # Queries específicas Data-E
│   │   └── README.md           # Catálogo de queries
│   └── templates/              # Templates de queries
├── reports/                    # Relatórios gerados (ver CLAUDE.md local)
│   ├── YYYY-MM/                # Organizados por mês
│   └── templates/              # Templates de relatórios
├── dev/                        # Dev docs ativos (ver CLAUDE.md local)
│   ├── active/                 # Tarefas em andamento
│   └── archive/                # Tarefas concluídas
├── templates/                  # Projetos/templates base
│   ├── web-app/                # Template de web app
│   ├── api-service/            # Template de API
│   └── python-script/          # Template de script Python
├── docs/                       # Documentação geral
│   ├── guia-claude-code.md     # Guia completo
│   └── convenções.md           # Convenções do projeto
├── archive/                    # Arquivos antigos/deprecated
├── CLAUDE.md                   # Este arquivo (ponto de entrada)
└── README.md                   # Visão geral para visitantes
```

## Navegação por Contexto (Documentação em Camadas)

Esta estrutura usa **progressive disclosure**: o CLAUDE.md raiz carrega sempre, mas CLAUDE.md em subpastas carregam automaticamente quando você entra nesses contextos.

| Contexto | Arquivo | Quando Carrega |
|----------|---------|----------------|
| **Raiz** (este arquivo) | `CLAUDE.md` | Sempre - visão geral e índice |
| **Workflows** | `.claude/workflows/CLAUDE.md` | Ao criar/modificar workflows |
| **Skills** | `.claude/skills/CLAUDE.md` | Ao desenvolver skills modulares |
| **Dev Docs** | `dev/CLAUDE.md` | Ao trabalhar em tarefas multi-sessão |
| **Relatórios** | `reports/CLAUDE.md` | Ao gerar/consultar relatórios |

**Como funciona:**
1. O CLAUDE.md raiz define a arquitetura global e convenções universais
2. CLAUDE.md em subpastas herdam do raiz e adicionam detalhes específicos
3. Quando você navega para uma subpasta, o Claude combina ambos os contextos
4. Use `@file` para referenciar CLAUDE.md de outros contextos quando necessário

## Convenções

### Nomenclatura
- **Branches**: `feature/`, `fix/`, `report/`, `agent/`
- **Arquivos**: `kebab-case.ext`
- **Pastas**: `kebab-case`
- **Agentes**: Nome descritivo em camelCase
- **Skills**: Nome descritivo em camelCase

### Commits
```
[tipo] Descrição curta

Corpo detalhado se necessário

Co-Authored-By: Claude <noreply@anthropic.com>
```

Tipos:
- `[agent]` - Novo ou atualização de agente
- `[skill]` - Nova skill modular
- `[report]` - Relatório gerado
- `[template]` - Template adicionado/atualizado
- `[doc]` - Documentação
- `[chore]` - Manutenção

## Componentes Disponíveis

### 🎭 Agentes (Workflows)
Catálogo completo em [`agents/README.md`](./agents/README.md) | Detalhes em [`.claude/workflows/CLAUDE.md`](./.claude/workflows/CLAUDE.md)

Categorias:
- 🕵️ **Análise** - Code review, auditoria de segurança, performance
- 📝 **Documentação** - Geradores de docs, README, changelogs
- 🔧 **Refatoração** - Migrações, modernização de código
- 📊 **Relatórios** - Métricas, análises, dashboards
- 🧪 **Testes** - Geração de testes, cobertura, QA

### 🛠️ Skills Modulares
Documentação em [`.claude/skills/CLAUDE.md`](./.claude/skills/CLAUDE.md) | Regras em [`skill-rules.json`](./.claude/skills/skill-rules.json)

#### Skills Locais (Originais)
| Skill | Descrição | Triggers |
|-------|-----------|----------|
| `exemplo-doc` | Template de skill de exemplo | "exemplo", "template", "skill" |
| `conventional-commits` | Padrão de commits estruturados | "commit", "conventional commits" |
| `react-patterns` | Padrões React | "react", "componente", "tsx" |
| `api-design` | Design de APIs | "api", "endpoint", "rest" |
| **`cooper`** | **Integração Cooper (DiDi Docs)** | "cooper", "documento didi", "docs2" |
| `cooper-search` | Busca especializada no Cooper | "buscar no cooper", "procurar documento" |
| `cooper-read` | Leitura de documentos Cooper | "ler documento cooper", "conteúdo cooper" |
| `cooper-write` | Criação de documentos Cooper | "criar documento cooper", "salvar no cooper" |

#### Skills do Marketplace (alirezarezvani/claude-skills v2.9.0)
Instaladas em 2026-07-07:

| Skill | Categoria | Descrição | Triggers |
|-------|-----------|-----------|----------|
| `engineering-skills` | Data Eng | 32 skills: data engineering, arquitetura, backend, frontend, DevOps, segurança, AI/ML | "data engineering", "arquitetura", "backend", "devops", "AI/ML" |
| `data-quality-auditor` | Data Analytics | Auditoria de datasets: DQS scoring, análise de valores ausentes (MCAR/MAR/MNAR) | "data quality", "missing values", "DQS" |
| `statistical-analyst` | Data Analytics | Testes de hipóteses, A/B testing, cálculo amostral, intervalos de confiança | "A/B test", "significância estatística", "p-value" |
| `finance-skills` | Business Analytics | Financial analyst (DCF, valuation), SaaS metrics (ARR, MRR, LTV, CAC), forecasting | "análise financeira", "SaaS metrics", "ARR", "LTV" |
| `business-growth-skills` | Business Analytics | Customer success, sales engineering, revenue operations, contracts | "customer success", "churn", "retenção", "RFP" |
| `business-investment-advisor` | Business Analytics | ROI, IRR, NPV, payback, build vs buy, lease vs buy | "ROI", "NPV", "investimento", "capex" |

**Progressive Disclosure:** Cada skill tem SKILL.md (essencial), examples.md e advanced.md (carregados sob demanda via `@file`).

### 🤖 Subagentes Especializados
Documentação em [`.claude/agents/README.md`](./.claude/agents/README.md)

| Subagente | Propósito | Como Invocar |
|-----------|-----------|--------------|
| `planner` | Gera estrutura Dev Docs (plan.md, context.md, tasks-checklist.md) | `claude workflow run planner --name="x" --description="..."` |

Subagentes diferem de workflows: são prompts estruturados (não YAML) chamados por outros agentes para decomposição de tarefas complexas.

## Como Usar

### Executar um Workflow
```bash
# Via Claude Code direto
claude "execute o agente de code-review"

# Via comando workflow
claude workflow run code-review
```

### Usar uma Skill
```bash
# Skills ativam automaticamente com base em skill-rules.json
# Ou invoque diretamente:
claude skill run exemplo-doc
```

### Slash Commands

Comandos customizados registrados em `.claude/commands.json`:

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/dev-docs` | Gerencia documentação de desenvolvimento | `/dev-docs init <nome>` |
| `/skill` | Gerencia skills modulares | `/skill list` ou `/skill run <nome>` |
| `/workflow` | Executa workflows de agentes | `/workflow <nome-do-workflow>` |

**Exemplos:**
```bash
/dev-docs init implementar-auth    # Cria estrutura de dev docs
/dev-docs status                   # Lista tarefas ativas
/dev-docs continue implementar-auth # Carrega contexto

/skill list                        # Lista skills disponíveis
/skill run conventional-commits    # Ativa skill específica

/workflow code-review              # Executa workflow
```

Para criar novos comandos, veja `.claude/commands/_template.md`.

### Criar um Novo Workflow
1. Consulte [`.claude/workflows/CLAUDE.md`](./.claude/workflows/CLAUDE.md) para o padrão
2. Use o template `_template.yaml`
3. Documente em `agents/[nome]/README.md`
4. Adicione ao catálogo em `agents/README.md`
5. Commit com tag `[agent]`

### Criar uma Nova Skill
1. Consulte [`.claude/skills/CLAUDE.md`](./.claude/skills/CLAUDE.md)
2. Crie a pasta em `.claude/skills/[nome-da-skill]/`
3. Adicione regra em `skill-rules.json`
4. Commit com tag `[skill]`

### Iniciar Tarefa com Dev Docs

Para tarefas complexas (multi-sessão, multi-pessoa):

```bash
# Cria estrutura completa em dev/active/
/dev-docs init nome-da-tarefa

# Ou via workflow:
claude workflow run planner --name="nome" --description="..."
```

Isso cria:
- `plan.md` - Estratégia e decisões
- `context.md` - Rastreamento de sessões
- `tasks-checklist.md` - Tarefas executáveis

Veja [`dev/CLAUDE.md`](./dev/CLAUDE.md) para o fluxo completo.

## Integrações Configuradas (MCP)

### Servidores Ativos
| Servidor | Descrição | Status | Documentação |
|----------|-----------|--------|--------------|
| **Google Workspace** | Gmail, Calendar, Drive | ✅ Configurado | [docs/google-workspace-setup.md](./docs/google-workspace-setup.md) |
| **Cooper** | Documentação DiDi (DiDi Docs) | ✅ Configurado | [mcp-servers/cooper/README.md](./mcp-servers/cooper/README.md) |
| **D-Chat** | Mensagens via CLI `dws` | ✅ Configurado | [mcp-servers/dchat/v2/README.md](./mcp-servers/dchat/v2/README.md) |
| **Gattaran** | Order Management Viewer | 🟡 MVP implementado | [mcp-servers/gattaran/README.md](./mcp-servers/gattaran/README.md) |
| **GitHub** | Issues, PRs, repositórios | ⚙️ Via npx | [docs/mcp-setup-guide.md](./docs/mcp-setup-guide.md) |

### Adicionar Novas Integrações
Edite `.mcp.json` seguindo o padrão documentado na seção [MCP / Integrações](#mcp--integrações) abaixo.

Exemplo comum: GitHub, PostgreSQL, Slack, Discord.

## Comandos Úteis

```bash
# Listar todos os agentes disponíveis
ls .claude/workflows/agents/

# Executar workflow específico
claude workflow run .claude/workflows/agents/code-review.yaml

# Ver status dos MCP servers
claude mcp status
```

## Roadmap de Infraestrutura

### Fase 1: Fundação ✅
- [x] Estrutura de pastas
- [x] CLAUDE.md central com documentação em camadas
- [x] Documentação base

### Fase 2: Infraestrutura Avançada ✅
- [x] **CLAUDE.md em camadas** - Contexto hierárquico por subpasta
- [x] **Skills modulares** - `.claude/skills/` com progressive disclosure
- [x] **Hooks de automação** - PreToolUse e segurança
- [x] **Agentes/Subagentes** - Especializados em `.claude/agents/`
- [x] **Slash Commands** - Comandos customizados
- [x] **Dev Docs System** - Continuidade entre sessões

### Fase 3: Agentes Core
- [x] Agente de Code Review
- [x] Agente de Documentação
- [x] Agente de Segurança
- [ ] Agente de Relatórios (avançado)

### Fase 4: Integrações
- [x] Google Workspace
- [ ] GitHub MCP
- [ ] Jira/Linear
- [ ] Notificações automáticas

### Fase 5: Automação Total
- [ ] CI/CD com agentes
- [ ] Relatórios automáticos
- [ ] Análise preditiva

---

## Status da Infraestrutura

```
┌────────────────────────────────────────────────────────┐
│  DCC Claude Infrastructure v1.0.0                      │
├────────────────────────────────────────────────────────┤
│  Bloco 1: CLAUDE.md em camadas              ✅        │
│  Bloco 2: Skills modulares                    ✅        │
│  Bloco 3: Hooks de automação             ✅        │
│  Bloco 4: Agentes/Subagentes              ✅        │
│  Bloco 5: Slash Commands                     ✅        │
│  Bloco 6: Sistema de Dev Docs             ✅        │
│  Bloco 7: Plugin/distribuição               ✅        │
│  Bloco 8: MCP / integrações                 ✅        │
│  Bloco 9: Log de sessão                    ✅        │
│  Bloco 10: Output Style e Status Line   ✅        │
├────────────────────────────────────────────────────────┤
│  Infraestrutura completa e pronta para uso!           │
└────────────────────────────────────────────────────────┘
```

---

## MCP / Integrações

O arquivo `.mcp.json` configura servidores MCP (Model Context Protocol) que estendem as capacidades do Claude Code.

### Estrutura do `.mcp.json`

```json
{
  "mcpServers": {
    "nome-do-servidor": {
      "command": "comando-do-servidor",
      "args": ["--flag", "valor"],
      "env": {
        "VARIAVEL": "valor"
      }
    }
  }
}
```

### Exemplo: Adicionar GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Nota:** Use variáveis de ambiente para tokens - nunca commite credenciais.

### Servidores MCP Comuns

| Servidor | Instalação | Uso |
|----------|------------|-----|
| GitHub | `npx -y @modelcontextprotocol/server-github` | Issues, PRs, repositórios |
| PostgreSQL | `npx -y @modelcontextprotocol/server-postgres` | Consultas ao banco |
| Slack | `npx -y @modelcontextprotocol/server-slack` | Mensagens, canais |
| Puppeteer | `npx -y @modelcontextprotocol/server-puppeteer` | Automação web |

**Lista completa:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

**Guia detalhado:** Veja [`docs/mcp-setup-guide.md`](./docs/mcp-setup-guide.md) para instruções passo-a-passo de como adicionar GitHub, PostgreSQL, Slack e outros MCPs.

### Configuração Local

Para configurações pessoais (não compartilháveis), use `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["google-workspace", "github"],
  "permissions": {
    "allow": ["Bash(git *)", "Bash(gh *)"]
  }
}
```

## Contribuição

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Faça suas alterações
3. Teste o agente/workflow
4. Commit com mensagem clara
5. Abra PR (se houver remote configurado)

## Output Styles

Estilos de output personalizados em `.claude/output-styles/`:

| Estilo | Arquivo | Uso |
|--------|---------|-----|
| **Direto e Organizado** | `direto-e-organizado.md` | Respostas enxutas, foco no resultado |

### Como Usar

**Mencionar no início da sessão:**
```
Use o estilo "Direto e Organizado" para esta sessão.
```

**Ou configurar em `.claude/settings.json`:**
```json
{
  "outputStyle": "direto-e-organizado"
}
```

### Criar Novo Estilo

1. Crie arquivo em `.claude/output-styles/nome-do-estilo.md`
2. Use frontmatter com `name` e `description`
3. Defina regras claras de comunicação
4. Teste com o Claude

Veja `.claude/output-styles/direto-e-organizado.md` como template.

## Memórias

O Claude mantém memórias em `.claude/memory/` sobre:
- Preferências de estilo de código
- Decisões arquiteturais
- Feedbacks passados

Consulte `MEMORY.md` para o índice de memórias.

---

## Distribuição e Instalação

### Instalar em Novo Repositório

Para usar esta infraestrutura em outro projeto:

```bash
# Clone o repositório
git clone https://github.com/seu-org/dcc-claude-infrastructure.git
cd dcc-claude-infrastructure

# Execute o instalador
node scripts/install.js /caminho/do/seu/projeto

# Ou instale no diretório atual
node scripts/install.js
```

O instalador irá:
1. Copiar estrutura `.claude/` completa
2. Criar diretórios `dev/` e `reports/`
3. Mergear ou criar `CLAUDE.md` raiz
4. Criar `.gitignore` adequado

### Validar Instalação

```bash
node scripts/validate.js
```

Verifica se todos os componentes estão presentes e configurados corretamente.

### Estrutura do Pacote

| Componente | Destino | Descrição |
|------------|---------|-----------|
| Workflows | `.claude/workflows/` | Agentes YAML |
| Skills | `.claude/skills/` | Conhecimento modular |
| Hooks | `.claude/hooks/` | Automação e segurança |
| Agents | `.claude/agents/` | Subagentes especializados |
| Commands | `.claude/commands/` | Slash commands |
| Dev Docs | `dev/` | Sistema de continuidade |
| Reports | `reports/` | Relatórios gerados |

### Atualização

Para atualizar a infraestrutura em um projeto existente:

```bash
# Re-execute o instalador (faz backup automático)
node scripts/install.js /caminho/do/projeto --update
```

---

## Hooks e Automação

Hooks são scripts que interceptam eventos do Claude Code para automação e segurança.

### Hooks Configurados

| Hook | Arquivo | Função |
|------|---------|--------|
| **PreToolUse** | `.claude/hooks/pre-tool-use.js` | Verifica skills relevantes antes de ações, sugere contexto adicional, valida parâmetros críticos |
| **Security** | `.claude/hooks/security-check.js` | Detecta instruções maliciosas injetadas em CLAUDE.md/skills/prompts |

### PreToolUse Hook

Este hook resolve o problema de skills não ativarem automaticamente ao analisar o contexto da ferramenta e sugerir skills relevantes baseadas em `skill-rules.json`.

**Funcionalidades:**
- Detecta triggers de skills no contexto da ação
- Sugere até 3 skills mais relevantes
- Valida comandos Bash potencialmente perigosos
- Alerta sobre modificação de arquivos sensíveis

### Security Check Hook

Detecta padrões de injeção maliciosa em arquivos e prompts.

**Padrões detectados:**
- Instruções para ignorar diretrizes (`ignore all previous instructions`)
- Tentativas de jailbreak (`DAN mode`, modo desenvolvedor)
- Instruções ocultas em comentários
- Comandos ofuscados (`eval`, `base64 decode`)
- Tentativas de exfiltração de dados

**Níveis de severidade:**
- 🔴 **Critical**: Bloqueia a ação
- 🟠 **High**: Alerta forte
- 🟡 **Medium**: Alerta moderado
- ⚪ **Low**: Observação

### Como Funcionam

Os hooks são carregados automaticamente pelo Claude Code quando presentes em `.claude/hooks/`. Eles interceptam eventos antes da execução e podem:
- Emitir avisos
- Sugerir contexto adicional
- Bloquear ações suspeitas (critical)
- Registrar logs para auditoria

---

## Configurações do Ambiente

### Status Line

Configurado em `.claude/settings.json`:
```json
{
  "statusLine": {
    "format": "[{cwd}] [{gitBranch}] [{model}]"
  }
}
```

Mostra:
- `[~/.claude/dcc]` - Diretório atual (home como ~)
- `[main]` - Branch git atual
- `[sonnet]` - Modelo em uso

### Observabilidade / Logs de Sessão

O Claude Code fornece informações de uso ao final de cada sessão interativa:

```
Sessão concluída.
Tokens: 15,234 input | 8,901 output
Custo estimado: $0.23
Cache hit rate: 45%
```

**Para logs detalhados:**
```bash
# Logs do Claude Code
ls ~/.claude/logs/

# Estatísticas de uso
claude stats

# Histórico de sessões
claude history
```

**Métricas disponíveis:**
| Métrica | Descrição |
|---------|-----------|
| Input tokens | Tokens enviados para a API |
| Output tokens | Tokens gerados pelo modelo |
| Cache hit rate | % de tokens lidos do cache |
| Custo estimado | Valor aproximado em USD |
| Tempo de resposta | Latência média por requisição |

**Otimizando custos:**
- Use `cache` quando disponível (mesmo contexto entre chamadas)
- Quebre tarefas grandes em sessões menores
- Use modelos menores para tarefas simples (haiku vs sonnet)

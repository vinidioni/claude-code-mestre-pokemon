# 🗂️ Organização do Repositório DCC

Este documento explica a estrutura e propósito de cada diretório do repositório.

---

## Visão Geral

```
dcc/                                  ← RAIZ DO REPOSITÓRIO
│
├── 📄 README.md                      ← Cartão de visitas do projeto
├── 📄 CLAUDE.md                      ← Cérebro do projeto (contexto para Claude)
├── 📄 MEMORY.md                      ← Índice de memórias persistentes
├── 📄 .gitignore                     ← Arquivos ignorados pelo git
│
├── 📁 .claude/                       ← ⚙️ CONFIGURAÇÕES DO CLAUDE CODE
│   ├── 📁 workflows/                 ← 🤖 AGENTES E AUTOMATIZAÇÕES
│   │   ├── 📁 agents/                ← Agentes reutilizáveis
│   │   ├── 📁 reports/               ← Geradores de relatórios
│   │   └── 📁 tasks/                 ← Tarefas pontuais
│   ├── 📁 memory/                    ← Memórias persistentes (auto)
│   └── 📄 settings.local.json        ← Configurações locais
│
├── 📁 agents/                        ← 📚 DOCUMENTAÇÃO DE AGENTES
│   ├── 📄 README.md                  ← Catálogo de agentes disponíveis
│   ├── 📁 code-review/               ← Docs do agente code-review
│   ├── 📁 doc-generator/             ← Docs do agente doc-generator
│   └── 📁 report-generator/          ← Docs de relatórios
│
├── 📁 docs/                          ← 📖 DOCUMENTAÇÃO GERAL
│   ├── 📄 guia-claude-code.md        ← Guia completo do Claude Code
│   ├── 📄 convenções.md              ← Regras e convenções do projeto
│   └── 📄 organizacao.md             ← Este arquivo
│
├── 📁 reports/                       ← 📊 RELATÓRIOS GERADOS
│   └── 📁 templates/                 ← Templates para relatórios
│
├── 📁 templates/                     ← 🎨 TEMPLATES DE PROJETOS
│   ├── 📁 web-app/                   ← Template Next.js/React
│   └── 📁 api-service/               ← Template de API (vazio)
│
├── 📁 archive/                       ← 📦 ARQUIVOS ANTIGOS
│
└── 📄 .mcp.json                      ← Integrações MCP (Google Workspace)
```

---

## Raiz do Repositório

### `README.md`
**Propósito:** Cartão de visitas do projeto. Quem chega aqui entende rapidamente o que é.

**Contém:**
- Propósito do repositório
- Estrutura simplificada
- Comandos quick-start
- Lista de agentes principais

**Quando editar:**
- Ao adicionar agentes principais
- Ao mudar a estrutura base
- Ao atualizar comandos comuns

---

### `CLAUDE.md`
**Propósito:** Cérebro do projeto. É lido automaticamente pelo Claude em toda sessão.

**Contém:**
- Propósito do repositório
- Estrutura detalhada de pastas
- Convenções de nomenclatura
- Tipos de commits
- Catálogo de agentes
- Comandos úteis
- Roadmap

**Quando editar:**
- Ao criar novas categorias de agentes
- Ao mudar convenções
- Ao adicionar integrações

**⚠️ IMPORTANTE:** Este arquivo é essencial! O Claude sempre o consulta.

---

### `MEMORY.md`
**Propósito:** Índice de memórias persistentes que o Claude cria automaticamente.

**Como funciona:**
- O Claude salva memórias em `.claude/memory/`
- Este arquivo lista e organiza essas memórias
- Tipos: user, project, feedback, reference

**Quando usar:**
- Quando quiser que o Claude "lembre" de algo: "Lembre-se de usar camelCase"
- Para consultar decisões passadas

---

### `.gitignore`
**Propósito:** Define arquivos que não devem ser versionados.

**Ignora:**
- `.claude/memory/` (dados locais)
- Arquivos de log e cache
- Dados sensíveis (.env, secrets)
- Dependências (node_modules)

---

## `.claude/` - Configurações do Claude Code

### `workflows/` - Automatizações

#### `workflows/agents/` - Agentes Reutilizáveis

Agentes são workflows parametrizáveis que resolvem tarefas específicas.

**Arquivos:**

| Arquivo | Propósito | Como usar |
|---------|-----------|-----------|
| `_template.yaml` | Template base para criar novos agentes | Copie e modifique |
| `code-review.yaml` | Revisa código (bugs, segurança, performance) | `claude "execute code-review"` |
| `doc-generator.yaml` | Gera documentação automaticamente | `claude "execute doc-generator --type=readme"` |
| `security-audit.yaml` | Auditoria de vulnerabilidades | `claude "execute security-audit"` |

**Estrutura de um agente:**
```yaml
name: nome-do-agente           ← Identificador
description: |
  Descrição do que faz        ← Para o usuário entender

parameters:                    ← Parâmetros aceitos
  - name: parametro1
    type: string
    required: true
    default: "valor"

steps:                         ← Passos de execução
  - name: passo1
    prompt: |
      Instruções para o Claude

settings:                      ← Configurações
  model: sonnet
  save_output: true
  output_path: "reports/..."
```

#### `workflows/reports/` - Geradores de Relatórios

Relatórios são workflows especializados em gerar documentos periódicos.

**Arquivos:**

| Arquivo | Propósito | Saída |
|---------|-----------|-------|
| `report-weekly.yaml` | Relatório semanal de atividades | `reports/2024-07/weekly-report-W27.md` |

**Diferença entre agentes e reports:**
- **Agentes:** Tarefas genéricas (review, audit)
- **Reports:** Documentos periódicos com data/hora

#### `workflows/tasks/` - Tarefas Pontuais

**Propósito:** Scripts de uma única execução.

**Exemplos futuros:**
- Migração de dados
- Renomeação em massa
- Limpeza de arquivos temporários

---

### `memory/` - Memórias Persistentes

**Propósito:** Armazena informações que o Claude deve lembrar entre sessões.

**Local:** `.claude/memory/` (não commitado no git)

**Formato:**
```markdown
---
name: preferencia-codigo
description: Prefere arrow functions
metadata:
  type: user
---

Sempre usar arrow functions ao invés de function declarations.

**Por que:** Mais conciso, não tem hoisting problemático.

**Como aplicar:** Substituir `function foo()` por `const foo = () =>`
```

**Tipos de memória:**
- `user` - Preferências pessoais
- `project` - Decisões arquiteturais
- `feedback` - Correções recebidas
- `reference` - Links e recursos

---

### `settings.local.json`

**Propósito:** Configurações locais do Claude Code.

**Atual:**
```json
{
  "enabledMcpjsonServers": ["google-workspace"],
  "enableAllProjectMcpServers": true
}
```

**O que faz:**
- Habilita integração com Google Workspace (Gmail, Calendar, Drive)
- Permite que MCP servers do projeto sejam usados

---

## `agents/` - Documentação de Agentes

**Propósito:** Documentação detalhada de cada agente disponível.

**Por que separar:**
- Workflows (`workflows/agents/`) = código executável
- Documentação (`agents/`) = guia de uso

**Estrutura por agente:**
```
agents/
├── README.md                    ← Catálogo de todos os agentes
├── code-review/
│   └── README.md               ← Uso, parâmetros, exemplos
├── doc-generator/
│   └── README.md               ← Uso, parâmetros, exemplos
└── report-generator/
    └── README.md               ← Uso, parâmetros, exemplos
```

**O que contém cada README:**
- Propósito do agente
- Como usar (básico e avançado)
- Tabela de parâmetros
- Exemplos de output
- Integração com CI/CD
- Limitações

---

## `docs/` - Documentação Geral

**Propósito:** Documentação sobre o próprio repositório e ferramentas.

**Arquivos:**

| Arquivo | Conteúdo |
|---------|----------|
| `guia-claude-code.md` | Guia completo de como usar o Claude Code |
| `convenções.md` | Regras de nomenclatura, commits, workflows |
| `organizacao.md` | Este arquivo - explicação da estrutura |

**Diferença de `CLAUDE.md`:**
- `CLAUDE.md` = Contexto do projeto (lido pelo Claude)
- `docs/` = Referência para humanos

---

## `reports/` - Relatórios Gerados

**Propósito:** Armazenar saídas dos agentes de relatório.

**Estrutura:**
```
reports/
├── 2024-07/                    ← Organizado por mês
│   ├── weekly-report-W27.md
│   ├── weekly-report-W28.md
│   ├── security-audit-2024-07-15.md
│   └── code-review-2024-07-20.md
├── 2024-08/
│   └── ...
└── templates/                  ← Templates de formatação
    ├── weekly-template.md
    └── audit-template.md
```

**Benefícios:**
- Histórico de análises
- Rastreamento de evolução
- Compartilhamento fácil

---

## `templates/` - Templates de Projetos

**Propósito:** Projetos base prontos para copiar e começar.

**Estrutura:**
```
templates/
├── web-app/                    ← Template Next.js/React
│   └── exemplo-projeto/
│       └── .claude/
│           └── CLAUDE.md       ← Contexto específico do template
├── api-service/                ← Template de API (vazio, pronto)
└── python-script/              ← (pode criar)
```

**Como usar:**
```bash
# Copiar template para novo projeto
cp -r templates/web-app/exemplo-projeto ~/projetos/meu-novo-site

# Ou usar como referência
```

---

## `archive/` - Arquivos Antigos

**Propósito:** Armazenar arquivos descontinuados sem deletar.

**Quando usar:**
- Versões antigas de agentes
- Relatórios muito antigos
- Experimentos abandonados

**Diferente de deletar:**
- Mantém histórico
- Pode recuperar se necessário
- Não polui os diretórios ativos

---

## `.mcp.json` - Integrações MCP

**Propósito:** Configura integrações com serviços externos.

**Atual:**
```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "mcp-server-google-workspace",
      "args": [],
      "env": {
        "GOOGLE_REDIRECT_URI": "http://localhost:3000/oauth2callback"
      }
    }
  }
}
```

**O que habilita:**
- Acesso ao Gmail
- Acesso ao Google Calendar
- Acesso ao Google Drive
- Envio de emails automatizados

---

## Fluxo de Trabalho Típico

### 1. Usar um Agente Existente
```bash
# Executar agente
claude "execute code-review --target=src/"

# Output salvo automaticamente em reports/
```

### 2. Criar um Novo Agente
```bash
# 1. Copiar template
cp .claude/workflows/agents/_template.yaml \
   .claude/workflows/agents/meu-agente.yaml

# 2. Editar o YAML

# 3. Criar documentação
mkdir agents/meu-agente
touch agents/meu-agente/README.md

# 4. Adicionar ao catálogo
# (editar agents/README.md)

# 5. Testar
claude "execute meu-agente"

# 6. Commit
# git add .
# git commit -m "[agent] Adiciona meu-agente"
```

### 3. Gerar Relatório
```bash
# Gerar e salvar
claude "execute report-weekly"

# Output: reports/2024-07/weekly-report-W27.md
```

---

## Convenções Importantes

### Nomenclatura
- Pastas/arquivos: `kebab-case`
- Agentes: nome descritivo da ação
- Commits: `[tipo] descrição`

### Commits
```
[agent]    Novo ou atualização de agente
[report]   Relatório gerado
[template] Template adicionado
[doc]      Documentação
[chore]    Manutenção
[fix]      Correção
```

### Gitignore
Nunca commitar:
- `.claude/memory/` (dados locais)
- `reports/*/processed/` (processados)
- Arquivos de secrets

---

## Checklist de Manutenção

### Semanal
- [ ] Revisar relatórios gerados em `reports/`
- [ ] Verificar se há memórias novas em `.claude/memory/`

### Mensal
- [ ] Atualizar catálogo em `agents/README.md`
- [ ] Revisar documentação em `docs/`
- [ ] Arquivar relatórios antigos (mover para `archive/`)

### Novo Agente
- [ ] Criar workflow em `.claude/workflows/agents/`
- [ ] Criar documentação em `agents/[nome]/README.md`
- [ ] Adicionar ao catálogo em `agents/README.md`
- [ ] Adicionar ao `CLAUDE.md` se for agente principal
- [ ] Testar antes de commitar
- [ ] Commitar com tag `[agent]`

---

## Resumo Visual

```
┌─────────────────────────────────────────────────────────┐
│  RAIZ (entry points)                                    │
│  ├── README.md        → Para humanos conhecerem         │
│  ├── CLAUDE.md        → Para o Claude entender          │
│  └── MEMORY.md        → Índice de memórias              │
├─────────────────────────────────────────────────────────┤
│  .claude/ (executáveis)                                 │
│  ├── workflows/agents/    → Código dos agentes          │
│  ├── workflows/reports/   → Geradores de relatórios     │
│  └── memory/              → Dados persistentes          │
├─────────────────────────────────────────────────────────┤
│  agents/ (documentação)                                 │
│  └── [nome]/README.md     → Como usar cada agente       │
├─────────────────────────────────────────────────────────┤
│  docs/ (referência)                                     │
│  └── *.md                 → Guias e convenções          │
├─────────────────────────────────────────────────────────┤
│  reports/ (saídas)                                      │
│  └── YYYY-MM/*.md         → Relatórios gerados          │
├─────────────────────────────────────────────────────────┤
│  templates/ (projetos base)                             │
│  └── [tipo]/              → Copiar para novos projetos  │
└─────────────────────────────────────────────────────────┘
```

---

**Última atualização:** 2024-07-07

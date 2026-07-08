# DCC - Claude Code Infrastructure

> Infraestrutura completa para trabalho com Claude Code em equipe. Workflows, Skills, MCPs e automações.

## 🚀 Começando (Setup do Zero)

### 1. Clone e Entre no Diretório

```bash
git clone https://github.com/vinidioni/claude-code-mestre-pokemon.git dcc
cd dcc
```

### 2. Execute o Setup Automático

**Windows (PowerShell como Admin):**
```powershell
.\scripts\setup.ps1
```

**macOS/Linux:**
```bash
bash scripts/setup.sh
```

### 3. Configure suas Credenciais

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais
# - GitHub Token: https://github.com/settings/tokens
# - Google Workspace: opcional (veja docs/)
# - D-Chat: opcional (apenas funcionários DiDi/99)
```

### 4. Verifique a Instalação

```bash
node scripts/verify-setup.js
```

### 5. Comece a Usar

```bash
claude
```

---

## 📋 Requisitos

| Ferramenta | Versão | Obrigatório |
|------------|--------|-------------|
| [Node.js](https://nodejs.org) | 18+ | ✅ |
| [Python](https://python.org) | 3.10+ | ✅ |
| [Git](https://git-scm.com) | 2.40+ | ✅ |
| [Claude Code](https://claude.ai/code) | latest | ✅ |

Veja [SETUP.md](SETUP.md) para instruções detalhadas.

## 📦 O que está incluído

| Componente | Descrição | Local |
|------------|-----------|-------|
| **Workflows** | Agentes reutilizáveis (code review, security audit, etc.) | `.claude/workflows/` |
| **Skills** | Conhecimento modular com ativação automática | `.claude/skills/` |
| **Hooks** | Automação (PreToolUse) e segurança | `.claude/hooks/` |
| **Subagentes** | Agentes especializados (planner) | `.claude/agents/` |
| **Slash Commands** | Atalhos (`/dev-docs`, `/skill`, `/workflow`) | `.claude/commands.json` |
| **Dev Docs** | Sistema de continuidade entre sessões | `dev/` |
| **Output Styles** | Estilos de comunicação customizados | `.claude/output-styles/` |

## 🎯 Recursos Principais

### 1. Documentação em Camadas

CLAUDE.md específicos carregam automaticamente por contexto:
- `CLAUDE.md` (raiz) - Visão geral
- `.claude/workflows/CLAUDE.md` - Como criar workflows
- `.claude/skills/CLAUDE.md` - Como criar skills
- `dev/CLAUDE.md` - Sistema de Dev Docs

### 2. Skills Modulares

Sistema de progressive disclosure:
```bash
# Skills ativam automaticamente com base em palavras-chave
# ou invoque diretamente:
/skill run conventional-commits
```

### 3. Dev Docs System

Para tarefas complexas multi-sessão:
```bash
/dev-docs init minha-feature
# Cria: plan.md, context.md, tasks-checklist.md
```

### 4. Hooks de Segurança

- **PreToolUse**: Sugere skills relevantes antes de ações
- **Security Check**: Detecta instruções maliciosas injetadas

## 📚 Documentação

- **[CLAUDE.md Principal](CLAUDE.md)** - Documentação completa da infraestrutura
- [Guia de Instalação MCP](docs/mcp-setup-guide.md) - Como adicionar MCPs (GitHub, PostgreSQL, etc.)
- [Configuração Google Workspace](docs/google-workspace-setup.md) - Integração com Gmail/Calendar/Drive
- [Convenções do Projeto](docs/convenções.md) - Padrões de nomenclatura e commits
- [Guia Claude Code](docs/guia-claude-code.md) - Uso geral do Claude Code

## 🛠️ Comandos Úteis

```bash
# Listar workflows disponíveis
ls .claude/workflows/agents/

# Executar workflow
claude workflow run code-review

# Criar dev docs para tarefa complexa
/dev-docs init nome-da-tarefa

# Ver tarefas ativas
/dev-docs status

# Validar infraestrutura
node scripts/validate.js
```

## 🔧 Personalização

### Adicionar um Novo Workflow

1. Copie `.claude/workflows/agents/_template.yaml`
2. Edite nome, descrição e steps
3. Teste: `claude workflow run meu-workflow`

### Adicionar uma Nova Skill

1. Crie `.claude/skills/minha-skill/SKILL.md`
2. Adicione regra em `skill-rules.json`
3. Teste ativação automática

### Adicionar MCP (Integração)

Edite `.mcp.json`:
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

Veja [docs/mcp-setup-guide.md](docs/mcp-setup-guide.md) para mais exemplos.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│  Camada de Interface                                     │
│  - Slash Commands (/dev-docs, /skill, /workflow)        │
├─────────────────────────────────────────────────────────┤
│  Camada de Automação                                     │
│  - Workflows (YAML) - Processos completos               │
│  - Subagentes (MD) - Raciocínio adaptativo              │
├─────────────────────────────────────────────────────────┤
│  Camada de Conhecimento                                  │
│  - Skills (Progressive Disclosure)                      │
│  - Dev Docs (Continuidade)                              │
├─────────────────────────────────────────────────────────┤
│  Camada de Segurança                                     │
│  - PreToolUse Hook (Sugestões)                          │
│  - Security Hook (Detecção de injeção)                  │
├─────────────────────────────────────────────────────────┤
│  Camada de Integração                                    │
│  - MCP Servers (Google, GitHub, etc.)                   │
└─────────────────────────────────────────────────────────┘
```

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Faça alterações seguindo [convenções](docs/convenções.md)
3. Execute `node scripts/validate.js`
4. Commit com tag apropriada: `[agent]`, `[skill]`, `[doc]`, etc.
5. Abra PR

## 📄 Licença

MIT - Livre para uso e modificação.

---

**DCC Claude Infrastructure v1.0.0** | [Validação: 24/24 ✅](scripts/validate.js)

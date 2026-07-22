# DCCrazy - Kit de Ferramentas para DCC

> Extensão de workflows, skills e automações para o DCC (Claude Code Infrastructure).

**O que é:**
- **DCC** = Repositório base com estrutura, convenções e documentação
- **DCCrazy** = Kit de ferramentas (workflows, skills, scripts) que adicionamos por cima

**Autor:** Vinicius Castanho (viniciuscastanho@didiglobal.com)

---

## 🔗 Primeira Vez Aqui? (Recebeu o Link)

Se alguém te enviou o link deste repositório, [clique aqui](#-recebeu-o-link-do-repositório-1) para ver como usar o DCCrazy.

Ou continue lendo para entender tudo sobre o projeto.

---

## 🎯 Índice

1. [O que é o DCCrazy](#o-que-é-o-dccrazy)
2. [Recebeu o link do repositório?](#-recebeu-o-link-do-repositório-1)
3. [Começando (Setup do Zero)](#-começando-setup-do-zero)
4. [O que você pode fazer](#-o-que-você-pode-fazer-com-o-dccrazy)
5. [Comandos e Convenções](#-comandos-essenciais)
6. [Documentação](#-documentação)

---

## 🎓 O Que é o DCCrazy

O DCCrazy é um **kit de ferramentas** que estende as capacidades do Claude Code (DCC) com:

- **Workflows** → Automações prontas (code review, relatórios, etc)
- **Skills** → Conhecimento especializado que ativa automaticamente
- **Dev Docs** → Sistema para não perder contexto entre sessões
- **Enciclopédia** → Mapeamento automático de tabelas do banco
- **Integrações** → Conectores para GitHub, DiDi Docs, D-Chat, etc

---

## 🔗 Recebeu o Link do Repositório?

Se alguém te enviou o link do DCCrazy no GitHub, aqui está o passo a passo para ter acesso:

### Opção 1: Quero Ter Meu Próprio DCCrazy (Recomendado)

Isso te dá acesso a todos os workflows, skills e ferramentas:

```bash
# 1. Clone o repositório
git clone https://github.com/vinidioni/claude-code-mestre-pokemon.git dccrazy
cd dccrazy

# 2. Execute o setup automático
# Windows:
.\scripts\setup.ps1
# macOS/Linux:
bash scripts/setup.sh

# 3. Configure suas credenciais (veja seção "Onde Pegar as Credenciais")
cp .env.example .env
# Edite o .env com seus tokens

# 4. Verifique a instalação
node scripts/verify-setup.js

# 5. Pronto!
claude
```

**Você terá:**
- ✅ Todos os workflows do DCCrazy
- ✅ Skills que ativam automaticamente
- ✅ Sistema de Dev Docs
- ✅ Enciclopédia de tabelas
- ✅ Scripts de backup e atualização

---

### Opção 2: Só Quero Ver/Consultar o Conteúdo

Se você só quer ver as queries, documentações ou relatorios:

1. **Acesse o GitHub diretamente:** https://github.com/vinidioni/claude-code-mestre-pokemon
2. **Navegue pelas pastas:**
   - `analytics/queries/` → Queries SQL prontas
   - `docs/` → Documentações e guias
   - `reports/` → Relatórios gerados
   - `.claude/workflows/agents/` → Workflows disponíveis

3. **Para usar:** Você pode copiar arquivos específicos manualmente, mas não terá o sistema completo funcionando.

---

### ⚠️ Importante sobre Acesso

**O repositório é público?**
- Se sim: qualquer pessoa com o link pode clonar e usar
- Se não: a pessoa precisa que você adicione ela como colaboradora no GitHub

**Para adicionar alguém como colaboradora:**
1. Vá em Settings → Manage access (no GitHub)
2. Clique em "Invite a collaborator"
3. Adicione o email/username da pessoa

---

## 📁 Por Que Pasta Local?

O DCCrazy é projetado para funcionar em **pasta local** (não Google Drive) por:

| Vantagem | Explicação |
|----------|------------|
| **Git Versionado** | Histórico completo de mudanças, branches, rollback |
| **Execução de Scripts** | Scripts Python funcionam nativamente |
| **Velocidade** | Sem latência de rede para arquivos pequenos |
| **Claude Code** | Integração nativa com a CLI |
| **MCPs** | Servidores locais (D-Chat, Cooper) funcionam melhor |

**Backup no Drive:** Oferecemos função opcional para sincronizar com Google Drive quando desejar (ver seção "Backup no Google Drive").

---

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

Veja [SETUP.md](SETUP.md) para instruções detalhadas de instalação.

---

## 🔑 Onde Pegar as Credenciais

**⚠️ Importante:** Todos os MCPs (integrações) requerem que você configure seu próprio token de acesso. O DCC não inclui credenciais pré-configuradas.

| Serviço | Onde Obter | Notas |
|---------|------------|-------|
| **GitHub** | https://github.com/settings/tokens | Token classic, scopes: `repo`, `read:user`, `read:org` |
| **Google Workspace** | https://console.cloud.google.com | Criar projeto → Ativar APIs (Gmail, Calendar, Drive) → Criar credenciais OAuth 2.0 → Baixar `client_secret.json` |
| **Cooper (DiDi Docs)** | https://mcphub.intra.xiaojukeji.com/ | Clique em **访问令牌** (token de acesso). ⚠️ **Dica:** Se criar o token e não aparecer a chave, desative o tradutor da página - o erro só aparece no idioma original |
| **D-Chat** | https://mcphub.intra.xiaojukeji.com/ | Mesmo processo do Cooper. Requer SmartWork CLI instalado |
| **Gattaran** | https://mcphub.intra.xiaojukeji.com/ | Mesmo processo do Cooper |

Após obter os tokens, configure-os no arquivo `.env` e no `.mcp.json`.

---

## 🏗️ Arquitetura do DCC

O DCC é organizado em **5 camadas** que trabalham juntas:

```
┌─────────────────────────────────────────────────────────┐
│  1. Camada de Interface                                  │
│     - Slash Commands (/dev-docs, /skill, /workflow)     │
├─────────────────────────────────────────────────────────┤
│  2. Camada de Automação                                  │
│     - Workflows (YAML) - Processos completos            │
│     - Subagentes (MD) - Raciocínio adaptativo           │
├─────────────────────────────────────────────────────────┤
│  3. Camada de Conhecimento                               │
│     - Skills (Progressive Disclosure)                   │
│     - Dev Docs (Continuidade entre sessões)             │
├─────────────────────────────────────────────────────────┤
│  4. Camada de Segurança                                  │
│     - PreToolUse Hook (Sugestões contextuais)           │
│     - Security Hook (Detecção de injeção)               │
├─────────────────────────────────────────────────────────┤
│  5. Camada de Integração                                 │
│     - MCP Servers (GitHub, Google, Cooper, etc.)        │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 O Que Você Pode Fazer com o DCC

Pergunte ao Claude no DCC usando linguagem natural:

### Integrar com Serviços Externos
**Você diz:** *"Como integro com GitHub?"* ou *"Configure o MCP para Slack"*

**O DCC faz:** Explica como configurar o `.mcp.json` e quais tokens são necessários

**MCPs disponíveis:**
| Servidor | Função | Status |
|----------|--------|--------|
| **Cooper** | Documentação DiDi (DiDi Docs) | ✅ Requer token mcphub |
| **D-Chat** | Mensagens internas DiDi | ✅ Requer token mcphub + SmartWork CLI |
| **Gattaran** | Order Management Viewer | ✅ Requer token mcphub |
| **Google Workspace** | Gmail, Calendar, Drive | ⚙️ Requer configuração OAuth |
| **GitHub** | Issues, PRs, repositórios | ⚙️ Requer token GitHub |

---

### Criar Queries Organizadas
**Você diz:** *"Crie uma query para [descrição]"*

**O DCC faz:**
1. Cria a query com cabeçalho obrigatório
2. **Pergunta:** "Esta query acessa Data-E?" → Salva em `presto/` ou `data-e/`
3. Atualiza o índice do diretório
4. Detecta tabelas novas → Atualiza a **Enciclopédia**

**Documentação:** [docs/convenção-queries.md](docs/convenção-queries.md)

---

### Consultar a Enciclopédia de Tabelas
**Você diz:** *"Quais tabelas eu já usei?"* ou *"Me mostre a estrutura da tabela X"*

**O DCC faz:** Consulta `analytics/encyclopedia/tables.json` e mostra:
- Tabelas que você já consultou
- Descrições que você adicionou
- Colunas documentadas

**Como funciona:**
- Toda query é analisada automaticamente
- Tabelas novas são adicionadas à enciclopédia
- Você pode adicionar descrições manualmente depois

**Documentação:** [docs/enciclopedia-tabelas.md](docs/enciclopedia-tabelas.md)

---

### Ensinar o DCCrazy Meus Padrões
**Você diz:** *"Sempre que eu [fazer X], sugira [Y]"*

**O DCC faz:**
1. Registra o padrão em `.claude/memory/feedback-system.md`
2. Nas próximas vezes, aplica o aprendizado

**Exemplo:**
```
Você: "Sempre use CTE ao invés de subquery nas minhas queries"
DCC: "Vou lembrar disso. Posso sugerir CTEs da próxima vez?"
Você: "Sim"
[DCC salva o feedback]

[Próxima query]
DCC: "Quer que eu use CTE para essa query?"
```

**Documentação:** [docs/sistema-feedback.md](docs/sistema-feedback.md)

---

### Automatizar uma Tarefa que Você Faz Sempre
**Você diz:** *"Crie um workflow para [descreva a tarefa]"*

**O DCC faz:** Cria um workflow YAML personalizado em `.claude/workflows/agents/`

**Workflows já disponíveis:**
| Workflow | Quando Usar |
|----------|-------------|
| `code-review` | Revisar código automaticamente (bugs, segurança, performance) |
| `doc-generator` | Gerar documentação de um projeto |
| `report-generator` | Criar relatórios estruturados |

---

### Ter o Claude Especializado em Certos Contextos
**Você diz:** *"Crie uma skill para [assunto]"* ou simplesmente mencione o assunto

**O DCC faz:** Cria uma skill que ativa automaticamente quando você fala sobre aquele tema

**Como funciona:**
```
Você diz: "crie um componente React"
          ↓
Skill "react-patterns" detecta a palavra "React"
          ↓
Claude responde seguindo padrões React definidos
```

**Skills disponíveis:**
| Skill | Ativa Quando Você Menciona... |
|-------|-------------------------------|
| `conventional-commits` | "commit", "conventional commits" |
| `react-patterns` | "react", "componente", "tsx" |
| `api-design` | "api", "endpoint", "rest" |
| `cooper` | "cooper", "documento didi", "docs2" |
| `engineering-skills` | "data engineering", "arquitetura", "backend", "devops" |

---

### Não Perder Contexto Entre Sessões de Trabalho
**Você diz:** *"Inicie um Dev Doc para [nome da tarefa]"*

**O DCC faz:** Cria uma estrutura de acompanhamento em `dev/active/[nome]/`

**Por que usar Dev Docs?**

**Problema real:** Você trabalha em uma tarefa complexa hoje, para no meio, e amanhã não lembra:
- Onde parou
- Quais arquivos estava editando
- Qual era a decisão arquitetural que tomou

**Solução - Arquivos gerados:**
| Arquivo | Utilidade |
|---------|-----------|
| `plan.md` | **Decisões e estratégia** - Documenta o "porquê" das escolhas. Útil quando você volta dias depois e não lembra a lógica |
| `context.md` | **Histórico por sessão** - Registra o que foi feito em cada dia, quais arquivos foram tocados. Útil para saber exatamente "onde parei" |
| `tasks-checklist.md` | **Tarefas pendentes** - Lista o que falta fazer com checkboxes. Útil para não esquecer nenhum passo |

**Como usar:**
```bash
# Iniciar tarefa
/dev-docs init implementar-autenticacao

# Ver tarefas ativas
/dev-docs status

# Continuar depois
/dev-docs continue implementar-autenticacao

# Marcar como concluída
/dev-docs archive implementar-autenticacao
```

---

### Verificar Atualizações do DCCrazy
**Você diz:** *"Há atualizações no DCCrazy?"* ou *"Verifique atualizações"*

**O DCC faz:** Executa o script `scripts/check-updates.py` que:
1. Verifica se há commits novos no GitHub
2. Mostra o que mudou
3. Faz backup das suas configurações (.env, .mcp.json)
4. Atualiza se você aprovar
5. Restaura suas configurações locais

---

### Outras Funcionalidades

| Quero... | Diga ao DCC... |
|----------|----------------|
| **Revisar código** | "Execute code review" ou "revise meu código" |
| **Gerar relatório** | "Crie um relatório de [tipo]" |
| **Listar skills disponíveis** | `/skill list` |
| **Executar skill específica** | `/skill run conventional-commits` |
| **Mudar estilo de resposta** | "Use o estilo direto e organizado" |
| **Ver integrações ativas** | `claude mcp status` |

---

## 🛠️ Comandos Essenciais

### Slash Commands

| Comando | O que Faz | Exemplo |
|---------|-----------|---------|
| `/skill` | Lista ou executa skills | `/skill list`, `/skill run conventional-commits` |
| `/workflow` | Lista ou executa workflows | `/workflow`, `/workflow code-review` |
| `/dev-docs` | Gerencia documentação de desenvolvimento | `/dev-docs init minha-feature` |

### Comandos do Claude Code

```bash
/help              # Mostra todos os comandos disponíveis
/clear             # Limpa o contexto da conversa
/cost              # Mostra o custo da sessão atual
/tokens            # Mostra uso de tokens
```

---

## 📝 Convenções do Projeto

### Queries

Toda query deve seguir as regras rigorosas de organização:

- **Local:** Salvar em `analytics/queries/presto/` (genéricas) ou `analytics/queries/data-e/` (Data-E)
- **Template:** Usar cabeçalho obrigatório com descrição, autor, tabelas
- **Índice:** Sempre adicionar ao README.md da pasta

**Documentação completa:** [docs/convenção-queries.md](docs/convenção-queries.md)

---

### Nomenclatura

| Elemento | Padrão | Exemplo |
|----------|--------|---------|
| Arquivos | `kebab-case` | `code-review.yaml` |
| Pastas | `kebab-case` | `api-service/` |
| Agentes | `kebab-case` | `code-review`, `doc-generator` |
| Relatórios | `{tipo}-report-YYYY-MM-DD.{ext}` | `weekly-report-2024-07-22.md` |

### Commits

```
[tipo] Descrição curta

Corpo detalhado se necessário.

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Tipos:**
- `[agent]` - Novo agente ou atualização
- `[skill]` - Nova skill modular
- `[report]` - Relatório gerado
- `[template]` - Template adicionado/atualizado
- `[doc]` - Documentação
- `[chore]` - Manutenção
- `[fix]` - Correção em agente

### Branches

```
main                    # Branch principal
├── feature/[nome]       # Novas funcionalidades
├── agent/[nome]         # Novos agentes
├── fix/[nome]          # Correções
├── report/[periodo]    # Relatórios
└── docs/[assunto]      # Documentação
```

---

## 🧪 Primeiros Passos Após Instalação

Teste se tudo funciona:

```bash
# 1. Verificar skills
/skill list

# 2. Testar ativação automática
"como faço um commit no padrão conventional commits?"

# 3. Executar workflow
/workflow

# 4. Criar Dev Docs
/dev-docs init minha-primeira-tarefa

# 5. Verificar MCPs
claude mcp status

# 6. Verificar atualizações
python scripts/check-updates.py
```

---

## 📚 Documentação

### Principais
- **[CLAUDE.md](CLAUDE.md)** - Documentação completa de referência
- **[SETUP.md](SETUP.md)** - Guia detalhado de instalação

### Funcionalidades do DCCrazy
- **[docs/convenção-queries.md](docs/convenção-queries.md)** - Regras para criar queries
- **[docs/enciclopedia-tabelas.md](docs/enciclopedia-tabelas.md)** - Sistema de documentação de tabelas
- **[docs/sistema-feedback.md](docs/sistema-feedback.md)** - Aprendizado contínuo

### Integrações
- **[docs/mcp-setup-guide.md](docs/mcp-setup-guide.md)** - Como adicionar MCPs
- **[docs/google-workspace-setup.md](docs/google-workspace-setup.md)** - Integração Google

### Contexto Específico
- **.claude/workflows/CLAUDE.md** - Como criar workflows
- **.claude/skills/CLAUDE.md** - Como criar skills
- **dev/CLAUDE.md** - Como usar Dev Docs

---

## ✅ Verificação de Instalação

```bash
node scripts/verify-setup.js
```

Verifica:
- ✅ Node.js instalado
- ✅ Python instalado
- ✅ Claude Code instalado
- ✅ Variáveis de ambiente configuradas
- ✅ MCPs funcionando
- ✅ Skills carregadas

---

## 💾 Backup no Google Drive

Para criar um backup do seu DCCrazy completo no Google Drive:

```bash
python scripts/backup-to-drive.py
```

**O que é sincronizado:**
- Todo o conteúdo do DCCrazy (cópia exata)
- Estrutura de pastas preservada
- Configurações pessoais (.env, .mcp.json)
- Queries, relatórios, dev docs

**Requisitos:**
- MCP Google Workspace configurado
- Pasta `DCCrazy_Backup` será criada no seu Drive

**Observações:**
- Backup é **manual** (você executa quando quiser)
- Sempre cria uma nova versão (não sobrescreve)
- Útil para acessar de outros dispositivos ou recuperar após formatação

---

## 🔄 Atualizando o DCCrazy

Para atualizar seu kit de ferramentas com as últimas mudanças do GitHub:

```bash
python scripts/check-updates.py
```

O script irá:
1. Verificar se há atualizações disponíveis no DCCrazy
2. Mostrar o que mudou
3. Fazer backup das suas configurações locais
4. Aplicar a atualização (se você aprovar)
5. Restaurar suas configurações

---

## 👤 Autoria

Criado por **Vinicius Castanho** (viniciuscastanho@didiglobal.com) com assistência de Claude Code.

Em caso de dúvidas ou sugestões, entre em contato.

---

## 📄 Licença

MIT - Livre para uso e modificação.

---

**DCC Claude Infrastructure v1.0.0** | [Validação: 24/24 ✅](scripts/validate.js)

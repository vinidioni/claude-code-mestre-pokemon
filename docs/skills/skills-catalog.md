# Catálogo de Skills - DCCrazy

> Guia completo de todas as skills disponíveis no DCCrazy

---

## 📋 Como Usar Este Catálogo

Cada skill é ativada automaticamente quando você usa certas palavras-chave (triggers) na conversa com o Claude.

**Exemplo:**
- Você diz: *"vamos fazer um novo projeto"*
- Claude ativa a skill **superpowers**
- A skill guia você pelo processo completo

---

## 🦸 Skills do Superpowers (Framework de Desenvolvimento)

Metodologia completa para desenvolvimento de software com subagentes, TDD e boas práticas.

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **superpowers** | Ativa o framework completo | Começar qualquer desenvolvimento | `"vamos fazer"`, `"novo projeto"` |
| **brainstorming** | Explora múltiplas abordagens | Há várias formas de resolver | `"brainstorming"`, `"explorar opções"` |
| **specification** | Cria especificações claras | Precisa definir o que fazer | `"especificar"`, `"vamos especificar"` |
| **writing-plans** | Cria planos de implementação | Tem especificação, vai codar | `"criar plano"`, `"plano de implementação"` |
| **executing-plans** | Executa planos com TDD | Implementar código | `"executar plano"`, `"mão na massa"` |
| **test-driven-development** | TDD puro (Red/Green/Refactor) | Escrever código testável | `"tdd"`, `"test first"` |
| **dispatching-parallel-agents** | Executa tasks em paralelo | Múltiplas tasks independentes | `"executar em paralelo"`, `"paralelizar"` |
| **subagent-driven-development** | Delega para subagentes | Task complexa para delegar | `"subagente"`, `"delegar"` |
| **systematic-debugging** | Debug sistemático (método HEAL) | Tem um bug para resolver | `"debug"`, `"debugar"`, `"tem um bug"` |
| **requesting-code-review** | Solicita revisão de código | Código pronto para revisar | `"revisar código"`, `"code review"` |
| **receiving-code-review** | Recebe feedback de revisão | Responder comentários do PR | `"receber revisão"`, `"feedback recebido"` |
| **verification-before-completion** | Checklist final de qualidade | Antes de marcar como pronto | `"checklist final"`, `"pronto para entregar"` |
| **finishing-a-development-branch** | Finaliza branch (merge) | Completar desenvolvimento | `"finalizar branch"`, `"mergear"` |
| **writing-skills** | Cria novas skills | Quer adicionar skill nova | `"criar skill"`, `"nova skill"` |

### Ciclo Completo Superpowers

```
brainstorming → specification → writing-plans → executing-plans
                                              ↓
                    verification-before-completion ← TDD
                                              ↓
                    finishing-a-development-branch
```

---

## 🔧 Skills de Desenvolvimento

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **conventional-commits** | Padrões de mensagem de commit | Escrever commits | `"commit"`, `"conventional commits"` |
| **engineering-skills** | Engenharia de software geral | Questões técnicas | `"arquitetura"`, `"backend"`, `"devops"` |
| **sql-encyclopedia** | Consulta tabelas e schema SQL | Trabalhar com dados | `"tabelas"`, `"schema"`, `"banco de dados"` |
| **example-doc** | Template de exemplo | Ver como fazer skills | `"example"`, `"template"` |

---

## 🔌 Skills de Integração (MCPs)

### DiDi

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **cooper** | Acesso ao Cooper/Docs2 | Documentação DiDi | `"cooper"`, `"docs2"` |
| **cooper-search** | Busca no Cooper | Achar documentos | `"search cooper"`, `"buscar documento"` |
| **cooper-read** | Ler documentos Cooper | Ler conteúdo | `"read cooper"`, `"ler documento"` |
| **cooper-write** | Criar documentos Cooper | Salvar docs | `"create cooper"`, `"salvar no cooper"` |
| **cooper-image-read** | Ler imagens do Cooper | Analisar screenshots | `"imagem cooper"`, `"ler imagem"` |
| **cooper-link-parser** | Extrair links do Cooper | Analisar links | `"links cooper"`, `"extrair links"` |
| **dchat-send** | Enviar mensagens D-Chat | Mensagens internas | `"dchat send"`, `"enviar mensagem"` |
| **dchat-search** | Buscar no D-Chat | Histórico de chats | `"dchat search"`, `"buscar dchat"` |
| **dchat-notify** | Notificações D-Chat | Alertas | `"dchat notify"`, `"notificar"` |
| **gattaran-viewer** | Visualizar pedidos Gattaran | Gestão de pedidos | `"gattaran"`, `"pedidos"` |
| **intranet-fetcher** | Buscar na intranet | Documentação interna | `"intranet"`, `"docs2"` |
| **deskbee-book-room** | Reservar salas | Agendar reuniões | `"deskbee"`, `"reservar sala"` |

### Git

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **github** | Operações GitHub | PRs, issues, repos | `"github"`, `"pull request"`, `"pr"` |
| **gitlab** | Operações GitLab | MRs, repos | `"gitlab"`, `"merge request"`, `"mr"` |

### Google

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **google-drive** | Acessar Drive | Arquivos Drive | `"google drive"`, `"drive"` |
| **google-maps** | Usar Maps | Localização | `"google maps"`, `"maps"` |

---

## 📊 Skills de Dados e Análise

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **data-quality-auditor** | Auditoria de qualidade de dados | Dados sujos | `"data quality"`, `"qualidade de dados"` |
| **statistical-analyst** | Análise estatística | Testes A/B, p-value | `"a/b test"`, `"significância estatística"` |
| **finance-skills** | Análise financeira | Métricas SaaS | `"arr"`, `"mrr"`, `"ltv"`, `"cac"` |
| **business-growth-skills** | Crescimento de negócio | Customer success | `"churn"`, `"retenção"`, `"vendas"` |
| **business-investment-advisor** | Análise de investimento | ROI, NPV | `"roi"`, `"npv"`, `"investimento"` |

---

## 🛠️ Skills de Utilitários

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **everything-search** | Busca global de arquivos | Achar arquivos | `"everything"`, `"buscar arquivo"` |
| **browser-automation** | Automação de browser | Web scraping | `"browser"`, `"playwright"` |
| **backup-dccrazy** | Backup do DCCrazy | Salvar configurações | `"backup"`, `"fazer backup"` |

---

## 🎯 Skills do Sistema DCCrazy

| Skill | O Que Faz | Quando Usar | Trigger Principal |
|-------|-----------|-------------|-------------------|
| **dccrazy-onboarding** | Primeira configuração | Instalar DCCrazy | `"analise a pasta dcc"` |
| **dccrazy-updater** | Atualizar DCCrazy | Verificar updates | `"atualizar dccrazy"`, `"tem atualização"` |

---

## 📖 Exemplos de Uso

### Exemplo 1: Novo Projeto
**Você:** *"Vamos fazer um sistema de login"*

**Claude ativa:** `superpowers`

**Fluxo:**
1. Brainstorming (explorar opções: JWT, sessions, OAuth)
2. Specification (definir o que fazer)
3. Writing Plans (criar tasks)
4. Executing Plans (implementar com TDD)

### Exemplo 2: Bug Misterioso
**Você:** *"Tem um bug, a aplicação trava"*

**Claude ativa:** `systematic-debugging`

**Fluxo:**
1. Hipótese (formular explicação)
2. Experimento (testar hipótese)
3. Análise (confirmar/refutar)
4. Correção (com base na evidência)

### Exemplo 3: Documentação DiDi
**Você:** *"Buscar documento sobre API no cooper"*

**Claude ativa:** `cooper-search`

**Resultado:** Busca realizada no Cooper/Docs2

---

## 🔄 Como as Skills Funcionam

1. **Detecção:** Claude detecta palavras-chave (triggers) na sua mensagem
2. **Ativação:** A skill mais relevante é carregada automaticamente
3. **Execução:** O comportamento do Claude muda seguindo a skill
4. **Término:** Skill continua ativa até tarefa completar ou nova skill ativar

---

## ➕ Adicionar Novas Skills

Quer criar uma skill nova? Use:

```
"Criar nova skill"
"Como escrever skill"
```

Ou veja a skill `writing-skills` para o template completo.

---

## 📚 Documentação Relacionada

- [Superpowers Framework](../.claude/skills/superpowers/SKILL.md)
- [Skill Rules](../.claude/skill-rules.json)
- [Guia de Skills](../.claude/skills/CLAUDE.md)

---

*Última atualização: 2026-07-31*
*Total de skills: 30+*
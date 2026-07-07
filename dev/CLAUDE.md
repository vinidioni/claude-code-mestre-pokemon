# Dev Docs - Documentação de Contexto

> Este CLAUDE.md carrega automaticamente quando você trabalha em `dev/`. Ele estende o CLAUDE.md raiz com o sistema de documentação de desenvolvimento para continuidade entre sessões e membros da equipe.

## Propósito

O sistema Dev Docs permite:
- Continuar tarefas entre sessões de Claude Code
- Transferir contexto entre membros da equipe
- Manter histórico de decisões e raciocínios
- Rastrear progresso de tarefas complexas

## Estrutura de Pastas

```
dev/
├── CLAUDE.md              # Este arquivo
├── active/                # Tarefas em andamento
│   ├── YYYY-MM-DD-feature-name/
│   │   ├── plan.md        # Plano estratégico
│   │   ├── context.md     # Contexto e decisões
│   │   └── tasks-checklist.md  # Tarefas detalhadas
│   └── ...
└── archive/               # Tarefas concluídas
    └── YYYY-MM-DD-completed-feature/
```

## Convenções de Nomenclatura

- **Pastas**: `YYYY-MM-DD-nome-descritivo/`
  - Data de início da tarefa
  - Nome em kebab-case
  - Máximo 5 palavras

## Arquivos Padrão

### plan.md
Visão estratégica de alto nível:
- Objetivo
- Abordagem geral
- Dependências
- Critérios de sucesso

### context.md
Contexto operacional:
- Decisões tomadas e por quê
- Descobertas importantes
- Links e referências
- Notas de sessões anteriores

### tasks-checklist.md
Lista executável de tarefas:
- [ ] Tarefa pendente
- [x] Tarefa concluída
- [~] Tarefa em progresso
- [?] Tarefa bloqueada (com razão)

## Como Iniciar uma Nova Tarefa

1. Crie a pasta em `dev/active/YYYY-MM-DD-nome-da-tarefa/`
2. Crie `plan.md` com o objetivo e estratégia
3. Crie `tasks-checklist.md` com as tarefas iniciais
4. Execute o comando `/dev-docs init` (ou crie manualmente)
5. Atualize `context.md` durante o trabalho

## Como Continuar uma Tarefa Existente

1. Localize a pasta em `dev/active/`
2. Leia os 3 arquivos (plan, context, tasks)
3. Atualize `tasks-checklist.md` com progresso atual
4. Continue o trabalho
5. Atualize `context.md` com novas descobertas

## Como Finalizar uma Tarefa

1. Atualize `tasks-checklist.md` marcando tudo como concluído
2. Adicione resumo final em `context.md`
3. Mova a pasta de `active/` para `archive/`
4. Commit com referência à pasta

## Comando /dev-docs

O slash command `/dev-docs` oferece atalhos:

```bash
/dev-docs init <nome>     # Cria estrutura inicial
/dev-docs status          # Mostra tarefas ativas
/dev-docs continue <nome> # Carrega contexto de tarefa
/dev-docs archive <nome>  # Move para archive
```

## Fluxo Completo de Trabalho

### 1. Início (Sessão 1)

```bash
# Identifique que a tarefa é complexa
# Execute:
/dev-docs init minha-feature

# O sistema irá:
# 1. Perguntar descrição e contexto
# 2. Invocar o agente planner
# 3. Criar estrutura em dev/active/YYYY-MM-DD-minha-feature/
# 4. Mostrar plano e próximos passos
```

### 2. Durante o Desenvolvimento (Sessões N)

```bash
# No início de cada sessão:
/dev-docs continue minha-feature

# Leia:
# - context.md (estado atual)
# - tasks-checklist.md (o que falta)

# Execute tarefas...

# No final da sessão, atualize:
# - context.md (novas decisões, descobertas)
# - tasks-checklist.md (marque concluídas)
```

### 3. Continuidade entre Membros da Equipe

```bash
# Membro A finalizou sessão:
git add dev/active/YYYY-MM-DD-minha-feature/
git commit -m "[dev] Progresso em minha-feature

- Implementado módulo X
- Decidido usar abordagem Y

Co-Authored-By: Claude <noreply@anthropic.com>"
git push

# Membro B continua:
git pull
claude
# dentro do Claude:
/dev-docs continue minha-feature
```

### 4. Finalização

```bash
# Quando todas as tasks estiverem concluídas:
/dev-docs archive minha-feature

# O sistema irá:
# 1. Validar que tudo está concluído
# 2. Mover para dev/archive/
# 3. Commit automático
```

## Integração com Agente Planner

O agente `planner` (`.claude/agents/planner/`) é a porta de entrada do sistema Dev Docs. Ele é automaticamente invocado por `/dev-docs init`.

### O que o Planner Faz

1. **Análise Estratégica**
   - Define escopo (incluído/excluído)
   - Identifica dependências
   - Avalia riscos
   - Propõe abordagem

2. **Geração de Artefatos**
   - `plan.md` com estratégia completa
   - `context.md` estruturado para preenchimento
   - `tasks-checklist.md` decomposto em fases

3. **Estimativas**
   - Complexidade (Baixa/Média/Alta)
   - Tempo estimado
   - Número de sessões previstas

### Quando Usar o Planner

| Situação | Usar Planner? | Motivo |
|----------|---------------|--------|
| Bug simples (1 arquivo) | Não | Não justifica overhead |
| Nova feature (multi-arquivo) | Sim | Necessita rastreamento |
| Refatoração complexa | Sim | Decisões arquiteturais |
| Spike/POC | Talvez | Se for evoluir para produção |
| Tarefa exploratória | Não | Contexto muda muito |

## Templates de Sessão

### Template para context.md (Nova Sessão)

```markdown
### YYYY-MM-DD HH:MM - [Seu Nome]

**Progresso:**
- [O que foi feito nesta sessão]

**Decisões:**
- [Decisão] → [Justificativa curta]

**Descobertas:**
- [Algo novo aprendido sobre o sistema]

**Bloqueios:**
- [Se houver, descreva e quem pode ajudar]

**Próximos Passos:**
- [O que fazer na próxima sessão]
```

### Template para tasks-checklist.md (Atualização)

```markdown
## Fase X: [Nome]

- [x] [Tarefa concluída]
- [~] [Tarefa em progresso - atualizado por Membro A]
- [ ] [Tarefa pendente]
- [?] [Tarefa bloqueada - aguardando resposta de...]
```

## Boas Práticas

1. **Atualize context.md frequentemente** - Não acumule muita informação na memória
2. **Seja específico nas tasks** - Cada item deve ser acionável
3. **Documente decisões** - Explique o "porquê", não só o "o quê"
4. **Mantenha links** - Referencie arquivos, commits, PRs relevantes
5. **Arquive prontamente** - Mantenha `active/` limpo (máx 5-7 tarefas)
6. **Commits pequenos** - Commit context.md a cada sessão
7. **Seja honesto nos bloqueios** - Melhor sinalizar cedo do que esquecer

## Exemplo Completo

Veja `dev/active/2026-07-07-exemplo-planner/` para um exemplo funcional de:
- `plan.md` - Plano estratégico
- `context.md` - Rastreamento de sessões
- `tasks-checklist.md` - Lista de tarefas com métricas

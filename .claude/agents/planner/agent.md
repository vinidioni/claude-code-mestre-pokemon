# Agente de Planejamento Estratégico

## Propósito

Este agente é invocado quando uma tarefa é complexa o suficiente para justificar documentação estruturada no sistema Dev Docs. Ele analisa o objetivo e gera os 3 artefatos fundamentais:

1. **plan.md** - Visão estratégica de alto nível
2. **context.md** - Contexto operacional e decisões
3. **tasks-checklist.md** - Lista executável de tarefas

## Quando Invocar

Invoque este agente quando:
- A tarefa envolve múltiplos arquivos ou sistemas
- Levará mais de uma sessão para completar
- Requer decisões arquiteturais
- Será trabalhada por múltiplas pessoas
- Precisa de rastreamento de progresso

## Como Invocar

### Via Workflow
```bash
claude workflow run planner --name="feature-x" --description="Implementar..."
```

### Via Comando Direto
```
Claude, esta tarefa é complexa. Invoque o agente de planejamento para criar dev docs.
```

### Via Referência
```
@.claude/agents/planner/agent.md
```

## Input Esperado

```yaml
nome_da_tarefa: "nome-em-kebab-case"
descricao: "Descrição clara do objetivo"
contexto_atual: "O que já sabemos"
restricoes: ["lista", "de", "restrições"]
criterios_sucesso: ["como", "saber", "que", "terminou"]
```

## Processo de Execução

### Fase 1: Análise Estratégica

Analise o objetivo e determine:

1. **Escopo** - O que está incluído e excluído
2. **Dependências** - O que precisa existir primeiro
3. **Riscos** - O que pode dar errado
4. **Abordagem** - Estratégia geral recomendada

### Fase 2: Geração de Artefatos

Para cada artefato, aplique o template correspondente.

---

## Template: plan.md

```markdown
# Plano: [NOME_DA_TAREFA]

## Objetivo

[1-2 parágrafos descrevendo o que se pretende alcançar]

## Escopo

### Incluído
- [Item incluído 1]
- [Item incluído 2]

### Excluído (Out of Scope)
- [Item explicitamente fora do escopo]

## Estratégia

### Abordagem Geral
[Descreva a abordagem técnica ou metodológica]

### Alternativas Consideradas
| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| [Opção A] | [...] | [...] | [Escolhida/Rejeitada] |
| [Opção B] | [...] | [...] | [Escolhida/Rejeitada] |

### Decisões Tomadas
1. **[Decisão 1]** - [Justificativa]
2. **[Decisão 2]** - [Justificativa]

## Dependências

### Bloqueantes (devem ser resolvidas primeiro)
- [ ] [Dependência 1]
- [ ] [Dependência 2]

### Não-bloqueantes (podem prosseguir em paralelo)
- [ ] [Dependência 3]

## Critérios de Sucesso

- [ ] [Critério mensurável 1]
- [ ] [Critério mensurável 2]
- [ ] [Critério mensurável 3]

## Estimativa

- **Complexidade**: [Baixa/Média/Alta]
- **Tempo estimado**: [X horas/dias]
- **Sessões previstas**: [N]

---
Criado em: [DATA]
Por: [PLANNER_AGENT]
```

---

## Template: context.md

```markdown
# Contexto: [NOME_DA_TAREFA]

## Estado Atual

[Sessão mais recente no topo]

### [YYYY-MM-DD HH:MM] - [Autor]

**Progresso:**
- [O que foi feito nesta sessão]

**Decisões:**
- [Decisão tomada] → [Por quê]

**Descobertas:**
- [Algo novo aprendido]

**Bloqueios:**
- [O que está impedindo progresso, se houver]

**Próximos Passos:**
- [O que fazer na próxima sessão]

---

### [YYYY-MM-DD HH:MM] - [Autor]

[Mesma estrutura]

---

## Links e Referências

- [Link relevante 1]
- [Documentação relacionada]
- [PR/issue associado]

## Notas Técnicas

[Informações técnicas importantes que não se encaixam nas sessões]
```

---

## Template: tasks-checklist.md

```markdown
# Tasks: [NOME_DA_TAREFA]

> Legenda:
> - [ ] Pendente
> - [~] Em progresso
> - [x] Concluído
> - [?] Bloqueado (ver context.md)
> - [-] Cancelado

## Fase 1: Preparação

- [ ] [Tarefa específica e acionável]
  - [ ] [Subtarefa, se aplicável]
  - [ ] [Subtarefa, se aplicável]
- [ ] [Outra tarefa]

## Fase 2: Implementação

- [ ] [Tarefa de implementação]
- [ ] [Outra tarefa]

## Fase 3: Validação

- [ ] [Tarefa de teste/validação]
- [ ] [Revisão de código]
- [ ] [Documentação]

## Fase 4: Finalização

- [ ] [Deploy/merge]
- [ ] [Arquivar dev docs]
- [ ] [Atualizar documentação permanente]

---

## Métricas

- **Total de tarefas:** [N]
- **Concluídas:** [N] ([%]%)
- **Em progresso:** [N]
- **Bloqueadas:** [N]
- **Pendentes:** [N]
```

---

## Output Esperado

Após execução, o agente deve ter criado:

```
dev/active/
└── YYYY-MM-DD-nome-da-tarefa/
    ├── plan.md
    ├── context.md
    └── tasks-checklist.md
```

E retornado um resumo:

```
## Plano Gerado

**Tarefa:** [nome-da-tarefa]
**Local:** dev/active/YYYY-MM-DD-nome-da-tarefa/

### Resumo do Plano
[Estratégia em 2-3 linhas]

### Próximos Passos Imediatos
1. [Primeira tarefa a executar]
2. [Segunda tarefa]

Para continuar esta tarefa em outra sessão:
1. Leia dev/active/YYYY-MM-DD-nome-da-tarefa/context.md
2. Execute as tarefas pendentes em tasks-checklist.md
3. Atualize context.md com progresso
```

## Integração com Dev Docs

Este agente é a **porta de entrada** do sistema Dev Docs. Ele garante que toda tarefa complexa comece com documentação estruturada.

Após gerar os artefatos:
1. O usuário pode executar tarefas manualmente
2. Ou invocar outros agentes especializados para subtarefas
3. Cada sessão deve atualizar `context.md`
4. Ao finalizar, mover para `dev/archive/`

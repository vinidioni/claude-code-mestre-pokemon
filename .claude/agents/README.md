# Subagentes Especializados

Esta pasta contém agentes especializados de propósito único para orquestração de tarefas complexas.

## Estrutura

```
.claude/agents/
├── README.md              # Este arquivo
└── planner/               # Agente de planejamento estratégico
    └── agent.md           # Prompt do agente
```

## Agente de Planejamento (planner)

O agente `planner` é a **porta de entrada** do sistema Dev Docs.

### Artefatos Gerados

| Arquivo | Propósito | Quando Atualizar |
|---------|-----------|------------------|
| `plan.md` | Estratégia de alto nível | Quando a estratégia muda |
| `context.md` | Rastreamento de sessões | Ao final de cada sessão |
| `tasks-checklist.md` | Lista executável | Ao completar tarefas |

### Fluxo de Uso

```
Tarefa Complexa
       |
       v
Workflow: planner
--name="feature-x"
--description="..."
       |
       v
Agente planner
       |
       v
dev/active/YYYY-MM-DD-feature-x/
├── plan.md
├── context.md
└── tasks-checklist.md
       |
       v
Execução Manual
ou outros agentes
       |
       v
Ao finalizar:
mover para dev/archive/
```

### Como Invocar

**Via Workflow (recomendado):**
```bash
claude workflow run planner \
  --name="implementar-auth" \
  --description="Implementar autenticação JWT"
```

**Via Referência:**
```
@.claude/agents/planner/agent.md
```

### Critérios para Usar o Planner

Use quando a tarefa:
- Envolve múltiplos arquivos ou sistemas
- Levará mais de uma sessão para completar
- Requer decisões arquiteturais
- Será trabalhada por múltiplas pessoas

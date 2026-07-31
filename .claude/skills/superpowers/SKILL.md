---
name: superpowers
description: Metodologia de desenvolvimento Superpowers - especificação antes de codar, subagentes para execução, TDD, YAGNI, DRY
triggers:
  - vamos fazer
  - vamos criar
  - implementar
  - desenvolver
  - novo projeto
  - nova feature
  - brainstorming
---

# Skill: Superpowers

## O que é

Integração da metodologia Superpowers ao DCCrazy. Uma abordagem de desenvolvimento que:
- ✋ **Pausa antes de codar** - entende o problema primeiro
- 📝 **Especifica em pedaços** - mostra o plano em partes digeríveis
- 👤 **Usa subagentes** - delega tarefas para agentes especializados
- ✅ **Segue boas práticas** - TDD, YAGNI (You Aren't Gonna Need It), DRY

## Quando Ativar

Quando você quer:
- Iniciar um novo projeto ou feature
- Fazer brainstorming de uma solução
- Desenvolver código seguindo metodologia estruturada
- Usar subagentes para execução paralela

## Metodologia Superpowers no DCCrazy

### Fase 1: Descoberta (Discovery)

**NÃO escreva código ainda!**

Primeiro, entenda profundamente o que está sendo pedido:

```
Perguntas para fazer:
1. O que você está tentando construir?
2. Qual problema resolve?
3. Quem vai usar?
4. Quais são os requisitos funcionais?
5. Quais são as restrições?
6. Existe algo similar no projeto atual?
```

**Objetivo:** Extrair uma especificação clara através de diálogo.

### Fase 2: Especificação (Specification)

Mostre a especificação em **chunks pequenos** (suficiente para ler e digerir):

```markdown
## 📋 Especificação: [Nome do Projeto]

### Visão Geral
[Uma frase descrevendo o objetivo]

### Funcionalidades Principais
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

### Fora do Escopo (YAGNI)
- ❌ [O que NÃO será feito nesta versão]

### Critérios de Aceitação
- [ ] [Critério 1]
- [ ] [Critério 2]

**Revise cada seção com o usuário antes de prosseguir.**
```

### Fase 3: Plano de Implementação

Crie um plano que um "engenheiro júnior entusiasta" possa seguir:

```markdown
## 🔨 Plano de Implementação

### Task 1: [Nome da tarefa]
**Subagente:** [Tipo de especialista necessário]
**Input:** [O que precisa]
**Output:** [O que deve produzir]
**Critério de sucesso:** [Como verificar]

### Task 2: [Nome da tarefa]
...

### Task N: [Nome da tarefa]
```

**Princípios:**
- 🧪 **TDD:** Sempre testes primeiro (red/green)
- ✂️ **YAGNI:** Não adicione o que não foi pedido
- 🔄 **DRY:** Não repita código

### Fase 4: Execução com Subagentes

Para cada task do plano:

1. **Dispatch** → Envie para um subagente especializado
2. **Monitor** → Acompanhe progresso
3. **Review** → Inspecione o trabalho retornado
4. **Integrate** → Junte ao projeto principal
5. **Next** → Próxima task

```
Workflow de Execução:

Projeto Principal
    ↓
  Dispatch → Subagente 1 (Task A)
  Dispatch → Subagente 2 (Task B) [paralelo]
    ↓
  Collect Results
    ↓
  Review (código, testes, integração)
    ↓
  Integrate
    ↓
  Next Cycle
```

## Exemplo de Sessão

**Usuário:** "Vamos fazer um React todo list"

**Claude (Superpowers):**

```
🦸 Superpowers Mode Ativado!

Antes de escrevermos qualquer código, vamos entender o que você quer:

1. Que tipo de "todo list"? Simples (adicionar/remover) ou avançada (categorias, deadlines, prioridades)?

2. Local storage apenas ou precisa de backend?

3. Já existe um projeto React configurado ou começamos do zero?

4. Alguma preferência de estilo (Tailwind, Material-UI, styled-components)?

Me responda e vamos criar uma especificação clara antes de codar.
```

## Ferramentas Disponíveis

| Ferramenta | Uso | Comando |
|------------|-----|---------|
| **Dev Docs** | Criar plano estruturado | `/dev-docs init [nome-do-projeto]` |
| **Workflows** | Executar padrões | `/workflow [nome]` |
| **Subagentes** | Delegar tasks | Use `Agent()` ou workflows |
| **Planner** | Gerar plano de tasks | `claude workflow run planner` |

## Convenções

### Commits
```
[superpowers] Short description

Detailed body if needed

Co-Authored-By: Subagent <subagent@superpowers>
```

### Nomenclatura de Tasks
```
Task-NN-[short-name].md
```

### Estrutura de Projeto Superpowers
```
incubator/in-progress/[nome-projeto]/
├── plan.md                    # Plano completo
├── tasks/
│   ├── Task-01-setup.md
│   ├── Task-02-component.md
│   └── Task-03-tests.md
└── results/
    └── [entregáveis]
```

## Diferenças do Superpowers Original

| Aspecto | Superpowers Original | Superpowers no DCCrazy |
|---------|----------------------|------------------------|
| **Plugin** Marketplace oficial | Sistema de skills do DCCrazy |
| **Bootstrap** Automático na sessão | Ativa via trigger ou comando |
| **Subagentes** Integração nativa | Via `Agent()` ou workflows |
| **Custo** Marketplace/assinatura | Gratuito (próprio) |

## Quer Integrar ao seu Projeto?

**Para usar Superpowers em um projeto existente:**
```
"Ativar modo Superpowers para este projeto"
```

**Para desativar:**
```
"Desativar Superpowers, voltar ao modo normal"
```

## Ver Mais

- Repositório Original: https://github.com/obra/superpowers
- Documentação TDD: `/skill run tdd-patterns`
- Workflows de Subagentes: `/workflow agent-dispatch`

---

**Metodologia inspirada em:** Superpowers by Jesse Vincent
**Adaptado para:** DCCrazy Infrastructure

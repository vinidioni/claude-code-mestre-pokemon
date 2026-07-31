---
name: writing-plans
description: Criar planos de implementação claros e executáveis
parent: superpowers
triggers:
  - criar plano
  - escrever plano
  - plano de implementacao
  - quebrar em tasks
  - dividir trabalho
  - proximos passos
---

# Skill: Writing Plans

## Propósito

Transformar uma especificação aprovada em um plano de implementação executável, com tasks claras e ordenadas.

## Quando Usar

- Especificação está aprovada
- É hora de implementar
- Você precisa organizar o trabalho

## Metodologia

### Estrutura do Plano

```markdown
## 🔨 Plano de Implementação: [Nome do Projeto]

### Visão Geral
[Resumo do que será construído - 1 parágrafo]

### Tasks

#### Task 1: [Nome descritivo]
**Objetivo:** [O que esta task deve entregar]
**Critério de Sucesso:** [Como saber que está pronta]
**Estimativa:** [X minutos/horas]
**Dependências:** [Nenhuma / Task X]

#### Task 2: [Nome descritivo]
...

### Orquestração
[Sequência de execução, paralelizações possíveis]

### Critérios de Aceitação do Projeto
- [ ] [Critério 1]
- [ ] [Critério 2]
```

## Regras para Tasks

### 1. Independência
Cada task deve ser **independentemente completável** (quando possível).

### 2. Tamanho
- **Mínimo:** 15 minutos (menos = overhead)
- **Máximo:** 2 horas (mais = quebre em subtasks)
- **Ideal:** 30-60 minutos

### 3. Clareza
Deve dar para explicar para um "engenheiro júnior entusiasta".

### 4. Testabilidade
Sempre inclua como verificar que funcionou.

## Exemplo

**Especificação:** Sistema de login com email/senha

**Plano:**

```markdown
## 🔨 Plano de Implementação: Sistema de Login

### Visão Geral
Implementar autenticação JWT com endpoints de login/logout,
middleware de proteção e formulário de login na UI.

### Tasks

#### Task 1: Modelo de Usuário
**Objetivo:** Criar model User com campos necessários
**Critério de Sucesso:** 
- [ ] Model tem name, email, password_hash
- [ ] Validação de email único
- [ ] Método para verificar senha
**Estimativa:** 30 min
**Dependências:** Nenhuma

#### Task 2: Endpoint de Registro
**Objetivo:** POST /api/auth/register
**Critério de Sucesso:**
- [ ] Recebe name, email, password
- [ ] Valida dados
- [ ] Cria usuário no banco
- [ ] Retorna token JWT
**Estimativa:** 45 min
**Dependências:** Task 1

#### Task 3: Endpoint de Login
**Objetivo:** POST /api/auth/login
**Critério de Sucesso:**
- [ ] Recebe email, password
- [ ] Valida credenciais
- [ ] Retorna token JWT
**Estimativa:** 30 min
**Dependências:** Task 1

#### Task 4: Middleware de Autenticação
**Objetivo:** Proteger rotas privadas
**Critério de Sucesso:**
- [ ] Middleware verifica JWT
- [ ] Retorna 401 se inválido
- [ ] Adiciona user ao request
**Estimativa:** 30 min
**Dependências:** Task 2, 3

#### Task 5: Componente de Login (UI)
**Objetivo:** Formulário de login funcional
**Critério de Sucesso:**
- [ ] Campos email e senha
- [ ] Validação client-side
- [ ] Integração com API
- [ ] Armazena token
**Estimativa:** 60 min
**Dependências:** Task 3

### Orquestração
```
Task 1 → Task 2 → Task 4
    ↓    → Task 3 → ↗
              ↓
           Task 5
```

Paralelizável: Task 2 e Task 3 (depois da 1)

### Critérios de Aceitação do Projeto
- [ ] Usuário pode se registrar
- [ ] Usuário pode fazer login
- [ ] Rotas protegidas requerem autenticação
- [ ] Token JWT funciona corretamente
```

## Do Plano para Execução

1. **Aprovação** - Usuário revisa e aprova plano
2. **Setup** - Cria estrutura de pastas/arquivos
3. **Execução** - Segue tasks uma a uma (skill: executing-plans)
4. **Tracking** - Marca progresso

## Comandos

```
"Criar plano de implementação"
"Quais as tasks?"
"Como dividimos isso?"
"Próximos passos"
```

---

**Parte do:** Superpowers Framework
**Próximo passo:** executing-plans
**Input:** specification aprovada

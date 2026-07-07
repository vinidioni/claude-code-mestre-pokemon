# /dev-docs - Slash Command

## Descrição

Gera ou atualiza a estrutura de documentação de desenvolvimento (Dev Docs) para tarefas complexas. Este comando é um atalho para o workflow `planner`, empacotando todo o processo de criação de plan.md, context.md e tasks-checklist.md em um único comando.

## Uso

```bash
/dev-docs init <nome-da-tarefa>    # Cria nova estrutura de dev docs
/dev-docs status                   # Lista tarefas ativas
/dev-docs continue <nome>          # Carrega contexto de tarefa existente
/dev-docs archive <nome>           # Move tarefa para archive
```

## Casos de Uso

### 1. Iniciar Nova Tarefa Complexa

Quando você identifica que uma tarefa é complexa o suficiente para documentação estruturada:

```bash
/dev-docs init implementar-autenticacao-jwt
```

O comando irá:
1. Perguntar a descrição da tarefa
2. Perguntar contexto adicional (opcional)
3. Invocar o agente `planner`
4. Criar a estrutura em `dev/active/YYYY-MM-DD-implementar-autenticacao-jwt/`
5. Mostrar resumo e próximos passos

### 2. Ver Status de Tarefas

```bash
/dev-docs status
```

Mostra:
```
Tarefas Ativas em dev/active/:

1. 2026-07-07-implementar-autenticacao-jwt
   Progresso: 3/8 tarefas (37%)
   Última atualização: há 2 dias

2. 2026-07-05-refatorar-modulo-pagamentos
   Progresso: 7/10 tarefas (70%)
   Última atualização: há 5 horas
```

### 3. Continuar Tarefa Existente

```bash
/dev-docs continue implementar-autenticacao-jwt
```

O comando irá:
1. Localizar a pasta em `dev/active/`
2. Ler `context.md` e `tasks-checklist.md`
3. Mostrar resumo do estado atual
4. Perguntar qual tarefa executar

### 4. Arquivar Tarefa Concluída

```bash
/dev-docs archive implementar-autenticacao-jwt
```

Move a pasta de `dev/active/` para `dev/archive/` e atualiza o resumo final.

## Implementação

Este comando é um wrapper que:

1. **Para `init`:** Invoca `claude workflow run planner` com os parâmetros coletados
2. **Para `status`:** Lista diretórios em `dev/active/` e extrai métricas de `tasks-checklist.md`
3. **Para `continue`:** Carrega arquivos de contexto e os apresenta
4. **Para `archive`:** Executa operação de move e validação

## Por Que Slash Command?

Sem o slash command, você precisaria:
```bash
# Verificar se existe
ls dev/active/

# Ler contexto
 cat dev/active/2026-07-07-feature/context.md

# Ver tarefas
cat dev/active/2026-07-07-feature/tasks-checklist.md

# Ou invocar workflow com parâmetros
claude workflow run planner --name="feature" --description="..."
```

Com o slash command:
```bash
/dev-docs continue feature
```

## Integração com Sistema Dev Docs

Este comando é a interface principal do sistema Dev Docs. Todo o fluxo de trabalho documentado em `dev/CLAUDE.md` pode ser acessado via este comando.

```
/dev-docs init     →  Cria estrutura (planner agent)
     ↓
[trabalho nas tarefas]
     ↓
/dev-docs continue →  Carrega contexto
     ↓
[mais trabalho]
     ↓
/dev-docs archive  →  Finaliza e arquiva
```

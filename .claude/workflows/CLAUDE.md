# Workflows - Documentação de Contexto

> Este CLAUDE.md carrega automaticamente quando você trabalha em `.claude/workflows/`. Ele estende o CLAUDE.md raiz com detalhes específicos para criação e manutenção de workflows.

## Propósito

Workflows são agentes reutilizáveis que executam tarefas complexas de forma estruturada. Eles são definidos em YAML e podem ser parametrizados.

## Estrutura de Pastas

```
.claude/workflows/
├── CLAUDE.md              # Este arquivo
├── agents/                # Agentes de análise e ação
│   ├── _template.yaml     # Template para novos agentes
│   ├── code-review.yaml
│   ├── doc-generator.yaml
│   └── security-audit.yaml
├── reports/               # Geradores de relatórios
│   └── report-weekly.yaml
└── tasks/                 # Tarefas operacionais
    ├── send-report-email.yaml
    └── backup-drive.yaml
```

## Convenções de Workflow

### Nomenclatura
- **Arquivos**: `kebab-case.yaml`
- **Nome interno** (`name:`): camelCase descritivo
- **Steps**: snake_case

### Estrutura Mínima

```yaml
name: nomeDoAgente
description: |
  Descrição clara do propósito.
  Explique quando usar este agente.

parameters:
  - name: parametroObrigatorio
    type: string
    required: true
    description: Descrição do parâmetro

  - name: parametroOpcional
    type: string
    required: false
    default: "valor-padrao"
    description: Descrição do parâmetro

steps:
  - name: nome_da_etapa
    prompt: |
      ## Título da Etapa

      Instruções claras do que fazer.
      Use {parametro} para interpolar valores.

      Retorne:
      - Campo 1
      - Campo 2

settings:
  model: sonnet
  timeout: 300
  save_output: true
  output_path: "reports/{date}/{name}-{timestamp}.md"
```

## Tipos de Steps

### Step Simples
Executa sempre que o workflow roda.

### Step Condicional
Executa apenas se a condição for satisfeita:
```yaml
- name: analise_seguranca
  condition: "{focus} == 'all' or {focus} == 'security'"
  prompt: ...
```

## Boas Práticas

1. **Use descrições claras** - Explique o propósito do agente
2. **Valide parâmetros** - Verifique entradas nas primeiras etapas
3. **Steps atômicos** - Cada step deve ter uma responsabilidade única
4. **Output estruturado** - Defina formato de retorno em cada step
5. **Timeout adequado** - Tarefas complexas precisam de mais tempo
6. **Salve outputs** - Use `save_output: true` para auditoria

## Como Criar um Novo Workflow

1. Copie `_template.yaml` para um novo arquivo
2. Preencha `name`, `description` e `parameters`
3. Defina os `steps` necessários
4. Ajuste `settings` conforme complexidade
5. Teste localmente antes de commitar
6. Documente em `agents/[nome]/README.md`

## Comandos Úteis

```bash
# Listar workflows disponíveis
ls .claude/workflows/agents/

# Executar workflow
claude workflow run code-review

# Executar com parâmetros
claude workflow run code-review --target="src/api/" --focus="security"
```

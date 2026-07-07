# /nome-do-comando - Template de Slash Command

## Descrição

Descreva em 1-2 linhas o que este comando faz.

## Uso

```bash
/nome-do-comando <subcomando> [argumentos]
```

## Subcomandos

| Subcomando | Descrição | Exemplo |
|------------|-----------|---------|
| `sub1` | O que faz | `/nome-do-comando sub1 arg` |
| `sub2` | O que faz | `/nome-do-comando sub2` |

## Casos de Uso

### Exemplo 1: Caso Comum

```bash
/nome-do-comando exemplo parametro
```

Resultado esperado:
```
[Output esperado]
```

### Exemplo 2: Caso Avançado

```bash
/nome-do-comando exemplo --flag valor
```

## Por Que Slash Command?

Sem o slash command, você precisaria:
```bash
# Múltiplos comandos complicados
comando1
comando2 --parametro
comando3
```

Com o slash command:
```bash
/nome-do-comando exemplo
```

## Implementação

Este comando é um wrapper que:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

## Registro

Adicione ao arquivo `.claude/commands.json`:

```json
{
  "name": "nome-do-comando",
  "description": "Descrição curta",
  "prompt": "Instruções para o Claude executar o comando",
  "arguments": [
    {
      "name": "arg1",
      "description": "Descrição do argumento",
      "required": true
    }
  ]
}
```

# Hooks de Automação

Esta pasta contém hooks que interceptam eventos do Claude Code para automação e segurança.

## Hooks Configurados

### PreToolUse (`pre-tool-use.js`)
Intercepta chamadas de ferramentas antes da execução para:
- Verificar e anunciar skills relevantes
- Sugerir contexto adicional
- Validar parâmetros

### Security Check (`security-check.js`)
Detecta instruções maliciosas potencialmente injetadas em:
- Arquivos CLAUDE.md de repositórios externos
- Arquivos de skills
- Prompts de usuários

## Como Funcionam

Hooks são scripts que rodam em pontos específicos do ciclo de vida do Claude Code. Eles podem:
- Inspecionar ações antes da execução
- Modificar comportamento
- Bloquear ações suspeitas
- Registrar logs

## Status

- [ ] PreToolUse - Implementado no Bloco 3
- [ ] Security Check - Implementado no Bloco 3

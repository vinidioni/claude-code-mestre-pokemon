# Guia Completo do Claude Code

## O que é o Claude Code?

O Claude Code é a CLI oficial da Anthropic que permite interagir com os modelos Claude (Opus, Sonnet, Haiku, Fable) diretamente do terminal. Ele é um parceiro de programação interativo que pode:

- **Ler e editar arquivos** - Analisa código, documentação, configs
- **Executar comandos** - Roda testes, builds, scripts
- **Navegar projetos** - Busca, grep, glob patterns
- **Gerenciar git** - Commits, PRs, branches
- **Orquestrar workflows** - Múltiplos agentes em paralelo

---

## Instalação e Primeiros Passos

### Instalação
```bash
# macOS
brew install claude-code

# Windows (via npm)
npm install -g @anthropic-ai/claude-code

# Linux
curl -fsSL https://claude.ai/install.sh | bash
```

### Login
```bash
claude login
```

---

## Comandos Essenciais

### Navegação e Busca

| Comando | Descrição |
|---------|-----------|
| `/help` | Mostra todos os comandos disponíveis |
| `/clear` | Limpa o contexto da conversa |
| `/cost` | Mostra o custo da sessão atual |
| `/tokens` | Mostra uso de tokens do contexto |

### Modos de Interação

```bash
# Modo interativo (padrão)
claude

# Executar um comando direto
claude "explique esse código"

# Modo plano (planejamento sem execução)
claude --planner
```

---

## Ferramentas Principais

### 1. Leitura de Arquivos (`Read`)
```
Você: Leia o arquivo src/app.js
```
O Claude lê e analisa o conteúdo.

### 2. Edição de Arquivos (`Edit`)
```
Você: Adicione uma função de validação no arquivo utils.js
```
O Claude propõe edições precisas.

### 3. Busca (`Grep`)
```
Você: Procure por todas as ocorrências de "TODO" no projeto
```
Busca com regex em todo o codebase.

### 4. Padrões de Arquivo (`Glob`)
```
Você: Liste todos os arquivos .test.ts
```
Usa patterns como `**/*.test.ts`.

### 5. Comandos Bash (`Bash`)
```
Você: Execute os testes
```
Roda comandos no terminal.

### 6. Workflows (`Workflow`)
```
Você: Crie um workflow para revisar todo o código
```
Orquestra múltiplos agentes em paralelo.

### 7. Agentes (`Agent`)
```
Você: Crie um subagente para analisar segurança
```
Delega tarefas complexas.

---

## Organização de Projetos

### Estrutura Recomendada

```
meu-projeto/
├── .claude/
│   ├── workflows/          # Workflows reutilizáveis
│   │   ├── code-review.yaml
│   │   └── security-audit.yaml
│   └── CLAUDE.md           # Contexto persistente do projeto
├── memory/                 # Memória do Claude (auto-gerado)
├── src/
├── tests/
├── docs/
└── README.md
```

### Arquivo CLAUDE.md

Crie em `.claude/CLAUDE.md` com contexto do projeto:

```markdown
# Contexto do Projeto

## Stack Tecnológica
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + Express
- Banco: PostgreSQL
- Testes: Vitest + Testing Library

## Convenções
- Usar arrow functions
- Nomes em camelCase
- Componentes: PascalCase
- Testes: `.test.ts` junto ao código

## Comandos Importantes
- `npm run dev` - Inicia servidor
- `npm test` - Executa testes
- `npm run lint` - Verifica código

## Estrutura de Pastas
/src
  /components    # Componentes React
  /hooks         # Custom hooks
  /utils         # Funções utilitárias
  /services      # APIs e serviços
```

### Workflows Comuns

**code-review.yaml:**
```yaml
name: code-review
description: Revisa código em múltiplas dimensões
steps:
  - name: security
    prompt: "Analise segurança do código alterado"
  - name: performance
    prompt: "Identifique gargalos de performance"
  - name: tests
    prompt: "Verifique cobertura de testes"
```

---

## Governança e Boas Práticas

### 1. Versionamento de Memória

O Claude Code mantém memória persistente em `.claude/memory/`:

```markdown
---
name: api-conventions
description: Convenções da API REST
type: project
---

Usamos REST com JSON.
- POST /api/v1/resources
- GET /api/v1/resources/:id
- Erros: { error: string, code: number }
```

**Tipos de memória:**
- `user` - Preferências do usuário
- `project` - Decisões do projeto
- `feedback` - Correções recebidas
- `reference` - Links úteis

### 2. Permissões e Segurança

O Claude opera em modos de permissão:
- **Read-only** - Só leitura
- **Edit** - Pode editar arquivos
- **Bash** - Pode executar comandos
- **Dangerous** - Comandos destrutivos (requer confirmação)

### 3. Commits e PRs

```bash
# Claude pode ajudar com commits
claude "crie um commit das mudanças atuais"

# Criar PR
git push origin feature-branch
gh pr create --title "Nova feature" --body "..."
```

### 4. Code Review com Claude

```
Você: Revise as mudanças no PR #123
```

O Claude analisa:
- Bugs potenciais
- Problemas de segurança
- Performance
- Cobertura de testes
- Convenções do projeto

---

## Padrões de Uso

### Fluxo de Desenvolvimento

1. **Exploração**
   ```
   "Explique a arquitetura deste projeto"
   "Onde estão as rotas da API?"
   ```

2. **Desenvolvimento**
   ```
   "Crie um componente de formulário de login"
   "Adicione validação com zod"
   ```

3. **Testes**
   ```
   "Crie testes unitários para o componente"
   "Execute os testes e verifique cobertura"
   ```

4. **Refatoração**
   ```
   "Refatore esse código para usar hooks"
   "Extraia essa lógica para um utilitário"
   ```

### Exemplos de Prompts Efetivos

**Ruim:**
```
"Conserte isso"
```

**Bom:**
```
"O componente UserProfile está com erro de hydration no Next.js. 
O erro ocorre na linha 23 quando user.name é undefined. 
Adicione uma verificação segura e um estado de loading."
```

**Padrão C-E-R:**
- **C**ontexto: "Estamos usando React Query"
- **E**specificação: "Crie um hook useUsers"
- **R**estrições: "Deve ter cache de 5 minutos e retry de 3x"

---

## Workflows Avançados

### Auditoria de Segurança
```javascript
export const meta = {
  name: 'security-audit',
  description: 'Audita segurança do código',
  phases: [
    { title: 'Scan', detail: 'Busca vulnerabilidades conhecidas' },
    { title: 'Verify', detail: 'Verifica cada achado' }
  ]
}

phase('Scan')
const findings = await agent('Busque SQL injection, XSS, etc', {
  schema: FINDINGS_SCHEMA
})

phase('Verify')
const verified = await parallel(findings.map(f => () =>
  agent(`Verifique: ${f.description}`, { schema: VERDICT_SCHEMA })
))
```

### Refatoração em Escala
```
Você: Migre todos os componentes de classes para hooks
```

O Claude pode:
1. Encontrar todos os componentes de classe
2. Criar plano de migração
3. Executar migrações em paralelo
4. Verificar cada mudança

---

## Integração com CI/CD

### GitHub Actions
```yaml
name: Claude Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Claude Review
        run: |
          claude "revise as mudanças deste PR focando em segurança"
```

### Pre-commit Hooks
```bash
# .husky/pre-commit
claude "verifique se o código segue as convenções do projeto"
```

---

## Dicas e Truques

### 1. Contexto Infinito
- Use arquivos CLAUDE.md para contexto persistente
- O Claude resume conversas longas automaticamente

### 2. Ferramentas Especializadas
```bash
# Use skills disponíveis
/deploy    # Deploy do projeto
/test      # Executar testes específicos
/docs      # Gerar documentação
```

### 3. Múltiplos Modelos
```bash
# Use modelos específicos para tarefas
claude --model haiku "resuma este arquivo"  # Rápido
claude --model opus "arquitete este sistema" # Profundo
```

### 4. Isolamento
```bash
# Worktrees para trabalho paralelo
claude --worktree "experimente essa refatoração"
```

---

## Comandos Úteis do Sistema

```bash
# Informações do sistema
claude --version          # Versão do CLI
claude --models           # Lista modelos disponíveis
claude --config           # Configurações

# Gestão de sessão
claude --resume          # Resume sessão anterior
claude --history         # Histórico de comandos
```

---

## Resolução de Problemas

### Token limit exceeded
```
Você: Resuma o contexto atual
Você: Foque apenas no arquivo X
```

### Claude não entendeu
- Seja mais específico
- Forneça exemplos
- Divida em passos menores

### Erro de permissão
```bash
# Verifique permissões do diretório
ls -la .claude/
chmod -R 755 .claude/
```

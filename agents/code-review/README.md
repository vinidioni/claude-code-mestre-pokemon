# code-review

Agente de revisão de código automatizada.

## Propósito

Executa revisão de código abrangente analisando múltiplas dimensões:
- 🐛 Bugs e problemas de lógica
- 🔒 Vulnerabilidades de segurança
- ⚡ Gargalos de performance
- 📖 Legibilidade e manutenibilidade
- 🧪 Testabilidade

## Uso

### Básico
```bash
# Revisar mudanças não commitadas
claude "execute code-review"

# Revisar arquivo específico
claude "execute code-review --target=src/components/Button.tsx"

# Revisar diretório
claude "execute code-review --target=src/api/"
```

### Foco Específico
```bash
# Apenas segurança
claude "execute code-review --focus=security"

# Apenas performance
claude "execute code-review --focus=performance"

# Apenas bugs
claude "execute code-review --focus=bugs"
```

### Filtrar Severidade
```bash
# Apenas erros críticos
claude "execute code-review --severity=error"

# Warnings e acima
claude "execute code-review --severity=warning"
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| target | string | Não | `git diff HEAD` | Alvo da análise |
| focus | string | Não | `all` | Foco específico |
| severity | string | Não | `all` | Severidade mínima |

### Valores para `target`
- `git diff` (padrão): mudanças não staged
- `git diff HEAD`: mudanças desde último commit
- Caminho de arquivo: `src/api/users.ts`
- Caminho de diretório: `src/components/`

### Valores para `focus`
- `all`: Todas as dimensões
- `security`: Apenas segurança
- `performance`: Apenas performance
- `bugs`: Apenas bugs e lógica
- `style`: Apenas estilo e legibilidade

## Output

O relatório é gerado em formato Markdown com:

### 🔴 CRÍTICO
Issues que devem ser corrigidas antes do merge.

### 🟡 IMPORTANTE
Issues que devem ser corrigidas na sprint atual.

### 🟢 SUGESTÃO
Melhorias para considerar futuramente.

### 📊 Resumo
- Total de issues
- Distribuição por severidade
- Recomendações prioritárias

O arquivo é salvo automaticamente em:
`reports/{data}/code-review-{timestamp}.md`

## Checklist de Análise

### Segurança
- [ ] SQL Injection
- [ ] XSS
- [ ] CSRF
- [ ] Path Traversal
- [ ] Hardcoded secrets
- [ ] Validação de input
- [ ] Autenticação/autorização

### Performance
- [ ] Complexidade algorítmica
- [ ] Re-renderizações
- [ ] Memory leaks
- [ ] N+1 queries
- [ ] Lazy loading
- [ ] Caching

### Bugs
- [ ] Race conditions
- [ ] Null/undefined handling
- [ ] Off-by-one errors
- [ ] Async/await correto
- [ ] Erros de tipagem

### Qualidade
- [ ] Tamanho de funções
- [ ] Código duplicado
- [ ] Nomenclatura
- [ ] Complexidade ciclomática
- [ ] Tratamento de erros
- [ ] Testes

## Exemplo de Output

```markdown
# Code Review Report

## 🔴 CRÍTICO

### src/auth.ts:23
**Vulnerabilidade:** SQL Injection
```typescript
const query = `SELECT * FROM users WHERE id = ${userId}`;
```
**Correção:**
```typescript
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

## 🟡 IMPORTANTE

### src/api.ts:45
**Problema:** Função muito longa (85 linhas)
**Sugestão:** Extrair em funções menores

## 📊 Resumo
- Total: 12 issues
- Críticas: 1
- Importantes: 5
- Sugestões: 6
```

## Integração com CI/CD

### GitHub Actions
```yaml
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Claude Code Review
        run: |
          claude "execute code-review --target=${{ github.event.pull_request.base.sha }}..${{ github.sha }}"
```

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
claude "execute code-review --severity=error"
if [ $? -ne 0 ]; then
  echo "Erros críticos encontrados. Corrija antes de commitar."
  exit 1
fi
```

## Limitações

- Não executa código (análise estática apenas)
- Pode ter falsos positivos
- Requer contexto do projeto para análises mais precisas
- Performance depende do tamanho do codebase

## Histórico

- 1.0.0 (2024-07-07) - Versão inicial

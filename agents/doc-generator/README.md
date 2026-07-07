# doc-generator

Gera documentação automaticamente a partir do código.

## Propósito

Automatiza a criação e manutenção de documentação:
- README.md profissionais
- Documentação de API (OpenAPI/Swagger)
- Changelogs a partir de commits
- Guias de contribuição
- Documentação de arquitetura
- Comentários inline (JSDoc/TSDoc)

## Uso

### README
```bash
# Gerar README do projeto
claude "execute doc-generator --type=readme"

# Gerar README para submódulo
claude "execute doc-generator --type=readme --target=src/auth/"
```

### Documentação de API
```bash
# Gerar docs da API
claude "execute doc-generator --type=api"

# Formato específico
claude "execute doc-generator --type=api --output=docs/openapi.yaml"
```

### Changelog
```bash
# Desde última tag
claude "execute doc-generator --type=changelog"

# Período específico
claude "execute doc-generator --type=changelog --since=v1.0.0"
```

### Contribuição
```bash
claude "execute doc-generator --type=contributing"
```

### Arquitetura
```bash
claude "execute doc-generator --type=architecture"
```

### Comentários Inline
```bash
# Todo projeto
claude "execute doc-generator --type=inline"

# Arquivo específico
claude "execute doc-generator --type=inline --target=src/utils.ts"
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| type | string | Sim | `readme` | Tipo de documentação |
| target | string | Não | `.` | Alvo da geração |
| output | string | Não | (auto) | Caminho de saída |

### Tipos de Documentação

| Tipo | Descrição | Output Padrão |
|------|-----------|---------------|
| readme | README.md do projeto | `README.md` |
| api | Documentação de API | `docs/api.md` |
| changelog | Changelog | `CHANGELOG.md` |
| contributing | Guia de contribuição | `CONTRIBUTING.md` |
| architecture | Doc de arquitetura | `docs/architecture.md` |
| inline | Comentários JSDoc/TSDoc | (inline) |

## Templates

### README Gerado

Inclui automaticamente:
- Título e descrição
- Badges (se detectado CI)
- Features principais
- Stack tecnológica
- Instalação e configuração
- Exemplos de uso
- Testes
- Estrutura de pastas
- Contribuição
- Licença

### API Docs

Suporta:
- REST API (Markdown ou OpenAPI)
- GraphQL (schemas e exemplos)
- gRPC (protobuf docs)

### Changelog

Segue [Keep a Changelog](https://keepachangelog.com/):
- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

## Exemplos

### Antes e Depois

**Projeto sem README:**
```
src/
├── index.ts
├── api.ts
└── utils.ts
```

**Após executar:**
```markdown
# Meu Projeto

## 🎯 Propósito
API REST para gerenciamento de tarefas.

## 🚀 Tecnologias
- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma

## 📦 Instalação
```bash
npm install
npm run migrate
npm run dev
```

## 🔧 Configuração
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
```

## 🚦 Uso
```bash
curl http://localhost:3000/api/tasks
```

## 📁 Estrutura
```
src/
├── index.ts      # Entry point
├── api.ts        # Rotas da API
└── utils.ts      # Utilitários
```
```

## Customização

Para customizar a saída, edite o workflow ou crie um novo baseado no template.

## Dicas

1. **Revise sempre** - A documentação gerada é um ponto de partida
2. **Adicione contexto** - Inclua informações específicas do negócio
3. **Mantenha atualizado** - Regere periodicamente
4. **Use no CI** - Gere docs automaticamente em releases

## Integração com CI

### GitHub Actions - Gerar README
```yaml
name: Generate Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate README
        run: claude "execute doc-generator --type=readme"
      - name: Commit changes
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add README.md
          git commit -m "[doc] Atualiza README automaticamente" || true
          git push
```

### GitHub Actions - Changelog
```yaml
name: Changelog
on:
  release:
    types: [created]
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Generate Changelog
        run: claude "execute doc-generator --type=changelog"
```

## Limitações

- Requer código bem estruturado para melhores resultados
- Não substitui documentação de negócio
- Comentários inline podem precisar de revisão humana
- Detecção de stack limitada às mais comuns

## Histórico

- 1.0.0 (2024-07-07) - Versão inicial

# Plano de Ação: Gattaran Order Viewer

> **Objetivo**: Permitir que o Claude acesse e analise orders no Gattaran navegando por
> City Services → Transaction Management → Order Management, inserindo Order ID e Current City.

---

## 🎯 Escopo do Projeto

### Caso de Teste
- **Order ID**: `5764678978203877694`
- **Cidade**: `Goiânia`
- **URL Base**: `https://gattaran.didi-food.com/v2/home`
- **Fluxo**: City Services → Transaction Management → Order Management

---

## 📋 Análise das Skills Existentes (SkillsHub)

### Skills Analisadas

| Skill | Categoria | Insights Aproveitáveis |
|-------|-----------|----------------------|
| `gattaran-coupon-batch-auto` | Automação de Cupons | Padrões de batch processing, estrutura de APIs |
| `gattaran-coupon-creator` | Criação de Cupons | Autenticação e endpoints do Gattaran |
| `gattaran-coupon-activity-batch` | Atividades em Lote | Estrutura de sessões e cookies |
| `gattaran-exp-diff` | Análise de Experimentos | Padrões de análise e extração de dados |
| `soda-ai-gattaran-workflow` | Workflow com IA | Arquitetura de automação inteligente |
| `city-budget-rpo` | Orçamento por Cidade | Uso de city codes/slugs |
| `gtr-frontend-page-generator` | Geração Frontend | Estrutura de navegação e componentes |
| `lowcode-material-creator` | Low-Code | Componentes reutilizáveis |

### Aprendizados Principais

1. **Autenticação**: As skills usam sessões autenticadas via cookies DiDi
2. **Estrutura de APIs**: O Gattaran expõe endpoints REST para operações
3. **Padrões de Resposta**: JSON estruturado com campos padronizados
4. **Fluxos Comuns**: Padrão de navegação via menu lateral (City Services → ...)

---

## 🏗️ Decisão Arquitetural: MCP vs Navegação no Browser

### Opção 1: MCP Server (Recomendada)

**Vantagens:**
- Acesso direto às APIs internas do Gattaran (mais rápido)
- Sem dependência de interface gráfica
- Reutilizável por outros agentes/workflows
- Integra nativamente com Claude Code

**Desvantagens:**
- Requer engenharia reversa das APIs
- Pode quebrar se as APIs mudarem
- Necessita autenticação programática

### Opção 2: Automação de Browser (Puppeteer/Playwright)

**Vantagens:**
- Mais resiliente a mudanças de API
- Navegação visual idêntica ao usuário humano
- Não requer engenharia reversa

**Desvantagens:**
- Mais lento (carrega toda a UI)
- Mais frágil a mudanças de layout
- Requer gerenciamento de sessão de browser

### ✅ Decisão: Abordagem Híbrida

**Fase 1**: Usar **navegação de browser** para o MVP rápido
**Fase 2**: Migrar para **APIs diretas** após mapeamento

---

## 📅 Plano de Etapas

### Fase 1: Setup e Prova de Conceito (Semana 1)

#### Etapa 1.1: Configuração de Ambiente
- [ ] Verificar acesso à URL `https://gattaran.didi-food.com/v2/home`
- [ ] Confirmar credenciais de login DiDi válidas
- [ ] Testar navegação manual no browser do usuário
- [ ] Documentar estrutura de login/autenticação

#### Etapa 1.2: MCP Server Puppeteer (POC)
- [ ] Criar estrutura do MCP server em `mcp-servers/gattaran/`
- [ ] Implementar ferramenta `navigate_to_order`
- [ ] Implementar ferramenta `extract_order_details`
- [ ] Testar com a order de exemplo

#### Etapa 1.3: Validação do Caso de Teste
- [ ] Executar fluxo completo com order `5764678978203877694`
- [ ] Extrair e documentar campos disponíveis
- [ ] Validar precisão dos dados extraídos

**Entregável**: MCP Server funcional via navegação de browser

---

### Fase 2: Engenharia Reversa de APIs (Semana 2)

#### Etapa 2.1: Mapeamento de APIs
- [ ] Inspecionar network requests no browser
- [ ] Identificar endpoints de:
  - [ ] Busca de orders (`/api/orders/search`?)
  - [ ] Detalhes de order (`/api/orders/{id}`?)
  - [ ] Lista de cidades (`/api/cities`?)
- [ ] Documentar headers necessários (auth tokens, etc.)

#### Etapa 2.2: Implementação de API Client
- [ ] Criar cliente HTTP com autenticação
- [ ] Implementar `search_order(order_id, city)`
- [ ] Implementar `get_order_details(order_id)`
- [ ] Adicionar tratamento de erros

#### Etapa 2.3: Atualização do MCP
- [ ] Adicionar modo API ao MCP server
- [ ] Manter modo browser como fallback
- [ ] Criar configuração para switch entre modos

**Entregável**: MCP Server com dupla capacidade (Browser + API)

---

### Fase 3: Automação Inteligente (Semana 3)

#### Etapa 3.1: Skill Gattaran
- [ ] Criar skill em `.claude/skills/gattaran-order-viewer/`
- [ ] Definir triggers: "gattaran", "order", "buscar order"
- [ ] Integrar com MCP server

#### Etapa 3.2: Templates de Análise
- [ ] Criar template de relatório de order
- [ ] Definir campos críticos a extrair
- [ ] Criar visualização formatada

#### Etapa 3.3: Workflow de Automação
- [ ] Criar workflow para batch processing
- [ ] Permitir múltiplas orders em sequência
- [ ] Exportar resultados (CSV/JSON)

**Entregável**: Sistema completo de visualização e análise

---

### Fase 4: Refinamento e Documentação (Semana 4)

#### Etapa 4.1: Documentação
- [ ] Documentar uso no `mcp-servers/gattaran/README.md`
- [ ] Criar guia de troubleshooting
- [ ] Documentar limitações conhecidas

#### Etapa 4.2: Otimização
- [ ] Cache de sessões
- [ ] Retry logic para falhas
- [ ] Rate limiting

#### Etapa 4.3: Testes
- [ ] Testes com múltiplas cidades
- [ ] Testes com diferentes tipos de orders
- [ ] Validação de edge cases

**Entregável**: Sistema em produção, documentado e testado

---

## 🛠️ Estrutura Técnica Proposta

### MCP Server: `mcp-servers/gattaran/`

```
gattaran/
├── src/
│   ├── index.js              # Entry point MCP
│   ├── browser/
│   │   ├── navigator.js      # Navegação Puppeteer
│   │   └── extractor.js      # Extração de dados
│   ├── api/
│   │   ├── client.js         # Cliente HTTP
│   │   └── endpoints.js      # Definições de endpoints
│   └── utils/
│       ├── auth.js           # Gerenciamento de auth
│       └── formatter.js      # Formatação de saída
├── config/
│   └── default.json          # Configurações
├── package.json
└── README.md
```

### Tools do MCP

| Tool | Descrição | Parâmetros |
|------|-----------|------------|
| `gattaran_navigate` | Navega para URL do Gattaran | `url`, `credentials` |
| `gattaran_search_order` | Busca order por ID | `order_id`, `city` |
| `gattaran_get_order_details` | Extrai detalhes completos | `order_id` |
| `gattaran_list_cities` | Lista cidades disponíveis | - |

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Autenticação 2FA obrigatória | Média | Alto | Usar session cookies persistentes |
| Mudanças na UI do Gattaran | Alta | Médio | Fallback para modo API |
| Rate limiting | Média | Médio | Implementar delays e retries |
| Dados sensíveis | Baixa | Alto | Não logar PII, usar variáveis de ambiente |

---

## 📊 Métricas de Sucesso

- [ ] Conseguir extrair detalhes da order de teste em < 30 segundos
- [ ] Precisão de 100% nos campos críticos
- [ ] Funcionar para pelo menos 3 cidades diferentes
- [ ] Documentação completa para outros usuários

---

## 🔗 Referências

- [SkillsHub Analysis](../../skillshub_analysis_summary.md)
- [Cooper Doc Gattaran](https://cooper.didichuxing.com/knowledge/2204950953008/2204951852679)
- [Pebble Design System](http://pebble.design.intra.didiglobal.com/design/principle.html)

---

**Próximo Passo**: Validar acesso à URL do Gattaran e testar login manual.

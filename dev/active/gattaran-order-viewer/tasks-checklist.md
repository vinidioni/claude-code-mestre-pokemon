# Checklist de Tarefas: Gattaran Order Viewer

## Fase 1: Setup e Prova de Conceito

### Etapa 1.1: Configuração de Ambiente
- [ ] 1.1.1 Verificar acesso à URL `https://gattaran.didi-food.com/v2/home`
- [ ] 1.1.2 Confirmar credenciais de login DiDi válidas
- [ ] 1.1.3 Testar navegação manual: City Services → Transaction Management → Order Management
- [ ] 1.1.4 Documentar estrutura de login/autenticação encontrada

### Etapa 1.2: MCP Server Puppeteer (POC)
- [ ] 1.2.1 Criar estrutura do MCP server em `mcp-servers/gattaran/`
  - [ ] Criar `package.json` com dependências (puppeteer, @modelcontextprotocol/sdk)
  - [ ] Criar estrutura de pastas `src/`, `config/`
- [ ] 1.2.2 Implementar ferramenta `navigate_to_order`
  - [ ] Navegar para Gattaran
  - [ ] Lidar com login (se necessário)
  - [ ] Clicar em City Services
  - [ ] Clicar em Transaction Management
  - [ ] Clicar em Order Management
- [ ] 1.2.3 Implementar ferramenta `extract_order_details`
  - [ ] Inserir Order ID no campo
  - [ ] Inserir Current City no campo
  - [ ] Clicar em buscar/submit
  - [ ] Extrair dados da página de detalhes
- [ ] 1.2.4 Testar com a order de exemplo `5764678978203877694`

### Etapa 1.3: Validação do Caso de Teste
- [ ] 1.3.1 Executar fluxo completo com order `5764678978203877694`
- [ ] 1.3.2 Extrair e documentar todos os campos disponíveis
- [ ] 1.3.3 Validar precisão dos dados extraídos
- [ ] 1.3.4 Documentar tempo de execução

---

## Fase 2: Engenharia Reversa de APIs

### Etapa 2.1: Mapeamento de APIs
- [ ] 2.1.1 Inspecionar network requests no DevTools do browser
- [ ] 2.1.2 Identificar endpoint de busca de orders
- [ ] 2.1.3 Identificar endpoint de detalhes de order
- [ ] 2.1.4 Identificar endpoint de lista de cidades (se existir)
- [ ] 2.1.5 Documentar headers necessários (auth tokens, cookies, etc.)
- [ ] 2.1.6 Documentar formato de request/response

### Etapa 2.2: Implementação de API Client
- [ ] 2.2.1 Criar cliente HTTP com autenticação (axios/fetch)
- [ ] 2.2.2 Implementar `search_order(order_id, city)`
- [ ] 2.2.3 Implementar `get_order_details(order_id)`
- [ ] 2.2.4 Adicionar tratamento de erros (404, 401, 500, rate limit)
- [ ] 2.2.5 Testar API client com order de exemplo

### Etapa 2.3: Atualização do MCP
- [ ] 2.3.1 Adicionar modo API ao MCP server
- [ ] 2.3.2 Manter modo browser como fallback
- [ ] 2.3.3 Criar configuração para switch entre modos
- [ ] 2.3.4 Testar ambos os modos

---

## Fase 3: Automação Inteligente

### Etapa 3.1: Skill Gattaran
- [ ] 3.1.1 Criar pasta da skill em `.claude/skills/gattaran-order-viewer/`
- [ ] 3.1.2 Criar `SKILL.md` com descrição e triggers
- [ ] 3.1.3 Definir triggers: "gattaran", "order", "buscar order"
- [ ] 3.1.4 Integrar skill com MCP server
- [ ] 3.1.5 Adicionar regra em `skill-rules.json`

### Etapa 3.2: Templates de Análise
- [ ] 3.2.1 Definir campos críticos a extrair
- [ ] 3.2.2 Criar template de relatório de order
- [ ] 3.2.3 Criar visualização formatada (markdown)
- [ ] 3.2.4 Adicionar análise automática (status, flags, etc.)

### Etapa 3.3: Workflow de Automação
- [ ] 3.3.1 Criar workflow YAML para batch processing
- [ ] 3.3.2 Permitir múltiplas orders em sequência
- [ ] 3.3.3 Adicionar exportação de resultados (CSV/JSON)
- [ ] 3.3.4 Documentar workflow em `agents/gattaran-batch/`

---

## Fase 4: Refinamento e Documentação

### Etapa 4.1: Documentação
- [ ] 4.1.1 Escrever `mcp-servers/gattaran/README.md`
- [ ] 4.1.2 Documentar instalação e configuração
- [ ] 4.1.3 Documentar uso das ferramentas
- [ ] 4.1.4 Criar guia de troubleshooting
- [ ] 4.1.5 Documentar limitações conhecidas

### Etapa 4.2: Otimização
- [ ] 4.2.1 Implementar cache de sessões
- [ ] 4.2.2 Adicionar retry logic para falhas
- [ ] 4.2.3 Implementar rate limiting
- [ ] 4.2.4 Otimizar tempo de resposta

### Etapa 4.3: Testes
- [ ] 4.3.1 Testar com cidade: Goiânia
- [ ] 4.3.2 Testar com cidade: São Paulo
- [ ] 4.3.3 Testar com cidade: Rio de Janeiro
- [ ] 4.3.4 Testar orders com diferentes status
- [ ] 4.3.5 Testar edge cases (order não encontrada, erro de auth)

---

## Métricas de Sucesso

- [ ] Extrair detalhes da order em < 30 segundos
- [ ] Precisão de 100% nos campos críticos
- [ ] Funcionar para pelo menos 3 cidades diferentes
- [ ] Documentação completa e testada

---

## Tarefas Atuais (Prioridade)

### Em Andamento
*None*

### Concluídas ✅
1. [x] 1.1.1 - Verificar acesso à URL do Gattaran
2. [x] 1.1.2 - Confirmar credenciais de login
3. [x] 1.1.3 - Testar navegação manual
4. [x] 1.2.1 - Criar estrutura do MCP server
5. [x] 1.2.2 - Implementar ferramentas do MCP
6. [x] 1.2.3 - Instalar Playwright e Chromium
7. [x] 1.2.4 - Testar com a order de exemplo
8. [x] 1.3.1 - Extrair detalhes de cancelamento
9. [x] 1.3.2 - Extrair Control Information do entregador
10. [x] 1.3.3 - Organização de governança

### Próximas
- [ ] 2.1.1 - Mapear endpoints internos do Gattaran
- [ ] 2.2.1 - Implementar modo API direta
- [ ] 3.1.1 - Criar skill `gattaran-order-viewer`

---

## Log de Progresso

| Data | Tarefa | Status | Notas |
|------|--------|--------|-------|
| 2026-07-20 | Criação do plano | ✅ | Plano criado e documentado |
| 2026-07-20 | Análise de skills | ✅ | 8 skills analisadas |
| 2026-07-21 | Busca de orders | ✅ | Funcionando com sessão persistente |
| 2026-07-21 | Extração de detalhes | ✅ | Motivo de cancelamento extraído |
| 2026-07-21 | Control Information | ✅ | Dados do entregador acessíveis |
| 2026-07-21 | Governança | ✅ | Estrutura reorganizada e documentada |

# MCP Hub DiDi - Análise Completa

> Data: 2026-07-23
> Total MCPs analisados: 17
> Origem: https://mcphub.intra.xiaojukeji.com

---

## Resumo por Categoria

| Categoria | Quantidade | MCPs |
|-----------|------------|------|
| **Oficiais (ModelContextProtocol)** | 6 | google-drive, gitlab, github, google-maps, puppeteer, playwright |
| **DiDi Internos** | 6 | 数梦MCP, DiDi-MCP-Server, star, apollo-mcp, rider-feature-explanation, bigdata-server-diag-mcp |
| **Utilitários/DevTools** | 3 | github-actions, everything-search, mcp-deepwiki |
| **AI/ML** | 2 | replicate, Apollo-mcp (Go) |

---

## Análise Detalhada por MCP

### 🔥 ALTA PRIORIDADE - Para Adotar Imediatamente

#### 1. **everything-search**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Busca ultra-rápida de arquivos no sistema (Windows/Mac/Linux) |
| **O que faz** | Usa Everything SDK (Windows), mdfind (Mac), locate (Linux) para buscar arquivos na máquina local |
| **Para que serve** | Achar arquivos no PC rapidamente - logs, configs, documentos |
| **Como usar** | `uvx mcp-server-everything-search` + EVERYTHING_SDK_PATH |
| **Aproveitar** | ✅ MUITO ÚTIL - Já podemos usar localmente! Instalar no DCC para buscar arquivos do projeto |

---

#### 2. **Playwright MCP (Microsoft)**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Automação de browser oficial da Microsoft via MCP |
| **O que faz** | 19 ferramentas: navegar, clicar, screenshot, upload, preencher forms, extrair dados |
| **Para que serve** | Automatizar tarefas web, extrair dados de sites, testes E2E |
| **Como usar** | `npx @playwright/mcp@latest` |
| **Aproveitar** | ✅ SUBSTITUIR nossa skill intranet-fetcher - é mais completo e mantido pela Microsoft |

---

#### 3. **Puppeteer**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Automação de browser via Puppeteer (Google Chrome) |
| **O que faz** | 7 ferramentas: navegar, screenshot, click, fill, select, hover, evaluate JS |
| **Para que serve** | Similar ao Playwright mas com foco em Chrome |
| **Como usar** | `npx -y @modelcontextprotocol/server-puppeteer` |
| **Aproveitar** | ⚠️ **Escolher**: Puppeteer OU Playwright (não ambos). Playwright é mais moderno |

---

### 🛠️ FERRAMENTAS DE DESENVOLVIMENTO

#### 4. **GitHub** (Oficial)
| Campo | Descrição |
|-------|-----------|
| **O que é** | MCP oficial para GitHub API |
| **O que faz** | 26 ferramentas: criar/atualizar arquivos, criar repos, search, issues, PRs, commits |
| **Para que serve** | Gerenciar repositórios, código, issues |
| **Como usar** | `npx -y @modelcontextprotocol/server-github` + GITHUB_PERSONAL_ACCESS_TOKEN |
| **Aproveitar** | ✅ ADICIONAR ao nosso .mcp.json - substitui config atual de GitHub |

---

#### 5. **GitLab** (Oficial)
| Campo | Descrição |
|-------|-----------|
| **O que é** | MCP oficial para GitLab API |
| **O que faz** | 9 ferramentas: criar/atualizar arquivos, search repos, criar projetos, ler conteúdo |
| **Para que serve** | Gerenciar projetos GitLab (se a DiDi usa GitLab interno) |
| **Como usar** | `npx -y @modelcontextprotocol/server-gitlab` + GITLAB_API_URL + GITLAB_PERSONAL_ACCESS_TOKEN |
| **Aproveitar** | ✅ ADICIONAR se a DiDi usa GitLab interno. Verificar primeiro qual GIT usam |

---

#### 6. **GitHub Actions**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Interagir com workflows do GitHub Actions |
| **O que faz** | Listar workflows, trigger execuções, ver status |
| **Para que serve** | Monitorar CI/CD, disparar builds, ver pipelines |
| **Como usar** | `npx -y https://github.com/ko1ynnky/github-actions-mcp-server` + GITHUB_PERSONAL_ACCESS_TOKEN |
| **Aproveitar** | ⚠️ BACKLOG - Útil mas não prioritário agora. Adicionar depois do GitHub base |

---

### 🗄️ PRODUTIVIDADE E ARMAZENAMENTO

#### 7. **Google Drive** (Oficial)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Acesso a arquivos do Google Drive |
| **O que faz** | Search de arquivos no Drive |
| **Para que serve** | Buscar documentos, planilhas, apresentações |
| **Como usar** | `npx -y @modelcontextprotocol/server-gdrive` |
| **Aproveitar** | ⚠️ VERIFICAR - Já temos Google Workspace configurado. Este é específico para Drive |

---

#### 8. **mcp-deepwiki**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Busca conhecimento de repositórios no deepwiki.com |
| **O que faz** | Fetch documentação de repos em formato Markdown |
| **Para que serve** | Achar documentação técnica de bibliotecas |
| **Como usar** | `npx -y mcp-deepwiki@latest` |
| **Aproveitar** | ⚠️ BACKLOG - Interessante para pesquisa técnica, mas não essencial |

---

### 🗺️ MAPS E LOCALIZAÇÃO

#### 9. **Google Maps** (Oficial)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Serviços de localização Google Maps |
| **O que faz** | 7 ferramentas: geocode (endereço → coordenada), reverse geocode, search places, place details, distance matrix, elevation, directions |
| **Para que serve** | Análise de rotas, dados geográficos, POI |
| **Como usar** | `npx -y @modelcontextprotocol/server-google-maps` + GOOGLE_MAPS_API_KEY |
| **Aproveitar** | ✅ BACKLOG - Útil para relatórios operacionais da DiDi. Requer API key |

---

#### 10. **DiDi-MCP-Server** (DiDi)
| Campo | Descrição |
|-------|-----------|
| **O que é** | MCP oficial da DiDi para serviços de mobilidade |
| **O que faz** | 10 ferramentas: maps_direction_transit, maps_place_around, maps_regeocode, maps_textsearch, taxi_create_order, taxi_estimate, taxi_cancel_order |
| **Para que serve** | Acesso aos serviços de mapas e mobilidade da DiDi |
| **Como usar** | Via MCP Hub (config streamable-http) |
| **Aproveitar** | ✅ ANALISAR - É usado internamente na DiDi. Pode ser útil para dados de mobilidade |

---

### 🤖 AI/ML

#### 11. **Replicate**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Executar modelos de ML na nuvem via Replicate |
| **O que faz** | 12 ferramentas: search/list models, create/cancel/get predictions, handle images |
| **Para que serve** | Rodar modelos de AI (geração de imagem, text-to-speech, etc) |
| **Como usar** | `npx mcp-replicate` + REPLICATE_API_TOKEN |
| **Aproveitar** | ⚠️ BACKLOG - Útil para experimentos com AI. Requer conta Replicate |

---

### 🔧 FERRAMENTAS INTERNAS DiDi

#### 12. **数梦MCP (Shumeng/Data Dream)**
| Campo | Descrição |
|-------|-----------|
| **O que é** | MCP oficial da plataforma 数梦 (Shumeng) de dados da DiDi |
| **O que faz** | Acesso a datasets internos, analytics, dados de negócio |
| **Para que serve** | Consultar dados internos da DiDi, métricas operacionais |
| **Como usar** | Via MCP Hub com project-code e Authorization Bearer |
| **Aproveitar** | ✅ ESSENCIAL - Acesso aos dados da DiDi para relatórios |

---

#### 13. **apollo-mcp** (DiDi)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Consultar configurações do Apollo (config center da DiDi) |
| **O que faz** | query_apollo_item, list_apollo_enviroments, init, list_keys, get_config |
| **Para que serve** | Ver configs de serviços, ambientes, parâmetros |
| **Como usar** | Via MCP Hub com SSO Cookie |
| **Aproveitar** | ✅ PARA DEVS - Útil para quem trabalha com microserviços na DiDi |

---

#### 14. **Apollo-mcp (Go)**
| Campo | Descrição |
|-------|-----------|
| **O que é** | Versão Go do Apollo MCP com mais features |
| **O que faz** | query_apollo_item, list_apollo_enviroments, query_hive_table_schema, query_app_detail, query_disf_detail, query_disf_topology |
| **Para que serve** | Acesso a configs, schemas Hive, detalhes de apps, rotas DISF |
| **Como usar** | `npx -y --registry=http://npm.intra.xiaojukeji.com/ @didi/mcp-server@latest` |
| **Aproveitar** | ✅ PARA DEVS - Mais completo que o anterior. Inclui query Hive |

---

#### 15. **bigdata-server-diag-mcp** (DiDi)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Ferramenta de diagnóstico de servidores big data |
| **O que faz** | 16 ferramentas: disk_usage, disk_largest, health_check, health_load, health_memory, logs_grep, logs_tail, process_list, port_scan |
| **Para que serve** | Diagnosticar servidores, ver logs, processos, disco, saúde do sistema |
| **Como usar** | Via MCP Hub com streamable-http e API-KEY |
| **Aproveitar** | ✅ ÚTIL - Para SREs e quem precisa debugar servidores internos |

---

#### 16. **rider-feature-explanation** (DiDi)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Consultar métricas e indicadores de entregadores (骑手) |
| **O que faz** | Buscar nomes de métricas, fórmulas de cálculo, definições de negócio |
| **Para que serve** | Análise de dados de entregadores do food delivery |
| **Como usar** | Via MCP Hub com Authorization Bearer |
| **Aproveitar** | ⚠️ ESPECÍFICO - Só útil se trabalha com dados de riders |

---

#### 17. **星辰平台 (Star Platform)** (DiDi)
| Campo | Descrição |
|-------|-----------|
| **O que é** | Acesso aos incidentes e cases da plataforma Star |
| **O que faz** | Consultar casos de incidentes, business lines, tags de falha, itens de melhoria |
| **Para que serve** | Análise de incidentes, post-mortem, melhorias |
| **Como usar** | Via MCP Hub com Authorization Bearer |
| **Aproveitar** | ⚠️ ESPECÍFICO - SRE/DevOps que trabalham com incidentes |

---

## Recomendações de Prioridade

### 🔴 Instalar Imediatamente (Alto Impacto)
1. **everything-search** - Busca local de arquivos
2. **playwright** - Automação web (substitui nossa skill)
3. **github** - Gestão de repos (melhora config atual)

### 🟡 Adicionar em Breve (Médio Impacto)
4. **gitlab** - Se usar GitLab na DiDi
5. **google-maps** - Para análise de dados geográficos
6. **DiDi-MCP-Server** - Para acesso aos serviços DiDi

### 🟢 Backlog (Baixa Prioridade)
7. **google-drive** - Se necessário além do Workspace
8. **github-actions** - Monitoramento CI/CD
9. **mcp-deepwiki** - Pesquisa técnica
10. **replicate** - Experimentos AI
11. **puppeteer** - Playwright cobre isso

### 🔵 DiDi-Internos (Se Relevante)
12. **数梦MCP** - Dados/analytics
13. **Apollo-mcp (Go)** - Configs/services
14. **bigdata-server-diag-mcp** - Diagnóstico servidores
15. **rider-feature-explanation** - Dados riders
16. **星辰平台** - Incidentes

---

## Próximos Passos Sugeridos

1. **Testar** `everything-search` localmente
2. **Substituir** nosso `intranet-fetcher` pelo `playwright` oficial
3. **Atualizar** config GitHub para o MCP oficial
4. **Verificar** se a DiDi usa GitLab interno
5. **Backlog** os demais para avaliação futura

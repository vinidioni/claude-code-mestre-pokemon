# intranet-fetcher

Skill para automação de navegador e extração de conteúdo da intranet DiDi (skillshub, cooper, etc.).

## Visão Geral

A `intranet-fetcher` permite automatizar acesso e extração de dados de páginas internas da DiDi usando Playwright. Projetada para funcionar com autenticação SSO corporativa, reutilizando sessões e suportando múltiplas operações de navegação.

## Funcionalidades

- **Sessão persistente**: Login único, reutilização de cookies
- **Múltiplas operações**: Navegar, clicar, digitar, screenshots, extrair texto/HTML
- **Suporte a múltiplas abas**: Gerenciamento de páginas no mesmo contexto
- **Execução de scripts**: JavaScript arbitrário nas páginas
- **Upload/Download**: Manipulação de arquivos
- **Detecção automática de login**: Interação manual quando necessário

## Quando Usar

Ative esta skill quando:
- Precisar extrair conteúdo de páginas da skillshub
- Automatizar tarefas em sistemas internos (Cooper, etc.)
- Fazer scraping de documentação interna
- Necessitar de screenshots ou relatórios de páginas internas
- Realizar auditorias ou análises em massa

## Instalação Rápida

A skill já está disponível no repositório DCC. Certifique-se de ter o Playwright instalado:

```bash
# Verificar/instalar Playwright
python -m playwright install chromium
```

## Uso Básico

### Via Claude (Recomendado)

```
"Analisa essa URL da skillshub: https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch"

"Extrai o conteúdo desse documento do Cooper: https://cooper.didichuxing.com/docs2/document/123456"

"Tira um screenshot da página de analytics"
```

### Via Scripts (Standalone)

```bash
# Analisar URL simples
python scripts/fetch-intranet.py <url>

# Operações avançadas com sessão
python scripts/intranet_fetcher/main.py --session mysession --url <url>
```

## Domínios Suportados

- `*.xiaojukeji.com` - Skillshub e sistemas internos
- `*.didichuxing.com` - Cooper e documentação
- `*.didi.cn` - Sistemas chineses
- `*.didiglobal.com` - Sistemas globais

## Arquitetura

```
intranet-fetcher/
├── SKILL.md                 # Este arquivo
├── advanced.md              # Guia avançado (@file)
├── examples.md              # Exemplos completos (@file)
├── docs/
│   ├── api-reference.md     # Referência da API
│   └── troubleshooting.md   # Guia de problemas
├── scripts/
│   ├── fetch-intranet.py    # Script principal (análise única)
│   ├── session_manager.py   # Gerenciamento de sessões
│   ├── navigate.py          # Navegação
│   ├── extract.py           # Extração de conteúdo
│   ├── interact.py          # Interações (click, type)
│   └── screenshot.py        # Capturas de tela
└── examples/
    ├── basic-usage.py       # Exemplo básico
    ├── batch-analysis.py    # Análise em lote
    └── advanced-session.py  # Sessão avançada
```

## Fluxo de Autenticação

1. **Primeiro acesso**:
   - Navegador abre em modo visível
   - Redirecionado para login SSO
   - Usuário faz login manual (90s timeout)
   - Cookies salvos em `~/.claude/intranet_cookies/`

2. **Acessos subsequentes**:
   - Cookies carregados automaticamente
   - Sessão válida por ~24h
   - Re-login apenas quando expirar

## Integração com Skills DiDi

A `intranet-fetcher` complementa as skills oficiais:

| Skill Oficial | intranet-fetcher |
|---------------|------------------|
| `cooper-search` | Análise detalhada de documentos |
| `cooper-read` | Extração alternativa com mais controle |
| `xiaoju-fetch` | Equivalente no ecossistema DiDi |

## Configuração

### Variáveis de Ambiente

```bash
# Timeout para login manual (segundos)
export INTRANET_LOGIN_TIMEOUT=120

# Diretório de cookies
export INTRANET_COOKIES_DIR="~/.claude/intranet_cookies"

# Headless mode (true/false)
export INTRANET_HEADLESS=false
```

### Configuração Local

Crie `.claude/intranet-fetcher.config.json`:

```json
{
  "defaultTimeout": 90,
  "viewport": {"width": 1920, "height": 1080},
  "userAgent": "custom",
  "allowedDomains": ["*.xiaojukeji.com", "*.didichuxing.com"]
}
```

## Documentação Adicional

- **Uso Avançado**: @file `.claude/skills/intranet-fetcher/advanced.md`
- **Exemplos**: @file `.claude/skills/intranet-fetcher/examples.md`
- **API Reference**: @file `.claude/skills/intranet-fetcher/docs/api-reference.md`
- **Troubleshooting**: @file `.claude/skills/intranet-fetcher/docs/troubleshooting.md`

## Limitações

- Requer autenticação manual na primeira execução
- Sessões expiram após ~24h
- Alguns sistemas podem ter proteção anti-bot
- Upload/download limitado a arquivos < 100MB

## Changelog

### v1.0.0 (2026-07-22)
- Versão inicial com sistema de sessões
- Suporte a skillshub e cooper
- Extração de texto, HTML e screenshots
- Gerenciamento de cookies

---

**Autor**: DCC Team  
**Repositório**: https://github.com/seu-org/dcc-claude-infrastructure  
**Issues**: Reportar em `.claude/skills/intranet-fetcher/`

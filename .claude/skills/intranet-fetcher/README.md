# 🌐 intranet-fetcher

Skill avançada para automação de navegador e extração de conteúdo da intranet DiDi.

## ✨ Features

- 🔐 **Autenticação inteligente** - Detecta login, aguarda autenticação manual, persiste cookies
- 🗂️ **Sistema de sessões** - Múltiplas sessões simultâneas, reutilização de estado
- 📊 **Análise em lote** - Processar múltiplas URLs com retry e backoff
- 🎯 **Extração estruturada** - Headings, código, metadados, screenshots
- 🔄 **Pipelines configuráveis** - Fluxos customizados de processamento
- 📝 **Exportação múltipla** - JSON, CSV, Markdown, HTML

## 🚀 Uso Rápido

### Via Claude (Recomendado)

```
"Analisa essa skill: https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch"
"Extrai documento do Cooper: https://cooper.didichuxing.com/docs2/document/123456"
"Tira screenshot da página de analytics"
```

### Via CLI

```bash
# Análise simples
python scripts/fetch-intranet.py https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch

# Exportar JSON
python scripts/fetch-intranet.py <url> --json

# Screenshot + dados completos
python scripts/fetch-intranet.py <url> --output-dir ./meus_dados --screenshot

# Aumentar timeout de login
python scripts/fetch-intranet.py <url> --wait 180
```

### Via Python

```python
from intranet_fetcher import IntranetFetcher

fetcher = IntranetFetcher()
result = fetcher.analyze_sync("https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch")

print(result.main_title)
print(result.version)
print(result.content[:1000])
```

## 📁 Estrutura

```
intranet-fetcher/
├── SKILL.md                    # Documentação principal
├── README.md                   # Este arquivo
├── advanced.md                 # Guia avançado (@file)
├── examples.md                 # Exemplos completos (@file)
├── docs/
│   ├── api-reference.md        # Referência da API
│   └── troubleshooting.md      # Guia de problemas
├── scripts/                    # Módulos Python
│   ├── __init__.py
│   ├── fetcher.py             # Classe principal
│   ├── session.py             # Gerenciamento de sessões
│   ├── batch.py               # Processamento em lote
│   └── pipeline.py            # Pipelines de processamento
├── examples/                   # Exemplos práticos
│   ├── basic-usage.py
│   ├── batch-analysis.py
│   └── session-example.py
└── tests/                     # Testes
    └── test_fetcher.py
```

## 🏗️ Arquitetura

### Componentes Principais

| Componente | Descrição | Arquivo |
|------------|-----------|---------|
| `IntranetFetcher` | Análise de URLs únicas | `fetcher.py` |
| `SessionManager` | Gerenciamento de sessões | `session.py` |
| `BatchProcessor` | Processamento em lote | `batch.py` |
| `DocumentationPipeline` | Pipelines configuráveis | `pipeline.py` |

### Fluxo de Autenticação

```
1. Acessar URL
   ↓
2. Detectar página de login?
   ├─ Sim: Abrir navegador → Aguardar 90s → Salvar cookies
   └─ Não: Continuar
   ↓
3. Extrair conteúdo
   ↓
4. Salvar resultados
```

## 🌐 Domínios Suportados

- `*.xiaojukeji.com` - Skillshub e sistemas internos
- `*.didichuxing.com` - Cooper e documentação
- `*.didi.cn` - Sistemas chineses
- `*.didiglobal.com` - Sistemas globais
- `*.didipay.com` - Pagamentos
- `*.didifinance.com` - Finanças

## 📚 Documentação

- **Introdução**: `SKILL.md`
- **Uso Avançado**: `advanced.md` (carregue com @file)
- **Exemplos**: `examples.md` (carregue com @file)
- **API**: `docs/api-reference.md`
- **Troubleshooting**: `docs/troubleshooting.md`

## 🧪 Testes

```bash
# Rodar testes unitários
python -m pytest .claude/skills/intranet-fetcher/tests/

# Ou diretamente
python .claude/skills/intranet-fetcher/tests/test_fetcher.py
```

## 🔄 Integração

### Com Skills Oficiais DiDi

| Skill Oficial | intranet-fetcher |
|---------------|------------------|
| `xiaoju-fetch` | Equivalente open-source |
| `cooper-search` | Extração detalhada |
| `cooper-read` | Mais controle sobre extração |

### Em Workflows

```yaml
# Exemplo de workflow
steps:
  - name: extrair_conteudo
    tool: intranet_fetcher
    action: analyze
    params:
      url: "{{input.url}}"

  - name: gerar_relatorio
    tool: report_generator
    params:
      data: "{{steps.extrair_conteudo.output}}"
```

## 🛣️ Roadmap

### v1.0.0 (Atual) ✅
- [x] Análise de URLs únicas
- [x] Sistema de sessões
- [x] Processamento em lote
- [x] Exportação múltipla
- [x] Documentação completa

### v1.1.0 (Futuro)
- [ ] Cache de respostas
- [ ] Rate limiting avançado
- [ ] Webhooks para mudanças
- [ ] Suporte a proxies
- [ ] Modo headless completo

### v2.0.0 (Futuro)
- [ ] API REST
- [ ] Interface web
- [ ] Agendamento de tarefas
- [ ] Machine learning para extração

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -am '[skill] Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`

## 📝 Changelog

### v1.0.0 (2026-07-22)
- Lançamento inicial
- Sistema completo de sessões
- Processamento em lote
- Documentação abrangente

## 👥 Autores

- **DCC Team** - Desenvolvimento inicial

## 📄 Licença

MIT License - Parte do projeto DCC

---

<p align="center">
  <strong>intranet-fetcher</strong> - Feito com ❤️ pelo time DCC
</p>

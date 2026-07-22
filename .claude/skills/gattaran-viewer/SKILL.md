---
name: gattaranViewer
description: Visualiza e analisa orders do Gattaran (Order Management System da DiDi) com sessão persistente
---

# Gattaran Viewer

Visualiza orders no Gattaran, extrai detalhes de cancelamento e informações do entregador (Control Information).

## Quando Usar

- Quando precisar investigar uma order específica no Gattaran
- Para analisar o motivo de cancelamento de uma order
- Para verificar o histórico de suspensões de um entregador
- Quando precisar extrair dados de múltiplas orders em sequência

## Uso Básico

```bash
# Buscar uma order
/skill run gattaran-viewer --order=5764678698494132425 --city="São Paulo"

# Analisar entregador da order
/skill run gattaran-viewer --order=5764678698494132425 --courier-info

# Buscar múltiplas orders (mesma sessão)
/skill run gattaran-viewer --orders=order1.json,order2.json
```

## Exemplos Rápidos

### Exemplo 1: Buscar order cancelada
```
Order ID: 5764678698494132425
Cidade: São Paulo

Resultado: Order cancelada às 16:38:58 do dia 17/07/2026
Motivo: 3:Ocorreu um acidente
Entregador: FEL****IES (ID: 650911850070348)
```

### Exemplo 2: Ver Control Information do entregador
```
Courier ID: 650911850070348
Status: Normal
Última suspensão: 17/07/2026 16:39 (1 dia)
Motivo: Short-term restriction due to vehicle malfunction
Histórico: 5 suspensões nos últimos 7 dias
```

## Como Funciona

1. **Sessão Persistente**: O login é feito apenas uma vez e reutilizado
2. **Batch Processing**: Múltiplas orders usam a mesma sessão
3. **Extração Completa**: Dados da order + cancelamento + entregador

## Recursos Adicionais

- Para documentação técnica: `@docs/API.md`
- Para exemplos avançados: `@examples.md`
- Código fonte: `mcp-servers/gattaran/`

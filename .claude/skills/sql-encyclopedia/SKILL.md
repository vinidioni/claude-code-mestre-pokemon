---
name: sqlEncyclopedia
description: Consulta e gerencia a enciclopédia de tabelas SQL - schemas, descrições e histórico de uso
---

# Skill: SQL Encyclopedia

## Quando Usar

Quando você quiser:
- **Consultar schemas de tabelas** que já usou
- **Descobrir que tabelas existem** na enciclopédia
- **Documentar tabelas** com descrições
- **Ver histórico de uso** de tabelas
- **Encontrar tabelas relevantes** para uma query

## O que é a Enciclopédia

A **SQL Encyclopedia** é um dicionário de dados automático que:
- **Detecta tabelas** em todas as queries SQL
- **Registra metadados**: primeira consulta, última consulta, descrição
- **Acumula conhecimento** sobre o banco de dados usado
- **Facilita reuso** consultando tabelas anteriores

Ela fica em: `sql-library/encyclopedia/tables.json`

## Uso Básico

### Listar todas as tabelas
```
"quais tabelas tenho na enciclopédia?"
"mostra as tabelas documentadas"
"listar tabelas SQL"
"o que tem na encyclopedia"
```

### Consultar uma tabela específica
```
"o que é a tabela X?"
"schema da tabela orders"
"documentação da tabela users"
"como usar a tabela products"
```

### Adicionar descrição
```
"documentar tabela X como 'descrição'"
"adicionar descrição na tabela"
"salvar documentação da tabela"
```

### Atualizar enciclopédia a partir de queries
```
"atualizar encyclopedia"
"scanear queries"
"atualizar tabelas"
"detectar tabelas novas"
```

## Funcionalidades

- ✅ **Lista tabelas** com metadados (data de uso, descrição)
- ✅ **Consulta schema** de tabela específica
- ✅ **Adiciona descrições** manualmente
- ✅ **Atualização automática** a partir de queries SQL
- ✅ **Detecção de tabelas** em queries novas
- ✅ **Histórico de uso**: primeira e última consulta

## Comandos Equivalentes

```bash
# Listar todas as tabelas
python scripts/maintenance/update-encyclopedia.py --list

# Adicionar descrição
python scripts/maintenance/update-encyclopedia.py --table orders --describe "Tabela de pedidos"

# Scanear diretório de queries
python scripts/maintenance/update-encyclopedia.py --scan-all

# Processar query individual
python scripts/maintenance/update-encyclopedia.py --query "SELECT * FROM orders"
```

## Estrutura da Enciclopédia

```json
{
  "_metadata": {
    "version": "1.0",
    "created_at": "2026-01-15T10:00:00",
    "updated_at": "2026-07-27T14:30:00",
    "description": "Enciclopédia auto-gerada de tabelas do banco de dados"
  },
  "tabelas": {
    "data_mart.orders": {
      "descricao": "Tabela de pedidos consolidada",
      "colunas": {},
      "primeira_consulta": "2026-01-15T14:30:00",
      "ultima_consulta": "2026-07-27T09:15:00"
    },
    "data_mart.users": {
      "descricao": "",
      "colunas": {},
      "primeira_consulta": "2026-03-20T11:20:00",
      "ultima_consulta": "2026-07-26T16:45:00"
    }
  }
}
```

## Como Funciona a Detecção Automática

1. **Você cria uma query** em `sql-library/queries/`
2. **O sistema detecta**: `FROM`, `JOIN`, `INTO`
3. **Extrai nomes** das tabelas
4. **Adiciona à enciclopédia** se for nova
5. **Atualiza data** se já existir

### Padrões detectados:
```sql
-- FROM
FROM data_mart.orders
FROM dataset.table

-- JOIN
JOIN data_mart.users u ON ...

-- INTO
INTO staging.temp_table
```

## Resolução de Problemas

### "Tabela não encontrada na enciclopédia"

**Causa:** Tabela nunca foi usada em uma query salva.

**Solução:**
```bash
# 1. Crie uma query usando a tabela
# 2. Salve em sql-library/queries/
# 3. Execute:
python scripts/maintenance/update-encyclopedia.py --scan-all
```

### "Enciclopédia vazia"

**Causa:** Nenhuma query foi analisada ainda.

**Solução:**
```bash
# Scanear todas as queries existentes
python scripts/maintenance/update-encyclopedia.py --scan-all

# Ou processar uma query específica
python scripts/maintenance/update-encyclopedia.py --query "SELECT * FROM orders"
```

### "Deseja adicionar descrição? (erro de UX)"

Quando uma nova tabela é detectada, o sistema sugere adicionar descrição. Para fazer:

```
Claude: "Nova tabela 'data_mart.products' detectada!"
       "Adicione uma descrição:"

Você: "documentar tabela data_mart.products como 'Tabela de produtos com preços e categorias'"

Claude: ✅ Descrição adicionada!
```

## Boas Práticas

### Documentar tabelas assim que usar:
```
"Criar query de vendas por mês"
[Claude cria query usando data_mart.orders]

"documentar tabela data_mart.orders"
"é a tabela de pedidos consolidada com dados de 2020-2026"
```

### Nomes descritivos:
```
✅ "Tabela de pedidos consolidada com dados de cancelamento"
✅ "Dimensão de clientes com segmentação"
✅ "Fatos de entregas com SLA"

❌ "tabela"
❌ "orders"
❌ "dados"
```

### Manter atualizado:
```bash
# Antes de começar novo projeto
python scripts/maintenance/update-encyclopedia.py --scan-all

# Sempre após criar queries importantes
# O sistema faz automático, mas pode forçar
```

## Integração com Queries

Quando você pede:
```
"Criar query de análise de churn"
```

Claude pode:
1. Consultar a enciclopédia: *"Quais tabelas têm dados de clientes?"*
2. Encontrar: `data_mart.users`, `data_mart.subscriptions`
3. Ver descrições para entender contexto
4. Sugerir estrutura baseada em uso anterior

## Próximos Passos

```bash
# Ver estatísticas
cat sql-library/encyclopedia/tables.json | grep -c '"primeira_consulta"'

# Ver tabelas mais usadas (ordem de última consulta)
python scripts/maintenance/update-encyclopedia.py --list

# Documentar tabela importante
python scripts/maintenance/update-encyclopedia.py --table data_mart.orders --describe "Pedidos consolidados"
```

## Notas

- A enciclopédia cresce **automaticamente** conforme você usa
- Descrições ajudam **futuro você** e **outras pessoas**
- Pode ser usada como **consulta rápida** antes de escrever queries
- **Não substitui** documentação oficial Data-E, complementa

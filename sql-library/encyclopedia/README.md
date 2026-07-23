# 📚 Enciclopédia de Tabelas - DCCrazy

> Sistema auto-gerado de documentação de tabelas do banco de dados.

---

## O Que É

A Enciclopédia é um arquivo JSON (`analytics/encyclopedia/tables.json`) que mapeia automaticamente as tabelas que você consulta em queries. Serve como referência rápida para:

- Saber quais tabelas já usou
- Documentar o schema (colunas e tipos)
- Descrever o propósito de cada tabela
- Evitar consultar `DESCRIBE` repetidamente

---

## Como Funciona

### Detecção Automática

Quando você executa uma query no DCCrazy:

1. DCC analisa a query SQL
2. Extrai nomes de tabelas (FROM, JOIN, INTO)
3. Verifica se a tabela já está na enciclopédia
4. Se for NOVA: adiciona automaticamente
5. Se já existir: atualiza a data de última consulta

### Uso

```bash
# Analisar uma query específica
python scripts/update-encyclopedia.py --query "SELECT * FROM users"

# Escanear TODAS as queries do diretório
python scripts/update-encyclopedia.py --scan-all

# Listar todas as tabelas documentadas
python scripts/update-encyclopedia.py --list

# Adicionar descrição manual
python scripts/update-encyclopedia.py --table users --describe "Tabela de usuários do app"
```

---

## Estrutura do Arquivo

```json
{
  "_metadata": {
    "version": "1.0",
    "created_at": "2024-07-22",
    "updated_at": "2024-07-22",
    "description": "Enciclopédia auto-gerada de tabelas"
  },
  "tabelas": {
    "analytics.users_activity": {
      "descricao": "Log de atividades dos usuários no app",
      "colunas": {
        "user_id": "bigint - ID do usuário",
        "event_time": "timestamp - Data/hora do evento",
        "event_type": "string - Tipo de ação realizada"
      },
      "primeira_consulta": "2024-07-22T10:00:00",
      "ultima_consulta": "2024-07-22T15:30:00"
    }
  }
}
```

---

## Integração com Workflows

Use o workflow dedicado:

```bash
claude workflow run update-table-encyclopedia --query="SELECT * FROM orders"
```

Ou deixe o DCC perguntar:

```
Você: "Crie uma query que junte usuários com pedidos"
DCC: [cria query]
DCC: "Detectei tabelas novas: users, orders. Adicionar à enciclopédia?"
Você: "Sim"
DCC: [atualiza tables.json]
```

---

## Boas Práticas

1. **Sempre adicione descrições** quando uma tabela nova for detectada
2. **Mantenha colunas atualizadas** se o schema mudar
3. **Use como referência** antes de consultar tabelas desconhecidas
4. **Não edite manualmente** o `_metadata` - é gerado automaticamente

---

**Arquivo:** `analytics/encyclopedia/tables.json`  
**Script:** `scripts/update-encyclopedia.py`

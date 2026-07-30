# SQL Encyclopedia - Exemplos

## Exemplo 1: Listar Tabelas

```
Usuário: "quais tabelas tenho na enciclopédia?"

Claude: Vou consultar a SQL Encyclopedia para você.

📚 Tabelas na Enciclopédia:

1. data_mart.orders
   Primeira consulta: 15/01/2026
   Última consulta: 27/07/2026
   Descrição: Tabela de pedidos consolidada com dados de cancelamento

2. data_mart.users
   Primeira consulta: 20/03/2026
   Última consulta: 26/07/2026
   Descrição: (sem descrição - adicione!)

3. data_mart.products
   Primeira consulta: 10/05/2026
   Última consulta: 25/07/2026
   Descrição: Catálogo de produtos com preços e categorias

4. staging.temp_analytics
   Primeira consulta: 15/07/2026
   Última consulta: 15/07/2026
   Descrição: (sem descrição - adicione!)

📊 Total: 4 tabelas documentadas

💡 Dica: Adicione descrições para tabelas sem documentação.
   Use: "documentar tabela [nome]"
```

## Exemplo 2: Consultar Tabela Específica

```
Usuário: "o que é a tabela data_mart.orders?"

Claude: Vou consultar os detalhes da tabela.

📋 data_mart.orders

📅 Histórico de Uso:
   • Primeira consulta: 15/01/2026 (6 meses atrás)
   • Última consulta: 27/07/2026 (hoje)
   • Frequência: Alta (usada em 12 queries)

📝 Descrição:
   "Tabela de pedidos consolidada com dados de cancelamento.
    Valores em centavos. Timezone UTC."

📊 Colunas Documentadas:
   (Nenhuma coluna documentada individualmente)

💡 Para documentar colunas:
   python scripts/maintenance/update-encyclopedia.py \\\n     --table data_mart.orders --columns '{"order_id": "ID único"}'

📚 Queries que usam esta tabela:
   • sql-library/queries/data-e/funnel-analysis.sql
   • sql-library/queries/presto/weekly-orders.sql
   • sql-library/queries/draft/churn-analysis.sql
```

## Exemplo 3: Adicionar Descrição

```
Usuário: "documentar tabela data_mart.users como 'Dimensão de clientes com dados de segmentação e churn'"

Claude: Vou adicionar a documentação.

✅ Descrição adicionada para data_mart.users:
   "Dimensão de clientes com dados de segmentação e churn"

📋 Resumo da Tabela:
   • Primeira consulta: 20/03/2026
   • Última consulta: 26/07/2026
   • Descrição atualizada agora
   • Total de colunas: (não documentado)

💡 Dica: Se souber as colunas principais, posso documentá-las também.
   Exemplo: "documentar coluna user_id como 'ID único do cliente'"
```

## Exemplo 4: Atualizar a Partir de Queries

```
Usuário: "atualizar encyclopedia"

Claude: Vou escanear todas as queries e atualizar a enciclopédia.

🔍 Escaneando diretório de queries...
   • sql-library/queries/data-e/: 15 arquivos
   • sql-library/queries/presto/: 8 arquivos
   • sql-library/queries/draft/: 5 arquivos

📊 Resultado:
   • Arquivos analisados: 28
   • Novas tabelas encontradas: 2
     - data_warehouse.transactions
     - staging.events
   • Tabelas atualizadas: 6
   • Tempo: 2.3s

🆕 Tabelas Novas:
   1. data_warehouse.transactions
      Primeira vez detectada

   2. staging.events
      Primeira vez detectada

💡 Deseja adicionar descrições para as novas tabelas?
"sim"

"data_warehouse.transactions são transações financeiras consolidadas"
"staging.events são eventos brutos do tracking"

✅ Descrições adicionadas!
```

## Exemplo 5: Detectar Nova Tabela em Query

```
Usuário: "criar query analisando produtos com baixo estoque"

Claude: Vou criar uma query para análise de estoque.

💭 Analisando tabelas disponíveis...
   • data_mart.products - "Catálogo de produtos"
   • data_mart.orders - "Pedidos consolidados"

[Claude cria query usando data_mart.products]

📝 Query criada:
   sql-library/queries/draft/low-stock-analysis.sql

🆕 Nova tabela detectada: data_mart.inventory

Esta query acessa a tabela data_mart.inventory que não estava
na enciclopédia. Deseja adicionar uma descrição?

"sim, é a tabela de controle de estoque com saldo atual"

✅ data_mart.inventory documentada!
   Adicionada à SQL Encyclopedia.
```

## Exemplo 6: Enciclopédia Vazia

```
Usuário: "mostrar tabelas"

Claude: Vou consultar a enciclopédia.

📚 Tabelas na Enciclopédia:

Nenhuma tabela registrada ainda.

💡 Como popular a enciclopédia:

1. Crie queries SQL e salve em sql-library/queries/
   Exemplo: "criar query de vendas"

2. Ou escaneie queries existentes:
   "atualizar encyclopedia"
   "scanear queries existentes"

3. A enciclopédia cresce automaticamente
   conforme você usa tabelas em queries.

🚀 Comece criando sua primeira query!
```

## Exemplo 7: Integração com Criação de Query

```
Usuário: "query de análise de churn usando tabelas que já documentei"

Claude: Vou consultar a enciclopédia para entender o contexto.

📚 Analisando tabelas documentadas...

Tabelas úteis para churn:
1. data_mart.users
   "Dimensão de clientes com dados de segmentação e churn"
   → Provavelmente tem flag de churn, data de inativação

2. data_mart.orders
   "Pedidos consolidados com dados de cancelamento"
   → Tem informações de recência/frequência

3. data_mart.subscriptions (sem descrição)
   → Pode ter dados de assinatura/cancelamento

💡 Sugestão de estrutura:
   - JOIN users + orders (última compra)
   - WHERE users.churned = 1 OR recência > 90 dias
   - GROUP BY segmento

Deseja que eu crie a query usando estas tabelas?
"sim"

[Claude cria query baseada nas tabelas analisadas]
```

# Exemplos - Everything Search

## Cenário 1: Buscar Arquivos por Extensão

```
Usuário: "Buscar todos arquivos SQL no projeto"

Ação:
→ Skill: everything-search
→ Tool: search
→ Params:
  {
    "query": "*.sql",
    "max_results": 20
  }

Resultado:
"Encontrados 15 arquivos SQL:
1. C:\Users\...\dcc\sql-library\queries\sales-report.sql
2. C:\Users\...\dcc\sql-library\queries\user-analytics.sql
3. C:\Users\...\dcc\analytics\queries\presto\groceries-duties.sql
...
Total: 15 arquivos (busca em 12ms)"
```

## Cenário 2: Buscar por Nome Parcial

```
Usuário: "Encontra arquivos que têm 'config' no nome"

Ação:
→ search com query="*config*"

Resultado:
"Encontrados 8 arquivos:
1. config.js
2. database.config.json
3. app.config.yaml
4. webpack.config.js
..."
```

## Cenário 3: Buscar Arquivo Específico

```
Usuário: "Onde está o arquivo .env?"

Ação:
→ search com query=".env"

Resultado:
"Encontrados 3 arquivos:
1. C:\Users\...\dcc\.env
2. C:\Users\...\dcc\mcp-servers\cooper\.env
3. C:\Users\...\dcc\mcp-servers\dchat\.env"
```

## Cenário 4: Busca em Pasta Específica

```
Usuário: "Procurar README na pasta docs"

Ação:
→ search com query="README*", path="C:\Users\...\dcc\docs"

Resultado:
"Encontrados 4 arquivos:
1. docs/README.md
2. docs/guides/README.md
3. docs/api/README.md
4. docs/sql/README.md"
```

## Cenário 5: Combinar com Outra Skill

```
Usuário: "Encontra o arquivo de backup mais recente e envia pro time"

Fluxo:
1. everything-search → Encontra arquivo de backup
   → query="backup*.zip", max_results=5
2. Identifica o mais recente
3. dchat-send → Envia mensagem com link/path

Mensagem: "Backup mais recente: DCCrazy_Backup_20260728_143022.zip (18.5 MB)"
```

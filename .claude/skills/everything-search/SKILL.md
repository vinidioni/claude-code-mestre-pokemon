# Skill: everything-search

## Descrição
Busca ultra-rápida de arquivos locais usando o Everything (Windows), mdfind (Mac) ou locate (Linux).

## Quando Usar
- Quando precisa encontrar arquivos rapidamente no sistema
- Keywords: "buscar arquivo", "encontrar arquivo", "procurar arquivo", "localizar arquivo", "search file"

## Ferramentas MCP Disponíveis

### search
Busca arquivos por nome ou padrão.

**Parâmetros:**
- `query` (string, obrigatório): Termo de busca (suporta wildcards: * ?)
- `max_results` (number, opcional): Máximo de resultados (padrão: 20)
- `path` (string, opcional): Limitar busca a pasta específica

**Exemplo:**
```json
{
  "query": "*.md",
  "max_results": 10,
  "path": "C:\\Users\\viniciuscastanho\\Desktop\\dcc"
}
```

**Retorno:**
```json
{
  "results": [
    {
      "path": "C:\\Users\\...\\README.md",
      "name": "README.md",
      "size": 2450,
      "modified": "2026-07-28T10:00:00Z"
    }
  ],
  "total": 45,
  "time_ms": 12
}
```

## Uso

### Buscar por extensão
```
Usuário: "Buscar todos arquivos .sql no projeto"
→ search com query="*.sql"
```

### Buscar por nome parcial
```
Usuário: "Encontra o arquivo que tem 'config' no nome"
→ search com query="*config*"
```

### Buscar em pasta específica
```
Usuário: "Procurar README na pasta docs"
→ search com query="README*", path="C:\\...\\docs"
```

### Busca rápida
```
Usuário: "Onde está o arquivo .env?"
→ search com query=".env"
```

## Dicas

- **Wildcards:** Use `*` para qualquer caracter, `?` para um caracter
- **Extensões:** `*.md` encontra todos markdown
- **Nome parcial:** `*config*` encontra qualquer arquivo com "config"
- **Múltiplos termos:** `report*2026*.pdf` (relatórios de 2026 em PDF)
- **Case insensitive:** A busca ignora maiúsculas/minúsculas

## Limitações

- **Windows:** Requer Everything instalado e rodando (Everything.exe)
- **Mac:** Usa mdfind (built-in)
- **Linux:** Require locate/mlocate instalado
- **Indexação:** Everything precisa ter indexado a pasta (geralmente instantâneo)

## Integração

- Combina com `cooper-write`: Encontrar arquivos → documentar no Cooper
- Combina com `backup-dccrazy`: Identificar arquivos para backup
- Combina com `sql-encyclopedia`: Encontrar queries SQL

## Troubleshooting

**"Nenhum resultado encontrado"**
- Verifique se Everything está rodando (tasklist | findstr Everything)
- Pasta pode não estar indexada ainda
- Tente sem wildcards primeiro

**"Everything não encontrado"**
- Instalar: https://www.voidtools.com
- Ou: `winget install voidtools.Everything`

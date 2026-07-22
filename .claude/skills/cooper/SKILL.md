# Cooper - DiDi Documentation Platform

Skill para interagir com a plataforma de documentação Cooper da DiDi.

## Quando Usar

Ative esta skill quando o usuário:
- Mencionar "cooper", "documento", "docs da didi"
- Pedir para buscar, ler ou criar documentos no Cooper
- Quiser navegar na documentação da empresa

## Ferramentas MCP Disponíveis

### cooper_get_document
Obtém o conteúdo completo de um documento.

**Uso:**
```
Pega o documento 2207291123516 do Cooper
```

Ou com URL:
```
Lê esse doc: https://cooper.didichuxing.com/docs2/document/2207291123516
```

### cooper_search
Busca documentos por palavra-chave.

**Uso:**
```
Busca no Cooper sobre "onboarding processo"
Procura documentos de "API gateway"
```

### cooper_list_spaces
Lista espaços/workspaces disponíveis.

**Uso:**
```
Quais espaços tenho no Cooper?
Lista minhas workspaces do Cooper
```

## Autenticação

Na primeira vez, o MCP abrirá um navegador Chrome para login. Após fazer login na conta Didi, a sessão será salva para uso futuro.

## Exemplos

**Buscar e ler:**
> "Busca no Cooper sobre integração de pagamentos e me mostra o documento mais relevante"

**Navegar:**
> "Lista meus espaços no Cooper"

**Obter documento específico:**
> "Pega o documento 2207291123516 do Cooper e resume os principais pontos"

## Dicas

- IDs de documentos podem ser extraídos das URLs: `/docs2/document/2207291123516` → ID é `2207291123516`
- Use busca com termos em inglês ou chinês conforme a convenção da sua empresa
- A sessão dura ~24h, depois precisa relogar

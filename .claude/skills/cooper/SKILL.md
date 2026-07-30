# Cooper - DiDi Documentation Platform

Skill para interagir com a plataforma de documentação Cooper da DiDi.

## Quando Usar

Ative esta skill quando o usuário:
- Mencionar "cooper", "documento", "docs da didi"
- Pedir para buscar, ler ou criar documentos no Cooper
- Quiser navegar na documentação da empresa
- Navegar por hierarquia: team spaces → knowledge bases → documentos

## Hierarquia de Recursos (Estrutura Cooper)

```
Team Space (ex: Engineering, Product, Data)
├── Knowledge Base (ex: API Docs, Onboarding, Runbooks)
│   ├── Documentos (docs2/document/{id})
│   ├── Planilhas (docs2/sheet/{id})
│   └── Wikis (wiki/{id})
├── Arquivos (docs2/file/{id})
└── Tags (para organização cruzada)
```

### Navegação Hierárquica

| Nível | Como Acessar | Exemplo |
|-------|--------------|---------|
| **Team Spaces** | `cooper_list_spaces` | Listar todos os espaços do time |
| **Knowledge Bases** | Dentro de um space | KBs de API, Runbooks, Playbooks |
| **Documentos** | `cooper_get_document` | Documentos individuais |
| **Planilhas** | `cooper_get_document` | Sheets/dados tabulares |
| **Arquivos** | Via space → files | Anexos, PDFs, imagens |

### Convenções de Organização

- **Team Spaces**: Nomeados por time ("Engineering-Brazil", "Data-Platform")
- **KBs**: Temáticas ("APIs", "Onboarding", "Incident Response")
- **Documentos**: Título descritivo com categoria prefixada quando relevante
- **Tags**: Usadas para cross-reference (ex: #grocery, #aftersales)

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

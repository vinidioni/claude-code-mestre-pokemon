# Cooper - Sistema de Documentação DiDi

Este diretório contém **4 skills** para integração completa com a plataforma Cooper de documentação da DiDi.

## 🎯 Visão Geral

O Cooper é a plataforma interna de documentação da DiDi (similar ao Confluence). Este conjunto de skills permite:

- 🔍 **Buscar** documentos por palavra-chave
- 📖 **Ler** conteúdo de documentos específicos
- ✏️ **Criar** novos documentos
- 🗂️ **Navegar** espaços e workspaces

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Sistema Cooper                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MCP Server (mcp-servers/cooper/)                          │
│  ├── Autenticação via browser (Playwright)                 │
│  ├── API REST Cooper                                       │
│  └── Ferramentas MCP:                                      │
│      • cooper_search                                       │
│      • cooper_get_document                                 │
│      • cooper_list_spaces                                  │
│      • cooper_create_document                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Skills Claude (.claude/skills/)                           │
│  ├── cooper/           → Contexto geral                    │
│  ├── cooper-search/    → Busca especializada               │
│  ├── cooper-read/      → Leitura especializada             │
│  └── cooper-write/     → Criação especializada             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scripts Standalone (mcp-servers/cooper/scripts/)          │
│  ├── search.js                                             │
│  ├── read.js                                               │
│  └── create.js                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Skills Disponíveis

### 1. cooper (Geral)
**Arquivo:** `SKILL.md`

Skill para contexto geral sobre o Cooper. Use quando o usuário mencionar "cooper", "documento", "docs da didi" de forma genérica.

**Ferramentas:** Todas as 4 ferramentas MCP

**Exemplos:**
```
"Busca no Cooper sobre onboarding"
"Lista meus espaços no Cooper"
```

---

### 2. cooper-search
**Arquivo:** `cooper-search/SKILL.md`

Skill especializada em **busca**. Use quando o foco for encontrar documentos.

**Triggers:**
- "buscar no cooper"
- "procurar documento cooper"
- "search cooper"
- "listar documentos cooper"

**Ferramentas:**
- `cooper_search` - Busca por palavra-chave
- `cooper_list_spaces` - Lista espaços

**Exemplo:**
```
"Busca no Cooper sobre integração de pagamentos"
"Procura documentos de API gateway no Cooper"
```

---

### 3. cooper-read
**Arquivo:** `cooper-read/SKILL.md`

Skill especializada em **leitura**. Use quando o foco for extrair conteúdo de um documento específico.

**Triggers:**
- "ler documento cooper"
- "conteúdo cooper"
- "abrir doc cooper"
- "extrair texto cooper"

**Ferramentas:**
- `cooper_get_document` - Obtém conteúdo completo

**Exemplo:**
```
"Lê o documento 2207291123516 do Cooper"
"Pega o conteúdo do doc: https://cooper.didichuxing.com/docs2/document/2207291123516"
```

---

### 4. cooper-write
**Arquivo:** `cooper-write/SKILL.md`

Skill especializada em **criação**. Use quando o foco for criar novos documentos.

**Triggers:**
- "criar documento cooper"
- "novo doc cooper"
- "salvar no cooper"
- "documentar no cooper"

**Ferramentas:**
- `cooper_create_document` - Cria novo documento
- `cooper_list_spaces` - Para escolher onde criar

**Exemplo:**
```
"Cria um documento no Cooper chamado 'Reunião Daily' com a pauta: ..."
"Salva isso no espaço de Engenharia do Cooper"
```

## 🔧 Regras de Ativação (skill-rules.json)

```json
{
  "name": "cooper",
  "triggers": ["cooper", "documento didi", "docs da didi"],
  "priority": "high"
},
{
  "name": "cooper-search",
  "triggers": ["buscar no cooper", "procurar documento cooper"],
  "priority": "high"
},
{
  "name": "cooper-read",
  "triggers": ["ler documento cooper", "conteúdo cooper"],
  "priority": "high"
},
{
  "name": "cooper-write",
  "triggers": ["criar documento cooper", "novo doc cooper"],
  "priority": "high"
}
```

## 📁 Estrutura de Arquivos

```
.claude/skills/
├── cooper/
│   ├── README.md          # Este arquivo
│   └── SKILL.md           # Skill geral
│
├── cooper-search/
│   └── SKILL.md           # Skill de busca
│
├── cooper-read/
│   └── SKILL.md           # Skill de leitura
│
└── cooper-write/
    └── SKILL.md           # Skill de escrita
```

## 🔗 Como funciona a integração

1. **Usuário faz uma pergunta** sobre o Cooper
2. **Skill-rules.json** identifica qual skill ativar baseado nos triggers
3. **Skill ativada** fornece contexto ao Claude sobre ferramentas disponíveis
4. **Claude chama o MCP Server** via protocolo MCP
5. **MCP Server** autentica e executa a operação na API Cooper
6. **Resultado** retorna ao usuário

## 📚 Documentação Relacionada

- [README do MCP Server](../../mcp-servers/cooper/README.md)
- [Exemplos de uso da API](../../mcp-servers/cooper/examples/usage-examples.md)
- [Guia de Setup MCP](../../docs/mcp-setup-guide.md)

## ⚙️ Configuração

Para usar as skills, você precisa:

1. **MCP Server configurado** em `.mcp.json`
2. **Token de autenticação** em `mcp-servers/cooper/scripts/config.js`
3. **Skills ativadas** em `.claude/skills/skill-rules.json`

Veja o [README do MCP](../../mcp-servers/cooper/README.md) para instruções completas.

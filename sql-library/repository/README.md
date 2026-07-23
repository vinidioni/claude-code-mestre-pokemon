# 📚 SQL Library - Repository

Repositório de queries de referência catalogadas.

---

## 🎯 Propósito

Esta pasta armazena queries **atualmente utilizadas que geram alto valor** para consulta e reutilização. São queries que demonstram:

- Uso eficiente de filtros e condições
- Combinações de tabelas relevantes
- Padrões de boas práticas
- Soluções para problemas recorrentes

---

## 📁 Estrutura

```
repository/
├── [dominio-ou-tema]/     # Ex: groceries/, aftersales/, crm/
│   └── *.sql
└── README.md             # Este arquivo
```

---

## 📝 Como Catalogar uma Query

1. **Copie** a query da pasta `queries/` ou de outra fonte
2. **Renomeie** se necessário para nome descritivo em `kebab-case`
3. **Adicione header** com contexto de valor:

```sql
-- ============================================================================
-- REPOSITORY QUERY: [Nome Descritivo]
-- ============================================================================
-- Contexto: [Onde/quando esta query é utilizada]
-- Valor: [Por que esta query é valiosa como referência]
-- Origem: [Link ou referência à query original]
-- ============================================================================
-- Tabelas principais: [lista de tabelas utilizadas]
-- Filtros chave: [descrição dos filtros aplicados]
-- ============================================================================

-- Query aqui...
```

4. **Organize** em subpasta temática se aplicável
5. **Atualize** este README com a entrada da query

---

## 📋 Queries Catalogadas

<!-- Adicionar queries catalogadas aqui conforme o padrão:

### [Tema/Domínio]

| Query | Contexto | Tabelas Principais | Valor |
|-------|----------|-------------------|-------|
| [`query-exemplo.sql`](caminho/query-exemplo.sql) | Descrição do contexto | tabela_a, tabela_b | O que demonstra de valioso |

-->

*Ainda não há queries catalogadas. Adicione conforme identificar queries de alto valor.*

---

## 🔍 Critérios de Catalogação

Catalogar queries que atendam a pelo menos um critério:

- ✅ **Reutilização frequente** - Query usada regularmente em análises
- ✅ **Complexidade didática** - Demonstra padrões avançados bem aplicados
- ✅ **Integração de dados** - Conecta múltiplas fontes de forma elegante
- ✅ **Solução de problema** - Resolve casos de borda ou cenários específicos
- ✅ **Base para variações** - Serve como template para queries similares

---

## ⚠️ Importante

- **Não modifique** queries em uso ativo sem verificar dependências
- **Mantenha sincronizado** com a versão original quando aplicável
- **Documente mudanças** no header da query

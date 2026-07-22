# Skill: cooper-write

## Descrição
Cria novos documentos na plataforma Cooper.

## Quando Usar
- Quando o usuário quer criar documentação no Cooper
- Quando precisa salvar conteúdo gerado na plataforma
- Keywords: "criar documento", "novo doc cooper", "salvar no cooper", "documentar"

## Ferramentas MCP Disponíveis

### cooper_create_document
Cria um novo documento no Cooper.

**Parâmetros:**
- `title` (string, obrigatório): Título do documento
- `content` (string, obrigatório): Conteúdo (texto ou markdown)
- `spaceId` (string, opcional): ID do espaço/pasta onde criar

**Exemplo:**
```json
{
  "title": "Processo de Onboarding - Tech Team",
  "content": "## Introdução\n\nEste documento descreve...",
  "spaceId": "space_123"
}
```

**Fluxo:**
1. Ferramenta abre navegador visível
2. Preenche título e conteúdo automaticamente
3. Usuário revisa e salva manualmente (ou confirma)

## Exemplos de Uso

### Criar documento simples
```
Usuário: "Cria um documento no Cooper chamado 'Reunião Daily' com o conteúdo: ..."
→ Chamar cooper_create_document com title e content
```

### Criar em espaço específico
```
Usuário: "Salva isso no espaço de Engenharia: [conteúdo]"
→ Primeiro listar espaços (cooper_list_spaces)
→ Depois criar com spaceId apropriado
```

## Integração com Outras Skills

Combine com:
- **conventional-commits**: Para documentar mudanças
- **api-design**: Para documentar APIs criadas
- **cooper-read**: Para atualizar documentos existentes

## Dicas
- Use markdown para formatação (## para headers, - para listas)
- Sem espaId, o documento é criado no espaço padrão
- O navegador abre para confirmação - revise antes de salvar

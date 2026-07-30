# Skill: google-drive

## Descrição
Busca e gerencia arquivos no Google Drive, complementando o Google Workspace (Gmail/Calendar).

## Quando Usar
- Quando precisa encontrar arquivos no Google Drive
- Keywords: "google drive", "buscar no drive", "arquivo no drive", "planilha drive", "doc drive"

## Ferramentas MCP Disponíveis

### search_files
Busca arquivos no Drive por nome ou tipo.

**Parâmetros:**
- `query` (string, obrigatório): Termo de busca
- `file_type` (string, opcional): Tipo de arquivo (document, spreadsheet, presentation, folder)
- `limit` (number, opcional): Máximo de resultados (padrão: 10)

**Exemplo:**
```json
{
  "query": "relatório vendas",
  "file_type": "spreadsheet",
  "limit": 5
}
```

### get_file
Obtém informações de um arquivo específico.

**Parâmetros:**
- `file_id` (string): ID do arquivo no Drive
- `include_content` (boolean): Se deve baixar conteúdo

### list_folder
Lista arquivos em uma pasta.

**Parâmetros:**
- `folder_id` (string): ID da pasta
- `limit` (number): Máximo de resultados

### get_file_content
Obtém conteúdo de arquivo (para Google Docs/Sheets exporta como texto).

**Parâmetros:**
- `file_id` (string): ID do arquivo
- `mime_type` (string, opcional): Tipo de exportação

## Uso

### Buscar arquivo por nome
```
Usuário: "Busca no Drive o arquivo 'relatório anual'"
→ search_files com query="relatório anual"
```

### Buscar por tipo
```
Usuário: "Procura planilhas de vendas no Drive"
→ search_files com query="vendas", file_type="spreadsheet"
```

### Listar pasta
```
Usuário: "O que tem na pasta 'Projetos' do Drive?"
→ list_folder com folder_id="ID_DA_PASTA"
```

### Ver conteúdo
```
Usuário: "Mostra o conteúdo do documento 'Reunião'"
→ get_file_content com file_id="ID_DO_ARQUIVO"
```

## Dicas

- **Busca fuzzy:** O Drive busca no conteúdo dos arquivos também, não só no nome
- **Filtros:** Use `file_type` para restringir (document, spreadsheet, presentation, folder, pdf)
- **ID do arquivo:** Extraído da URL do Drive (`/d/FILE_ID/edit`)
- **Permissões:** Apenas arquivos que sua conta tem acesso

## Limitações

- Rate limits da API Google Drive aplicam-se
- Arquivos muito grandes podem ter download limitado
- Formatação rica de Docs/Sheets é simplificada no export

## Integração

- Combina com `google-workspace`: Gmail + Calendar + Drive completo
- Combina com `backup-dccrazy`: Encontrar backups no Drive
- Combina com `cooper-write`: Salvar documentos encontrados no Cooper

## Troubleshooting

**"Unauthorized" ou "Token expired"**
- Reautenticar: O MCP solicitará novo login OAuth
- Verificar se `GOOGLE_REFRESH_TOKEN` está configurado

**"File not found"**
- Arquivo pode ter sido deletado
- Verificar se tem permissão de acesso
- ID do arquivo pode estar incorreto

**"Rate limit exceeded"**
- Aguarde alguns minutos
- Reduza número de buscas sequenciais

## Exemplos de Busca Avançada

```
"Buscar documentos de 2024 no Drive"
→ query="2024", file_type="document"

"Procura planilha do último trimestre"
→ query="Q3 2026 OR Q4 2026", file_type="spreadsheet"

"Arquivos PDF sobre projeto X"
→ query="projeto X pdf"
```

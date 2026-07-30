# Exemplos - Google Drive

 ## Cenário 1: Buscar Arquivo por Nome

 ```
 Usuário: "Busca no Drive o arquivo 'relatório anual'"

 Ação:
 → Skill: google-drive
 → Tool: search_files
 → Params:
   {
     "query": "relatório anual",
     "limit": 10
   }

 Resultado:
 "Encontrados 3 arquivos:

 1. 📊 Relatório Anual 2026.xlsx
    Tipo: Planilha
    Modificado: 2026-07-15
    Link: https://drive.google.com/...

 2. 📄 Relatório Anual - Resumo Executivo.docx
    Tipo: Documento
    Modificado: 2026-07-14

 3. 📈 Relatório Anual - Apresentação.pptx
    Tipo: Apresentação
    Modificado: 2026-07-10"
 ```

 ## Cenário 2: Buscar por Tipo

 ```
 Usuário: "Procura planilhas de vendas no Drive"

 Ação:
 → search_files
 → Params:
   {
     "query": "vendas",
     "file_type": "spreadsheet",
     "limit": 5
   }

 Resultado:
 "Planilhas encontradas (5):
 1. Vendas Q1 2026.xlsx
 2. Vendas Q2 2026.xlsx
 3. Relatório de Vendas - Junho.xlsx
 ..."
 ```

 ## Cenário 3: Listar Pasta

 ```
 Usuário: "O que tem na pasta 'Projetos' do Drive?"

 Ação:
 → list_folder
 → Params:
   {
     "folder_id": "1ABC123xyz...",
     "limit": 20
   }

 Resultado:
 "Conteúdo da pasta 'Projetos' (12 itens):
 📁 AI Initiatives/
 📁 Data Platform/
 📁 Mobile App/
 📄 Roadmap 2026.docx
 📄 Status Report.xlsx
 ..."
 ```

 ## Cenário 4: Ver Conteúdo de Documento

 ```
 Usuário: "Mostra o conteúdo do documento 'Reunião'"

 Ação:
 1. search_files → query="Reunião", file_type="document"
 2. get_file_content → file_id="ID_DO_ARQUIVO"

 Resultado:
 "Conteúdo do documento 'Reunião - 2026-07-28':

 Participantes: João, Maria, Pedro
 Pauta:
 1. Review do Q2
 2. Planejamento Q3
 3. Novas iniciativas

 Decisões:
 - Aprovar budget para projeto X
 - Reunião semanal às quartas"
 ```

 ## Cenário 5: Busca Avançada

 ```
 Usuário: "Buscar documentos de 2024 sobre projetos"

 Ação:
 → search_files
 → Params:
   {
     "query": "2024 projeto",
     "file_type": "document"
   }

 Resultado: Lista de documentos de 2024 relacionados a projetos
 ```

 ## Cenário 6: Integração com Backup

 ```
 Usuário: "Verifica se tem backup do DCCrazy no Drive"

 Fluxo:
 1. google-drive → search_files
    → query="DCCrazy_Backup"
    → file_type="application/zip"

 2. Ordenar por data (mais recente)

 3. dchat-notify → Informar time
    "Backup mais recente: DCCrazy_Backup_20260728.zip (18.5 MB)"

 Resultado: Time notificado sobre último backup
 ```

 ## Cenário 7: Encontrar e Compartilhar

 ```
 Usuário: "Acha o doc de onboarding e manda pro novo dev"

 Fluxo:
 1. google-drive → search_files
    → query="onboarding"
    → file_type="document"

 2. Identificar documento correto

 3. cooper-write → Salvar no Cooper (opcional)
    OU
    dchat-send → Enviar link direto

 Resultado: Documento encontrado e compartilhado
 ```

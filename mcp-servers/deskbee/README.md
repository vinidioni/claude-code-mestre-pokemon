# DeskBee MCP Server

MCP Server para automação de reservas de salas no DeskBee (99 Workspace & Facilities).

## Funcionalidades

- ✅ Listar minhas reservas
- ✅ Verificar disponibilidade de salas
- ✅ Reservar salas (simples e recorrente)
- ✅ Gerar relatório completo de salas e reservas
- ✅ Suporte a filtros (andar, capacidade, propriedades)

## Instalação

```bash
cd mcp-servers/deskbee
npm install
```

## Configuração no Claude

Adicione ao `.mcp.json`:

```json
{
  "mcpServers": {
    "deskbee": {
      "command": "node",
      "args": ["mcp-servers/deskbee/src/index.js"]
    }
  }
}
```

## Ferramentas Disponíveis

| Ferramenta | Descrição |
|------------|-----------|
| `deskbee_navigate` | Navegar para o DeskBee |
| `deskbee_list_my_bookings` | Listar minhas reservas ativas |
| `deskbee_check_availability` | Verificar salas disponíveis |
| `deskbee_book_room` | Reservar uma sala |
| `deskbee_book_recurrent` | Criar reserva recorrente |
| `deskbee_generate_report` | Relatório de todas as salas/reservas |
| `deskbee_close` | Fechar navegador |

## Exemplos de Uso

### Reservar uma sala
```javascript
{
  "titulo": "Daily Standup",
  "data": "15/07/2026",
  "hora_inicio": "10:00",
  "hora_fim": "10:30",
  "pessoas": 8,
  "andar": "6º Andar"
}
```

### Gerar relatório
```javascript
{
  "data": "15/07/2026",
  "hora_inicio": "09:00",
  "hora_fim": "18:00"
}
```

## Notas

- Requer login manual na primeira execução
- Horário permitido: 09:00 às 20:00
- Reservas recorrentes: máx 4 ocorrências

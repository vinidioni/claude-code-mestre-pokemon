---
name: deskbeeBookRoom
source: mcp-servers/deskbee
description: MCP Server for DeskBee room booking automation
tools:
  - deskbee_navigate
  - deskbee_list_my_bookings
  - deskbee_check_availability
  - deskbee_book_room
  - deskbee_book_recurrent
  - deskbee_generate_report
  - deskbee_close
---

# DeskBee Book Room

> **Status:** ✅ MCP Server implementado e funcional
> **Location:** `mcp-servers/deskbee/`

---

## Quando Usar

Use esta skill para automatizar reservas de salas no DeskBee (99 Workspace):

- Reservar sala para reuniões
- Verificar disponibilidade de salas
- Criar reservas recorrentes (diárias/semanais)
- Listar minhas reservas ativas
- Gerar relatórios de ocupação

---

## Instalação

```bash
cd mcp-servers/deskbee
npm install
```

---

## Ferramentas MCP Disponíveis

### 1. Navegar
```javascript
// Acessar página inicial do DeskBee
deskbee_navigate()
```

### 2. Listar Minhas Reservas
```javascript
// Ver todas as reservas ativas
deskbee_list_my_bookings()
// Retorna: título, data, horário, sala, status
```

### 3. Verificar Disponibilidade
```javascript
// Checar salas disponíveis para um horário
deskbee_check_availability({
  data: "27/07/2026",           // DD/MM/YYYY
  hora_inicio: "10:00",         // 09:00-20:00
  hora_fim: "11:00",
  pessoas: 8,                   // opcional
  andar: "6º Andar",           // opcional
  propriedades: ["TV", "Videoconferência"]  // opcional
})
```

### 4. Reservar Sala
```javascript
// Fazer uma reserva simples
deskbee_book_room({
  titulo: "Daily Standup",
  data: "27/07/2026",
  hora_inicio: "10:00",
  hora_fim: "10:30",
  pessoas: 8,
  andar: "6º Andar",
  propriedades: ["TV"]
})
```

### 5. Reserva Recorrente
```javascript
// Criar reserva recorrente (máx 4 ocorrências)
deskbee_book_recurrent({
  titulo: "Sprint Planning",
  data_inicial: "27/07/2026",
  hora_inicio: "14:00",
  hora_fim: "16:00",
  recorrencia: "Semanalmente",  // ou "Diariamente"
  ocorrencias: 4,
  pessoas: 12,
  andar: "7º Andar"
})
```

### 6. Relatório Completo ⭐
```javascript
// Relatório de todas as salas e reservas
deskbee_generate_report({
  data: "27/07/2026",
  hora_inicio: "09:00",
  hora_fim: "18:00"
})

// Retorna:
// - Total de salas
// - Disponíveis vs Ocupadas
// - Lista por andar
// - Quem reservou cada sala ocupada
```

---

## Exemplos de Uso

### Reserva rápida
```
"Reserve uma sala para reunião de equipe amanhã às 14h por 1 hora"
→ deskbee_book_room({
  titulo: "Reunião de Equipe",
  data: "28/07/2026",
  hora_inicio: "14:00",
  hora_fim: "15:00"
})
```

### Verificar antes de reservar
```
"Quais salas estão livres hoje à tarde para 10 pessoas?"
→ deskbee_check_availability({
  data: "27/07/2026",
  hora_inicio: "14:00",
  hora_fim: "18:00",
  pessoas: 10
})
```

### Relatório de ocupaçã   o
```
"Me mostre todas as salas reservadas hoje"
→ deskbee_generate_report({
  data: "27/07/2026",
  hora_inicio: "09:00",
  hora_fim: "20:00"
})
```

---

## Notas Importantes

- **Login:** Requer login manual na primeira execução (SSO)
- **Horário:** Permitido apenas 09:00 às 20:00
- **Recorrência:** Máximo 4 ocorrências
- **Andares:** Use formato como "6º Andar", "7º Andar"
- **Propriedades:** TV, Videoconferência, Quadro branco, Projetor, etc.

---

## Veja Também

- Exemplos detalhados: `@examples.md`
- Casos avançados: `@advanced.md`
- Código fonte: `mcp-servers/deskbee/src/index.js`

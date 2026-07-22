---
name: deskbeeBookRoom
description: Automatiza reserva de salas de reunião na plataforma DeskBee (99 Workspace & Facilities)
source: https://skillshub.intra.xiaojukeji.com/skill/deskbee-book-room
version: v1.0.0
---

# DeskBee Book Room

## Quando Usar

Use esta skill quando o usuário quiser:
- Reservar uma sala de reunião no DeskBee
- Verificar disponibilidade de salas
- Criar reservas recorrentes (diárias ou semanais)
- Buscar salas por andar, capacidade ou propriedades específicas
- Consultar reservas já feitas em seu nome

## Pré-requisitos

- Usuário logado em https://99app.deskbee.app/app/home
- Interações via browser bridge (openPage, screenshot, evaluateScript)
- Horário permitido: 09:00 às 20:00

## Uso Básico

```python
# Fluxo simplificado de reserva
1. Navegar para https://99app.deskbee.app/app/home
2. Clicar em "RESERVA SALA"
3. Definir data (DD/MM/YYYY), horário início/fim
4. Aplicar filtros (andar, capacidade, propriedades)
5. Selecionar sala e preencher formulário
6. Confirmar reserva
```

## Parâmetros da Reserva

| Parâmetro | Obrigatório | Notas |
|-----------|-------------|-------|
| Título do evento | Sim | Campo "Título" no formulário |
| Data | Sim | Formato DD/MM/YYYY |
| Hora início | Sim | Entre 09:00-20:00 |
| Hora fim | Sim | Entre 09:00-20:00, após início |
| Andar preferido | Não | Match aproximado se exato indisponível |
| Número de pessoas | Não | Filtra por capacidade da sala |
| Propriedades | Não | TVs, videoconferência, etc. |
| Recorrência | Não | Diária ou semanal, máx 4 ocorrências |

## Exemplos Rápidos

### Exemplo 1: Reserva simples
```python
# Reservar sala para reunião de equipe
titulo = "Daily Standup"
data = "15/07/2026"
hora_inicio = "10:00"
hora_fim = "10:30"
pessoas = 8
andar = "6º Andar"
```

### Exemplo 2: Reserva recorrente
```python
# Reserva semanal às terças, 4 ocorrências
recorrencia = "Semanalmente"
ocorrencias = 4
# Repetir fluxo para cada ocorrência ou usar dropdown "Recorrência"
```

## Recursos Adicionais

- Para exemplos detalhados: `@examples.md`
- Para casos avançados: `@advanced.md`

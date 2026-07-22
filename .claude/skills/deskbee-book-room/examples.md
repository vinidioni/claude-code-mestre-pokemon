# DeskBee Book Room - Exemplos Detalhados

## Exemplo 0: Consultar Minhas Reservas

```python
# Acessar pagina de reservas do usuario
openPage("https://99app.deskbee.app/app/booking/my")

# Ou verificar via dashboard
openPage("https://99app.deskbee.app/app/dashboard")

# Extrair lista de reservas ativas
bookings = evaluateScript("""
    // Procurar cards de reserva
    const cards = document.querySelectorAll('.booking-card, .reservation-item');
    return Array.from(cards).map(card => {
        const text = card.innerText;
        return {
            title: card.querySelector('.title')?.innerText || '',
            date: card.querySelector('.date')?.innerText || '',
            time: card.querySelector('.time')?.innerText || '',
            room: card.querySelector('.room-name')?.innerText || '',
            status: card.querySelector('.status')?.innerText || ''
        };
    });
""")
```

## Exemplo 1: Reserva Completa Passo a Passo

```python
# 1. Acessar página inicial
openPage("https://99app.deskbee.app/app/home")

# 2. Navegar para reserva de sala
# Clicar no botão "RESERVA SALA"
# URL resultante: /app/booking/meetingroom

# 3. Definir data e horário
# Data: clicar no campo de data → selecionar no calendário
# Horário: usar document.execCommand('insertText', false, 'HH:MM')
# Exemplo:
evaluateScript("""
    const startInput = document.querySelector('input[placeholder="Início"]');
    startInput.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, '14:00');
""")

# 4. Aplicar filtros
# Número de pessoas: 10
# Andar: "6º Andar"
# Propriedades: TV, Videoconferência
# Clicar "FILTRAR"

# 5. Selecionar sala
# Scroll até encontrar o card da sala desejada
# Clicar "SELECIONAR" no card correto

# 6. Preencher formulário
evaluateScript("""
    const titleInput = document.querySelector('input[name="titulo"]');
    titleInput.focus();
    document.execCommand('insertText', false, 'Reunião de Planning');
""")

# 7. Confirmar
# Clicar "Finalizar reserva"
# Aceitar termos: "CONFIRMO QUE LI E ESTOU DE ACORDO"
# Verificar mensagem: "Reserva feita com sucesso!"
```

## Exemplo 2: Verificar Disponibilidade

```python
# Apenas verificar quais salas estão disponíveis
# sem efetivar a reserva

openPage("https://99app.deskbee.app/app/booking/meetingroom")

# Definir parâmetros
data = "20/07/2026"
hora_inicio = "09:00"
hora_fim = "18:00"

# Aplicar filtros e listar salas disponíveis
salas = evaluateScript("""
    const cards = document.querySelectorAll('.room-card');
    return Array.from(cards).map(card => ({
        nome: card.querySelector('.room-name')?.innerText,
        andar: card.querySelector('.floor')?.innerText,
        capacidade: card.querySelector('.capacity')?.innerText,
        disponivel: !card.querySelector('.unavailable')
    }));
""")
```

## Exemplo 3: Reserva Recorrente (Semanal)

```python
# Criar reserva semanal para sprint planning
# 4 ocorrências (um mês)

parametros = {
    "titulo": "Sprint Planning",
    "data_inicial": "15/07/2026",
    "hora_inicio": "14:00",
    "hora_fim": "16:00",
    "recorrencia": "Semanalmente",
    "ocorrencias": 4,
    "pessoas": 12,
    "andar": "7º Andar"
}

# Na interface:
# 1. Localizar dropdown "Recorrência" (default: "Não se repete")
# 2. Mudar para "Semanalmente"
# 3. Definir número de ocorrências: 4
# 4. Completar reserva normalmente

# Se UI não suportar, criar 4 reservas individuais
# repetindo os passos 3-7 para cada data
```

## Exemplo 4: Lidar com Conflitos

```python
# Quando sala já está reservada
# Mensagem de erro: "X já possui uma reserva para o ambiente Y no período informado"

# Estratégia:
# 1. Capturar erro na tela
screenshot()

# 2. Sugerir alternativas ao usuário
# - Outro horário no mesmo dia
# - Mesmo horário em outro dia
# - Sala similar no mesmo andar

# 3. Fechar formulário atual (Escape ou ícone de close)
evaluateScript("document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));")

# 4. Tentar nova seleção com parâmetros ajustados
```

## Exemplo 5: Seleção Precisa de Sala

```python
# Quando múltiplas salas têm o mesmo nome em andares diferentes
# Ex: "Sala Alpha" no 6º e 7º andar

# Estratégia: verificar o andar no card antes de clicar
evaluateScript("""
    const buttons = document.querySelectorAll('button:contains("SELECIONAR")');
    for (const btn of buttons) {
        // Subir 4 níveis no DOM para encontrar o card
        let card = btn;
        for (let i = 0; i < 4; i++) {
            card = card.parentElement;
        }
        const cardText = card.innerText;
        if (cardText.includes('6º Andar')) {
            btn.click();
            break;
        }
    }
""")
```

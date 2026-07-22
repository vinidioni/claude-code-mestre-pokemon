# DeskBee Book Room - Casos Avançados

## Propriedades de Salas Disponíveis

Propriedades comuns que podem ser filtradas:

| Propriedade | Descrição |
|-------------|-----------|
| TV | Sala equipada com TV |
| Videoconferência | Sistema de videoconferência integrado |
| Quadro branco | Quadro para apresentações |
| Projetor | Projetor disponível |
| Telefone | Telefone de conferência |
| Ar condicionado | Controle de temperatura |

> **Nota:** Para lista completa, verificar interface atual do DeskBee.

## Padrões de Interação DOM

### Scroll para Sala Específica

```javascript
// Scroll incremental até encontrar o card
let found = false;
let scrollPos = 0;
while (!found && scrollPos < 5000) {
    document.documentElement.scrollTop = scrollPos;
    const cards = document.querySelectorAll('.room-card');
    for (const card of cards) {
        if (card.innerText.includes('Sala Desejada')) {
            found = true;
            card.scrollIntoView({ behavior: 'instant', block: 'center' });
            break;
        }
    }
    scrollPos += 500;
}
```

### Inserção de Texto em Inputs

```javascript
// Método confiável para preencher inputs
function fillInput(selector, value) {
    const input = document.querySelector(selector);
    if (!input) return false;
    
    input.focus();
    input.click();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, value);
    
    // Disparar evento de change para reatividade
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    return true;
}

// Uso
fillInput('input[name="titulo"]', 'Reunião Importante');
fillInput('input[placeholder="Número de pessoas"]', '8');
```

### Clique em Botão SELECIONAR

```javascript
// Clique seguro considerando o andar
function selectRoomByFloor(floorText) {
    const buttons = Array.from(document.querySelectorAll('button'))
        .filter(btn => btn.innerText.includes('SELECIONAR'));
    
    for (const btn of buttons) {
        // Subir na árvore DOM para encontrar info do andar
        let parent = btn.parentElement;
        let attempts = 0;
        while (parent && attempts < 5) {
            if (parent.innerText.includes(floorText)) {
                btn.click();
                return true;
            }
            parent = parent.parentElement;
            attempts++;
        }
    }
    return false;
}

// Uso
selectRoomByFloor('6º Andar');
```

## Tratamento de Erros Avançado

### Diálogo de Atualização do App

```javascript
// Detectar e fechar popup de atualização
const updateDialog = document.querySelector('.update-dialog, .modal-update');
if (updateDialog && updateDialog.style.display !== 'none') {
    // Método 1: Pressionar Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    
    // Método 2: Clicar no backdrop
    const backdrop = document.querySelector('.modal-backdrop, .overlay');
    if (backdrop) backdrop.click();
}
```

### Validação de Horário

```python
def validar_horario(hora_inicio: str, hora_fim: str) -> tuple[bool, str]:
    """Valida se horários estão dentro do permitido (09:00-20:00)"""
    from datetime import datetime
    
    formato = "%H:%M"
    inicio = datetime.strptime(hora_inicio, formato)
    fim = datetime.strptime(hora_fim, formato)
    
    limite_inicio = datetime.strptime("09:00", formato)
    limite_fim = datetime.strptime("20:00", formato)
    
    if inicio < limite_inicio or inicio > limite_fim:
        return False, f"Hora início deve estar entre 09:00 e 20:00"
    
    if fim < limite_inicio or fim > limite_fim:
        return False, f"Hora fim deve estar entre 09:00 e 20:00"
    
    if fim <= inicio:
        return False, "Hora fim deve ser após hora início"
    
    return True, "OK"
```

### Retry com Fallback

```python
async def reservar_com_fallback(parametros, max_tentativas=3):
    """Tenta reservar com fallback para horários próximos"""
    
    for tentativa in range(max_tentativas):
        try:
            resultado = await tentar_reserva(parametros)
            if resultado.sucesso:
                return resultado
        except SalaIndisponivel as e:
            # Sugerir horário 30min antes ou depois
            parametros['hora_inicio'] = ajustar_horario(parametros['hora_inicio'], 30)
            parametros['hora_fim'] = ajustar_horario(parametros['hora_fim'], 30)
            continue
    
    raise FalhaReserva("Não foi possível reservar após tentativas")
```

## Automação Completa

### Script Python de Referência

```python
#!/usr/bin/env python3
"""
Automação completa de reserva DeskBee
Requer: playwright install
"""
from playwright.sync_api import sync_playwright
from datetime import datetime, timedelta

class DeskBeeBooker:
    def __init__(self):
        self.base_url = "https://99app.deskbee.app"
        
    def book_room(self, params: dict) -> dict:
        """
        Realiza reserva de sala completa
        
        Args:
            params: {
                'titulo': str,
                'data': 'DD/MM/YYYY',
                'hora_inicio': 'HH:MM',
                'hora_fim': 'HH:MM',
                'pessoas': int (opcional),
                'andar': str (opcional),
                'recorrencia': 'Diariamente'|'Semanalmente'|None,
                'ocorrencias': int (max 4)
            }
        """
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page(viewport={'width': 1280, 'height': 800})
            
            try:
                # Login e navegação
                page.goto(f"{self.base_url}/app/home")
                page.click('text=RESERVA SALA')
                page.wait_for_url('**/booking/meetingroom')
                
                # Preencher data e hora
                # ... implementação dos passos
                
                return {'success': True, 'message': 'Reserva confirmada'}
                
            except Exception as e:
                return {'success': False, 'error': str(e)}
            finally:
                browser.close()
```

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| Sala não aparece | Filtros muito restritivos | Remover alguns filtros |
| Botão SELECIONAR não clica | Elemento ainda carregando | Aguardar 500ms, retry |
| Erro "já possui reserva" | Conflito de horário | Sugerir novo horário |
| Input não aceita texto | Focus não aplicado | Clicar 2x antes de digitar |
| Calendário não abre | Overlay bloqueando | Fechar dialogs abertos |

## Integração com Outros Sistemas

### Enviar Notificação após Reserva

```python
# Após reserva bem-sucedida, notificar via D-Chat
from dchat import send_message

reserva = book_room(params)
if reserva['success']:
    send_message(
        to="#salas-reservadas",
        message=f"✅ Sala reservada: {params['titulo']}\n"
                f"📅 {params['data']} | {params['hora_inicio']}-{params['hora_fim']}"
    )
```

### Salvar no Calendar

```python
# Criar evento no Google Calendar após reserva
from google_calendar import create_event

if reserva['success']:
    create_event(
        title=params['titulo'],
        start=f"{params['data']} {params['hora_inicio']}",
        end=f"{params['data']} {params['hora_fim']}",
        location=f"WeWork Paulista - {params.get('andar', 'Sala')}"
    )
```

# Guia Detalhado - DevTools Network Tab

## Onde está o "Preserve Log"

O DevTools pode aparecer em diferentes posições. Veja como encontrar em cada caso:

---

## Layout 1: DevTools na Parte Inferior (padrão)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Chrome - Gattaran                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │                    CONTEÚDO DO SITE                             │   │
│  │                                                                 │   │
│  │                                                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  DevTools                                                    ▲  │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │   │
│  │  │ Elements Console Sources Network ► Performance ...       │ │   │
│  │  │                               ▲                          │ │   │
│  │  │                     CLIQUE AQUI (aba Network)            │ │   │
│  │  └──────────────────────────────────────────────────────────┘ │   │
│  │                                                                │   │
│  │  [🔴 Recording] [🚫 Clear] [Filter] [Preserve log ☐] [Disable │   │
│  │                                               ▲                │   │
│  │                     CHECKBOX "Preserve log" ESTÁ AQUI         │   │
│  │                     (pode estar escrito por extenso ou ser     │   │
│  │                      apenas um ícone de círculo)              │   │
│  │                                                                │   │
│  │  Name          Status    Type      Size    Time               │   │
│  │  ────────────────────────────────────────────────              │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layout 2: Barra de Ferramentas do Network

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BARRA DE FERRAMENTAS SUPERIOR DO NETWORK TAB                           │
│                                                                          │
│  ┌─────┬─────┬─────────────────┬──────────────────┬─────────────────┐   │
│  │ 🔴  │ 🚫  │ Filter: [ All ▼ ]│ [ Preserve log ] │ [ Disable cache]│   │
│  │Rec  │Clear│                  │       ☐         │       ☐         │   │
│  └─────┴─────┴─────────────────┴──────────────────┴─────────────────┘   │
│     ▲    ▲                              ▲                   ▲          │
│     │    │                              │                   │          │
│     │    │                              │                   └── MARCAR │
│     │    │                              │                              │
│     │    │                              └── MARCAR ESTA CAIXA          │
│     │    │                                                              │
│     │    └── Limpa logs antigos                                         │
│     │                                                                    │
│     └── Indica que está gravando (vermelho = gravando)                  │
│                                                                          │
│  ☑️ = Checkbox marcada                                                   │
│  ☐ = Checkbox desmarcada ← (clique para marcar)                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Localização Exata dos Elementos

### Passo 1: Abrir DevTools e ir em Network

```
┌──────────────────────────────────────────────────────────┐
│  Teclas de atalho:                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    F12      │  │ Ctrl+Shift+I│  │  Cmd+Option+I   │  │
│  │  (Windows)  │  │  (Windows)  │  │     (Mac)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
│  Depois de abrir, clique na aba: "Network"              │
│                                                          │
│  ┌────────┬────────┬──────────┬────────┬─────────┐      │
│  │Elements│Console │► Network │ Sources│ ...     │      │
│  └────────┴────────┴──────────┴────────┴─────────┘      │
│                           ▲                              │
│                     CLIQUE AQUI                          │
└──────────────────────────────────────────────────────────┘
```

### Passo 2: Encontrar "Preserve log"

**Opção A - Texto completo:**
```
Na barra de ferramentas do Network, procure por:

☐ Preserve log

Clique na caixinha para ficar: ☑️ Preserve log
```

**Opção B - Ícone apenas (se a tela estiver pequena):**
```
Passe o mouse sobre os ícones da barra até achar um que mostre
o tooltip "Preserve log" ao passar o mouse.

Pode ser um ícone de círculo ou de página com um símbolo.
```

**Opção C - Menu de 3 pontos (⋮):**
```
Se não achar na barra principal:

┌────────────────────────────────────────┐
│  Network                           [⋮] │  ← CLIQUE NOS 3 PONTOS
│  ┌──────────────────────────────────┐  │
│  │  ☐ Preserve log                  │  │
│  │  ☐ Disable cache                 │  │
│  │  ☐ Offline                       │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## Versões Diferentes do Chrome

### Chrome Antigo (antes de 2020):
```
A barra de ferramentas fica assim:

[🔴] [🚫] [Filter] [☐ Preserve Log] [☐ Disable Cache] [Offline ▼]
                                        ▲
                                   ESTÁ AQUI
```

### Chrome Novo (2021+):
```
Pode estar em um menu suspenso:

┌───────────────────────────────────────┐
│  [🔴] [🚫] [Filter ▼] [Mais ▼]       │
│                            ▲          │
│                     CLIQUE AQUI       │
│                                       │
│  Menu que abre:                       │
│  ├── ☐ Preserve log                   │
│  ├── ☐ Disable cache                  │
│  └── ...                              │
└───────────────────────────────────────┘
```

---

## Checklist Visual

Depois de configurar, deve estar assim:

```
┌──────────────────────────────────────────────────────────┐
│  Network                                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔴 Recording   🚫 Clear   Filter   ☑️ Preserve log │  │
│  │                                    ☑️ Disable cache│  │
│  └────────────────────────────────────────────────────┘  │
│                         ▲        ▲                       │
│                         │        │                       │
│                    MARCADO    MARCADO                    │
│                                                          │
│  [ All  XHR  JS  CSS  Img  Media  Font  Doc  WS  Other] │
│         ▲                                                │
│   CLIQUE EM "XHR" (ou "Fetch/XHR")                       │
│                                                          │
│  Name              Status   Type     Size    Time        │
│  ─────────────────────────────────────────────────       │
│  (lista de chamadas aparecerá aqui)                      │
└──────────────────────────────────────────────────────────┘
```

---

## Solução de Problemas

### "Não consigo ver a barra de ferramentas"
```
Aperte Ctrl + + (zoom in) no DevTools para aumentar o tamanho,
ou arraste a borda do DevTools para cima para aumentar a altura.
```

### "Não tem checkbox, só ícones"
```
Passe o mouse sobre cada ícone e espere aparecer o tooltip (texto explicativo).
Procure por:
- "Preserve log"
- "Persist logs"
- "Do not clear log on page reload"
```

### "Ainda não acho"
```
Alternativa: NÃO PRECISA marcar Preserve log se você fizer tudo
em uma sequência rápida sem recarregar a página:

1. Abra DevTools → Network
2. LIMPE o log (clique no 🚫)
3. FAÇA a busca da order
4. CLIQUE no link da order
5. Os logs estarão lá (não feche o DevTools)
```

---

## Resumo das Ações

| Ordem | Ação | Onde |
|-------|------|------|
| 1 | Abrir DevTools | `F12` ou `Ctrl+Shift+I` |
| 2 | Ir em Network | Aba "Network" no topo |
| 3 | Limpar logs | Botão 🚫 (círculo com risco) |
| 4 | Filtrar XHR | Clique em "XHR" ou "Fetch/XHR" |
| 5 | Preservar logs | ☑️ "Preserve log" (se achar) |
| 6 | Fazer a busca | No Gattaran normalmente |
| 7 | Capturar chamadas | Veja a lista que aparece |

---

## Me envie isso

Se ainda tiver dificuldade, me envie:
1. Uma **screenshot** do seu DevTools na aba Network (posso identificar onde está)

Ou simplesmente:
2. **Não use Preserve log** - só limpe o log antes de buscar e não feche o DevTools até copiar as chamadas.

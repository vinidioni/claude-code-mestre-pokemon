---
name: deskbee-automation-session
description: Contexto da sessão para retomada - Discussão de arquitetura para automação DeskBee
---

## 🎯 Objetivo

Definir arquitetura para automação de reservas de salas no DeskBee (99 Workspace & Facilities):
1. Entender funcionamento da skill do Skillshub
2. Decidir entre construir vs instalar
3. Avaliar API vs Browser automation
4. Escolher abordagem de implementação

## 📁 Arquivos Criados

| Arquivo | Local | Status |
|---------|-------|--------|
| `analyze_skill.py` | `scripts/` | ✅ Script de análise (não executado) |

## 🔧 Decisões Tomadas

### 1. Construir vs Instalar
| Aspecto | Instalar Skill | Construir Próprio |
|---------|----------------|-------------------|
| Controle | Limitado | Total |
| Personalização | Fixa | Adaptável |
| Manutenção | Terceiro | Própria |
| **Decisão** | ❌ | ✅ |

### 2. API vs Browser Automation
| Critério | API | Browser |
|----------|-----|---------|
| Velocidade | ⚡ Milissegundos | 🐢 Segundos |
| Confiabilidade | ✅ Alta | ❌ Frágil |
| Manutenção | ✅ Baixa | ❌ Alta |
| Disponibilidade | ❓ Provavelmente não existe | ✅ Sempre funciona |
| **Preferência** | ✅ Se existir | Último recurso |

### 3. Arquitetura Recomendada

```
Opção A: MCP Server + Playwright (recomendada)
├── Pros: Integração nativa com Claude, reutiliza lógica da skill
└── Cons: SSO complexo, manutenção alta se DOM mudar

Opção B: Script Python standalone
├── Pros: Simples de construir
└── Cons: Não integra com fluxo de conversa do Claude

Opção C: API "hackeada" (endpoints internos)
├── Pros: Mais rápido se funcionar
└── Cons: Pode quebrar, violar ToS
```

## 🚀 Próximo Passo

**Investigar se DeskBee tem API oculta**:

1. Abrir DeskBee no Chrome: https://99app.deskbee.app/app/home
2. F12 (Developer Tools) → Network tab
3. Realizar ações (buscar salas, fazer reserva)
4. Observar chamadas XHR/Fetch
5. Identificar endpoints de API

### Se encontrar API:
- Documentar endpoints
- Testar com curl/Postman
- Criar MCP Server usando API direta

### Se não encontrar API:
- Prosseguir com MCP Server + Playwright
- Definir escopo: consulta apenas ou também reserva/cancelamento?
- Planejar fluxo de autenticação (sessão persistente)

## 💭 Decisões Pendentes

1. **Investigação de API**: Aguardando verificação manual no browser
2. **Escopo**: Só consultar reservas? Ou também criar/cancelar?
3. **Login**: Primeira vez manual, sessão persistente depois?

## 📝 Notas da Sessão

- Skill do Skillshub é **documentação estruturada**, não código executável
- Usa 8 passos: coletar params → navegar → preencher → confirmar
- Limitações: horário 09:00-20:00, máx 4 recorrências
- Usuário tem reserva hoje que não conseguimos encontrar via automação
- SSO via Google/DiDi é o maior desafio técnico
- Skill original referencia arquivos externos (dom-patterns.md, room-properties.md)

## 🔗 Referências

- Skill original: https://skillshub.intra.xiaojukeji.com/skill/deskbee-book-room
- DeskBee: https://99app.deskbee.app/app/home

---

**Data da sessão:** 2026-07-15
**Status:** Pausado - continuar amanhã

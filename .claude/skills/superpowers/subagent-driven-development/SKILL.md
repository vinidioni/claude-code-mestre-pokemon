---
name: subagent-driven-development
description: Desenvolvimento orientado a subagentes - delegação inteligente de tarefas
parent: superpowers
triggers:
  - subagente
  - delegar
  - agente especializado
  - fazer em paralelo
  - divisao de trabalho
---

# Skill: Subagent-Driven Development (SDD)

## Propósito

Usar subagentes para executar tarefas de forma autônoma, permitindo que o agente principal coordene enquanto especialistas trabalham.

## Quando Usar

- Tarefa é **complexa o suficiente** para valer o overhead
- Pode ser **claramente especificada** sem ambiguidade
- Não requer **coordenação em tempo real**
- Você quer **trabalhar em paralelo** em múltiplas frentes

## Quando NÃO Usar

- Tarefa é simples (supervisionar agente > fazer)
- Requer decisões constantes durante execução
- Contexto muda rapidamente
- Revisão em tempo real é necessária

## Padrão de Delegação

### Estrutura de Delegação

```markdown
## 🤖 Subagente: [Nome da Task]

### Contexto
[Background, por que isso importa, restrições]

### Objetivo
[O que o subagente deve entregar - 1 frase clara]

### Input
[O que o subagente recebe]
```
[input específico]
```

### Output Esperado
[Formato, local, critérios de sucesso]
```
[exemplo ou template]
```

### Restrições
- [ ] [Restrição 1]
- [ ] [Restrição 2]

### Como Verificar
[Como saber se ficou bom]

### Exemplos
#### Bom
```
[Exemplo de bom resultado]
```

#### Ruim
```
[Exemplo de resultado inadequado]
```

### Timeout
[Quanto tempo máximo - ex: 10 minutos]
```

## Template de Envio

```
🤖 Disparando Subagente: [Nome]

Contexto: [Background]
Objetivo: [Entregável]
Input: [Dados]
Timeout: [X minutos]

[AGUARDANDO RESULTADO...]

---

✅ Subagente retornou!

Resultado: [Resumo]
Status: [Sucesso/Parcial/Falha]

Vou integrar ao projeto principal...
```

## Tipos de Subagentes

| Tipo | Especialidade | Quando Usar |
|------|--------------|-------------|
| **Implementador** | Escreve código | Task clara, especificada |
| **Refatorador** | Melhora código existente | Testes passam, precisa de cleanup |
| **Testador** | Escreve testes | Cobertura insuficiente |
| **Documentador** | Cria docs | API pronta, precisa de docs |
| **Investigador** | Pesquisa/Spike | Solução desconhecida |

## Exemplos

### Exemplo 1: Implementar Componente

```
🤖 Subagente: Criar Componente Button

Contexto: Precisamos de um botão reutilizável para o design system.
Já temos o tema configurado com cores.

Objetivo: Criar componente Button em React com variants.

Input:
- Usar TypeScript
- Variants: primary, secondary, danger
- Tamanhos: sm, md, lg
- Propriedades: children, onClick, disabled, variant, size
- Seguir padrão em src/components/Card/

Output Esperado:
Arquivo src/components/Button/Button.tsx
Arquivo src/components/Button/Button.test.tsx
Arquivo src/components/Button/index.ts

Exemplo de uso:
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

Restrições:
- Não use bibliotecas externas (exceto React)
- Testes devem passar
- Acessível (ARIA labels)

Timeout: 15 minutos
```

### Exemplo 2: Refatoração

```
🤖 Subagente: Refatorar utils/date.ts

Contexto: Funções de data estão repetidas e mal organizadas.

Objetivo: Consolidar funções, eliminar duplicatas, manter testes passando.

Input:
- Arquivo atual: src/utils/date.ts (ver git)
- Testes: src/utils/date.test.ts

Output Esperado:
- Mesma funcionalidade, código limpo
- Testes ainda passam
- Sem breaking changes na API pública

Como verificar:
- npm test src/utils/date.test.ts → passa
- npm run build → sem erros

Timeout: 10 minutos
```

## Agente Principal como Coordenador

O agente principal:
1. **Decide** o que delegar
2. **Especifica** claramente
3. **Dispara** subagentes
4. **Aguarda** resultados
5. **Revisa** entregáveis
6. **Integra** ao projeto
7. **Decide** próximo passo

## Erros Comuns

1. **Especificação vaga** → Subagente faz errado
2. **Muito contexto** → Subagente se perde
3. **Pouco contexto** → Subagente não entende o problema
4. **Monitorar de perto** → Vai contra o propósito
5. **Não revisar** → Assume que ficou bom

## Comandos

```
"Delegar para subagente"
"Criar subagente para [tarefa]"
"Executar via agente"
"Subagente especializado"
```

---

**Parte do:** Superpowers Framework
**Relacionado:** dispatching-parallel-agents

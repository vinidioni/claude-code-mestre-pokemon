---
name: systematic-debugging
description: Depuração sistemática - encontre bugs com método, não com sorte
parent: superpowers
triggers:
  - debug
  - debugar
  - tem um bug
  - nao esta funcionando
  - erro misterioso
  - depurar
  - investigar problema
---

# Skill: Systematic Debugging

## Propósito

Encontrar e corrigir bugs através de um processo sistemático, em vez de adivinhação ou mudanças aleatórias.

## A Regra de Ouro

> **Nunca mude código esperando que o bug suma.**
> Mude código porque você **entendeu** o bug.

## O Método HEAL

```
H - Hypothesis (Hipótese)
E - Experiment (Experimento)
A - Analyze (Análise)
L - Learn (Aprendizado)
```

## O Processo

### 1. HYPOTHESIS (Criar Hipótese)

Antes de tocar no código, forme uma explicação:

```
Eu acredito que o bug ocorre porque:
_________________________________________

Isso explicaria por que:
_________________________________________
```

**Hipóteses comuns:**
- Variável não inicializada
- Condição de corrida
- Assumção falsa sobre input
- Estado mutado inesperadamente
- Ordem de operações errada

### 2. EXPERIMENT (Testar Hipótese)

Crie um experimento que **prove ou disprove** sua hipótese.

**Tipos de experimentos:**
- Adicionar logs (console.log, print)
- Assertivas (confirmar estados)
- Isolar componente (teste unitário)
- Mudança mínima (uma variável)
- Reverter para versão anterior

**Regra:** Um experimento por vez.

### 3. ANALYZE (Analisar Resultado)

```
Resultado do experimento:
_________________________________________

Isso confirma ou refuta minha hipótese?
□ Confirma - o bug é exatamente o que pensei
□ Refuta - preciso de nova hipótese
□ Inconclusivo - experimento foi ruim
```

### 4. LEARN (Aprender e Agir)

Se confirmou:
- ✅ Agora você entende o bug
- ✅ Pode corrigir com confiança

Se refutou:
- 📝 Anote o que aprendeu
- 🔄 Crie nova hipótese
- 🔄 Volte para o passo 1

## Exemplo Completo

**Problema:** Usuário faz login mas aparece deslogado na página inicial

### Ciclo 1

**H:** Token JWT não está sendo salvo no localStorage

**E:** Adicionar `console.log('Token saved:', token)` após login

**A:** Token aparece no console, está sendo salvo

**L:** Hipótese refutada. Token é salvo. Problema é na leitura.

### Ciclo 2

**H:** Página inicial lê token antes de estar disponível (race condition)

**E:** Adicionar `console.log('Token read:', token)` na página inicial. Comparar timestamps.

**A:** Página lê token em T=0, login salva em T=500ms

**L:** ✅ Confirma hipótese! Ordem errada.

### Correção
```javascript
// Antes (ruim)
const token = localStorage.getItem('token'); // Lê imediatamente

// Depois (bom)
// Aguarda evento de login ou verifica periodicamente
useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) setUser(decodeToken(token));
  };
  window.addEventListener('storage', checkAuth);
  return () => window.removeEventListener('storage', checkAuth);
}, []);
```

## Ferramentas

| Ferramenta | Uso | Quando |
|------------|-----|--------|
| **Logs** | Verificar estado | Sempre primeiro |
| **Debugger** | Pausar e inspecionar | Fluxo complexo |
| **Testes** | Isolar componente | Bug consistente |
| **Git bisect** | Achar introdução | Regressão |
| **Minimal repro** | Simplificar | Bug complexo |

## Lista de Verificação

Antes de começar:
- [ ] Consigo reproduzir o bug consistentemente?
- [ ] Qual a última versão que funcionava?
- [ ] O que mudou entre funcionar e quebrar?
- [ ] Bug é local ou em produção também?

Durante:
- [ ] Uma hipótese por vez
- [ ] Documento cada experimento
- [ ] Volto ao estado anterior se experimento falhar

## Anti-Padrões

❌ Debug por diferença:
```
"Vou mudar isso e ver se funciona..."
"Hmm, não. Vou mudar aquilo..."
"Ainda não. Talvez se eu mudar aquilo também..."
```

❌ Shotgun debugging:
```
"Vou mudar 5 coisas ao mesmo tempo, uma deve funcionar"
```

❌ Debugging por comentário:
```
"Vou comentar isso e ver se funciona"
```

## Comandos

```
"Vamos debugar"
"Tem um bug"
"Não está funcionando"
"Depurar sistematicamente"
"Investigar o problema"
```

---

**Parte do:** Superpowers Framework
**Baseado em:** Método científico aplicado a debugging

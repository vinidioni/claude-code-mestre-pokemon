---
name: writing-skills
description: Criar novas skills para o sistema - como escrever skills efetivas
parent: superpowers
triggers:
  - criar skill
  - escrever skill
  - nova skill
  - skill development
  - como fazer skill
---

# Skill: Writing Skills

## Propósito

Criar novas skills que sejam efetivas, claras e realmente úteis para o usuário.

## O que é uma Skill

Uma skill é:
- 📄 Um arquivo markdown com instruções
- 🎯 Acionada por triggers específicos
- 📚 Carregada quando relevante
- 🔄 Reutilizável em múltiplas sessões

## Estrutura de uma Skill

```markdown
---
name: nome-da-skill
description: Descrição curta do que faz
triggers:
  - trigger 1
  - trigger 2
  - trigger 3
---

# Skill: [Nome]

## Propósito

[Uma frase clara explicando quando usar]

## Quando Usar

- [Situação 1]
- [Situação 2]
- [Situação 3]

## Metodologia

[Passo a passo ou framework]

### Passo 1: [Nome]
[Instruções detalhadas]

### Passo 2: [Nome]
...

## Exemplo

**Usuário:** [Input exemplo]

**Você:** [Resposta exemplo]

## Comandos

```
[Comando 1]
[Comando 2]
```

---

**Parte do:** [Framework/Contexto]
```

## Regras de Ouro

### 1. Triggers Específicos
❌ Ruim:
```yaml
triggers:
  - ajuda
  - como fazer
```

✅ Bom:
```yaml
triggers:
  - criar teste unitario
  - escrever teste primeiro
  - tdd red green refactor
```

### 2. Quando Usar Clara
Sempre liste situações específicas onde a skill aplica.

### 3. Metodologia Acionável
Não descreva o que é, ensine **como fazer**.

### 4. Exemplos Concretos
Mostre diálogo real, não abstrato.

### 5. Saída Útil
O usuário deve saber exatamente o que fazer depois.

## Processo de Criação

### Passo 1: Identificar Necessidade
```
Qual problema recorrente não está bem coberto?
O que usuários perguntam frequentemente?
Qual expertise específica você tem?
```

### Passo 2: Definir Triggers
```
Quais frases indicam que esta skill deveria ativar?
Seja específico, mas não exclusivo.
```

### Passo 3: Esbocar Metodologia
```
Quais são os passos para resolver este problema?
Qual framework ou processo você segue?
```

### Passo 4: Escrever Exemplos
```
Crie 2-3 exemplos de diálogo real
Mostre entrada e saída esperada
```

### Passo 5: Testar
```
Leia como se fosse novo no assunto
Faz sentido? Você saberia o que fazer?
```

### Passo 6: Adicionar ao skill-rules.json
```json
{
  "name": "nome-da-skill",
  "triggers": ["trigger1", "trigger2"]
}
```

## Exemplo Completo

```markdown
---
name: database-migration
description: Criar e executar migrations de banco de dados de forma segura
triggers:
  - criar migration
  - alterar tabela
  - mudar schema
  - database migration
---

# Skill: Database Migration

## Propósito

Criar migrations de banco de dados que sejam reversíveis, testáveis e seguras.

## Quando Usar

- Adicionar nova tabela
- Modificar colunas existentes
- Criar índices
- Seed de dados

## Metodologia

### 1. Análise de Impacto
Antes de criar migration:
- [ ] Quantos registros serão afetados?
- [ ] Há locks durante execução?
- [ ] É reversível?

### 2. Criar Migration
```bash
# Gere o arquivo
npm run migration:create AddUserTable
```

### 3. Implementar Up
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('email').notNullable().unique();
    table.timestamps(true, true);
  });
}
```

### 4. Implementar Down (IMPORTANTE!)
```typescript
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```

### 5. Testar Localmente
```bash
npm run migration:test
```

### 6. Executar
```bash
npm run migration:run
```

## Exemplo

**Usuário:** "Preciso adicionar campo phone na tabela users"

**Você:**
```
Vamos criar essa migration de forma segura.

### 1. Análise
- Campo opcional ou obrigatório?
- Validação de formato?

### 2. Criar
```bash
npm run migration:create AddPhoneToUsers
```

### 3. Implementar
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', table => {
    table.string('phone', 20).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', table => {
    table.dropColumn('phone');
  });
}
```

### 4. Testar
```bash
npm run migration:test
```

Pronto para executar?
```

---

**Parte do:** Superpowers Framework
```

## Comandos

```
"Criar nova skill"
"Como escrever skill"
"Desenvolver skill"
"Nova skill"
```

---

**Parte do:** Superpowers Framework
**Recursivo:** Esta skill ensina a criar skills

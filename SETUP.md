# 🚀 Setup do Ambiente DCC

Guia completo para configurar o ambiente DCC do zero em uma nova máquina.

---

## 📋 Pré-requisitos

### 1. Software Base

| Ferramenta | Versão | Download | Obrigatório |
|------------|--------|----------|-------------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) | ✅ |
| **Python** | 3.10+ | [python.org](https://python.org) | ✅ |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) | ✅ |
| **Claude Code** | latest | `npm install -g @anthropic-ai/claude-code` | ✅ |

### 2. Contas e Acessos

Você precisará criar contas/obter credenciais para:

- [ ] **GitHub** - Token de acesso pessoal (para MCP GitHub)
- [ ] **Google Cloud** - Para integração Google Workspace (opcional)
- [ ] **SmartWork/D-Chat** - Acesso corporativo (opcional)

---

## 🔧 Instalação Passo a Passo

### Etapa 1: Clone o Repositório

```bash
git clone https://github.com/vinidioni/claude-code-mestre-pokemon.git dcc
cd dcc
```

### Etapa 2: Execute o Script de Setup

```bash
# Windows (PowerShell como Administrador)
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

# macOS/Linux
bash scripts/setup.sh
```

Este script irá:
- ✅ Verificar pré-requisitos
- ✅ Instalar dependências Node.js
- ✅ Criar arquivos de configuração a partir dos templates
- ✅ Configurar permissões necessárias

### Etapa 3: Configure as Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# GitHub Token (obrigatório para MCP GitHub)
GITHUB_TOKEN=ghp_seu_token_aqui

# Google Workspace (opcional)
GOOGLE_CLIENT_SECRETS_PATH=/caminho/para/client_secret.json

# D-Chat / SmartWork (opcional)
DWS_SCRIPT_PATH=/caminho/para/dws-windows.ps1
```

**Como obter cada token:**

<details>
<summary><b>GitHub Token</b></summary>

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Selecione scopes: `repo`, `read:user`, `read:org`
4. Copie o token gerado para o `.env`

</details>

<details>
<summary><b>Google Workspace (opcional)</b></summary>

1. Acesse: https://console.cloud.google.com
2. Crie um projeto ou selecione existente
3. Ative APIs: Gmail, Calendar, Drive
4. Crie credenciais OAuth 2.0
5. Baixe o `client_secret.json`

</details>

<details>
<summary><b>D-Chat / SmartWork (opcional)</b></summary>

Requer acesso corporativo. Contate seu administrador de TI para:
- Instalação do SmartWork CLI
- Acesso ao D-Chat
- Script `dws-windows.ps1`

</details>

### Etapa 4: Configure o MCP

O script de setup já criou o `.mcp.json`. Verifique se os caminhos estão corretos:

```bash
# Verifique se o arquivo foi criado
cat .mcp.json
```

Se necessário, ajuste os caminhos para seu sistema operacional.

### Etapa 5: Teste a Instalação

```bash
# Verifique se o Claude Code está funcionando
claude --version

# Teste o status dos MCPs
claude mcp status

# Execute um workflow de teste
claude workflow run exemplo
```

---

## 📁 Estrutura de Configuração

Após o setup, você terá:

```
dcc/
├── .env                          # Suas credenciais (não commitar!)
├── .mcp.json                     # Configuração MCP gerada
├── .claude/
│   ├── settings.json             # Configurações do Claude Code
│   └── settings.local.json       # Configurações locais (não commitar)
└── ...
```

---

## 🛠️ Instalação Manual (Alternativa)

Se o script automático falhar, siga estes passos:

### 1. Instalar Dependências Node.js

```bash
# MCP Servers
cd mcp-servers/dchat
npm install
cd ../..
```

### 2. Configurar MCP

```bash
# Copie o template
cp .mcp.json.example .mcp.json

# Edite com seus caminhos
# Windows: use \\ ou /
# macOS/Linux: use /
```

### 3. Configurar Claude Code

```bash
# Copie as configurações
cp .claude/settings.json.example .claude/settings.json
```

---

## ✅ Verificação Pós-Setup

Execute o checklist de verificação:

```bash
node scripts/verify-setup.js
```

Isso irá verificar:
- ✅ Node.js instalado
- ✅ Python instalado
- ✅ Claude Code instalado
- ✅ Variáveis de ambiente configuradas
- ✅ MCPs funcionando
- ✅ Skills carregadas

---

## 🐛 Troubleshooting

### Problema: "command not found: claude"

**Solução:**
```bash
# Adicione ao PATH
export PATH="$PATH:$(npm bin -g)"

# Ou reinstale globalmente
npm install -g @anthropic-ai/claude-code
```

### Problema: MCP não conecta

**Solução:**
```bash
# Verifique se as variáveis de ambiente estão carregadas
source .env

# Teste manualmente
claude mcp status
```

### Problema: Caminhos do Windows vs macOS/Linux

**Solução:**
No `.mcp.json`, use sempre `/` em vez de `\\`:

```json
// ✅ Correto (funciona em todos os SOs)
"args": ["C:/Users/nome/Desktop/dcc/mcp-servers/dchat/index.js"]

// ❌ Evite (só funciona no Windows)
"args": ["C:\\Users\\nome\\Desktop\\dcc\\mcp-servers\\dchat\\index.js"]
```

---

## 📝 Próximos Passos

Após o setup técnico completo, siga a **ordem de leitura recomendada**:

1. **[README.md](README.md)** - Visão geral, arquitetura e como usar cada componente
2. **[CLAUDE.md](CLAUDE.md)** - Documentação completa de referência

**Testes práticos iniciais:**
```bash
# Explore as Skills
/skill list

# Teste um workflow
/workflow

# Crie seu primeiro Dev Doc
/dev-docs init minha-tarefa

# Verifique MCPs
claude mcp status

# Verifique atualizações
python scripts/check-updates.py
```

---

## 🔄 Atualizando o DCC

Ao longo do tempo, o DCC recebe atualizações no GitHub (novos workflows, skills, correções). Para atualizar sua instalação local **sem perder suas configurações**:

```bash
python scripts/check-updates.py
```

O que o script faz:
1. Verifica se há commits novos no GitHub
2. Mostra o que mudou (changelog)
3. Faz backup automático de:
   - `.env` (suas credenciais)
   - `.mcp.json` (suas configurações MCP)
   - `.claude/settings.local.json` (suas preferências)
4. Atualiza o repositório (se você aprovar)
5. Restaura suas configurações locais
6. Instala novas dependências (se houver)

**Backups são mantidos** em `.backup/update_YYYYMMDD_HHMMSS/` (últimos 5).

---

## 🤝 Suporte

Em caso de problemas:

1. Verifique os logs: `claude logs`
2. Consulte a documentação em `docs/`
3. Abra uma issue no GitHub

---

**Pronto para usar!** 🚀

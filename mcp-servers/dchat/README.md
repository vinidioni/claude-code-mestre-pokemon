# MCP D-Chat Server

Servidor MCP (Model Context Protocol) para integração com D-Chat via CLI `dws`.

## Funcionalidades

- **Enviar mensagens** para usuários ou grupos
- **Listar conversas** disponíveis
- **Ler mensagens** de chats (com filtros de tempo)
- **Obter informações** de chats e membros

## Pré-requisitos

1. **D-Chat desktop app** instalado e autenticado
2. **Node.js** 18+ instalado
3. **SmartWork CLI** disponível em `~/.SmartWork/skills/smartwork-cli/`

## Instalação

```bash
cd mcp-dchat-server
npm install
```

## Configuração no Claude Code

Adicione ao seu `.mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "dchat": {
      "command": "node",
      "args": ["C:\\Users\\viniciuscastanho\\Desktop\\dcc\\mcp-dchat-server\\index.js"],
      "env": {
        "DWS_SCRIPT_PATH": "C:\\Users\\viniciuscastanho\\.SmartWork\\skills\\smartwork-cli\\smartwork-shared\\assets\\dws-windows.ps1"
      }
    }
  }
}
```

Ou use o caminho relativo se preferir:

```json
{
  "mcpServers": {
    "dchat": {
      "command": "node",
      "args": ["./mcp-dchat-server/index.js"]
    }
  }
}
```

## Ferramentas Disponíveis

### `send_message`
Envia uma mensagem de texto para um usuário ou grupo.

**Parâmetros:**
- `target_type`: Tipo de destino (`user`, `chat_id`, `chat_name`, `current`)
- `target`: Identificador do destino (username, chat ID, ou nome do grupo)
- `message`: Texto da mensagem (suporta @mentions como `@username`)
- `dry_run` (opcional): Se true, apenas preview sem enviar

**Exemplos:**
```json
{
  "target_type": "user",
  "target": "maurojunior",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

```json
{
  "target_type": "chat_name",
  "target": "Nome do Grupo",
  "message": "@maurojunior Olá!"
}
```

### `list_chats`
Lista todas as conversas disponíveis (do cliente D-Chat).

**Nota:** Requer o cliente D-Chat em execução.

### `get_messages`
Recupera mensagens de uma conversa específica.

**Parâmetros:**
- `target_type`: Tipo de destino (`user`, `chat_id`, `chat_name`, `current`)
- `target`: Identificador do destino
- `time_range`: Faixa de tempo (`today`, `yesterday`, `last_7_days`, `latest`)
- `from_time` (opcional): Data/hora inicial (RFC3339)
- `to_time` (opcional): Data/hora final (RFC3339)
- `limit` (opcional): Limite de mensagens (padrão: 500)

### `get_chat_info`
Obtém informações sobre um chat específico.

**Parâmetros:**
- `target_type`: `chat_id` ou `current`
- `target`: Chat ID (se não for current)

### `get_latest_messages`
Obtém as mensagens mais recentes de um chat (até 50).

**Parâmetros:**
- `target_type`: `chat_id` ou `current`
- `target`: Chat ID (se não for current)
- `count`: Número de mensagens (1-50, padrão: 20)

## Limitações

- **Rate limit**: Máximo de 10 mensagens por minuto ao enviar
- **Workspace server**: Alguns comandos requerem o D-Chat rodando
- **Autenticação**: O usuário deve estar logado no D-Chat desktop

## Testando

```bash
# Testar o servidor manualmente
node index.js

# Em outro terminal, enviar um teste JSON-RPC:
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node index.js
```

## Troubleshooting

### "DWS script not found"
Verifique se o caminho em `DWS_SCRIPT_PATH` está correto ou se o SmartWork CLI está instalado.

### "Message history feature not available"
Sua conta não tem permissão para consultar histórico de mensagens. Contate o administrador.

### Comandos que falham silenciosamente
Certifique-se de que:
1. O D-Chat desktop está aberto
2. O workspace-server está rodando (é iniciado automaticamente com o D-Chat)
3. Você está autenticado no D-Chat

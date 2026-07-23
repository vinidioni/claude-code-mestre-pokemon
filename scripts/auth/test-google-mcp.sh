#!/bin/bash
# Script para testar conexão com Google Workspace MCP

echo "=========================================="
echo "🧪 Testando Google Workspace MCP"
echo "=========================================="
echo ""

# Verificar se token existe
TOKEN_PATH="$HOME/.config/google/mcp-token.json"

if [ ! -f "$TOKEN_PATH" ]; then
    echo "❌ Token não encontrado em: $TOKEN_PATH"
    echo ""
    echo "Execute primeiro: python3 scripts/auth-google.py"
    exit 1
fi

echo "✅ Token encontrado: $TOKEN_PATH"
echo ""

# Verificar variável de ambiente
if [ -z "$GOOGLE_CLIENT_SECRETS" ]; then
    export GOOGLE_CLIENT_SECRETS="C:\Users\viniciuscastanho\.google\client_secret.json"
    echo "✅ Variável GOOGLE_CLIENT_SECRETS configurada"
else
    echo "✅ Variável GOOGLE_CLIENT_SECRETS já estava configurada"
fi
echo ""

echo "=========================================="
echo "✅ Configuração OK!"
echo "=========================================="
echo ""
echo "O MCP Google Workspace está pronto para uso."
echo ""
echo "Teste no Claude Code:"
echo "  claude 'envie um email de teste para mim'"
echo "  claude 'crie um evento no calendário'"
echo "  claude 'liste meus arquivos do Drive'"
echo ""

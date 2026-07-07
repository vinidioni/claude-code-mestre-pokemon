#!/bin/bash
# Script para configurar autenticação Google Workspace MCP

set -e

CLIENT_SECRETS_PATH="C:\Users\viniciuscastanho\.google\client_secret.json"
MCP_SERVER="mcp-server-google-workspace"

echo "=========================================="
echo "🔐 Configuração Google Workspace MCP"
echo "=========================================="
echo ""

# Verificar se client_secret existe
if [ ! -f "$CLIENT_SECRETS_PATH" ]; then
    echo "❌ Erro: client_secret.json não encontrado em:"
    echo "   $CLIENT_SECRETS_PATH"
    echo ""
    echo "Por favor, baixe o arquivo do Google Cloud Console e salve neste local."
    exit 1
fi

echo "✅ Client secrets encontrado"
echo ""

# Exportar variável de ambiente
export GOOGLE_CLIENT_SECRETS="$CLIENT_SECRETS_PATH"

echo "🚀 Iniciando servidor MCP..."
echo ""
echo "Instruções:"
echo "1. Uma janela do navegador será aberta"
echo "2. Faça login com sua conta Google"
echo "3. Autorize as permissões solicitadas"
echo "4. Volte aqui quando terminar"
echo ""
echo "Pressione ENTER para continuar..."
read

# Iniciar servidor
echo "Iniciando mcp-server-google-workspace..."
$MCP_SERVER

echo ""
echo "=========================================="
echo "✅ Autenticação concluída!"
echo "=========================================="
echo ""
echo "O token foi salvo. Você pode agora usar:"
echo "  claude \"envie um email\""
echo "  claude \"crie um evento na agenda\""
echo "  claude \"salve no Drive\""
echo ""

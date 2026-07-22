#!/bin/bash
# Script de instalação do MCP Cooper
# Uso: ./install.sh [caminho-do-projeto-dcc]

set -e

DCC_PATH="${1:-$(pwd)}"
COOPER_PATH="$DCC_PATH/mcp-servers/cooper"

echo "🚀 Instalando MCP Cooper..."
echo "=============================="

# Verifica se está no diretório correto
if [ ! -f "$COOPER_PATH/package.json" ]; then
    echo "❌ ERRO: Diretório do MCP Cooper não encontrado"
    echo "   Esperado: $COOPER_PATH"
    exit 1
fi

# Instala dependências
echo "📦 Instalando dependências..."
cd "$COOPER_PATH"
npm install

# Copia skills para .claude/skills/
echo "📝 Copiando skills..."
SKILLS_SOURCE="$COOPER_PATH/skills"
SKILLS_DEST="$DCC_PATH/.claude/skills"

if [ -d "$SKILLS_SOURCE" ]; then
    for skill in cooper cooper-read cooper-search cooper-write; do
        if [ -d "$SKILLS_SOURCE/$skill" ]; then
            cp -r "$SKILLS_SOURCE/$skill" "$SKILLS_DEST/"
            echo "   ✅ $skill"
        fi
    done
fi

# Atualiza skill-rules.json
echo "⚙️  Atualizando skill-rules.json..."
RULES_FILE="$DCC_PATH/.claude/skills/skill-rules.json"
if [ -f "$RULES_FILE" ]; then
    # Faz backup
    cp "$RULES_FILE" "$RULES_FILE.backup.$(date +%Y%m%d)"
    echo "   💾 Backup criado"
fi

echo ""
echo "=============================="
echo "✅ Instalação concluída!"
echo ""
echo "Próximos passos:"
echo "1. Edite: mcp-servers/cooper/scripts/config.js"
echo "2. Adicione seu token do MCPHub"
echo "3. Adicione ao .mcp.json:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "cooper": {
      "command": "node",
      "args": ["mcp-servers/cooper/src/index.js"]
    }
  }
}
EOF
echo ""
echo "🔗 MCPHub: https://mcphub.intra.xiaojukeji.com/square"

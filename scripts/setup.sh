#!/bin/bash
#
# Script de setup do ambiente DCC para macOS/Linux
#
# Uso: bash scripts/setup.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Diretório raiz do DCC
DCC_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# =============================================================================
# FUNÇÕES DE UTILIDADE
# =============================================================================

log_info() {
    echo -e "${CYAN}$1${NC}"
}

log_success() {
    echo -e "${GREEN}$1${NC}"
}

log_error() {
    echo -e "${RED}$1${NC}"
}

log_warning() {
    echo -e "${YELLOW}$1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_node_version() {
    if command_exists node; then
        local version
        version=$(node --version | sed 's/v//')
        local major
        major=$(echo "$version" | cut -d. -f1)
        if [ "$major" -ge 18 ]; then
            return 0
        fi
    fi
    return 1
}

check_python_version() {
    if command_exists python3; then
        local version
        version=$(python3 --version 2>&1 | sed 's/Python //')
        local major minor
        major=$(echo "$version" | cut -d. -f1)
        minor=$(echo "$version" | cut -d. -f2)
        if [ "$major" -eq 3 ] && [ "$minor" -ge 10 ] || [ "$major" -gt 3 ]; then
            return 0
        fi
    fi
    return 1
}

# =============================================================================
# CHECKS INICIAIS
# =============================================================================

log_info ""
log_info "🚀 DCC Setup - macOS/Linux"
log_info "=========================="
log_info ""

log_info "📋 Verificando pré-requisitos..."

# Verificações
all_passed=true

checks=(
    "Node.js 18+:check_node_version"
    "Python 3.10+:check_python_version"
    "Git:command_exists git"
    "npm:command_exists npm"
)

for check in "${checks[@]}"; do
    IFS=':' read -r name cmd <<< "$check"
    if eval "$cmd"; then
        log_success "  ✅ $name"
    else
        log_error "  ❌ $name"
        all_passed=false
    fi
done

if [ "$all_passed" = false ]; then
    log_error ""
    log_error "❌ Pré-requisitos não atendidos. Instale os itens acima e tente novamente."
    log_info "   Veja SETUP.md para instruções detalhadas."
    exit 1
fi

log_success ""
log_success "✅ Todos os pré-requisitos atendidos!"

# =============================================================================
# INSTALAÇÃO DE DEPENDÊNCIAS
# =============================================================================

if [[ "$1" != "--skip-dependencies" ]]; then
    log_info ""
    log_info "📦 Instalando dependências..."

    # MCP D-Chat
    log_info "  📡 Instalando dependências do MCP D-Chat..."
    if (cd "$DCC_ROOT/mcp-servers/dchat" && npm install >/dev/null 2>&1); then
        log_success "  ✅ MCP D-Chat instalado"
    else
        log_error "  ❌ Erro ao instalar MCP D-Chat"
    fi

    # MCP Google Workspace
    log_info "  🔍 Verificando MCP Google Workspace..."
    if command_exists mcp-server-google-workspace; then
        log_success "  ✅ MCP Google Workspace já instalado"
    else
        log_warning ""
        log_warning "  ⚠️  IMPORTANTE: MCP Google Workspace NÃO INSTALADO"
        log_warning ""
        log_warning "  ╔══════════════════════════════════════════════════════════╗"
        log_warning "  ║  ⚠️  IMPORTANTE: Google Workspace é altamente recomendado ║"
        log_warning "  ║                                                          ║"
        log_warning "  ║  Com este MCP você poderá:                               ║"
        log_warning "  ║  • Ler e enviar emails pelo Gmail                        ║"
        log_warning "  ║  • Criar e consultar eventos no Calendar                 ║"
        log_warning "  ║  • Acessar e criar documentos no Drive                   ║"
        log_warning "  ║                                                          ║"
        log_warning "  ║  Para instalar:                                          ║"
        log_warning "  ║  npm install -g @kazuph/mcp-server-google-workspace      ║"
        log_warning "  ║                                                          ║"
        log_warning "  ║  Veja docs/google-workspace-setup.md para configuração   ║"
        log_warning "  ╚══════════════════════════════════════════════════════════╝"
        log_warning ""
    fi
fi

# =============================================================================
# CONFIGURAÇÃO DE ARQUIVOS
# =============================================================================

log_info ""
log_info "⚙️  Configurando arquivos..."

# .env
if [ ! -f "$DCC_ROOT/.env" ]; then
    cp "$DCC_ROOT/.env.example" "$DCC_ROOT/.env"
    log_success "  ✅ .env criado (edite com suas credenciais)"
else
    log_warning "  ⚠️  .env já existe, pulando"
fi

# .mcp.json
if [ ! -f "$DCC_ROOT/.mcp.json" ]; then
    sed "s|\\${DCC_ROOT}|$DCC_ROOT|g" "$DCC_ROOT/.mcp.json.example" > "$DCC_ROOT/.mcp.json"
    log_success "  ✅ .mcp.json criado"
else
    log_warning "  ⚠️  .mcp.json já existe, pulando"
fi

# .claude/settings.local.json
CLAUDE_DIR="$HOME/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    mkdir -p "$CLAUDE_DIR"
fi

cat > "$CLAUDE_DIR/settings.local.json" << EOF
{
  "enabledMcpjsonServers": ["github", "dchat"],
  "permissions": {
    "allow": ["Bash(git *)", "Bash(gh *)", "Bash(python *)", "Bash(node *)"]
  }
}
EOF
log_success "  ✅ ~/.claude/settings.local.json criado"

# =============================================================================
# VERIFICAÇÃO FINAL
# =============================================================================

log_info ""
log_info "🔍 Verificando instalação..."

checks=(
    "$DCC_ROOT:Diretório DCC"
    "$DCC_ROOT/mcp-servers/dchat/index.js:MCP D-Chat"
    "$DCC_ROOT/scripts:Diretório de scripts"
    "$DCC_ROOT/.env:Arquivo .env"
    "$DCC_ROOT/.mcp.json:Arquivo .mcp.json"
)

for check in "${checks[@]}"; do
    IFS=':' read -r path name <<< "$check"
    if [ -e "$path" ]; then
        log_success "  ✅ $name"
    else
        log_error "  ❌ $name"
    fi
done

# =============================================================================
# PRÓXIMOS PASSOS
# =============================================================================

log_success ""
log_success "🎉 Setup concluído!"
log_info ""
log_info "Próximos passos:"
log_info "  1. Edite o arquivo .env com suas credenciais"
log_info "  2. Obtenha um token GitHub: https://github.com/settings/tokens"
log_info "  3. Execute: claude mcp status"
log_info "  4. Leia o SETUP.md para mais detalhes"
log_info ""
log_info "📚 Documentação:"
log_info "  - SETUP.md: Guia completo de configuração"
log_info "  - CLAUDE.md: Documentação principal do projeto"
log_info "  - docs/: Documentação adicional"
log_info ""
log_success "🚀 Pronto para usar! Execute: claude"

#Requires -Version 5.1
<#
.SYNOPSIS
    Script de setup do ambiente DCC para Windows
.DESCRIPTION
    Configura automaticamente o ambiente DCC em uma nova máquina Windows
.EXAMPLE
    .\scripts\setup.ps1
#>

param(
    [switch]$SkipMCP,
    [switch]$SkipDependencies,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$script:DCC_ROOT = $PSScriptRoot | Split-Path -Parent
$script:OS = "windows"

# Cores para output
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
}

function Write-Status {
    param([string]$Message, [string]$Status = "Info")
    Write-Host $Message -ForegroundColor $Colors[$Status]
}

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-NodeVersion {
    try {
        $version = node --version
        $major = [int]($version -replace 'v', '').Split('.')[0]
        return $major -ge 18
    } catch {
        return $false
    }
}

function Test-PythonVersion {
    try {
        $version = python --version 2>&1
        $major = [int]($version -replace 'Python ', '').Split('.')[0]
        $minor = [int]($version -replace 'Python ', '').Split('.')[1]
        return ($major -eq 3 -and $minor -ge 10) -or ($major -gt 3)
    } catch {
        return $false
    }
}

# =============================================================================
# CHECKS INICIAIS
# =============================================================================

Write-Status "`n🚀 DCC Setup - Windows" "Info"
Write-Status "======================`n" "Info"

Write-Status "📋 Verificando pré-requisitos..." "Info"

$checks = @{
    "Node.js 18+" = (Test-NodeVersion)
    "Python 3.10+" = (Test-PythonVersion)
    "Git" = (Test-Command "git")
    "npm" = (Test-Command "npm")
}

$allPassed = $true
foreach ($check in $checks.GetEnumerator()) {
    $status = if ($check.Value) { "✅" } else { "❌" }
    $color = if ($check.Value) { "Success" } else { "Error" }
    Write-Status "  $status $($check.Key)" $color
    if (-not $check.Value) { $allPassed = $false }
}

if (-not $allPassed) {
    Write-Status "`n❌ Pré-requisitos não atendidos. Instale os itens acima e tente novamente." "Error"
    Write-Status "   Veja SETUP.md para instruções detalhadas." "Info"
    exit 1
}

Write-Status "`n✅ Todos os pré-requisitos atendidos!" "Success"

# =============================================================================
# INSTALAÇÃO DE DEPENDÊNCIAS
# =============================================================================

if (-not $SkipDependencies) {
    Write-Status "`n📦 Instalando dependências..." "Info"

    # MCP D-Chat
    Write-Status "  📡 Instalando dependências do MCP D-Chat..." "Info"
    Push-Location "$DCC_ROOT\mcp-servers\dchat"
    try {
        npm install 2>&1 | Out-Null
        Write-Status "  ✅ MCP D-Chat instalado" "Success"
    } catch {
        Write-Status "  ❌ Erro ao instalar MCP D-Chat: $_" "Error"
    } finally {
        Pop-Location
    }

    # MCP Google Workspace
    Write-Status "  🔍 Verificando MCP Google Workspace..." "Info"
    try {
        $null = Get-Command "mcp-server-google-workspace" -ErrorAction Stop
        Write-Status "  ✅ MCP Google Workspace já instalado" "Success"
    } catch {
        Write-Status "  ⚠️  MCP Google Workspace não encontrado" "Warning"
        Write-Status "     Para instalar: npm install -g @kazuph/mcp-server-google-workspace" "Info"
    }
}

# =============================================================================
# CONFIGURAÇÃO DE ARQUIVOS
# =============================================================================

Write-Status "`n⚙️  Configurando arquivos..." "Info"

# .env
if (-not (Test-Path "$DCC_ROOT\.env")) {
    Copy-Item "$DCC_ROOT\.env.example" "$DCC_ROOT\.env"
    Write-Status "  ✅ .env criado (edite com suas credenciais)" "Success"
} else {
    Write-Status "  ⚠️  .env já existe, pulando" "Warning"
}

# .mcp.json
if (-not (Test-Path "$DCC_ROOT\.mcp.json")) {
    $mcpExample = Get-Content "$DCC_ROOT\.mcp.json.example" -Raw
    $mcpConfig = $mcpExample.Replace('${DCC_ROOT}', $DCC_ROOT.Replace('\', '/'))
    $mcpConfig | Set-Content "$DCC_ROOT\.mcp.json" -NoNewline
    Write-Status "  ✅ .mcp.json criado" "Success"
} else {
    Write-Status "  ⚠️  .mcp.json já existe, pulando" "Warning"
}

# .claude/settings.local.json
$claudeDir = "$env:USERPROFILE\.claude"
if (-not (Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
}

$settingsLocal = @{
    enabledMcpjsonServers = @("github", "dchat")
    permissions = @{
        allow = @("Bash(git *)", "Bash(gh *)", "Bash(python *)", "Bash(node *)")
    }
} | ConvertTo-Json -Depth 10

$settingsLocal | Set-Content "$claudeDir\settings.local.json" -NoNewline
Write-Status "  ✅ .claude/settings.local.json criado" "Success"

# =============================================================================
# VERIFICAÇÃO FINAL
# =============================================================================

Write-Status "`n🔍 Verificando instalação..." "Info"

$finalChecks = @(
    @{ Name = "Diretório DCC"; Path = $DCC_ROOT },
    @{ Name = "MCP D-Chat"; Path = "$DCC_ROOT\mcp-servers\dchat\index.js" },
    @{ Name = "Scripts"; Path = "$DCC_ROOT\scripts" },
    @{ Name = ".env"; Path = "$DCC_ROOT\.env" },
    @{ Name = ".mcp.json"; Path = "$DCC_ROOT\.mcp.json" }
)

foreach ($check in $finalChecks) {
    $exists = Test-Path $check.Path
    $status = if ($exists) { "✅" } else { "❌" }
    $color = if ($exists) { "Success" } else { "Error" }
    Write-Status "  $status $($check.Name)" $color
}

# =============================================================================
# PRÓXIMOS PASSOS
# =============================================================================

Write-Status "`n🎉 Setup concluído!" "Success"
Write-Status "`nPróximos passos:" "Info"
Write-Status "  1. Edite o arquivo .env com suas credenciais" "Info"
Write-Status "  2. Obtenha um token GitHub: https://github.com/settings/tokens" "Info"
Write-Status "  3. Execute: claude mcp status" "Info"
Write-Status "  4. Leia o SETUP.md para mais detalhes" "Info"

Write-Status "`n📚 Documentação:" "Info"
Write-Status "  - SETUP.md: Guia completo de configuração" "Info"
Write-Status "  - CLAUDE.md: Documentação principal do projeto" "Info"
Write-Status "  - docs/: Documentação adicional" "Info"

Write-Status "`n🚀 Pronto para usar! Execute: claude" "Success"

#!/usr/bin/env node

/**
 * Script de Instalação do DCC Claude Infrastructure
 *
 * Este script instala a infraestrutura em um repositório existente,
 * configurando todos os componentes necessários.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function mergeCLAUDEMd(targetDir) {
  const sourceCLAUDE = path.join(__dirname, '..', 'CLAUDE.md');
  const targetCLAUDE = path.join(targetDir, 'CLAUDE.md');

  if (fs.existsSync(targetCLAUDE)) {
    log('CLAUDE.md já existe no diretório alvo.', 'yellow');
    log('Adicione manualmente as seções relevantes do template.', 'yellow');
    return;
  }

  fs.copyFileSync(sourceCLAUDE, targetCLAUDE);
  log('CLAUDE.md copiado com sucesso.', 'green');
}

function installInfrastructure(targetDir) {
  log('', 'reset');
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║   DCC Claude Infrastructure - Instalação                 ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');

  // Verificar diretório alvo
  if (!fs.existsSync(targetDir)) {
    log(`Erro: Diretório ${targetDir} não existe.`, 'red');
    process.exit(1);
  }

  log(`Instalando em: ${targetDir}`, 'bright');
  log('', 'reset');

  // Criar estrutura .claude
  const claudeDir = path.join(targetDir, '.claude');
  const sourceClaudeDir = path.join(__dirname, '..', '.claude');

  log('Copiando componentes...', 'yellow');

  // Copiar workflows
  if (fs.existsSync(path.join(sourceClaudeDir, 'workflows'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'workflows'),
      path.join(claudeDir, 'workflows')
    );
    log('  ✓ Workflows instalados', 'green');
  }

  // Copiar skills
  if (fs.existsSync(path.join(sourceClaudeDir, 'skills'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'skills'),
      path.join(claudeDir, 'skills')
    );
    log('  ✓ Skills instalados', 'green');
  }

  // Copiar hooks
  if (fs.existsSync(path.join(sourceClaudeDir, 'hooks'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'hooks'),
      path.join(claudeDir, 'hooks')
    );
    log('  ✓ Hooks instalados', 'green');
  }

  // Copiar agents
  if (fs.existsSync(path.join(sourceClaudeDir, 'agents'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'agents'),
      path.join(claudeDir, 'agents')
    );
    log('  ✓ Agents instalados', 'green');
  }

  // Copiar commands
  if (fs.existsSync(path.join(sourceClaudeDir, 'commands'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'commands'),
      path.join(claudeDir, 'commands')
    );
    fs.copyFileSync(
      path.join(sourceClaudeDir, 'commands.json'),
      path.join(claudeDir, 'commands.json')
    );
    log('  ✓ Commands instalados', 'green');
  }

  // Copiar output-styles
  if (fs.existsSync(path.join(sourceClaudeDir, 'output-styles'))) {
    copyDirectory(
      path.join(sourceClaudeDir, 'output-styles'),
      path.join(claudeDir, 'output-styles')
    );
    log('  ✓ Output styles instalados', 'green');
  }

  // Copiar settings.json
  if (fs.existsSync(path.join(sourceClaudeDir, 'settings.json'))) {
    fs.copyFileSync(
      path.join(sourceClaudeDir, 'settings.json'),
      path.join(claudeDir, 'settings.json')
    );
    log('  ✓ Settings instalados', 'green');
  }

  // Criar estrutura dev/
  const devDir = path.join(targetDir, 'dev');
  if (!fs.existsSync(path.join(devDir, 'active'))) {
    fs.mkdirSync(path.join(devDir, 'active'), { recursive: true });
    fs.mkdirSync(path.join(devDir, 'archive'), { recursive: true });

    // Copiar CLAUDE.md do dev
    const sourceDevCLAUDE = path.join(__dirname, '..', 'dev', 'CLAUDE.md');
    if (fs.existsSync(sourceDevCLAUDE)) {
      fs.copyFileSync(sourceDevCLAUDE, path.join(devDir, 'CLAUDE.md'));
    }
    log('  ✓ Dev docs estrutura criada', 'green');
  }

  // Criar estrutura reports/
  const reportsDir = path.join(targetDir, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    log('  ✓ Reports estrutura criada', 'green');
  }

  // Merge ou copiar CLAUDE.md raiz
  mergeCLAUDEMd(targetDir);

  // Criar .gitignore se não existir
  const gitignorePath = path.join(targetDir, '.gitignore');
  const gitignoreContent = `
# Claude Code
.claude/memory/
.claude/settings.local.json
*.log

# Dev Docs (opcional - descomente se não quiser versionar)
# dev/active/

# Reports (opcional - descomente se não quiser versionar)
# reports/20*/

# Node (se aplicável)
node_modules/
`;

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, gitignoreContent.trim());
    log('  ✓ .gitignore criado', 'green');
  }

  log('', 'reset');
  log('╔══════════════════════════════════════════════════════════╗', 'green');
  log('║   Instalação Concluída!                                  ║', 'green');
  log('╚══════════════════════════════════════════════════════════╝', 'green');
  log('', 'reset');
  log('Próximos passos:', 'bright');
  log('  1. Revise o CLAUDE.md no diretório raiz');
  log('  2. Configure o .mcp.json para integrações (opcional)');
  log('  3. Execute: claude "listar workflows disponíveis"');
  log('', 'reset');
}

// Main
const targetDirectory = process.argv[2] || process.cwd();
installInfrastructure(path.resolve(targetDirectory));

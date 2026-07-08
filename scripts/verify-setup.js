#!/usr/bin/env node
/**
 * Script de verificação do setup DCC
 * Verifica se todas as dependências e configurações estão corretas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DCC_ROOT = path.resolve(__dirname, '..');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`)
};

// =============================================================================
// CHECKS
// =============================================================================

const checks = {
  // Pré-requisitos
  node: () => {
    try {
      const version = execSync('node --version', { encoding: 'utf8' }).trim();
      const major = parseInt(version.replace('v', '').split('.')[0]);
      return { ok: major >= 18, message: `Node.js ${version}` };
    } catch {
      return { ok: false, message: 'Node.js não encontrado' };
    }
  },

  python: () => {
    try {
      const version = execSync('python --version', { encoding: 'utf8' }).trim();
      return { ok: true, message: version };
    } catch {
      try {
        const version = execSync('python3 --version', { encoding: 'utf8' }).trim();
        return { ok: true, message: version };
      } catch {
        return { ok: false, message: 'Python não encontrado' };
      }
    }
  },

  git: () => {
    try {
      const version = execSync('git --version', { encoding: 'utf8' }).trim();
      return { ok: true, message: version };
    } catch {
      return { ok: false, message: 'Git não encontrado' };
    }
  },

  claude: () => {
    try {
      const version = execSync('claude --version', { encoding: 'utf8' }).trim();
      return { ok: true, message: version };
    } catch {
      return { ok: false, message: 'Claude Code não instalado (npm install -g @anthropic-ai/claude-code)' };
    }
  },

  // Arquivos de configuração
  env: () => {
    const envPath = path.join(DCC_ROOT, '.env');
    const envExamplePath = path.join(DCC_ROOT, '.env.example');

    if (!fs.existsSync(envPath)) {
      return { ok: false, message: '.env não encontrado (execute: cp .env.example .env)' };
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasGithubToken = envContent.includes('GITHUB_TOKEN=') &&
                          !envContent.includes('GITHUB_TOKEN=ghp_seu_token_aqui');

    if (!hasGithubToken) {
      return { ok: false, message: '.env existe mas GITHUB_TOKEN não configurado' };
    }

    return { ok: true, message: '.env configurado' };
  },

  mcpConfig: () => {
    const mcpPath = path.join(DCC_ROOT, '.mcp.json');
    if (!fs.existsSync(mcpPath)) {
      return { ok: false, message: '.mcp.json não encontrado (execute o setup)' };
    }

    try {
      const config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      const servers = Object.keys(config.mcpServers || {});
      return { ok: true, message: `Servidores MCP: ${servers.join(', ')}` };
    } catch {
      return { ok: false, message: '.mcp.json inválido' };
    }
  },

  // MCP Servers
  mcpDChat: () => {
    const dchatPath = path.join(DCC_ROOT, 'mcp-servers', 'dchat', 'index.js');
    if (!fs.existsSync(dchatPath)) {
      return { ok: false, message: 'MCP D-Chat não encontrado' };
    }

    const nodeModulesPath = path.join(DCC_ROOT, 'mcp-servers', 'dchat', 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      return { ok: false, message: 'Dependências do MCP D-Chat não instaladas (cd mcp-servers/dchat && npm install)' };
    }

    return { ok: true, message: 'MCP D-Chat pronto' };
  },

  mcpGoogle: () => {
    try {
      execSync('mcp-server-google-workspace --version', { stdio: 'ignore' });
      return { ok: true, message: 'MCP Google Workspace instalado' };
    } catch {
      return { ok: false, message: 'MCP Google Workspace não instalado (npm install -g @kazuph/mcp-server-google-workspace)' };
    }
  },

  // Estrutura
  skills: () => {
    const skillsPath = path.join(DCC_ROOT, '.claude', 'skills');
    if (!fs.existsSync(skillsPath)) {
      return { ok: false, message: 'Diretório de skills não encontrado' };
    }

    const skills = fs.readdirSync(skillsPath).filter(f =>
      fs.statSync(path.join(skillsPath, f)).isDirectory()
    );

    return { ok: true, message: `${skills.length} skills disponíveis` };
  },

  workflows: () => {
    const workflowsPath = path.join(DCC_ROOT, '.claude', 'workflows');
    if (!fs.existsSync(workflowsPath)) {
      return { ok: false, message: 'Diretório de workflows não encontrado' };
    }

    return { ok: true, message: 'Workflows disponíveis' };
  }
};

// =============================================================================
// EXECUÇÃO
// =============================================================================

console.log('');
log.info('🔍 DCC Setup Verification');
log.info('=========================\n');

const results = [];

for (const [name, checkFn] of Object.entries(checks)) {
  process.stdout.write(`  ${name.padEnd(20)} ... `);

  try {
    const result = checkFn();
    results.push({ name, ...result });

    if (result.ok) {
      log.success(`✅ ${result.message}`);
    } else {
      log.error(`❌ ${result.message}`);
    }
  } catch (error) {
    results.push({ name, ok: false, message: error.message });
    log.error(`❌ Erro: ${error.message}`);
  }
}

// =============================================================================
// RESUMO
// =============================================================================

console.log('');
const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok).length;

log.info('=========================');
log.success(`✅ ${passed}/${results.length} checks passaram`);

if (failed > 0) {
  log.error(`❌ ${failed} problema(s) encontrado(s)`);
  console.log('');
  log.info('Para corrigir:');
  log.info('  1. Execute: bash scripts/setup.sh (ou .\scripts\setup.ps1 no Windows)');
  log.info('  2. Ou leia SETUP.md para instruções detalhadas');
  process.exit(1);
} else {
  console.log('');
  log.success('🎉 Setup completo e funcionando!');
  log.info('   Execute: claude');
}

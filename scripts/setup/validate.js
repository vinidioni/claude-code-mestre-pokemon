#!/usr/bin/env node

/**
 * Script de Validação da Infraestrutura DCC
 *
 * Verifica se todos os componentes estão configurados corretamente.
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

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  const icon = exists ? '✓' : '✗';
  const color = exists ? 'green' : 'red';
  log(`  ${icon} ${description}`, color);
  return exists;
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  const icon = exists ? '✓' : '✗';
  const color = exists ? 'green' : 'red';
  log(`  ${icon} ${description}`, color);
  return exists;
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

function validate() {
  const rootDir = process.cwd();

  log('', 'reset');
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║   DCC Claude Infrastructure - Validação                  ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');

  let passed = 0;
  let failed = 0;

  // Verificar estrutura raiz
  log('Estrutura Raiz:', 'bright');
  if (checkFile(path.join(rootDir, 'CLAUDE.md'), 'CLAUDE.md')) passed++; else failed++;
  if (checkFile(path.join(rootDir, 'README.md'), 'README.md')) passed++; else failed++;
  log('', 'reset');

  // Verificar .claude/
  log('Diretório .claude/:', 'bright');
  const claudeDir = path.join(rootDir, '.claude');

  if (checkDirectory(claudeDir, 'Diretório .claude/')) {
    passed++;

    // Workflows
    const workflowsDir = path.join(claudeDir, 'workflows');
    if (checkDirectory(workflowsDir, '  workflows/')) {
      passed++;
      if (checkFile(path.join(workflowsDir, 'CLAUDE.md'), '    CLAUDE.md')) passed++; else failed++;
      if (checkFile(path.join(workflowsDir, 'agents', '_template.yaml'), '    _template.yaml')) passed++; else failed++;
    } else {
      failed++;
    }

    // Skills
    const skillsDir = path.join(claudeDir, 'skills');
    if (checkDirectory(skillsDir, '  skills/')) {
      passed++;
      if (checkFile(path.join(skillsDir, 'CLAUDE.md'), '    CLAUDE.md')) passed++; else failed++;
      if (checkFile(path.join(skillsDir, 'skill-rules.json'), '    skill-rules.json')) passed++; else failed++;

      // Validar JSON
      const rulesPath = path.join(skillsDir, 'skill-rules.json');
      if (fs.existsSync(rulesPath) && validateJSON(rulesPath)) {
        log('    ✓ skill-rules.json válido', 'green');
        passed++;
      } else if (fs.existsSync(rulesPath)) {
        log('    ✗ skill-rules.json inválido', 'red');
        failed++;
      }
    } else {
      failed++;
    }

    // Hooks
    const hooksDir = path.join(claudeDir, 'hooks');
    if (checkDirectory(hooksDir, '  hooks/')) {
      passed++;
      if (checkFile(path.join(hooksDir, 'pre-tool-use.js'), '    pre-tool-use.js')) passed++; else failed++;
      if (checkFile(path.join(hooksDir, 'security-check.js'), '    security-check.js')) passed++; else failed++;
    } else {
      failed++;
    }

    // Agents
    const agentsDir = path.join(claudeDir, 'agents');
    if (checkDirectory(agentsDir, '  agents/')) {
      passed++;
      if (checkFile(path.join(agentsDir, 'README.md'), '    README.md')) passed++; else failed++;
      if (checkFile(path.join(agentsDir, 'planner', 'agent.md'), '    planner/agent.md')) passed++; else failed++;
    } else {
      failed++;
    }

    // Commands
    if (checkFile(path.join(claudeDir, 'commands.json'), '  commands.json')) {
      passed++;
      if (validateJSON(path.join(claudeDir, 'commands.json'))) {
        log('    ✓ commands.json válido', 'green');
        passed++;
      } else {
        log('    ✗ commands.json inválido', 'red');
        failed++;
      }
    } else {
      failed++;
    }

    // Output styles
    if (checkDirectory(path.join(claudeDir, 'output-styles'), '  output-styles/')) passed++; else failed++;

  } else {
    failed++;
  }

  log('', 'reset');

  // Verificar dev/
  log('Diretório dev/:', 'bright');
  const devDir = path.join(rootDir, 'dev');
  if (checkDirectory(devDir, 'Diretório dev/')) {
    passed++;
    if (checkFile(path.join(devDir, 'CLAUDE.md'), '  CLAUDE.md')) passed++; else failed++;
    if (checkDirectory(path.join(devDir, 'active'), '  active/')) passed++; else failed++;
    if (checkDirectory(path.join(devDir, 'archive'), '  archive/')) passed++; else failed++;
  } else {
    failed++;
  }

  log('', 'reset');

  // Verificar reports/
  log('Diretório reports/:', 'bright');
  if (checkDirectory(path.join(rootDir, 'reports'), 'Diretório reports/')) passed++; else failed++;

  log('', 'reset');

  // Resumo
  const total = passed + failed;
  const percentage = Math.round((passed / total) * 100);

  if (failed === 0) {
    log('╔══════════════════════════════════════════════════════════╗', 'green');
    log(`║   ✓ Validação Completa! (${passed}/${total} - ${percentage}%)          ║`, 'green');
    log('╚══════════════════════════════════════════════════════════╝', 'green');
  } else {
    log('╔══════════════════════════════════════════════════════════╗', 'yellow');
    log(`║   ⚠ Validação com Avisos (${passed}/${total} - ${percentage}%)        ║`, 'yellow');
    log('╚══════════════════════════════════════════════════════════╝', 'yellow');
    log('', 'reset');
    log('Alguns componentes opcionais podem estar faltando.', 'yellow');
    log('A infraestrutura ainda funciona sem eles.', 'yellow');
  }

  log('', 'reset');
  process.exit(failed > 0 ? 1 : 0);
}

validate();

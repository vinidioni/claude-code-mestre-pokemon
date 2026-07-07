/**
 * PreToolUse Hook
 *
 * Intercepta chamadas de ferramentas antes da execução para:
 * - Verificar e anunciar skills relevantes
 * - Sugerir contexto adicional
 * - Validar parâmetros
 *
 * Este hook resolve o problema de skills não ativarem automaticamente
 * ao verificar o contexto e sugerir skills aplicáveis.
 */

const fs = require('fs');
const path = require('path');

// Configuração
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const SKILL_RULES_FILE = path.join(SKILLS_DIR, 'skill-rules.json');

/**
 * Carrega as regras de skills
 */
function loadSkillRules() {
  try {
    const content = fs.readFileSync(SKILL_RULES_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao carregar skill-rules.json:', error.message);
    return { skills: [], globalRules: {} };
  }
}

/**
 * Analisa o contexto atual e sugere skills relevantes
 */
function suggestRelevantSkills(toolName, toolInput, skillRules) {
  const suggestions = [];
  const contextText = JSON.stringify(toolInput).toLowerCase();

  for (const skill of skillRules.skills || []) {
    // Verifica se algum trigger da skill está presente no contexto
    const hasTrigger = skill.triggers?.some(trigger =>
      contextText.includes(trigger.toLowerCase())
    );

    if (hasTrigger) {
      suggestions.push({
        name: skill.name,
        description: skill.description,
        priority: skill.priority || 'medium'
      });
    }
  }

  // Ordena por prioridade
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  suggestions.sort((a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return suggestions.slice(0, skillRules.globalRules?.maxActiveSkills || 3);
}

/**
 * Gera mensagem de anúncio de skills
 */
function generateSkillAnnouncement(skills) {
  if (skills.length === 0) return null;

  const skillList = skills.map(s => `  - ${s.name}: ${s.description}`).join('\n');

  return `
[PreToolUse Hook] Skills relevantes detectadas:
${skillList}

Para carregar uma skill, mencione: @.claude/skills/${skills[0].name}/SKILL.md
`;
}

/**
 * Valida parâmetros de ferramentas críticas
 */
function validateToolParams(toolName, toolInput) {
  const warnings = [];

  // Validações específicas por ferramenta
  switch (toolName) {
    case 'Bash':
      const command = toolInput.command || '';
      // Detecta comandos potencialmente perigosos
      const dangerousPatterns = [
        { pattern: /rm\s+-rf\s+\//, msg: 'Comando de deleção perigoso detectado' },
        { pattern: />\s*\/dev\/(null|zero)/, msg: 'Redirecionamento para dispositivos de sistema' },
        { pattern: /curl.*\|.*sh/, msg: 'Pipe de curl para shell (security risk)' }
      ];

      for (const { pattern, msg } of dangerousPatterns) {
        if (pattern.test(command)) {
          warnings.push(`⚠️  ${msg}: ${command}`);
        }
      }
      break;

    case 'Write':
    case 'Edit':
      // Verifica se está sobrescrevendo arquivos importantes
      const filePath = toolInput.file_path || '';
      const protectedFiles = ['.env', 'id_rsa', '.ssh/config', '.aws/credentials'];

      if (protectedFiles.some(f => filePath.includes(f))) {
        warnings.push(`⚠️  Modificando arquivo potencialmente sensível: ${filePath}`);
      }
      break;
  }

  return warnings;
}

/**
 * Função principal do hook
 */
function preToolUse(toolName, toolInput) {
  const output = [];

  // 1. Carrega regras de skills
  const skillRules = loadSkillRules();

  // 2. Sugere skills relevantes
  const relevantSkills = suggestRelevantSkills(toolName, toolInput, skillRules);
  const skillAnnouncement = generateSkillAnnouncement(relevantSkills);
  if (skillAnnouncement) {
    output.push(skillAnnouncement);
  }

  // 3. Valida parâmetros
  const warnings = validateToolParams(toolName, toolInput);
  if (warnings.length > 0) {
    output.push('[PreToolUse Hook] Avisos de segurança:');
    output.push(...warnings);
  }

  // Retorna resultado
  return {
    continue: true, // Permite a execução da ferramenta
    message: output.length > 0 ? output.join('\n') : null
  };
}

// Exporta para o sistema de hooks do Claude Code
module.exports = { preToolUse };

// Se executado diretamente (para testes)
if (require.main === module) {
  // Teste básico
  console.log('Testando PreToolUse Hook...');

  const testCases = [
    {
      tool: 'Read',
      input: { file_path: '.claude/skills/exemplo-doc/SKILL.md' }
    },
    {
      tool: 'Bash',
      input: { command: 'ls -la' }
    }
  ];

  for (const test of testCases) {
    console.log(`\nTest: ${test.tool}`);
    const result = preToolUse(test.tool, test.input);
    console.log('Result:', result);
  }
}

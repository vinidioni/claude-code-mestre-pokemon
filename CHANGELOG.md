# Changelog - DCCrazy

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Interactive onboarding system for first installation
- Skill `dccrazy-onboarding` to guide new users
- Installation script `dccrazy-install.py` with automatic detection
- Flag `.dcc-first-run` to identify new installations
- Updated memory templates

### Changed
- Initial ZIP structure optimized (empty folders for user content)
- Update system preserves user modifications
- Credentials are now required during onboarding

---

## [1.0.0] - 2026-07-31

### Added
- Complete DCCrazy structure
- YAML workflow system
- Skill system with automatic activation
- MCP integrations: GitHub, Cooper, D-Chat, Gattaran, Google Workspace
- Dev Docs for session continuity
- SQL Library with automatic encyclopedia
- Maintenance and backup scripts
- Automatic update system (dccrazy-updater)

### Infrastructure
- Layered CLAUDE.md documentation
- Modular skills system
- PreToolUse hooks
- Security checks
- Slash commands

---

## How to Use This Changelog

### For Users
- See [Unreleased] to know what's coming
- See numbered versions for complete history

### For Contributors
- Add changes in the [Unreleased] section
- Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
- Update date when releasing

---

**Maintainer:** Claude Code (assisted by Vinicius Castanho)
**Updated on:** 2026-07-31

### Added (Superpowers Integration)
- Skill `superpowers` - Metodologia de desenvolvimento com subagentes
- Skill `specification` - Criar especificações em chunks digeríveis  
- Suporte a TDD, YAGNI, DRY
- Documentação completa da metodologia Superpowers
- Atualização do skill-rules.json com novos triggers

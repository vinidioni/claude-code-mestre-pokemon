#!/usr/bin/env python3
"""
DCCrazy Update Checker

Verifica atualizações no repositório DCCrazy (kit de ferramentas para DCC)
e atualiza a instalação local preservando configurações personalizadas.

Autor: Vinicius Castanho (viniciuscastanho@didiglobal.com)
"""

# DCC = Repositório base (estrutura, convenções)
# DCCrazy = Kit de ferramentas (workflows, skills, scripts)

import os
import sys
import json
import shutil
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Optional


class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'


def log(message: str, color: str = Colors.END):
    """Printa mensagem colorida"""
    print(f"{color}{message}{Colors.END}")


def run_command(cmd: List[str], cwd: Optional[Path] = None, capture: bool = True) -> tuple:
    """Executa comando shell e retorna (sucesso, stdout, stderr)"""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=capture,
            text=True,
            check=False
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)


def get_dcc_root() -> Path:
    """Retorna diretório raiz do DCC"""
    return Path(__file__).parent.parent


def check_git_remote() -> bool:
    """Verifica se há remote configurado"""
    success, stdout, _ = run_command(['git', 'remote', '-v'])
    return success and stdout.strip()


def fetch_updates() -> bool:
    """Busca atualizações do remote"""
    log("🔍 Buscando atualizações...", Colors.BLUE)
    success, _, stderr = run_command(['git', 'fetch', 'origin'])
    if not success:
        log(f"❌ Erro ao buscar atualizações: {stderr}", Colors.FAIL)
        return False
    return True


def get_local_commit() -> str:
    """Retorna hash do commit local atual"""
    success, stdout, _ = run_command(['git', 'rev-parse', 'HEAD'])
    return stdout.strip() if success else ""


def get_remote_commit() -> str:
    """Retorna hash do commit remoto"""
    success, stdout, _ = run_command(['git', 'rev-parse', 'origin/main'])
    if not success:
        # Tenta origin/master se main não existir
        success, stdout, _ = run_command(['git', 'rev-parse', 'origin/master'])
    return stdout.strip() if success else ""


def get_commits_behind() -> List[str]:
    """Retorna lista de commits que estão no remote mas não no local"""
    success, stdout, _ = run_command(['git', 'log', 'HEAD..origin/main', '--oneline'])
    if not success or not stdout.strip():
        success, stdout, _ = run_command(['git', 'log', 'HEAD..origin/master', '--oneline'])

    if success and stdout.strip():
        return [line.strip() for line in stdout.strip().split('\n') if line.strip()]
    return []


def get_changed_files() -> List[str]:
    """Retorna lista de arquivos que serão alterados na atualização"""
    success, stdout, _ = run_command(['git', 'diff', '--name-only', 'HEAD..origin/main'])
    if not success or not stdout.strip():
        success, stdout, _ = run_command(['git', 'diff', '--name-only', 'HEAD..origin/master'])

    if success and stdout.strip():
        return [line.strip() for line in stdout.strip().split('\n') if line.strip()]
    return []


def backup_configs(backup_dir: Path) -> List[Path]:
    """Faz backup dos arquivos de configuração locais"""
    dcc_root = get_dcc_root()
    configs_to_backup = [
        dcc_root / '.env',
        dcc_root / '.mcp.json',
        dcc_root / '.claude' / 'settings.local.json',
    ]

    backed_up = []
    backup_dir.mkdir(parents=True, exist_ok=True)

    for config_file in configs_to_backup:
        if config_file.exists():
            backup_path = backup_dir / config_file.name
            shutil.copy2(config_file, backup_path)
            backed_up.append(config_file)
            log(f"  ✅ Backup: {config_file.name}", Colors.GREEN)
        else:
            log(f"  ⚠️  Não encontrado: {config_file.name}", Colors.WARNING)

    return backed_up


def restore_configs(backup_dir: Path) -> None:
    """Restaura arquivos de configuração do backup"""
    dcc_root = get_dcc_root()

    for backup_file in backup_dir.iterdir():
        if backup_file.is_file():
            if backup_file.name == 'settings.local.json':
                target = dcc_root / '.claude' / 'settings.local.json'
            else:
                target = dcc_root / backup_file.name

            shutil.copy2(backup_file, target)
            log(f"  ✅ Restaurado: {backup_file.name}", Colors.GREEN)


def check_dependencies_changed() -> bool:
    """Verifica se package.json ou requirements.txt mudaram"""
    changed_files = get_changed_files()
    dep_files = ['package.json', 'package-lock.json', 'requirements.txt', 'Pipfile', 'Pipfile.lock']
    return any(f in changed_files for f in dep_files)


def install_dependencies() -> bool:
    """Instala dependências atualizadas"""
    dcc_root = get_dcc_root()
    success = True

    # Node dependencies
    if (dcc_root / 'package.json').exists():
        log("📦 Instalando dependências Node.js...", Colors.BLUE)
        ok, _, stderr = run_command(['npm', 'install'], cwd=dcc_root)
        if not ok:
            log(f"⚠️  Erro npm install: {stderr}", Colors.WARNING)
            success = False
        else:
            log("  ✅ Node.js OK", Colors.GREEN)

    # MCP servers dependencies
    mcp_servers = dcc_root / 'mcp-servers'
    if mcp_servers.exists():
        for server_dir in mcp_servers.iterdir():
            if server_dir.is_dir() and (server_dir / 'package.json').exists():
                log(f"📦 Atualizando {server_dir.name}...", Colors.BLUE)
                ok, _, _ = run_command(['npm', 'install'], cwd=server_dir)
                if ok:
                    log(f"  ✅ {server_dir.name} OK", Colors.GREEN)

    return success


def update_repository() -> bool:
    """Executa git pull"""
    log("⬇️  Atualizando repositório...", Colors.BLUE)
    success, _, stderr = run_command(['git', 'pull'])
    if not success:
        log(f"❌ Erro no git pull: {stderr}", Colors.FAIL)
        return False
    log("  ✅ Repositório atualizado", Colors.GREEN)
    return True


def ask_yes_no(question: str) -> bool:
    """Pergunta sim/não ao usuário"""
    while True:
        response = input(f"{Colors.CYAN}{question} (s/n): {Colors.END}").strip().lower()
        if response in ['s', 'sim', 'y', 'yes']:
            return True
        if response in ['n', 'nao', 'não', 'no']:
            return False
        log("Responda 's' para sim ou 'n' para não.", Colors.WARNING)


def show_changelog(commits: List[str]) -> None:
    """Mostra o que mudou"""
    if not commits:
        return

    log("\n📝 Commits novos:", Colors.HEADER)
    for commit in commits[:10]:  # Mostra até 10
        log(f"   • {commit}", Colors.END)

    if len(commits) > 10:
        log(f"   ... e mais {len(commits) - 10} commits", Colors.END)


def show_changed_files(files: List[str]) -> None:
    """Mostra arquivos que serão alterados"""
    if not files:
        return

    log("\n📁 Arquivos que serão alterados:", Colors.HEADER)

    important_files = [f for f in files if not f.startswith('.') or f in ['.env.example', '.mcp.json.example']]
    hidden_files = [f for f in files if f.startswith('.') and f not in ['.env.example', '.mcp.json.example']]

    for f in important_files[:15]:
        log(f"   • {f}", Colors.END)

    if hidden_files:
        log(f"   • ... e {len(hidden_files)} arquivos de configuração", Colors.END)

    if len(important_files) > 15:
        log(f"   ... e mais {len(important_files) - 15} arquivos", Colors.END)


def main():
    """Função principal"""
    log("\n" + "="*60, Colors.HEADER)
    log("🔄 DCCrazy Update Checker", Colors.HEADER)
    log("   Atualiza o kit de ferramentas (workflows, skills, scripts)", Colors.CYAN)
    log("="*60 + "\n", Colors.HEADER)

    dcc_root = get_dcc_root()
    os.chdir(dcc_root)

    # Verifica se é um repositório git
    if not (dcc_root / '.git').exists():
        log("❌ Este diretório não é um repositório git.", Colors.FAIL)
        log("   O DCCrazy precisa ter sido clonado do GitHub para verificar atualizações.", Colors.WARNING)
        sys.exit(1)

    # Verifica remote
    if not check_git_remote():
        log("❌ Nenhum remote configurado.", Colors.FAIL)
        log("   Configure o remote com: git remote add origin <url>", Colors.WARNING)
        sys.exit(1)

    # Busca atualizações
    if not fetch_updates():
        sys.exit(1)

    # Verifica se há atualizações
    local = get_local_commit()
    remote = get_remote_commit()

    if not remote:
        log("❌ Não foi possível determinar o estado do repositório remoto.", Colors.FAIL)
        sys.exit(1)

    if local == remote:
        log("✅ Seu DCCrazy está atualizado!", Colors.GREEN)
        log(f"   Versão: {local[:8]}", Colors.END)
        sys.exit(0)

    # Há atualizações disponíveis
    commits_behind = get_commits_behind()
    changed_files = get_changed_files()

    log(f"📦 Atualização disponível no DCCrazy!", Colors.WARNING)
    log(f"   Sua versão: {local[:8]}", Colors.END)
    log(f"   Versão mais recente: {remote[:8]}", Colors.END)
    log(f"   Commits atrás: {len(commits_behind)}", Colors.END)

    show_changelog(commits_behind)
    show_changed_files(changed_files)

    # Pergunta se quer atualizar
    if not ask_yes_no("\nDeseja atualizar o DCCrazy?"):
        log("⏹️  Atualização cancelada.", Colors.WARNING)
        sys.exit(0)

    # Prepara backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = dcc_root / '.backup' / f'update_{timestamp}'

    log(f"\n💾 Criando backup em: {backup_dir}", Colors.BLUE)
    backed_up = backup_configs(backup_dir)

    if not backed_up:
        log("⚠️  Nenhum arquivo de configuração encontrado para backup.", Colors.WARNING)
    else:
        log(f"   {len(backed_up)} arquivo(s) salvos", Colors.GREEN)

    # Atualiza
    if not update_repository():
        log("\n⚠️  Tentando restaurar backup...", Colors.WARNING)
        restore_configs(backup_dir)
        sys.exit(1)

    # Verifica se há dependências novas
    if check_dependencies_changed():
        log("\n📦 Detectadas mudanças em dependências!", Colors.WARNING)
        if ask_yes_no("Deseja instalar as dependências atualizadas?"):
            install_dependencies()

    # Restaura configurações
    if backed_up:
        log("\n🔄 Restaurando configurações locais...", Colors.BLUE)
        restore_configs(backup_dir)

    # Finalização
    log("\n" + "="*60, Colors.GREEN)
    log("✅ DCC atualizado com sucesso!", Colors.GREEN)
    log("="*60 + "\n", Colors.GREEN)

    # Próximos passos
    log("Próximos passos:", Colors.CYAN)
    log("  • Verifique se tudo funciona: node scripts/verify-setup.js", Colors.END)
    log("  • Leia as novidades: git log --oneline -10", Colors.END)
    log(f"  • Backup salvo em: {backup_dir}", Colors.END)

    # Limpa backup antigos (mantém últimos 5)
    backup_parent = dcc_root / '.backup'
    if backup_parent.exists():
        backups = sorted(backup_parent.iterdir(), key=lambda x: x.stat().st_mtime)
        for old_backup in backups[:-5]:
            if old_backup.is_dir():
                shutil.rmtree(old_backup)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("\n\n⏹️  Operação cancelada pelo usuário.", Colors.WARNING)
        sys.exit(0)
    except Exception as e:
        log(f"\n❌ Erro inesperado: {e}", Colors.FAIL)
        sys.exit(1)

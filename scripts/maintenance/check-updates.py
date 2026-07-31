#!/usr/bin/env python3
"""
DCCrazy Update Checker v2.0

Sistema de atualizacao seletiva que:
- Preserva modificacoes do usuario
- Nunca altera estrutura de pastas
- Mostra CHANGELOG antes de aplicar
- Adiciona novos arquivos do oficial
- Avisa sobre remocoes do oficial

Autor: Vinicius Castanho (viniciuscastanho@didiglobal.com)
"""

import os
import sys
import json
import shutil
import hashlib
import subprocess
import platform
import zipfile
import tempfile
import urllib.request
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Set


class Colors:
    """Cores para terminal (cross-platform)"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

    @classmethod
    def disable(cls):
        """Desabilita cores (para Windows sem suporte)"""
        cls.HEADER = ''
        cls.BLUE = ''
        cls.CYAN = ''
        cls.GREEN = ''
        cls.WARNING = ''
        cls.FAIL = ''
        cls.BOLD = ''
        cls.END = ''


# Detecta se eh Windows e ajusta comportamento
IS_WINDOWS = platform.system() == 'Windows'
IS_MAC = platform.system() == 'Darwin'
IS_LINUX = platform.system() == 'Linux'

if IS_WINDOWS:
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except:
        Colors.disable()


def log(message: str, color: str = Colors.END):
    """Printa mensagem colorida"""
    print(f"{color}{message}{Colors.END}")


def ask(question: str, required: bool = True) -> str:
    """Pergunta ao usuario"""
    while True:
        response = input(f"{Colors.CYAN}{question}: {Colors.END}").strip()
        if response:
            return response
        if not required:
            return ""
        log("Esta informacao eh obrigatoria.", Colors.WARNING)


def ask_yes_no(question: str, default: bool = True) -> bool:
    """Pergunta sim/nao"""
    default_str = "S/n" if default else "s/N"
    while True:
        response = input(f"{Colors.CYAN}{question} [{default_str}]: {Colors.END}").strip().lower()
        if not response:
            return default
        if response in ['s', 'sim', 'y', 'yes']:
            return True
        if response in ['n', 'nao', 'no']:
            return False
        log("Responda 's' para sim ou 'n' para nao.", Colors.WARNING)


class DCCrazyUpdater:
    """Sistema de atualizacao do DCCrazy com preservacao de modificacoes"""

    PROTECTED_PATHS = {
        '.env',
        '.claude/memory/',
        'sql-library/queries/',
        'sql-library/repository/',
        'incubator/',
        'reports/draft/',
        'reports/weekly/',
        'reports/monthly/',
        'temp-storage/',
        '.dcc-installed',
        '.dcc-first-run',
        '.git/',
        '.backup/',
        'node_modules/',
    }

    UPDATEABLE_CATEGORIES = [
        '.claude/skills/',
        '.claude/workflows/',
        '.claude/agents/',
        '.claude/commands/',
        '.claude/hooks/',
        '.claude/output-styles/',
        'agents/',
        'scripts/',
        'mcp-servers/',
        'docs/',
        'templates/',
        'sql-library/encyclopedia/',
    ]

    def __init__(self):
        self.dcc_root = Path(__file__).parent.parent.parent.resolve()
        self.temp_dir = None
        self.official_dir = None
        self.current_hashes: Dict[str, str] = {}
        self.official_hashes: Dict[str, str] = {}
        self.user_modifications: Set[str] = set()
        self.new_files: Set[str] = set()
        self.removed_files: Set[str] = set()
        self.updatable_files: Set[str] = set()

    def get_file_hash(self, filepath: Path) -> str:
        """Calcula hash MD5 de um arquivo"""
        if not filepath.exists():
            return ""
        try:
            with open(filepath, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except:
            return ""

    def scan_directory(self, directory: Path, prefix: str = "") -> Dict[str, str]:
        """Escaneia diretorio e retorna dict de {caminho_relativo: hash}"""
        hashes = {}
        if not directory.exists():
            return hashes

        for item in directory.rglob('*'):
            if item.is_file():
                rel_path = str(item.relative_to(directory)).replace('\\', '/')
                if prefix:
                    rel_path = f"{prefix}/{rel_path}"

                # Ignora arquivos protegidos
                if any(rel_path.startswith(p) or p in rel_path for p in self.PROTECTED_PATHS):
                    continue

                hashes[rel_path] = self.get_file_hash(item)

        return hashes

    def download_official_release(self) -> bool:
        """Baixa release oficial do GitHub"""
        log("\n📥 Baixando versao oficial do DCCrazy...", Colors.BLUE)

        # Cria diretorio temporario
        self.temp_dir = Path(tempfile.mkdtemp(prefix="dccrazy_update_"))
        self.official_dir = self.temp_dir / "official"
        self.official_dir.mkdir()

        try:
            # URL do ZIP do repositorio (branch main)
            url = "https://github.com/viniciuscastanho/dccrazy/archive/refs/heads/main.zip"
            zip_path = self.temp_dir / "dccrazy.zip"

            log(f"   Baixando de: {url}", Colors.CYAN)

            # Download com timeout
            urllib.request.urlretrieve(url, zip_path)

            # Extrai ZIP
            log("   Extraindo arquivos...", Colors.CYAN)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(self.temp_dir)

            # Move conteudo para official_dir
            extracted = self.temp_dir / "dccrazy-main"
            if extracted.exists():
                for item in extracted.iterdir():
                    shutil.move(str(item), str(self.official_dir / item.name))

            log("✅ Download concluido!", Colors.GREEN)
            return True

        except Exception as e:
            log(f"❌ Erro ao baixar: {e}", Colors.FAIL)
            return False

    def analyze_changes(self) -> None:
        """Analisa diferencas entre versao local e oficial"""
        log("\n🔍 Analisando diferencas...", Colors.BLUE)

        # Escaneia diretorios
        self.current_hashes = self.scan_directory(self.dcc_root)
        self.official_hashes = self.scan_directory(self.official_dir)

        # Classifica arquivos
        all_files = set(self.current_hashes.keys()) | set(self.official_hashes.keys())

        for file_path in all_files:
            current_hash = self.current_hashes.get(file_path, "")
            official_hash = self.official_hashes.get(file_path, "")

            if not current_hash and official_hash:
                # Arquivo novo no oficial
                self.new_files.add(file_path)
            elif current_hash and not official_hash:
                # Arquivo removido do oficial
                if not any(file_path.startswith(p) for p in self.PROTECTED_PATHS):
                    self.removed_files.add(file_path)
            elif current_hash != official_hash:
                # Arquivo modificado - verifica se eh do usuario ou do oficial
                # Se o arquivo local eh diferente do oficial, usuario modificou
                self.user_modifications.add(file_path)
            else:
                # Arquivo igual - pode atualizar (mas nao precisa)
                pass

        # Determina quais arquivos podem ser atualizados
        # (iguais ao oficial, nao modificados pelo usuario)
        for file_path in self.current_hashes:
            if (file_path in self.official_hashes and
                self.current_hashes[file_path] == self.official_hashes[file_path]):
                if file_path not in self.user_modifications:
                    self.updatable_files.add(file_path)

    def get_changelog(self) -> str:
        """Le CHANGELOG.md do oficial"""
        changelog_path = self.official_dir / "CHANGELOG.md"
        if changelog_path.exists():
            try:
                return changelog_path.read_text(encoding='utf-8')
            except:
                pass
        return "CHANGELOG nao disponivel"

    def show_report(self) -> None:
        """Mostra relatorio de atualizacao"""
        log("\n" + "="*60, Colors.HEADER)
        log("📊 RELATORIO DE ATUALIZACAO", Colors.HEADER)
        log("="*60, Colors.HEADER)

        # Novos arquivos
        if self.new_files:
            log(f"\n✨ NOVOS arquivos (serao adicionados): {len(self.new_files)}", Colors.GREEN)
            for f in sorted(self.new_files)[:10]:
                log(f"   + {f}", Colors.END)
            if len(self.new_files) > 10:
                log(f"   ... e mais {len(self.new_files) - 10}", Colors.END)

        # Arquivos preservados (usuario modificou)
        if self.user_modifications:
            log(f"\n⚠️  ARQUIVOS MODIFICADOS POR VOCE (NAO serao atualizados): {len(self.user_modifications)}", Colors.WARNING)
            for f in sorted(self.user_modifications)[:10]:
                log(f"   • {f}", Colors.END)
            if len(self.user_modifications) > 10:
                log(f"   ... e mais {len(self.user_modifications) - 10}", Colors.END)
            log("   Dica: Para atualizar estes arquivos, faca backup das suas", Colors.CYAN)
            log("   modificacoes e aplique manualmente.", Colors.CYAN)

        # Arquivos removidos do oficial
        if self.removed_files:
            log(f"\n🗑️  REMOVIDOS do oficial (mantidos localmente): {len(self.removed_files)}", Colors.WARNING)
            for f in sorted(self.removed_files)[:5]:
                log(f"   • {f}", Colors.END)

        # Total que sera atualizado
        total_changes = len(self.new_files) + len(self.updatable_files)
        log(f"\n📦 Total de alteracoes a aplicar: {total_changes}", Colors.BOLD)

    def create_backup(self) -> Path:
        """Cria backup antes da atualizacao"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = self.dcc_root / '.backup' / f'update_{timestamp}'
        backup_dir.mkdir(parents=True, exist_ok=True)

        log(f"\n💾 Criando backup em: {backup_dir}", Colors.BLUE)

        # Copia configs importantes
        configs = ['.env', '.mcp.json', '.claude/settings.local.json']
        for config in configs:
            src = self.dcc_root / config
            if src.exists():
                dst = backup_dir / config
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                log(f"   ✅ {config}", Colors.GREEN)

        return backup_dir

    def apply_update(self, backup_dir: Path) -> bool:
        """Aplica atualizacao seletiva"""
        log("\n⬇️  Aplicando atualizacao...", Colors.BLUE)

        success_count = 0
        error_count = 0

        # 1. Adiciona novos arquivos
        for file_path in sorted(self.new_files):
            src = self.official_dir / file_path
            dst = self.dcc_root / file_path

            try:
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                log(f"   ✅ Novo: {file_path}", Colors.GREEN)
                success_count += 1
            except Exception as e:
                log(f"   ❌ Erro em {file_path}: {e}", Colors.FAIL)
                error_count += 1

        # 2. Atualiza arquivos nao modificados pelo usuario
        for file_path in sorted(self.updatable_files):
            src = self.official_dir / file_path
            dst = self.dcc_root / file_path

            try:
                # Backup do arquivo atual
                backup_file = backup_dir / file_path
                backup_file.parent.mkdir(parents=True, exist_ok=True)
                if dst.exists():
                    shutil.copy2(dst, backup_file)

                # Copia novo arquivo
                shutil.copy2(src, dst)
                log(f"   ✅ Atualizado: {file_path}", Colors.GREEN)
                success_count += 1
            except Exception as e:
                log(f"   ❌ Erro em {file_path}: {e}", Colors.FAIL)
                error_count += 1

        log(f"\n📊 Resumo: {success_count} sucesso(s), {error_count} erro(s)",
            Colors.GREEN if error_count == 0 else Colors.WARNING)

        return error_count == 0

    def cleanup(self):
        """Limpa arquivos temporarios"""
        if self.temp_dir and self.temp_dir.exists():
            try:
                shutil.rmtree(self.temp_dir)
            except:
                pass

    def run(self):
        """Executa fluxo completo de atualizacao"""
        log("\n" + "="*60, Colors.HEADER)
        log("🔄 DCCrazy Update Checker v2.0", Colors.HEADER)
        log("   Atualizacao seletiva com preservacao", Colors.CYAN)
        log("="*60 + "\n", Colors.HEADER)

        try:
            # 1. Baixa versao oficial
            if not self.download_official_release():
                log("\n❌ Nao foi possivel baixar a versao oficial.", Colors.FAIL)
                log("   Verifique sua conexao com a internet.", Colors.WARNING)
                return False

            # 2. Analisa mudancas
            self.analyze_changes()

            # 3. Mostra CHANGELOG
            changelog = self.get_changelog()
            log("\n📝 CHANGELOG:", Colors.HEADER)
            # Mostra apenas as primeiras 50 linhas do changelog
            changelog_lines = changelog.split('\n')[:50]
            for line in changelog_lines:
                if line.strip():
                    log(f"   {line}", Colors.END)
            if len(changelog.split('\n')) > 50:
                log("   ... (ver CHANGELOG.md completo apos atualizacao)", Colors.CYAN)

            # 4. Mostra relatorio
            self.show_report()

            # 5. Pergunta confirmacao
            if not ask_yes_no("\nDeseja prosseguir com a atualizacao?"):
                log("\n⏹️  Atualizacao cancelada.", Colors.WARNING)
                return False

            # 6. Cria backup
            backup_dir = self.create_backup()

            # 7. Aplica atualizacao
            if self.apply_update(backup_dir):
                log("\n" + "="*60, Colors.GREEN)
                log("✅ DCCrazy atualizado com sucesso!", Colors.GREEN)
                log("="*60 + "\n", Colors.GREEN)

                log("📋 Resumo final:", Colors.CYAN)
                log(f"   • Novos arquivos: {len(self.new_files)}", Colors.END)
                log(f"   • Arquivos atualizados: {len(self.updatable_files)}", Colors.END)
                log(f"   • Arquivos preservados (seus): {len(self.user_modifications)}", Colors.END)
                log(f"   • Backup salvo em: {backup_dir}", Colors.END)

                log("\n💡 Proximos passos:", Colors.CYAN)
                log("   1. Teste as novas funcionalidades", Colors.END)
                log("   2. Leia o CHANGELOG completo: docs/CHANGELOG.md", Colors.END)
                if self.user_modifications:
                    log("   3. Revise seus arquivos modificados para aplicar", Colors.END)
                    log("      atualizacoes manualmente se desejar", Colors.END)

                return True
            else:
                log("\n⚠️  Atualizacao concluida com erros.", Colors.WARNING)
                log(f"   Backup disponivel em: {backup_dir}", Colors.CYAN)
                return False

        except KeyboardInterrupt:
            log("\n\n⏹️  Operacao cancelada pelo usuario.", Colors.WARNING)
            return False
        except Exception as e:
            log(f"\n❌ Erro inesperado: {e}", Colors.FAIL)
            import traceback
            traceback.print_exc()
            return False
        finally:
            self.cleanup()


def main():
    """Funcao principal"""
    updater = DCCrazyUpdater()
    success = updater.run()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

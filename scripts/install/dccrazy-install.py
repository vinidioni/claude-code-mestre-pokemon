#!/usr/bin/env python3
"""
DCCrazy Interactive Installer

Instalação guiada e interativa do DCCrazy.
Detecta, instala pré-requisitos, configura e personaliza tudo automaticamente.

Autor: Vinicius Castanho (viniciuscastanho@didiglobal.com)
"""

import os
import sys
import subprocess
import shutil
import json
import platform
import getpass
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple, List


class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'


class Installer:
    def __init__(self):
        self.current_location = Path(__file__).parent.parent
        self.desktop = Path.home() / "Desktop"
        self.dcc_root = self.desktop / "dcc"
        self.user_name = ""
        self.os_type = ""
        self.install_log = []
        self.errors = []

    def detect_os(self) -> str:
        """Detecta o sistema operacional"""
        system = platform.system()
        if system == "Windows":
            return "windows"
        elif system == "Darwin":
            return "mac"
        else:
            return "linux"

    def ask_os(self):
        """Pergunta ou confirma o sistema operacional"""
        detected = self.detect_os()

        print(f"\n{Colors.CYAN}Detectei que voce esta usando: {detected.upper()}{Colors.END}")

        if detected == "windows":
            options = ["Windows", "Estou usando Mac", "Estou usando Linux"]
        elif detected == "mac":
            options = ["Mac (macOS)", "Estou usando Windows", "Estou usando Linux"]
        else:
            options = ["Linux", "Estou usando Windows", "Estou usando Mac"]

        print(f"{Colors.CYAN}Confirme seu sistema operacional:{Colors.END}")
        for i, opt in enumerate(options, 1):
            print(f"  {i}. {opt}")

        choice = input(f"{Colors.CYAN}Opcao [1]: {Colors.END}").strip() or "1"

        if choice == "1":
            self.os_type = detected
        elif choice == "2":
            self.os_type = "mac" if detected == "windows" else ("windows" if detected == "linux" else "linux")
        elif choice == "3":
            self.os_type = "linux" if detected in ["windows", "mac"] else ("mac" if detected == "windows" else "windows")
        else:
            self.os_type = detected

        self.log(f"Sistema operacional confirmado: {self.os_type.upper()}", Colors.GREEN)
        return self.os_type

    def log(self, message: str, color: str = Colors.END, level: str = "INFO"):
        """Loga mensagem na tela e no arquivo de log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{color}[{timestamp}] {message}{Colors.END}")
        self.install_log.append(f"[{timestamp}] [{level}] {message}")

    def header(self, title: str):
        """Mostra cabeçalho de seção"""
        print(f"\n{Colors.HEADER}{'='*60}{Colors.END}")
        print(f"{Colors.HEADER}{Colors.BOLD}  {title}{Colors.END}")
        print(f"{Colors.HEADER}{'='*60}{Colors.END}\n")

    def ask(self, question: str, default: str = "", required: bool = False) -> str:
        """Pergunta ao usuário"""
        if default:
            prompt = f"{Colors.CYAN}{question} [{default}]: {Colors.END}"
        else:
            prompt = f"{Colors.CYAN}{question}: {Colors.END}"

        while True:
            response = input(prompt).strip()
            if response:
                return response
            if default:
                return default
            if not required:
                return ""
            self.log("Esta informação é obrigatória.", Colors.WARNING)

    def ask_yes_no(self, question: str, default: bool = True) -> bool:
        """Pergunta sim/não"""
        default_str = "S/n" if default else "s/N"
        while True:
            response = input(f"{Colors.CYAN}{question} [{default_str}]: {Colors.END}").strip().lower()
            if not response:
                return default
            if response in ['s', 'sim', 'yes', 'y']:
                return True
            if response in ['n', 'nao', 'não', 'no']:
                return False
            self.log("Por favor, responda 's' para sim ou 'n' para não.", Colors.WARNING)

    def run_command(self, cmd: List[str], cwd: Optional[Path] = None,
                    capture: bool = True, description: str = "") -> Tuple[bool, str, str]:
        """Executa comando com descrição e tratamento de erro"""
        if description:
            self.log(f"⏳ {description}...", Colors.BLUE)

        try:
            result = subprocess.run(
                cmd, cwd=cwd, capture_output=capture,
                text=True, check=False, timeout=300
            )

            if result.returncode == 0:
                if description:
                    self.log(f"✅ {description} - OK", Colors.GREEN)
                return True, result.stdout, result.stderr
            else:
                error_msg = result.stderr[:200] if result.stderr else "Erro desconhecido"
                if description:
                    self.log(f"❌ {description} - FALHOU: {error_msg}", Colors.FAIL)
                return False, result.stdout, result.stderr

        except subprocess.TimeoutExpired:
            self.log(f"⏱️  {description} - Timeout (demorou muito)", Colors.FAIL)
            return False, "", "Timeout"
        except Exception as e:
            self.log(f"💥 {description} - ERRO: {str(e)}", Colors.FAIL)
            return False, "", str(e)

    def check_prerequisite(self, name: str, check_cmd: List[str],
                          min_version: str = "") -> Tuple[bool, str]:
        """Verifica se pré-requisito está instalado"""
        success, stdout, stderr = self.run_command(check_cmd, capture=True)
        if not success:
            return False, ""

        version = stdout.strip() if stdout else stderr.strip()
        return True, version

    def install_prerequisite(self, name: str, install_instructions: str) -> bool:
        """Tenta instalar pré-requisito ou dá instruções"""
        self.log(f"\n⚠️  {name} não encontrado ou desatualizado.", Colors.WARNING)

        if self.ask_yes_no(f"Posso tentar instalar {name} automaticamente?", default=True):
            self.log(f"🔄 Tentando instalar {name}...", Colors.BLUE)

            if name == "Node.js":
                if self.os_type == "windows":
                    self.log("Baixe em: https://nodejs.org (versão LTS)", Colors.CYAN)
                    self.log("Execute o instalador .msi e siga as instruções.", Colors.CYAN)
                    self.log("IMPORTANTE: Marque a opção 'Add to PATH'", Colors.WARNING)
                elif self.os_type == "mac":
                    success, _, _ = self.run_command(["brew", "install", "node"])
                    if success:
                        return True
                    self.log("Homebrew não encontrado. Instale em https://brew.sh", Colors.WARNING)
                else:  # linux
                    success, _, _ = self.run_command([
                        "curl", "-fsSL", "https://deb.nodesource.com/setup_20.x", "|", "sudo", "-E", "bash", "-"
                    ])
                    if success:
                        success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "nodejs"])
                        if success:
                            return True

            elif name == "Python":
                if self.os_type == "windows":
                    self.log("Baixe em: https://python.org/downloads", Colors.CYAN)
                    self.log("Baixe o instalador Windows x86-64 executable", Colors.CYAN)
                    self.log("IMPORTANTE: Marque 'Add Python to PATH' na instalação", Colors.WARNING)
                elif self.os_type == "mac":
                    success, _, _ = self.run_command(["brew", "install", "python@3.11"])
                    if success:
                        return True
                    self.log("Ou baixe em: https://python.org/downloads (macOS)", Colors.CYAN)
                else:  # linux
                    success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "python3", "python3-pip"])
                    if success:
                        return True

            elif name == "Git":
                if self.os_type == "windows":
                    self.log("Baixe em: https://git-scm.com/download/win", Colors.CYAN)
                    self.log("Execute o instalador .exe", Colors.CYAN)
                elif self.os_type == "mac":
                    success, _, _ = self.run_command(["brew", "install", "git"])
                    if success:
                        return True
                    self.log("Ou baixe em: https://git-scm.com/download/mac", Colors.CYAN)
                else:  # linux
                    success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "git"])
                    if success:
                        return True

            self.log("⚠️  Instalação automática falhou ou não disponível.", Colors.WARNING)

        # Mostra instruções manuais específicas por OS
        self.log(f"\n📋 Para instalar {name} manualmente no {self.os_type.upper()}:", Colors.CYAN)

        if name == "Node.js":
            if self.os_type == "windows":
                print("  1. Acesse: https://nodejs.org")
                print("  2. Baixe a versão LTS (botão verde)")
                print("  3. Execute o instalador .msi")
                print("  4. Siga o wizard (aceite os defaults)")
                print("  5. REINICIE o terminal/VS Code após instalar")
            elif self.os_type == "mac":
                print("  1. Se tiver Homebrew: brew install node")
                print("  2. Ou acesse: https://nodejs.org e baixe o .pkg")
                print("  3. Siga o instalador")
            else:  # linux
                print("  sudo apt update")
                print("  sudo apt install -y nodejs npm")

        elif name == "Python":
            if self.os_type == "windows":
                print("  1. Acesse: https://python.org/downloads")
                print("  2. Baixe 'Windows installer (64-bit)'")
                print("  3. Execute e MARQUE 'Add Python to PATH'")
                print("  4. REINICIE o terminal/VS Code")
            elif self.os_type == "mac":
                print("  1. Se tiver Homebrew: brew install python")
                print("  2. Ou baixe em https://python.org/downloads")
            else:  # linux
                print("  sudo apt update")
                print("  sudo apt install -y python3 python3-pip")

        elif name == "Git":
            if self.os_type == "windows":
                print("  1. Acesse: https://git-scm.com/download/win")
                print("  2. Baixe o instalador automaticamente")
                print("  3. Execute e siga o wizard (aceite os defaults)")
            elif self.os_type == "mac":
                print("  1. Se tiver Homebrew: brew install git")
                print("  2. Ou baixe em https://git-scm.com/download/mac")
            else:  # linux
                print("  sudo apt update")
                print("  sudo apt install -y git")

        if self.ask_yes_no("Instalou? Podemos continuar?"):
            # Verifica novamente
            return False  # Retorna False para verificar novamente no loop
        else:
            self.log(f"❌ {name} é necessário. Instalação abortada.", Colors.FAIL)
            sys.exit(1)

        return False

    def check_location(self) -> bool:
        """Verifica se está na pasta correta (Desktop/dcc)"""
        current = Path(__file__).parent.parent.resolve()
        expected = (Path.home() / "Desktop" / "dcc").resolve()

        if current != expected:
            self.log(f"📍 Local atual: {current}", Colors.CYAN)
            self.log(f"📍 Local esperado: {expected}", Colors.CYAN)
            return False
        return True

    def step_welcome(self):
        """Passo 1: Boas-vindas"""
        self.header("🚀 Bem-vindo ao DCCrazy!")

        # Detecta/Confirma sistema operacional
        self.ask_os()

        # Verifica localização
        if not self.check_location():
            print(f"{Colors.WARNING}⚠️  Atenção!{Colors.END}")
            print(f"{Colors.CYAN}Detectei que o DCCrazy não está na pasta correta.{Colors.END}\n")
            print(f"Para funcionar corretamente, preciso estar em:")
            print(f"  📁 Área de Trabalho > dcc\n")

            print(f"{Colors.WARNING}O que fazer:{Colors.END}")
            print(f"  1. Feche o Claude Code")
            print(f"  2. Mova a pasta 'dcc' para sua Área de Trabalho")
            print(f"  3. Abra o Claude Code novamente na pasta correta")
            print(f"  4. Execute: python scripts/dccrazy-install.py\n")

            print(f"{Colors.CYAN}Ou posso mover automaticamente para você.{Colors.END}")
            if self.ask_yes_no("Deseja que eu mova a pasta para a Área de Trabalho?"):
                self.move_to_desktop()
            else:
                self.log("Instalação pausada. Mova a pasta e execute novamente.", Colors.WARNING)
                sys.exit(0)

        self.explain_vscode_workspace()

        print(f"\n{Colors.CYAN}Olá! Vou instalar o DCCrazy para você.{Colors.END}")
        print(f"{Colors.CYAN}Este processo é interativo e vou guiar você em cada etapa.{Colors.END}\n")

        print(f"{Colors.WARNING}O que vou fazer:{Colors.END}")
        print("  1. Verificar pré-requisitos (Node.js, Python, Git)")
        print("  2. Instalar dependências")
        print("  3. Configurar credenciais OBRIGATÓRIAS (com sua ajuda)")
        print("  4. Testar a instalação")
        print("  5. Personalizar para você\n")

        print(f"{Colors.FAIL}⚠️  IMPORTANTE:{Colors.END}")
        print(f"{Colors.FAIL}   Serão necessárias 5 credenciais obrigatórias.{Colors.END}")
        print(f"{Colors.FAIL}   Sem elas, a instalação não pode continuar.{Colors.END}\n")

        if not self.ask_yes_no("Possui todas as credenciais ou sabe como obtê-las?", default=True):
            print(f"\n{Colors.CYAN}As 5 credenciais necessárias são:{Colors.END}")
            print("  1. GitHub Token (github.com/settings/tokens)")
            print("  2. Cooper Token (mcphub.intra.xiaojukeji.com)")
            print("  3. D-Chat Token (mcphub.intra.xiaojukeji.com)")
            print("  4. Gattaran Token (mcphub.intra.xiaojukeji.com)")
            print("  5. Google Client Secret (console.cloud.google.com)")
            print()
            print(f"{Colors.WARNING}Volte quando tiver acesso a todas.{Colors.END}")
            sys.exit(0)

    def move_to_desktop(self):
        """Move a pasta atual para Desktop/dcc"""
        current = Path(__file__).parent.parent.resolve()
        destination = Path.home() / "Desktop" / "dcc"

        self.log(f"🔄 Movendo de {current} para {destination}...", Colors.BLUE)

        try:
            # Se já existe pasta no destino, renomeia
            if destination.exists():
                backup_name = f"dcc-backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                destination.rename(destination.parent / backup_name)
                self.log(f"📦 Pasta existente renomeada para: {backup_name}", Colors.WARNING)

            # Move a pasta
            shutil.move(str(current), str(destination))
            self.log(f"✅ Pasta movida com sucesso!", Colors.GREEN)
            self.log(f"📁 Nova localização: {destination}", Colors.CYAN)

            print(f"\n{Colors.WARNING}⚠️  IMPORTANTE:{Colors.END}")
            print(f"{Colors.CYAN}Feche o Claude Code e abra novamente na pasta:{Colors.END}")
            print(f"  {destination}\n")
            print(f"Depois execute: python scripts/dccrazy-install.py")

            sys.exit(0)

        except Exception as e:
            self.log(f"❌ Erro ao mover pasta: {e}", Colors.FAIL)
            self.log("Mova manualmente e tente novamente.", Colors.WARNING)
            sys.exit(1)

    def get_vscode_paths(self) -> dict:
        """Retorna paths especificos por OS"""
        paths = {
            "windows": {
                "desktop_path": fr"C:\Users\{os.getlogin()}\Desktop",
                "dcc_path": fr"C:\Users\{os.getlogin()}\Desktop\dcc",
                "workspace_file": fr"C:\Users\{os.getlogin()}\Desktop\DCCrazy.code-workspace",
                "settings_path": fr"C:\Users\{os.getlogin()}\.claude\settings.local.json",
            },
            "mac": {
                "desktop_path": "~/Desktop",
                "dcc_path": "~/Desktop/dcc",
                "workspace_file": "~/Desktop/DCCrazy.code-workspace",
                "settings_path": "~/.claude/settings.local.json",
            },
            "linux": {
                "desktop_path": "~/Desktop",
                "dcc_path": "~/Desktop/dcc",
                "workspace_file": "~/Desktop/DCCrazy.code-workspace",
                "settings_path": "~/.claude/settings.local.json",
            }
        }
        return paths.get(self.os_type, paths["linux"])

    def explain_vscode_workspace(self):
        """Explica como fixar pasta no VS Code baseado no OS"""
        paths = self.get_vscode_paths()

        print(f"\n{Colors.CYAN}{Colors.BOLD}📌 Como Fixar a Pasta no VS Code:{Colors.END}\n")

        print("Para que o DCCrazy funcione corretamente sempre que voce abrir o VS Code:")
        print()

        if self.os_type == "windows":
            print("1️⃣  Abra o VS Code")
            print("2️⃣  Clique em File → Open Folder")
            print(f"3️⃣  Navegue ate: {paths['dcc_path']}")
            print("4️⃣  Clique em 'Selecionar Pasta'")
            print("5️⃣  Depois: File → Save Workspace As...")
            print(f"6️⃣  Salve como 'DCCrazy' na Desktop")
            print()
            print(f"{Colors.CYAN}Da proxima vez, abra o VS Code pelo arquivo{Colors.END}")
            print(f"{Colors.CYAN}'DCCrazy.code-workspace' na sua Area de Trabalho.{Colors.END}")

        elif self.os_type == "mac":
            print("1️⃣  Abra o VS Code")
            print("2️⃣  Clique em File → Open Folder (Cmd+K Cmd+O)")
            print(f"3️⃣  Navegue ate: ~/Desktop/dcc")
            print("4️⃣  Clique em 'Open'")
            print("5️⃣  Depois: File → Save Workspace As... (Cmd+S)")
            print("6️⃣  Salve como 'DCCrazy' na Desktop")
            print()
            print(f"{Colors.CYAN}Da proxima vez, abra o VS Code pelo arquivo{Colors.END}")
            print(f"{Colors.CYAN}'DCCrazy.code-workspace' na sua Desktop.{Colors.END}")

        else:  # Linux
            print("1️⃣  Abra o VS Code")
            print("2️⃣  Clique em File → Open Folder (Ctrl+K Ctrl+O)")
            print("3️⃣  Navegue ate: ~/Desktop/dcc")
            print("4️⃣  Clique em 'Open'")
            print("5️⃣  Depois: File → Save Workspace As... (Ctrl+S)")
            print("6️⃣  Salve como 'DCCrazy' na Desktop")
            print()
            print(f"{Colors.CYAN}Da proxima vez, abra o VS Code pelo arquivo{Colors.END}")
            print(f"{Colors.CYAN}'DCCrazy.code-workspace' na sua Desktop.{Colors.END}")

        print()
        print(f"{Colors.CYAN}Assim, todas as operacoes do DCC serao{Colors.END}")
        print(f"{Colors.CYAN}associadas a esta pasta automaticamente.{Colors.END}")
        print()

        if not self.ask_yes_no("Entendeu como fixar a pasta?", default=True):
            print(f"\n{Colors.CYAN}Vou explicar novamente de outra forma...{Colors.END}")
            print()
            print("A ideia e criar um 'atalho' que sempre abre o VS Code")
            print("ja na pasta correta do DCCrazy.")
            print()

            if self.os_type == "windows":
                print("Maneira alternativa (Windows):")
                print(f"  • Navegue ate: {paths['dcc_path']}")
                print("  • Clique com botao direito → 'Abrir com Code'")
                print("  • Depois: File → Save Workspace As... → Desktop")
            elif self.os_type == "mac":
                print("Maneira alternativa (Mac):")
                print("  • Abra o Terminal")
                print("  • Digite: code ~/Desktop/dcc")
                print("  • Depois no VS Code: File → Save Workspace As...")
            else:
                print("Maneira alternativa (Linux):")
                print("  • Abra o Terminal")
                print("  • Digite: code ~/Desktop/dcc")
                print("  • Depois no VS Code: File → Save Workspace As...")

            print()
            input(f"{Colors.CYAN}Pressione Enter quando entender...{Colors.END}")

    def step_prerequisites(self):
        """Passo 2: Verificar e instalar pré-requisitos"""
        self.header("📋 Verificando Pré-requisitos")

        prereqs = [
            ("Node.js", ["node", "--version"], "18.0.0",
             "  • Windows: https://nodejs.org (baixe o instalador LTS)\n  • macOS: brew install node\n  • Linux: sudo apt install nodejs"),
            ("Python", ["python", "--version"], "3.10.0",
             "  • Windows: https://python.org (marque 'Add to PATH')\n  • macOS: brew install python\n  • Linux: sudo apt install python3"),
            ("Git", ["git", "--version"], "2.40.0",
             "  • Windows: https://git-scm.com/download/win\n  • macOS: brew install git\n  • Linux: sudo apt install git"),
            ("Claude Code", ["claude", "--version"], "",
             "  • npm install -g @anthropic-ai/claude-code")
        ]

        all_ok = True
        for name, cmd, min_version, instructions in prereqs:
            self.log(f"\n🔍 Verificando {name}...")

            success, version = self.check_prerequisite(name, cmd)

            if success:
                self.log(f"✅ {name} encontrado: {version}", Colors.GREEN)
            else:
                self.log(f"❌ {name} não encontrado", Colors.FAIL)
                success = self.install_prerequisite(name, instructions)
                if not success:
                    all_ok = False
                    # Verifica novamente após tentativa de instalação
                    success, version = self.check_prerequisite(name, cmd)
                    if success:
                        self.log(f"✅ {name} agora disponível: {version}", Colors.GREEN)
                        all_ok = True

        if not all_ok:
            self.log("\n❌ Alguns pré-requisitos não puderam ser instalados.", Colors.FAIL)
            self.log("Instale manualmente e execute este script novamente.", Colors.WARNING)
            sys.exit(1)

        self.log("\n✅ Todos os pré-requisitos atendidos!", Colors.GREEN)

    def step_dependencies(self):
        """Passo 3: Instalar dependências"""
        self.header("📦 Instalando Dependências")

        # Instala dependências principais
        self.run_command(["npm", "install"], cwd=self.dcc_root,
                        description="Instalando dependências Node.js")

        # Instala MCP servers
        mcp_servers = self.dcc_root / "mcp-servers"
        if mcp_servers.exists():
            for server_dir in mcp_servers.iterdir():
                if server_dir.is_dir() and (server_dir / "package.json").exists():
                    self.run_command(["npm", "install"], cwd=server_dir,
                                   description=f"Instalando {server_dir.name}")

        self.log("\n✅ Dependências instaladas!", Colors.GREEN)

    def step_personalization(self):
        """Passo 4: Personalização"""
        self.header("👤 Personalização")

        print(f"{Colors.CYAN}Como devo te chamar?{Colors.END}\n")

        # Pergunta nome apenas
        self.user_name = self.ask("Qual é o seu nome?", default="Colega")

        self.log(f"\n👋 Prazer em conhecê-lo, {self.user_name}!", Colors.GREEN)

        # Salva preferências simples
        prefs = {
            "name": self.user_name,
            "installed_at": datetime.now().isoformat(),
            "version": "1.0"
        }

        prefs_file = self.dcc_root / ".claude" / "user-preferences.json"
        prefs_file.parent.mkdir(parents=True, exist_ok=True)

        with open(prefs_file, 'w', encoding='utf-8') as f:
            json.dump(prefs, f, indent=2)

        self.log("✅ Preferência salva!", Colors.GREEN)

    def step_credentials(self):
        """Passo 5: Configuração de credenciais"""
        self.header("🔐 Configuração de Credenciais")

        print(f"{Colors.CYAN}Agora vou configurar as integrações OBRIGATÓRIAS.{Colors.END}")
        print(f"{Colors.WARNING}Todas as credenciais são armazenadas localmente em arquivos .env (não são enviadas para o GitHub).{Colors.END}")
        print(f"{Colors.FAIL}⚠️  NENHUMA credencial é opcional. Todas são necessárias.{Colors.END}\n")

        env_content = "# Credenciais do DCCrazy - Gerado automaticamente\n"
        env_content += f"# Usuário: {self.user_name}\n"
        env_content += f"# Data: {datetime.now().strftime('%Y-%m-%d')}\n\n"

        tokens_configurados = 0
        tokens_necessarios = 5

        # 1. GitHub
        print(f"{Colors.BOLD}1/5: GitHub{Colors.END}")
        print("   O que é: Acesso ao GitHub (repositórios, issues, PRs)")
        print("   Como obter: https://github.com/settings/tokens")
        print("   Formato: ghp_xxxxxxxxxxxx ou github_pat_xxx")

        while True:
            github_token = self.ask("Token do GitHub (cole aqui)", required=True)
            if github_token.startswith(("ghp_", "github_pat_")):
                env_content += f"GITHUB_TOKEN={github_token}\n"
                self.log("✅ GitHub configurado", Colors.GREEN)
                tokens_configurados += 1
                break
            else:
                self.log("❌ Token inválido! Deve começar com 'ghp_' ou 'github_pat_'")
                if not self.ask_yes_no("Tentar novamente?"):
                    self.log("A instalação não pode continuar sem a credencial do GitHub.", Colors.FAIL)
                    sys.exit(1)

        # 2. Cooper
        print(f"\n{Colors.BOLD}2/5: Cooper (DiDi Docs){Colors.END}")
        print("   O que é: Acesso à documentação interna DiDi")
        print("   Como obter: https://mcphub.intra.xiaojukeji.com/")
        print("   Clique em '访问令牌' no servidor Cooper")

        while True:
            cooper_token = self.ask("Token do Cooper (cole aqui)", required=True)
            if cooper_token and len(cooper_token) > 10:
                env_content += f"COOPER_TOKEN={cooper_token}\n"
                self.log("✅ Cooper configurado", Colors.GREEN)
                tokens_configurados += 1
                break
            else:
                self.log("❌ Token inválido! O token parece muito curto.")
                if not self.ask_yes_no("Tentar novamente?"):
                    self.log("A instalação não pode continuar sem a credencial do Cooper.", Colors.FAIL)
                    sys.exit(1)

        # 3. D-Chat
        print(f"\n{Colors.BOLD}3/5: D-Chat{Colors.END}")
        print("   O que é: Acesso ao sistema de mensagens interno DiDi")
        print("   Como obter: https://mcphub.intra.xiaojukeji.com/")
        print("   Clique em '访问令牌' no servidor D-Chat")

        while True:
            dchat_token = self.ask("Token do D-Chat (cole aqui)", required=True)
            if dchat_token and len(dchat_token) > 10:
                env_content += f"DCHAT_TOKEN={dchat_token}\n"
                self.log("✅ D-Chat configurado", Colors.GREEN)
                tokens_configurados += 1
                break
            else:
                self.log("❌ Token inválido! O token parece muito curto.")
                if not self.ask_yes_no("Tentar novamente?"):
                    self.log("A instalação não pode continuar sem a credencial do D-Chat.", Colors.FAIL)
                    sys.exit(1)

        # 4. Gattaran
        print(f"\n{Colors.BOLD}4/5: Gattaran{Colors.END}")
        print("   O que é: Acesso ao sistema de gerenciamento de pedidos")
        print("   Como obter: https://mcphub.intra.xiaojukeji.com/")
        print("   Clique em '访问令牌' no servidor Gattaran")

        while True:
            gattaran_token = self.ask("Token do Gattaran (cole aqui)", required=True)
            if gattaran_token and len(gattaran_token) > 10:
                env_content += f"GATTARAN_TOKEN={gattaran_token}\n"
                self.log("✅ Gattaran configurado", Colors.GREEN)
                tokens_configurados += 1
                break
            else:
                self.log("❌ Token inválido! O token parece muito curto.")
                if not self.ask_yes_no("Tentar novamente?"):
                    self.log("A instalação não pode continuar sem a credencial do Gattaran.", Colors.FAIL)
                    sys.exit(1)

        # 5. Google Workspace
        print(f"\n{Colors.BOLD}5/5: Google Workspace{Colors.END}")
        print("   O que é: Acesso a Gmail, Calendar e Drive")
        print("   Como obter: console.cloud.google.com")
        print("   Crie um projeto → Ative APIs → Credentials → OAuth client ID")

        while True:
            print(f"{Colors.CYAN}Cole o conteúdo completo do arquivo client_secret.json:{Colors.END}")
            google_secret = self.ask("Client Secret JSON (cole aqui)", required=True)

            # Tenta validar como JSON
            try:
                import json as json_parser
                google_json = json_parser.loads(google_secret)
                if "installed" in google_json or "web" in google_json:
                    env_content += f'GOOGLE_CLIENT_SECRET={google_secret}\n'
                    self.log("✅ Google Workspace configurado", Colors.GREEN)
                    tokens_configurados += 1
                    break
                else:
                    self.log("❌ JSON inválido! Não encontrou 'installed' ou 'web' na estrutura.")
            except json_parser.JSONDecodeError as e:
                self.log(f"❌ JSON inválido: {e}")

            if not self.ask_yes_no("Tentar novamente?"):
                self.log("A instalação não pode continuar sem a credencial do Google.", Colors.FAIL)
                sys.exit(1)

        # Salva .env
        env_file = self.dcc_root / ".env"
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)

        self.log(f"\n✅ Arquivo .env criado em: {env_file}", Colors.GREEN)
        self.log("⚠️  Este arquivo NÃO deve ser commitado (já está no .gitignore)", Colors.WARNING)

    def step_mcp_config(self):
        """Passo 6: Configuração MCP"""
        self.header("🔌 Configuração de Integrações (MCP)")

        print(f"{Colors.CYAN}Vou configurar os servidores MCP automaticamente...{Colors.END}\n")

        mcp_config = {
            "mcpServers": {}
        }

        # Lê o arquivo .env gerado
        env_file = self.dcc_root / ".env"
        env_content = env_file.read_text() if env_file.exists() else ""

        # 1. GitHub MCP (sempre configura se token existe)
        if "GITHUB_TOKEN=" in env_content and "GITHUB_TOKEN=\n" not in env_content:
            try:
                token_line = [line for line in env_content.split('\n') if line.startswith('GITHUB_TOKEN=')][0]
                if token_line.replace('GITHUB_TOKEN=', ''):
                    mcp_config["mcpServers"]["github"] = {
                        "command": "npx",
                        "args": ["-y", "@modelcontextprotocol/server-github"],
                        "env": {
                            "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
                        }
                    }
                    self.log("✅ GitHub MCP configurado", Colors.GREEN)
            except IndexError:
                pass

        # 2. Cooper MCP
        if "COOPER_TOKEN=" in env_content and "COOPER_TOKEN=\n" not in env_content:
            try:
                token_line = [line for line in env_content.split('\n') if line.startswith('COOPER_TOKEN=')][0]
                if token_line.replace('COOPER_TOKEN=', ''):
                    mcp_config["mcpServers"]["cooper"] = {
                        "command": "node",
                        "args": [str(self.dcc_root / "mcp-servers" / "cooper" / "index.js")],
                        "env": {"COOPER_TOKEN": "${COOPER_TOKEN}"}
                    }
                    self.log("✅ Cooper MCP configurado", Colors.GREEN)
            except IndexError:
                pass

        # 3. D-Chat MCP
        if "DCHAT_TOKEN=" in env_content and "DCHAT_TOKEN=\n" not in env_content:
            try:
                token_line = [line for line in env_content.split('\n') if line.startswith('DCHAT_TOKEN=')][0]
                if token_line.replace('DCHAT_TOKEN=', ''):
                    # Path para DWS adequado ao OS
                    if self.os_type == 'windows':
                        import getpass
                        username = getpass.getuser()
                        dws_path = rf"C:\Users\{username}\.local\bin\dws.ps1"
                    else:
                        dws_path = "/usr/local/bin/dws"

                    mcp_config["mcpServers"]["dchat"] = {
                        "command": "node",
                        "args": [str(self.dcc_root / "mcp-servers" / "dchat" / "v2" / "index.js")],
                        "env": {
                            "DIDI_TOKEN": "${DCHAT_TOKEN}",
                            "DWS_SCRIPT_PATH": dws_path
                        }
                    }
                    self.log("✅ D-Chat MCP configurado", Colors.GREEN)
            except IndexError:
                pass

        # 4. Gattaran MCP
        if "GATTARAN_TOKEN=" in env_content and "GATTARAN_TOKEN=\n" not in env_content:
            try:
                token_line = [line for line in env_content.split('\n') if line.startswith('GATTARAN_TOKEN=')][0]
                if token_line.replace('GATTARAN_TOKEN=', ''):
                    mcp_config["mcpServers"]["gattaran"] = {
                        "command": "node",
                        "args": [str(self.dcc_root / "mcp-servers" / "gattaran" / "index.js")],
                        "env": {"GATTARAN_TOKEN": "${GATTARAN_TOKEN}"}
                    }
                    self.log("✅ Gattaran MCP configurado", Colors.GREEN)
            except IndexError:
                pass

        # 5. Google Workspace MCP
        if "GOOGLE_CLIENT_SECRET=" in env_content and "GOOGLE_CLIENT_SECRET=\n" not in env_content:
            try:
                token_line = [line for line in env_content.split('\n') if line.startswith('GOOGLE_CLIENT_SECRET=')][0]
                if token_line.replace('GOOGLE_CLIENT_SECRET=', ''):
                    mcp_config["mcpServers"]["google-workspace"] = {
                        "command": "npx",
                        "args": ["-y", "@gongrzhe"]
                    }
                    self.log("✅ Google Workspace MCP configurado", Colors.GREEN)
            except IndexError:
                pass

        # Salva .mcp.json
        mcp_file = self.dcc_root / ".mcp.json"
        with open(mcp_file, 'w', encoding='utf-8') as f:
            json.dump(mcp_config, f, indent=2)

        self.log(f"\n✅ Arquivo .mcp.json criado em: {mcp_file}", Colors.GREEN)

        # Cria flag de instalação completa
        flag_file = self.dcc_root / ".dcc-installed"
        with open(flag_file, 'w', encoding='utf-8') as f:
            f.write(f"DCCrazy installed at: {datetime.now().isoformat()}\n")
            f.write(f"User: {self.user_name}\n")
            f.write(f"OS: {self.os_type}\n")
            f.write(f"MCPs: {', '.join(mcp_config['mcpServers'].keys())}\n")

        self.log(f"✅ Instalação registrada em: {flag_file}", Colors.GREEN)

        # Remove flag de primeira execução (se existir)
        first_run_file = self.dcc_root / ".dccrazy-first-run"
        if first_run_file.exists():
            first_run_file.unlink()
            self.log("✅ Onboarding concluído - flag de primeira execução removida", Colors.GREEN)

    def step_verification(self):
        """Passo 7: Verificação"""
        self.header("🧪 Verificando Instalação")

        self.log("Executando verificação completa...\n", Colors.BLUE)

        success, stdout, stderr = self.run_command(
            ["node", "scripts/verify-setup.js"],
            cwd=self.dcc_root,
            capture=True
        )

        if success:
            self.log("\n✅ Verificação concluída com sucesso!", Colors.GREEN)
        else:
            self.log("\n⚠️  Verificação encontrou problemas:", Colors.WARNING)
            print(stdout if stdout else stderr)

            if self.ask_yes_no("Deseja continuar mesmo assim?"):
                self.log("Continuando...", Colors.WARNING)
            else:
                self.log("Instalação pausada. Corrija os problemas e execute novamente.", Colors.FAIL)
                sys.exit(1)

    def step_finalize(self):
        """Passo 8: Finalização"""
        self.header("🎉 Instalação Concluída!")

        print(f"\n{Colors.GREEN}{Colors.BOLD}Parabéns, {self.user_name}!{Colors.END}")
        print(f"{Colors.GREEN}O DCCrazy foi instalado com sucesso!{Colors.END}\n")

        print(f"{Colors.CYAN}Próximos passos:{Colors.END}")
        print("  1. Execute: claude")
        print("  2. Teste: /skill list")
        print("  3. Explore: /workflow")
        print("  4. Leia: README.md para ver todas as funcionalidades\n")

        print(f"{Colors.CYAN}Comandos úteis:{Colors.END}")
        print("  • python scripts/check-updates.py - Verifica atualizações")
        print("  • python scripts/backup-to-drive.py - Backup no Google Drive")
        print("  • node scripts/verify-setup.js - Verifica instalação\n")

        if self.ask_yes_no("Quer fazer um tour rápido agora?"):
            self.tour()

    def tour(self):
        """Tour rápido das funcionalidades"""
        self.header("🚀 Tour Rápido do DCCrazy")

        tour_steps = [
            ("Skills", "Diga 'crie um componente React' e veja a skill ativar automaticamente"),
            ("Workflows", "Execute '/workflow code-review' para revisar código"),
            ("Dev Docs", "Use '/dev-docs init minha-tarefa' para não perder contexto"),
            ("Enciclopédia", "Crie uma query e veja tabelas serem adicionadas automaticamente"),
            ("Integrações", "Teste 'liste meus emails' se configurou Google Workspace")
        ]

        for i, (feature, example) in enumerate(tour_steps, 1):
            print(f"\n{Colors.BOLD}{i}. {feature}{Colors.END}")
            print(f"   {example}")

            if i < len(tour_steps):
                if not self.ask_yes_no("Próximo?", default=True):
                    break

        print(f"\n{Colors.GREEN}✨ Divirta-se usando o DCCrazy!{Colors.END}")

    def save_log(self):
        """Salva log da instalação"""
        log_file = self.dcc_root / ".backup" / f"install-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
        log_file.parent.mkdir(parents=True, exist_ok=True)

        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.install_log))

    def run(self):
        """Executa instalação completa"""
        try:
            self.step_welcome()
            self.step_prerequisites()
            self.step_dependencies()
            self.step_personalization()
            self.step_credentials()
            self.step_mcp_config()
            self.step_verification()
            self.step_finalize()

        except KeyboardInterrupt:
            self.log("\n\n⏹️  Instalação cancelada pelo usuário.", Colors.WARNING)
            self.save_log()
            sys.exit(0)
        except Exception as e:
            self.log(f"\n💥 Erro inesperado: {e}", Colors.FAIL)
            self.save_log()
            sys.exit(1)
        finally:
            self.save_log()


def main():
    """Função principal"""
    installer = Installer()
    installer.run()


if __name__ == "__main__":
    main()

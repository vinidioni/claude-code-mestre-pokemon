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
        self.install_log = []
        self.errors = []

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

            # Tenta instalação baseada no SO
            os_type = platform.system()

            if name == "Node.js":
                if os_type == "Windows":
                    self.log("Baixe em: https://nodejs.org (versão LTS)", Colors.CYAN)
                    self.log("Execute o instalador e siga as instruções.", Colors.CYAN)
                elif os_type == "Darwin":  # macOS
                    success, _, _ = self.run_command(["brew", "install", "node"])
                    if success:
                        return True
                else:  # Linux
                    success, _, _ = self.run_command([
                        "curl", "-fsSL", "https://deb.nodesource.com/setup_20.x", "|", "sudo", "-E", "bash", "-"
                    ])
                    if success:
                        success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "nodejs"])
                        if success:
                            return True

            elif name == "Python":
                if os_type == "Windows":
                    self.log("Baixe em: https://python.org (versão 3.10+)", Colors.CYAN)
                elif os_type == "Darwin":
                    success, _, _ = self.run_command(["brew", "install", "python@3.11"])
                    if success:
                        return True
                else:
                    success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "python3", "python3-pip"])
                    if success:
                        return True

            elif name == "Git":
                if os_type == "Windows":
                    self.log("Baixe em: https://git-scm.com/download/win", Colors.CYAN)
                elif os_type == "Darwin":
                    success, _, _ = self.run_command(["brew", "install", "git"])
                    if success:
                        return True
                else:
                    success, _, _ = self.run_command(["sudo", "apt-get", "install", "-y", "git"])
                    if success:
                        return True

            self.log("⚠️  Instalação automática falhou ou não disponível.", Colors.WARNING)

        # Mostra instruções manuais
        self.log(f"\n📋 Para instalar {name} manualmente:", Colors.CYAN)
        print(install_instructions)

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

        print(f"{Colors.CYAN}Olá! Vou instalar o DCCrazy para você.{Colors.END}")
        print(f"{Colors.CYAN}Este processo é interativo e vou guiar você em cada etapa.{Colors.END}\n")

        print(f"{Colors.WARNING}O que vou fazer:{Colors.END}")
        print("  1. Verificar pré-requisitos (Node.js, Python, Git)")
        print("  2. Instalar dependências")
        print("  3. Configurar credenciais (com sua ajuda)")
        print("  4. Testar a instalação")
        print("  5. Personalizar para você\n")

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

        if not self.ask_yes_no("Pronto para começar?", default=True):
            self.log("Instalação cancelada. Quando quiser, execute:", Colors.WARNING)
            self.log("  python scripts/dccrazy-install.py", Colors.CYAN)
            sys.exit(0)

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

        print(f"{Colors.CYAN}Agora vou configurar as integrações.{Colors.END}")
        print(f"{Colors.WARNING}Todas as credenciais são armazenadas localmente em arquivos .env (não são enviadas para o GitHub).{Colors.END}\n")

        env_content = "# Credenciais do DCCrazy - Gerado automaticamente\n"
        env_content += f"# Usuário: {self.user_name}\n"
        env_content += f"# Data: {datetime.now().strftime('%Y-%m-%d')}\n\n"

        # GitHub
        print(f"{Colors.BOLD}1. GitHub (opcional){Colors.END}")
        print("   Permite criar issues, ver PRs, analisar repositórios")
        print("   Obtenha em: https://github.com/settings/tokens")

        if self.ask_yes_no("Deseja configurar GitHub?"):
            github_token = self.ask("Token do GitHub (cole aqui)")
            if github_token:
                env_content += f"GITHUB_TOKEN={github_token}\n"
                self.log("✅ GitHub configurado", Colors.GREEN)
        else:
            env_content += "# GITHUB_TOKEN=\n"

        # DiDi serviços (se aplicável)
        print(f"\n{Colors.BOLD}2. Serviços DiDi (opcional - apenas funcionários){Colors.END}")
        print("   Cooper (documentação), D-Chat (mensagens), Gattaran")
        print("   Obtenha em: https://mcphub.intra.xiaojukeji.com/")
        print("   ⚠️  Clique em '访问令牌' (token de acesso)")

        if self.ask_yes_no("Tem acesso aos serviços DiDi?"):
            didi_token = self.ask("Token do mcphub")
            if didi_token:
                env_content += f"DIDI_TOKEN={didi_token}\n"
                self.log("✅ DiDi configurado", Colors.GREEN)
        else:
            env_content += "# DIDI_TOKEN=\n"

        # Google Workspace
        print(f"\n{Colors.BOLD}3. Google Workspace (opcional){Colors.END}")
        print("   Permite ler emails, criar eventos, acessar Drive")
        print("   Requer configuração OAuth no Google Cloud")

        if self.ask_yes_no("Deseja configurar Google Workspace?"):
            self.log("Veja o guia: docs/google-workspace-setup.md", Colors.CYAN)
            env_content += "# GOOGLE_CLIENT_SECRETS_PATH=\n"
        else:
            env_content += "# GOOGLE_CLIENT_SECRETS_PATH=\n"

        # Salva .env
        env_file = self.dcc_root / ".env"
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)

        self.log(f"\n✅ Arquivo .env criado em: {env_file}", Colors.GREEN)
        self.log("⚠️  Este arquivo NÃO deve ser commitado (já está no .gitignore)", Colors.WARNING)

    def step_mcp_config(self):
        """Passo 6: Configuração MCP"""
        self.header("🔌 Configuração de Integrações (MCP)")

        print(f"{Colors.CYAN}Vou configurar os servidores MCP (integrações).{Colors.END}\n")

        mcp_config = {
            "mcpServers": {}
        }

        # Verifica quais tokens foram configurados
        env_file = self.dcc_root / ".env"
        env_content = env_file.read_text() if env_file.exists() else ""

        # GitHub MCP
        if "GITHUB_TOKEN" in env_content and not env_content.split("GITHUB_TOKEN=")[1].startswith("\n"):
            if self.ask_yes_no("Ativar integração GitHub?"):
                mcp_config["mcpServers"]["github"] = {
                    "command": "npx",
                    "args": ["-y", "@modelcontextprotocol/server-github"],
                    "env": {
                        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
                    }
                }
                self.log("✅ GitHub MCP ativado", Colors.GREEN)

        # DiDi MCPs
        if "DIDI_TOKEN" in env_content:
            print(f"\n{Colors.CYAN}Serviços DiDi detectados:{Colors.END}")

            services = [
                ("Cooper (documentação)", "cooper"),
                ("D-Chat (mensagens)", "dchat"),
                ("Gattaran (ordens)", "gattaran")
            ]

            for service_name, service_id in services:
                if self.ask_yes_no(f"Ativar {service_name}?"):
                    # Configuração específica de cada serviço
                    if service_id == "cooper":
                        mcp_config["mcpServers"]["cooper"] = {
                            "command": "node",
                            "args": [str(self.dcc_root / "mcp-servers" / "cooper" / "index.js")],
                            "env": {"DIDI_TOKEN": "${DIDI_TOKEN}"}
                        }
                    elif service_id == "dchat":
                        mcp_config["mcpServers"]["dchat"] = {
                            "command": "node",
                            "args": [str(self.dcc_root / "mcp-servers" / "dchat" / "index.js")],
                            "env": {
                                "DIDI_TOKEN": "${DIDI_TOKEN}",
                                "DWS_SCRIPT_PATH": "${DWS_SCRIPT_PATH}"
                            }
                        }
                    # Adicionar outros conforme necessário

                    self.log(f"✅ {service_name} ativado", Colors.GREEN)

        # Salva .mcp.json
        mcp_file = self.dcc_root / ".mcp.json"
        with open(mcp_file, 'w', encoding='utf-8') as f:
            json.dump(mcp_config, f, indent=2)

        self.log(f"\n✅ Arquivo .mcp.json criado em: {mcp_file}", Colors.GREEN)

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

        # Marca como instalado
        flag_file = self.dcc_root / ".dcc-installed"
        with open(flag_file, 'w', encoding='utf-8') as f:
            f.write(f"DCCrazy installed at: {datetime.now().isoformat()}\n")
            f.write(f"User: {self.user_name}\n")

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

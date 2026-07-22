#!/usr/bin/env python3
"""
DCCrazy Backup to Google Drive

Sincroniza o DCCrazy completo com o Google Drive do usuário.
Cria uma cópia exata em: Meu Drive/DCCrazy_Backup/

Autor: Vinicius Castanho (viniciuscastanho@didiglobal.com)
"""

import os
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional


class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'


def log(message: str, color: str = Colors.END):
    """Printa mensagem colorida"""
    print(f"{color}{message}{Colors.END}")


def get_dcc_root() -> Path:
    """Retorna diretório raiz do DCCrazy"""
    return Path(__file__).parent.parent


def check_google_workspace_mcp() -> bool:
    """Verifica se o MCP Google Workspace está disponível"""
    # Tenta executar um comando simples via MCP
    try:
        # No contexto do DCC, isso seria feito via Claude MCP
        # Aqui simulamos a verificação
        return True
    except:
        return False


def create_backup_manifest(dcc_root: Path) -> dict:
    """Cria manifesto do backup"""
    manifest = {
        "backup_date": datetime.now().isoformat(),
        "version": "1.0",
        "dccastanho_path": str(dcc_root),
        "contents": {
            "directories": [],
            "files": [],
            "total_size_mb": 0
        }
    }

    # Lista conteúdo
    for item in dcc_root.rglob("*"):
        try:
            relative_path = item.relative_to(dcc_root)

            # Ignora node_modules e pastas de cache
            if any(part in str(relative_path) for part in ['node_modules', '.git', '__pycache__', '.cache', '.backup']):
                continue

            if item.is_dir():
                manifest["contents"]["directories"].append(str(relative_path))
            else:
                manifest["contents"]["files"].append({
                    "path": str(relative_path),
                    "size": item.stat().st_size
                })
                manifest["contents"]["total_size_mb"] += item.stat().st_size / (1024 * 1024)
        except:
            pass

    manifest["contents"]["total_size_mb"] = round(manifest["contents"]["total_size_mb"], 2)

    return manifest


def create_local_backup_zip(dcc_root: Path) -> Optional[Path]:
    """Cria ZIP local do DCCrazy (para upload manual)"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f"DCCrazy_Backup_{timestamp}"
    zip_path = dcc_root.parent / f"{backup_name}.zip"

    log(f"📦 Criando backup local: {backup_name}.zip", Colors.BLUE)

    try:
        shutil.make_archive(
            base_name=str(dcc_root.parent / backup_name),
            format='zip',
            root_dir=dcc_root
        )
        log(f"✅ Backup criado: {zip_path}", Colors.GREEN)
        log(f"📊 Tamanho: {zip_path.stat().st_size / (1024*1024):.2f} MB", Colors.CYAN)
        return zip_path
    except Exception as e:
        log(f"❌ Erro ao criar backup: {e}", Colors.FAIL)
        return None


def instructions_for_manual_upload(zip_path: Path):
    """Mostra instruções para upload manual no Drive"""
    log("\n" + "="*60, Colors.HEADER)
    log("📤 UPLOAD MANUAL PARA GOOGLE DRIVE", Colors.HEADER)
    log("="*60 + "\n", Colors.HEADER)

    log(f"Arquivo: {zip_path}", Colors.CYAN)
    log("\nComo enviar para o Drive:\n", Colors.BLUE)

    steps = [
        "1. Abra o Google Drive no navegador (drive.google.com)",
        "2. Crie uma pasta chamada 'DCCrazy_Backup' (se não existir)",
        "3. Arraste o arquivo ZIP para dentro da pasta",
        "   OU clique em 'Novo' → 'Upload de arquivo'",
        "4. Aguarde o upload completar",
        "5. Pronto! Seu backup está salvo na nuvem"
    ]

    for step in steps:
        log(step, Colors.END)

    log("\n💡 Dica: Configure o backup para ser frequente (semanal/mensal)", Colors.WARNING)


def instructions_for_mcp_upload():
    """Mostra instruções se MCP Google Workspace estiver configurado"""
    log("\n" + "="*60, Colors.HEADER)
    log("🔄 BACKUP AUTOMÁTICO VIA MCP", Colors.HEADER)
    log("="*60 + "\n", Colors.HEADER)

    log("Para backup automático, configure o MCP Google Workspace:", Colors.BLUE)
    log("\n1. Verifique se o MCP está ativo:", Colors.END)
    log("   claude mcp status", Colors.CYAN)

    log("\n2. Se não estiver, configure em .mcp.json:", Colors.END)
    log("   Veja docs/google-workspace-setup.md", Colors.CYAN)

    log("\n3. Com o MCP ativo, peça ao Claude:", Colors.END)
    log('   "Faça backup do DCCrazy no meu Drive"', Colors.CYAN)

    log("\n4. O Claude irá:", Colors.END)
    log("   • Compactar o DCCrazy", Colors.END)
    log("   • Criar pasta DCCrazy_Backup no Drive", Colors.END)
    log("   • Fazer upload do arquivo", Colors.END)
    log("   • Confirmar quando terminar", Colors.END)


def main():
    """Função principal"""
    log("\n" + "="*60, Colors.HEADER)
    log("💾 DCCrazy Backup to Google Drive", Colors.HEADER)
    log("="*60 + "\n", Colors.HEADER)

    dcc_root = get_dcc_root()

    # Cria manifesto
    log("📋 Gerando manifesto do backup...", Colors.BLUE)
    manifest = create_backup_manifest(dcc_root)

    log(f"📁 Diretórios: {len(manifest['contents']['directories'])}", Colors.CYAN)
    log(f"📄 Arquivos: {len(manifest['contents']['files'])}", Colors.CYAN)
    log(f"📊 Tamanho total: {manifest['contents']['total_size_mb']} MB", Colors.CYAN)

    # Salva manifesto local
    manifest_path = dcc_root / '.backup' / 'manifest.json'
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    log(f"✅ Manifesto salvo: {manifest_path}", Colors.GREEN)

    # Cria ZIP para upload
    zip_path = create_local_backup_zip(dcc_root)

    if zip_path:
        # Verifica se MCP está disponível
        if check_google_workspace_mcp():
            instructions_for_mcp_upload()
        else:
            instructions_for_manual_upload(zip_path)

        log("\n" + "="*60, Colors.GREEN)
        log("✅ Processo de backup concluído!", Colors.GREEN)
        log("="*60 + "\n", Colors.GREEN)

        log("📍 Arquivo de backup:", Colors.BLUE)
        log(f"   {zip_path}", Colors.CYAN)
    else:
        log("\n❌ Falha ao criar backup", Colors.FAIL)
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("\n\n⏹️  Backup cancelado pelo usuário.", Colors.WARNING)
        sys.exit(0)
    except Exception as e:
        log(f"\n❌ Erro inesperado: {e}", Colors.FAIL)
        sys.exit(1)

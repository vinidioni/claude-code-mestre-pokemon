#!/usr/bin/env python3
"""
DCCrazy Table Encyclopedia Updater

Detecta tabelas em queries e atualiza a enciclopédia com seus schemas.
Roda automaticamente quando novas tabelas são consultadas.

Autor: Vinicius Castanho (viniciuscastanho@didiglobal.com)
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import Set, Dict, List, Optional


# Caminho da enciclopédia
ENCYCLOPEDIA_PATH = Path(__file__).parent.parent / "analytics" / "encyclopedia" / "tables.json"


def extract_tables_from_query(query: str) -> Set[str]:
    """Extrai nomes de tabelas de uma query SQL"""
    tables = set()

    # Padrão: FROM tabela
    from_pattern = r'\bFROM\s+(\w+\.\w+\.\w+|\w+\.\w+)'
    tables.update(re.findall(from_pattern, query, re.IGNORECASE))

    # Padrão: JOIN tabela
    join_pattern = r'\bJOIN\s+(\w+\.\w+\.\w+|\w+\.\w+)'
    tables.update(re.findall(join_pattern, query, re.IGNORECASE))

    # Padrão: INTO tabela
    into_pattern = r'\bINTO\s+(\w+\.\w+\.\w+|\w+\.\w+)'
    tables.update(re.findall(into_pattern, query, re.IGNORECASE))

    return {t.lower().strip() for t in tables}


def load_encyclopedia() -> Dict:
    """Carrega a enciclopédia existente"""
    if ENCYCLOPEDIA_PATH.exists():
        try:
            with open(ENCYCLOPEDIA_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass

    # Retorna estrutura vazia se não existir ou estiver corrompido
    return {
        "_metadata": {
            "version": "1.0",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "description": "Enciclopédia auto-gerada de tabelas do banco de dados"
        },
        "tabelas": {}
    }


def save_encyclopedia(data: Dict) -> None:
    """Salva a enciclopédia no arquivo"""
    data["_metadata"]["updated_at"] = datetime.now().isoformat()

    ENCYCLOPEDIA_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(ENCYCLOPEDIA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_table_schema(table_name: str) -> Optional[Dict]:
    """
    Obtém o schema de uma tabela do banco.
    Em produção, isso executaria DESCRIBE ou SHOW COLUMNS.
    Por enquanto, retorna estrutura vazia para preenchimento manual.
    """
    return {
        "descricao": "",
        "colunas": {},
        "primeira_consulta": datetime.now().isoformat(),
        "ultima_consulta": datetime.now().isoformat()
    }


def add_table_to_encyclopedia(table_name: str, encyclopedia: Dict) -> bool:
    """Adiciona uma tabela à enciclopédia se não existir"""
    if table_name in encyclopedia["tabelas"]:
        # Atualiza data de última consulta
        encyclopedia["tabelas"][table_name]["ultima_consulta"] = datetime.now().isoformat()
        return False  # Não é nova

    # Nova tabela - adiciona à enciclopédia
    encyclopedia["tabelas"][table_name] = get_table_schema(table_name)
    return True  # É nova


def process_query(query: str, encyclopedia: Dict) -> List[str]:
    """Processa uma query e retorna tabelas novas encontradas"""
    tables = extract_tables_from_query(query)
    new_tables = []

    for table in tables:
        if add_table_to_encyclopedia(table, encyclopedia):
            new_tables.append(table)

    return new_tables


def scan_queries_directory(directory: Path) -> Set[str]:
    """Escaneia diretório de queries e retorna todas as tabelas encontradas"""
    all_tables = set()

    if not directory.exists():
        return all_tables

    for sql_file in directory.rglob("*.sql"):
        try:
            with open(sql_file, 'r', encoding='utf-8') as f:
                query = f.read()
                tables = extract_tables_from_query(query)
                all_tables.update(tables)
        except Exception as e:
            print(f"Erro ao ler {sql_file}: {e}", file=sys.stderr)

    return all_tables


def format_table_for_user(table_name: str, schema: Dict) -> str:
    """Formata informação da tabela para exibição ao usuário"""
    lines = [
        f"Tabela: {table_name}",
        f"  Primeira consulta: {schema.get('primeira_consulta', 'N/A')}",
        f"  Última consulta: {schema.get('ultima_consulta', 'N/A')}",
    ]

    if schema.get('descricao'):
        lines.append(f"  Descrição: {schema['descricao']}")

    if schema.get('colunas'):
        lines.append(f"  Colunas: {len(schema['colunas'])} definidas")

    return '\n'.join(lines)


def main():
    """Função principal"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Atualiza enciclopédia de tabelas do DCCrazy'
    )
    parser.add_argument(
        '--query',
        type=str,
        help='Query SQL para analisar (opcional)'
    )
    parser.add_argument(
        '--scan-all',
        action='store_true',
        help='Escanear todas as queries existentes'
    )
    parser.add_argument(
        '--list',
        action='store_true',
        help='Listar todas as tabelas na enciclopédia'
    )
    parser.add_argument(
        '--describe',
        type=str,
        help='Adicionar descrição manual para uma tabela'
    )
    parser.add_argument(
        '--table',
        type=str,
        help='Nome da tabela (usado com --describe)'
    )

    args = parser.parse_args()

    # Carrega enciclopédia
    encyclopedia = load_encyclopedia()

    # Lista todas as tabelas
    if args.list:
        print("\n📚 Tabelas na Enciclopédia:\n")
        if not encyclopedia["tabelas"]:
            print("Nenhuma tabela registrada ainda.")
        else:
            for table_name, schema in sorted(encyclopedia["tabelas"].items()):
                print(format_table_for_user(table_name, schema))
                print()
        return

    # Adiciona descrição manual
    if args.describe and args.table:
        if args.table not in encyclopedia["tabelas"]:
            print(f"Tabela {args.table} não encontrada na enciclopédia.")
            return

        encyclopedia["tabelas"][args.table]["descricao"] = args.describe
        save_encyclopedia(encyclopedia)
        print(f"✅ Descrição adicionada para {args.table}")
        return

    # Processa query individual
    if args.query:
        new_tables = process_query(args.query, encyclopedia)

        if new_tables:
            print(f"\n🆕 Novas tabelas detectadas: {', '.join(new_tables)}")
            save_encyclopedia(encyclopedia)
            print(f"✅ Enciclopédia atualizada ({len(encyclopedia['tabelas'])} tabelas no total)")

            # Sugere preenchimento
            print("\n💡 Dica: Adicione descrições com:")
            for table in new_tables:
                print(f"   python scripts/update-encyclopedia.py --table {table} --describe 'Descrição aqui'")
        else:
            print("✅ Nenhuma tabela nova detectada.")
        return

    # Escaneia todas as queries
    if args.scan_all:
        print("\n🔍 Escaneando diretório de queries...")

        queries_dir = Path(__file__).parent.parent / "analytics" / "queries"
        all_tables = scan_queries_directory(queries_dir)

        new_tables = []
        for table in all_tables:
            if add_table_to_encyclopedia(table, encyclopedia):
                new_tables.append(table)

        save_encyclopedia(encyclopedia)

        if new_tables:
            print(f"🆕 {len(new_tables)} novas tabelas adicionadas:")
            for table in new_tables:
                print(f"   • {table}")
        else:
            print("✅ Nenhuma tabela nova encontrada.")

        print(f"\n📊 Total: {len(encyclopedia['tabelas'])} tabelas na enciclopédia")
        return

    # Se não passou nenhum argumento, mostra ajuda
    parser.print_help()


if __name__ == "__main__":
    main()

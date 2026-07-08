#!/usr/bin/env python3
"""
D-Chat MCP Output Processor
Processa o output da ferramenta MCP get_messages e gera resumo estruturado.
Este script trabalha com dados limitados quando a API está com limite atingido.

Uso:
    python dchat_mcp_processor.py <arquivo_txt>

O arquivo TXT deve conter o output bruto da ferramenta MCP.
"""

import re
import sys
from datetime import datetime
from collections import defaultdict


class DChatMCPProcessor:
    def __init__(self, content: str):
        self.content = content
        self.messages = []
        self.participants = set()

    def parse_messages(self):
        """Parseia mensagens do formato MCP."""
        # Encontra blocos de mensagens
        lines = self.content.split('\n')
        current_msg = {}

        for line in lines:
            line = line.strip()

            # Ignora linhas vazias ou headers
            if not line or line.startswith('Messages') or line.startswith('['):
                continue

            # Tenta extrair JSON-like content
            if line.startswith('"text"'):
                # Extrai texto da mensagem
                match = re.search(r'"text":\s*"(.*?)"(?:,|$)', line)
                if match:
                    text = match.group(1).replace('\\n', '\n')
                    current_msg['text'] = text

                    # Tenta identificar remetente de menções
                    mentions = re.findall(r'@<=?(\d+)=?\>', text)
                    if mentions:
                        current_msg['mentions'] = mentions

            # Se temos texto, salva mensagem
            if 'text' in current_msg and len(current_msg['text']) > 5:
                self.messages.append(current_msg)
                current_msg = {}

        # Também tenta extrair diretamente do formato array
        if not self.messages:
            self._parse_array_format()

    def _parse_array_format(self):
        """Parseia formato de array JSON."""
        # Procura por objetos JSON no texto
        json_pattern = r'\{\s*"text":\s*"([^"]+)"[^}]*\}'
        matches = re.findall(json_pattern, self.content, re.DOTALL)

        for match in matches:
            self.messages.append({
                'text': match.replace('\\n', '\n'),
                'sender': 'Desconhecido'
            })

    def extract_links(self) -> list:
        """Extrai links compartilhados."""
        url_pattern = r'https?://[^\s<>"\']+(?:\([^\s]*\)|[^\s<>"\'])?'
        links = re.findall(url_pattern, self.content)
        return list(set(links))

    def identify_topics(self) -> dict:
        """Identifica tópicos principais."""
        topics = defaultdict(list)

        for msg in self.messages:
            text = msg.get('text', '').lower()

            if any(kw in text for kw in ['roadmap', 'plan', 'planning']):
                topics['🗺️ Planejamento/Roadmap'].append(msg['text'][:100])

            if any(kw in text for kw in ['reunião', 'meeting', 'call', 'sync']):
                topics['📅 Reuniões'].append(msg['text'][:100])

            if any(kw in text for kw in ['entregável', 'deliverable', 'prazo', 'deadline']):
                topics['📋 Entregáveis'].append(msg['text'][:100])

            if 'http' in text:
                topics['🔗 Links/Documentos'].append(msg['text'][:100])

            if any(kw in text for kw in ['duvida', 'pergunta', '?']):
                topics['❓ Dúvidas/Perguntas'].append(msg['text'][:100])

        return topics

    def identify_participants(self):
        """Identifica participantes de menções."""
        mention_pattern = r'@<=?(\d+)=?\>'
        mentions = re.findall(mention_pattern, self.content)
        self.participants = set(mentions)

    def resolve_mentions(self, text: str) -> str:
        """Converte menções codificadas para formato legível."""
        text = re.sub(r'@<=?\d+=?\>', '@[usuário]', text)
        text = re.sub(r'@<-channel->', '@canal', text)
        return text

    def generate_summary(self) -> str:
        """Gera resumo estruturado."""
        lines = []

        lines.append("# 📋 Resumo de Conversas - D-Chat (via MCP)")
        lines.append(f"**Mensagens analisadas:** {len(self.messages)}")
        lines.append("")

        # Links encontrados
        links = self.extract_links()
        if links:
            lines.append("## 🔗 Links e Documentos Compartilhados")
            for link in links:
                lines.append(f"- [{link[:60]}...]({link})" if len(link) > 60 else f"- {link}")
            lines.append("")

        # Tópicos
        topics = self.identify_topics()
        if topics:
            lines.append("## 📌 Tópicos Identificados")
            for topic, items in topics.items():
                lines.append(f"\n### {topic}")
                for item in items[:5]:  # Limita a 5 itens por tópico
                    clean_item = self.resolve_mentions(item)
                    lines.append(f"- {clean_item}...")
            lines.append("")

        # Participantes
        if self.participants:
            lines.append("## 👥 Participantes Mencionados")
            lines.append(f"IDs encontrados: {', '.join(sorted(self.participants))}")
            lines.append("")

        # Mensagens completas
        if self.messages:
            lines.append("## 💬 Mensagens Detalhadas")
            for i, msg in enumerate(self.messages[:20], 1):  # Limita a 20 mensagens
                text = self.resolve_mentions(msg['text'])
                lines.append(f"\n### Mensagem {i}")
                lines.append(f"{text}")
                if 'mentions' in msg:
                    lines.append(f"*Menciona: {', '.join(msg['mentions'])}*")
            lines.append("")

        # Observações
        lines.append("---")
        lines.append("⚠️ **Nota:** Este resumo foi gerado a partir de dados limitados devido a restrições de API.")
        lines.append("Para um relatório completo com timestamps e remetentes, é necessário usar o comando:")
        lines.append("```")
        lines.append("dws message +dump-by-chat --by-chat-id <ID> --from \"YYYY-MM-DD\" output.json")
        lines.append("```")

        return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("Uso: python dchat_mcp_processor.py <arquivo>")
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Arquivo não encontrado: {file_path}")
        sys.exit(1)

    processor = DChatMCPProcessor(content)
    processor.parse_messages()
    processor.identify_participants()

    summary = processor.generate_summary()

    # Salva em arquivo
    output_path = file_path.replace('.txt', '_resumo.md')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(summary)

    print(f"OK - Resumo salvo em: {output_path}")
    print("\n" + "="*60)
    print(summary)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
D-Chat Message Summarizer
Processa arquivo JSON exportado do D-Chat e gera resumo estruturado.

Uso:
    python dchat_summarizer.py <arquivo_json> [data_inicio] [data_fim]

Exemplo:
    python dchat_summarizer.py ssi-ai-initiatives.json "2026-06-24" "2026-06-30"
"""

import json
import sys
from datetime import datetime, timezone
from collections import defaultdict
from typing import Dict, List, Any
import re


class DChatSummarizer:
    def __init__(self, json_path: str):
        self.json_path = json_path
        self.messages = []
        self.participants = set()
        self.threads = defaultdict(list)
        self.decisions = []
        self.timeline = []

    def load_messages(self) -> bool:
        """Carrega mensagens do arquivo JSON."""
        try:
            with open(self.json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if not data.get('ok'):
                print(f"❌ Erro na resposta da API: {data}")
                return False

            self.messages = data.get('data', {}).get('messages', [])
            print(f"✅ Carregadas {len(self.messages)} mensagens")
            return True

        except FileNotFoundError:
            print(f"❌ Arquivo não encontrado: {self.json_path}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Erro ao parsear JSON: {e}")
            return False

    def filter_by_date(self, start_date: str = None, end_date: str = None):
        """Filtra mensagens por intervalo de datas."""
        if not start_date and not end_date:
            return

        filtered = []
        for msg in self.messages:
            ts = msg.get('ts', 0)
            msg_date = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)

            if start_date:
                start = datetime.strptime(start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                if msg_date < start:
                    continue

            if end_date:
                end = datetime.strptime(end_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                end = end.replace(hour=23, minute=59, second=59)
                if msg_date > end:
                    continue

            filtered.append(msg)

        self.messages = filtered
        print(f"📅 Após filtro de datas: {len(self.messages)} mensagens")

    def extract_participants(self):
        """Extrai lista de participantes únicos."""
        for msg in self.messages:
            sender = msg.get('sender', {})
            fullname = sender.get('fullname', 'Desconhecido')
            username = sender.get('username', 'unknown')
            self.participants.add((fullname, username))

    def parse_mentions(self, text: str) -> List[str]:
        """Extrai menções de usuários do texto."""
        mentions = re.findall(r'@\<=?(\d+)=?\>', text)
        return mentions

    def format_mentions(self, text: str) -> str:
        """Formata menções codificadas para formato legível."""
        # Substitui @<=123456=> por @usuario
        text = re.sub(r'@\<=?\d+=?\>', '@usuario', text)
        text = re.sub(r'@<-channel->', '@canal', text)
        return text

    def identify_threads(self):
        """Agrupa mensagens em threads baseado em menções e continuidade."""
        current_thread = []
        last_sender = None
        last_time = 0
        thread_id = 0

        for msg in self.messages:
            ts = msg.get('ts', 0)
            sender = msg.get('sender', {}).get('fullname', 'Desconhecido')
            text = msg.get('text', '')

            # Nova thread se:
            # 1. Mudou de remetente e passou mais de 30 minutos
            # 2. Mensagem começa com menção a alguém diferente do último
            time_gap = (ts - last_time) > (30 * 60 * 1000)  # 30 minutos
            new_mention = any(mention in text for mention in ['@<=', '@<-channel->'])

            if (time_gap or (new_mention and sender != last_sender)) and current_thread:
                self.threads[f"Thread {thread_id + 1}"] = current_thread
                thread_id += 1
                current_thread = []

            current_thread.append({
                'timestamp': ts,
                'datetime': datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M"),
                'sender': sender,
                'text': self.format_mentions(text),
                'mentions': self.parse_mentions(text)
            })

            last_sender = sender
            last_time = ts

        if current_thread:
            self.threads[f"Thread {thread_id + 1}"] = current_thread

    def identify_decisions(self):
        """Identifica decisões e resoluções nas mensagens."""
        decision_keywords = [
            'decidido', 'decisão', 'definido', 'resolvido', 'resolução',
            'concordo', 'aprovado', 'fechado', 'finalizado', 'ok,',
            'vamos', 'vamos seguir', 'ficou definido', 'ficou acordado',
            'approved', 'resolved', 'decided', 'agreed', 'closed'
        ]

        for msg in self.messages:
            text = msg.get('text', '').lower()
            sender = msg.get('sender', {}).get('fullname', 'Desconhecido')
            ts = msg.get('ts', 0)

            if any(keyword in text for keyword in decision_keywords):
                # Contexto: pega mensagens anteriores e posteriores
                self.decisions.append({
                    'datetime': datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M"),
                    'sender': sender,
                    'content': self.format_mentions(msg.get('text', '')),
                    'keywords_found': [k for k in decision_keywords if k in text]
                })

    def build_timeline(self):
        """Constrói timeline cronológica dos eventos."""
        for msg in self.messages:
            ts = msg.get('ts', 0)
            sender = msg.get('sender', {}).get('fullname', 'Desconhecido')
            text = msg.get('text', '')

            self.timeline.append({
                'datetime': datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M"),
                'sender': sender,
                'summary': self.format_mentions(text[:150] + '...' if len(text) > 150 else text)
            })

    def generate_report(self) -> str:
        """Gera relatório completo em formato Markdown."""
        report = []

        # Header
        report.append("# 📋 Resumo de Conversas - D-Chat")
        report.append(f"**Arquivo:** `{self.json_path}`")
        report.append(f"**Gerado em:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        report.append(f"**Total de mensagens:** {len(self.messages)}")
        report.append("")

        # 1. Participantes
        report.append("## 👥 1. Participantes")
        report.append("")
        for fullname, username in sorted(self.participants):
            report.append(f"- **{fullname}** (@{username})")
        report.append("")

        # 2. Threads de Conversa
        report.append("## 💬 2. Threads de Conversa")
        report.append("")
        for thread_name, messages in self.threads.items():
            if not messages:
                continue
            start_time = messages[0]['datetime']
            end_time = messages[-1]['datetime']
            participants = set(m['sender'] for m in messages)

            report.append(f"### {thread_name}")
            report.append(f"**Período:** {start_time} → {end_time}")
            report.append(f"**Participantes:** {', '.join(sorted(participants))}")
            report.append(f"**Mensagens:** {len(messages)}")
            report.append("")
            report.append("**Resumo:**")

            for msg in messages:
                report.append(f"- `[{msg['datetime']}]` **{msg['sender']}:** {msg['text']}")

            report.append("")

        # 3. Decisões e Resoluções
        report.append("## ✅ 3. Decisões e Resoluções Identificadas")
        report.append("")
        if self.decisions:
            for i, decision in enumerate(self.decisions, 1):
                report.append(f"### Decisão {i}")
                report.append(f"- **Data:** {decision['datetime']}")
                report.append(f"- **Responsável:** {decision['sender']}")
                report.append(f"- **Conteúdo:** {decision['content']}")
                report.append("")
        else:
            report.append("_Nenhuma decisão explícita identificada nas mensagens._")
            report.append("")

        # 4. Timeline Cronológica
        report.append("## 📅 4. Timeline Cronológica")
        report.append("")
        current_date = None
        for event in self.timeline:
            date_part = event['datetime'][:10]
            time_part = event['datetime'][11:]

            if date_part != current_date:
                current_date = date_part
                report.append(f"\n### {current_date}")
                report.append("")

            report.append(f"- `{time_part}` **{event['sender']}:** {event['summary']}")

        report.append("")
        report.append("---")
        report.append("*Relatório gerado automaticamente por D-Chat Summarizer*")

        return "\n".join(report)

    def save_report(self, output_path: str = None):
        """Salva o relatório em arquivo."""
        if not output_path:
            base_name = self.json_path.replace('.json', '')
            output_path = f"{base_name}_resumo.md"

        report = self.generate_report()

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"📝 Relatório salvo em: {output_path}")
        return output_path


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    json_path = sys.argv[1]
    start_date = sys.argv[2] if len(sys.argv) > 2 else None
    end_date = sys.argv[3] if len(sys.argv) > 3 else None

    summarizer = DChatSummarizer(json_path)

    if not summarizer.load_messages():
        sys.exit(1)

    summarizer.filter_by_date(start_date, end_date)
    summarizer.extract_participants()
    summarizer.identify_threads()
    summarizer.identify_decisions()
    summarizer.build_timeline()

    output = summarizer.save_report()

    # Também imprime no stdout
    print("\n" + "="*60)
    print(summarizer.generate_report())


if __name__ == "__main__":
    main()

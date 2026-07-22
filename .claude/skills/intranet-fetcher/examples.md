# Exemplos - intranet-fetcher

Coleção de exemplos práticos para uso da skill.

## Sumário

1. [Exemplos Básicos](#exemplos-básicos)
2. [Exemplos Intermediários](#exemplos-intermediários)
3. [Exemplos Avançados](#exemplos-avançados)
4. [Casos de Uso Reais](#casos-de-uso-reais)

---

## Exemplos Básicos

### 1. Analisar uma Skill do Skillshub

```python
# scripts/examples/basic-usage.py
from intranet_fetcher import IntranetFetcher

# Inicializar
fetcher = IntranetFetcher()

# Analisar URL
result = fetcher.analyze(
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch"
)

print(f"Título: {result['title']}")
print(f"Versão: {result['version']}")
print(f"Descrição: {result['description'][:200]}...")
```

### 2. Extrair Conteúdo de Documento Cooper

```python
# Extrair documento específico
doc = fetcher.analyze(
    "https://cooper.didichuxing.com/docs2/document/2207291123516",
    extract_headings=True,
    extract_code=True,
    max_content_length=50000
)

# Salvar em arquivo
with open("cooper_doc.json", "w", encoding="utf-8") as f:
    json.dump(doc, f, indent=2, ensure_ascii=False)
```

### 3. Tirar Screenshot

```python
# Screenshot simples
fetcher.screenshot(
    url="https://skillshub.intra.xiaojukeji.com",
    output_path="./skillshub_home.png",
    full_page=True
)

# Screenshot de elemento específico
fetcher.screenshot(
    url="https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    output_path="./skill_detail.png",
    selector=".skill-content"  # apenas essa seção
)
```

---

## Exemplos Intermediários

### 4. Buscar Múltiplas Skills

```python
# Lista de skills para analisar
skills_to_analyze = [
    "xiaoju-fetch",
    "cooper",
    "cooper-doc-writer",
    "dchat-message",
    "gattaran-viewer"
]

results = []
for skill_id in skills_to_analyze:
    url = f"https://skillshub.intra.xiaojukeji.com/skill/{skill_id}"
    try:
        result = fetcher.analyze(url)
        results.append({
            "skill": skill_id,
            "name": result.get("mainTitle"),
            "version": result.get("version"),
            "description": result.get("description", "")[:300]
        })
        print(f"✓ {skill_id}")
    except Exception as e:
        print(f"✗ {skill_id}: {e}")

# Exportar para CSV
import csv
with open("skills_summary.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["skill", "name", "version", "description"])
    writer.writeheader()
    writer.writerows(results)
```

### 5. Navegar e Interagir

```python
from intranet_fetcher import InteractiveSession

# Criar sessão interativa
session = InteractiveSession()

# Abrir página
session.navigate("https://skillshub.intra.xiaojukeji.com")

# Buscar por termo
session.type('input[name="search"]', "cooper")
session.press("Enter")

# Aguardar resultados
session.wait_for(".search-results")

# Clicar no primeiro resultado
results = session.query_selector_all(".skill-card")
if results:
    results[0].click()

# Extrair conteúdo da página de detalhe
content = session.extract_content()

session.close()
```

### 6. Extrair Tabela de Dados

```python
# Extrair tabela estruturada
def extract_table(session, selector):
    return session.evaluate("""
        (selector) => {
            const table = document.querySelector(selector);
            if (!table) return null;

            const headers = Array.from(table.querySelectorAll('th'))
                .map(th => th.innerText.trim());

            const rows = Array.from(table.querySelectorAll('tr'))
                .slice(1)  // Skip header
                .map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td'));
                    const row = {};
                    headers.forEach((h, i) => {
                        row[h] = cells[i]?.innerText.trim() || '';
                    });
                    return row;
                });

            return { headers, rows };
        }
    """, selector)

# Uso
table_data = extract_table(session, ".data-table")
print(f"Colunas: {table_data['headers']}")
print(f"Linhas: {len(table_data['rows'])}")
```

---

## Exemplos Avançados

### 7. Análise Comparativa de Skills

```python
from intranet_fetcher import BatchAnalyzer
from datetime import datetime

# Configurar análise em lote
analyzer = BatchAnalyzer(
    session_id="comparative_analysis",
    output_dir="./analysis_output"
)

# Definir métricas para extração
metrics = {
    "basic": ["title", "version", "description"],
    "structure": ["headings", "sections"],
    "content": ["code_examples", "documentation_length"],
    "metadata": ["author", "last_updated", "usage_stats"]
}

# Executar análise
urls = [
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    "https://skillshub.intra.xiaojukeji.com/skill/cooper-mcp-helper",
    "https://skillshub.intra.xiaojukeji.com/skill/cooper-doc-writer"
]

report = analyzer.compare(urls, metrics=metrics)

# Gerar relatório Markdown
timestamp = datetime.now().strftime("%Y-%m-%d")
report_path = f"./skill_comparison_{timestamp}.md"
analyzer.export_report(report, format="markdown", path=report_path)
```

### 8. Monitoramento de Mudanças

```python
from intranet_fetcher import ChangeMonitor
import hashlib

class SkillMonitor:
    def __init__(self, url, check_interval=3600):
        self.url = url
        self.check_interval = check_interval
        self.last_hash = None

    def get_content_hash(self, content):
        return hashlib.md5(
            content.encode('utf-8')
        ).hexdigest()

    def check_for_changes(self, fetcher):
        result = fetcher.analyze(self.url)
        current_hash = self.get_content_hash(result['content'])

        if self.last_hash and current_hash != self.last_hash:
            print(f"🔄 Mudança detectada em {self.url}!")
            self.on_change_detected(result)

        self.last_hash = current_hash
        return current_hash != self.last_hash

    def on_change_detected(self, new_content):
        # Notificar, salvar diff, etc.
        pass

# Uso
monitor = SkillMonitor(
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch",
    check_interval=86400  # 24 horas
)

# Verificar periodicamente
import time
while True:
    changed = monitor.check_for_changes(fetcher)
    if changed:
        print("Ação: atualizar documentação local")
    time.sleep(monitor.check_interval)
```

### 9. Pipeline de Documentação

```python
from intranet_fetcher import DocumentationPipeline

# Definir pipeline
pipeline = DocumentationPipeline([
    # Etapa 1: Extrair conteúdo bruto
    {
        "name": "extract",
        "action": "fetch_and_parse",
        "params": {"include_metadata": True}
    },
    # Etapa 2: Limpar e estruturar
    {
        "name": "clean",
        "action": "structure_content",
        "params": {
            "remove_ads": True,
            "normalize_headings": True
        }
    },
    # Etapa 3: Gerar resumo
    {
        "name": "summarize",
        "action": "generate_summary",
        "params": {"max_length": 500}
    },
    # Etapa 4: Exportar
    {
        "name": "export",
        "action": "save_to_formats",
        "params": {
            "formats": ["markdown", "json"],
            "output_dir": "./docs"
        }
    }
])

# Executar pipeline
result = pipeline.run(
    "https://skillshub.intra.xiaojukeji.com/skill/xiaoju-fetch"
)

print(f"Documentação gerada em: {result['output_path']}")
```

---

## Casos de Uso Reais

### Caso 1: Catalogar Todas as Skills

```python
"""
Objetivo: Criar catálogo completo de skills do skillshub
para documentação interna do time.
"""

def catalog_all_skills():
    fetcher = IntranetFetcher()

    # 1. Navegar para página de listagem
    session = fetcher.create_session()
    session.navigate("https://skillshub.intra.xiaojukeji.com/skills")

    # 2. Extrair todos os links de skills
    skills = []
    while True:
        # Extrair skills da página atual
        page_skills = session.evaluate("""
            () => Array.from(document.querySelectorAll('.skill-link'))
                .map(a => ({
                    url: a.href,
                    name: a.innerText.trim()
                }))
        """)
        skills.extend(page_skills)

        # Verificar próxima página
        next_btn = session.query_selector(".pagination .next:not(.disabled)")
        if not next_btn:
            break

        next_btn.click()
        session.wait_for_load_state("networkidle")

    # 3. Analisar cada skill
    catalog = []
    for skill in skills:
        try:
            detail = fetcher.analyze(skill['url'])
            catalog.append({
                **skill,
                "version": detail.get('version'),
                "description": detail.get('description', '')[:500],
                "tags": detail.get('tags', []),
                "last_updated": detail.get('last_updated')
            })
        except Exception as e:
            print(f"Erro em {skill['name']}: {e}")

    # 4. Salvar catálogo
    with open("skill_catalog.json", "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"Catálogo criado com {len(catalog)} skills")
    return catalog
```

### Caso 2: Auditoria de Documentação

```python
"""
Objetivo: Verificar quais documentos do Cooper
estão desatualizados ou sem manutenção.
"""

def audit_cooper_docs(space_id):
    fetcher = IntranetFetcher()

    # Listar documentos do espaço
    docs = fetcher.list_cooper_documents(space_id)

    audit_results = []
    for doc in docs:
        result = {
            "id": doc['id'],
            "title": doc['title'],
            "last_modified": doc['last_modified'],
            "author": doc['author'],
            "issues": []
        }

        # Verificar idade
        age_days = (datetime.now() - doc['last_modified']).days
        if age_days > 180:
            result["issues"].append(f"Desatualizado ({age_days} dias)")

        # Verificar conteúdo
        content = fetcher.get_document(doc['id'])
        if len(content['content']) < 100:
            result["issues"].append("Conteúdo muito curto")

        if not content.get('code_examples'):
            result["issues"].append("Sem exemplos de código")

        audit_results.append(result)

    # Gerar relatório
    outdated = [r for r in audit_results if r['issues']]
    print(f"Documentos com problemas: {len(outdated)}/{len(docs)}")

    return audit_results
```

### Caso 3: Integração CI/CD

```python
"""
Objetivo: Verificar se documentação está
sincronizada com código em PRs.
"""

import subprocess

def check_doc_sync():
    # Verificar arquivos modificados
    changed_files = subprocess.check_output(
        ["git", "diff", "--name-only", "HEAD~1"],
        text=True
    ).strip().split("\n")

    # Identificar mudanças em skills
    skill_changes = [
        f for f in changed_files
        if f.startswith("skills/")
    ]

    if not skill_changes:
        print("Nenhuma skill modificada")
        return True

    # Verificar se documentação foi atualizada
    fetcher = IntranetFetcher()
    issues = []

    for skill_file in skill_changes:
        skill_name = skill_file.split("/")[1]
        skill_url = f"https://skillshub.intra.xiaojukeji.com/skill/{skill_name}"

        try:
            remote_doc = fetcher.analyze(skill_url)
            local_doc = read_local_doc(skill_name)

            if not docs_match(remote_doc, local_doc):
                issues.append({
                    "skill": skill_name,
                    "issue": "Documentação desatualizada"
                })
        except Exception as e:
            issues.append({
                "skill": skill_name,
                "issue": f"Erro: {e}"
            })

    if issues:
        print("⚠️  Problemas encontrados:")
        for issue in issues:
            print(f"  - {issue['skill']}: {issue['issue']}")
        return False

    print("✅ Documentação sincronizada")
    return True
```

---

Para mais detalhes sobre a API, consulte @file `docs/api-reference.md`.

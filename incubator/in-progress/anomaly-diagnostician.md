# anomaly-diagnostician

> **Status:** 🟡 In Progress  
> **Start:** 2026-07-29  
> **End:** _em andamento_

---

## 🎯 Contexto + Ideia

Agente especializado em diagnóstico de anomalias em orders (inicialmente d-duty).  
Quando ocorrer picos ou comportamentos anômalos em métricas de orders, o agente investiga a causa raiz via análise exploratória SQL.

**Exemplo de uso:**  
"d-duty aumentou 50% em Recife no dia 10/06" → Agente extrai orders, identifica padrões (ex: 68% são bike após 22h), compara com baseline, gera relatório executivo.

---

## 📋 Plano de Ação

1. [x] Definir escopo e requisitos com o usuário
2. [ ] Criar workflow YAML (`.claude/workflows/agents/anomaly-diagnostician.yaml`)
3. [ ] Criar config de parâmetros (`.claude/anomaly-config.yaml`)
4. [ ] Testar com caso real (d-duty)
5. [ ] Documentar em `agents/anomaly-diagnostician/README.md`
6. [ ] Adicionar trigger de skill automática

---

## ✅ O Que Já Fizemos

- [x] Levantamento de requisitos
- [x] Definição da arquitetura
- [x] Decisões técnicas registradas neste arquivo

---

## 🏗️ Arquitetura Completa

### Entradas Suportadas

| Modo | Descrição | Exemplo |
|------|-----------|---------|
| `orders` | Lista de order IDs específicos | `orderIds="id1,id2,id3"` |
| `description` | Descrição textual do problema | `problemDescription="d-duty alto em Recife"` |
| `hybrid` | Descrição + amostra de orders | Ambos os parâmetros |

### Parâmetros

```yaml
mode: "description" | "orders" | "hybrid"
orderIds: "id1,id2,id3"  # para mode=orders/hybrid
problemDescription: "d-duty aumentou 50% em Recife no dia 10/06"
metric: "d-duty"  # auto-detect da descrição se não informado
city: "Recife"  # nome da cidade (converter para city_id)
dateRange: "2026-06-10"  # formato: YYYY-MM-DD
baseline: "previous_day"  # previous_day | same_day_last_week | last_30_days_average
threshold: 20  # % de variação mínima para anomalia
dimensions: "shop_id,zone"  # dimensões extras além do padrão
outputFormat: "markdown"
saveReport: true  # salva em reports/anomaly-diagnostician/
gattaranDeepDive: false  # se true, sugere deep dive quando necessário
```

### Steps do Workflow

```
1. validate_and_prepare
   - Valida parâmetros
   - Detecta métrica da descrição (se auto-detect)
   - Converte cidade para city_id
   - Prepara partições year/month/day

2. data_extraction (Presto MCP)
   - Query principal: orders problemáticas
   - Query baseline: comparação
   - Queries de enriquecimento (shop, regional, rider)

3. exploratory_analysis
   - Drill-down hierárquico: Cidade → Hora → Loja → Veículo
   - Análise de correlação entre variáveis
   - Detecção de clusters de padrões
   - Validação de hipóteses com SQL

4. validation_and_deep_dive (condicional)
   - Se gattaranDeepDive=true e padrão encontrado
   - Seleciona orders representativas
   - Pergunta ao usuário: "Deseja deep dive no Gattaran para [orders]?"

5. generate_report
   - Compila evidências em relatório markdown
   - Salva em: reports/anomaly-diagnostician/YYYY-MM-DD_metric_cidade_timestamp.md
```

---

## 📊 Queries SQL (Templates)

### Query Principal (Orders Problemáticas)

```sql
SELECT 
  o.order_id,
  o.city_id,
  o.shop_id,
  o.create_time_local,
  o.cancel_time_local,
  HOUR(FROM_UNIXTIME(o.create_timestamp/1000)) as hour,
  DAY_OF_WEEK(FROM_UNIXTIME(o.create_timestamp/1000)) as day_of_week,
  o.biz_line,
  o.ka_group_type,
  o.delivery_model,
  o.r_vehicle_type,
  o.d_from_to_distance,
  -- duty info
  o.e_dutyinfo_b_responsibility,
  o.e_dutyinfo_c_responsibility,
  o.e_dutyinfo_d_responsibility,
  o.e_dutyinfo_p_responsibility,
  -- shop info
  s.shop_name,
  s.ka as shop_ka,
  s.rank as shop_rank,
  -- regional
  r.city_name,
  r.state_abbreviation
FROM soda_international_dw_br.dwd_order_wide_d_increment o
LEFT JOIN soda_international_dw_br.dwd_shop_base_d_whole s
  ON o.shop_id = s.shop_id 
  AND s.country_code = 'BR'
  AND s.year = '{year}' AND s.month = '{month}' AND s.day = '{day}'
LEFT JOIN latam_99.dim_regional_county r
  ON CAST(o.city_id AS varchar) = r.city_id
WHERE o.country_code = 'BR'
  AND o.year = '{year}' 
  AND o.month = '{month}' 
  AND o.day = '{day}'
  AND o.e_dutyinfo_d_responsibility = '100'  -- filtro d-duty
  AND r.city_name = '{city}'
  -- filtro order_ids se mode=orders/hybrid
LIMIT 10000
```

### Query Baseline

Mesma estrutura, data anterior (ou período baseline escolhido).

### Queries de Validação de Hipóteses

```sql
-- Hipótese: "O problema é bike noturno"
SELECT 
  CASE WHEN r_vehicle_type = '101' AND hour >= 22 THEN 'bike_noturno'
       WHEN r_vehicle_type = '101' THEN 'bike_diurno'
       ELSE 'outros' END as categoria,
  COUNT(*) as volume,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as pct
FROM ({query_principal}) t
GROUP BY 1

-- Hipótese: "Lojas específicas estão sobrecarregadas"
SELECT 
  shop_id,
  shop_name,
  COUNT(*) as volume,
  AVG(d_from_to_distance) as avg_distance
FROM ({query_principal}) t
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 20
```

---

## 🔍 Técnicas de Análise Exploratória

### 1. Drill-down Hierárquico

Ordem padrão para d-duty: `Cidade → Hora → Loja → Veículo → Tipo de entrega`

Para cada nível, calcular:
- Volume de orders
- % do total
- Variação vs baseline
- Z-score (desvio da média)

### 2. Análise de Correlação

Variáveis a cruzar:
- hour × r_vehicle_type
- shop_id × cancel_detail_msg
- d_from_to_distance × duty_type
- ka_group_type × hour

### 3. Detecção de Clusters

Agrupar orders similares:
```
Cluster A: 65% das orders - bike, >22h, zona norte
Cluster B: 20% das orders - moto, 12-14h, centro  
Cluster C: 15% das orders - outros padrões
```

### 4. Identificação de Outliers

```sql
-- Z-score para identificar anomalias
SELECT 
  shop_id,
  volume,
  (volume - avg_volume) / std_volume as z_score
FROM (...)
WHERE ABS(z_score) > 2  -- outlier
```

---

## 📄 Template do Relatório

**Path:** `reports/anomaly-diagnostician/YYYY-MM-DD_d-duty_Recife_timestamp.md`

```markdown
# 🚨 Diagnóstico de Anomalia: d-duty

**Data:** 2026-07-29 14:30  
**Período Analisado:** 2026-06-10  
**Cidade:** Recife  
**Modo:** description  
**Amostra:** 1,234 orders  
**Baseline:** 2026-06-09 (5,678 orders)

---

## 📊 Resumo Executivo

[2-3 parágrafos com findings principais]

**Conclusão Principal:** [Padrão dominante]

---

## 🔍 Hipóteses Validadas

| Hipótese | Evidência | Confiança | Impacto |
|----------|-----------|-----------|---------|
| Bike noturno | 68% das orders são bike >22h | 85% | Alto |
| Loja X sobrecarregada | Shop 12345: 45 vs 5 esperado | 92% | Médio |

---

## 📈 Distribuição Temporal

| Hora | Volume | % Total | vs Baseline |
|------|--------|---------|-------------|
| 22h | 450 | 36% | +180% |
| 23h | 380 | 31% | +220% |

---

## 🗺️ Análise Geográfica

[Distribuição por zona/região]

---

## 🏪 Top Lojas Impactadas

| Shop ID | Nome | Volume | % do Total | vs Baseline |
|---------|------|--------|------------|-------------|
| 12345 | Loja A | 45 | 3.6% | +800% |

---

## 🚗 Breakdown por Atributos

### Tipo de Veículo
- Bike (101): 850 orders (69%)
- Moto (102): 280 orders (23%)
- ...

### KA Group
- KA: ...
- CKA: ...

---

## 🎯 Recomendações

1. **[Prioridade Alta]** Verificar disponibilidade de couriers noturnos na Zona Norte
   - Evidência: 68% dos cancelamentos são bike >22h
   - Ação: Analisar escala de entregadores noturnos

---

## 🧪 Queries Utilizadas

```sql
-- Query principal
...

-- Query baseline
...
```

---

## 📎 Apêndice

- Order IDs analisados: [lista ou amostra]
- Deep dive Gattaran: [realizado/não realizado]
```

---

## 💻 Exemplos de Uso

### Exemplo 1: Descrição do Problema

```bash
claude workflow run anomaly-diagnostician \
  --mode=description \
  --problemDescription="d-duty aumentou 50% em Recife no dia 10/06" \
  --city="Recife" \
  --dateRange="2026-06-10"
```

**Fluxo:**
1. Detecta métrica = d-duty
2. Extrai orders d-duty de Recife em 10/06
3. Análise exploratória
4. Relatório: "68% são bike após 22h na Zona Norte"

### Exemplo 2: Order IDs Específicos

```bash
claude workflow run anomaly-diagnostician \
  --mode=orders \
  --orderIds="5764678698494132425,5764678698494132426" \
  --metric=d-duty \
  --city="Recife" \
  --dateRange="2026-06-10" \
  --gattaranDeepDive=true
```

### Exemplo 3: Híbrido com Dimensões Customizadas

```bash
claude workflow run anomaly-diagnostician \
  --mode=hybrid \
  --problemDescription="Aumento de d-duty em São Paulo" \
  --orderIds="id1,id2,id3" \
  --city="São Paulo" \
  --dateRange="2026-06-15" \
  --dimensions="shop_id,rider_work_level" \
  --baseline=same_day_last_week
```

### Exemplo 4: Interativo (Sessão)

```
Usuário: "Analise esse pico de d-duty em Recife"

Agente: [Executa, encontra padrão de bike noturno]

Usuário: "Interessante. Veja agora se o problema não é na loja"

Agente: [Re-executa com dimensão shop_id]
        "3 lojas representam 60% dos casos"
        
Usuário: "Quero ver detalhes no Gattaran"

Agente: "Deseja prosseguir com deep dive para 9 orders?"

Usuário: "Sim"

Agente: [Skill gattaran-viewer] → [Atualiza relatório]
```

---

## 📍 Onde Estamos

- [x] Arquitetura definida
- [x] Templates de queries documentados
- [x] Estrutura do relatório definida
- [ ] Workflow YAML a criar
- [ ] Config YAML a criar

---

## 🚀 Próximos Passos

- [ ] Criar `.claude/workflows/agents/anomaly-diagnostician.yaml`
- [ ] Criar `.claude/anomaly-config.yaml`
- [ ] Testar com caso: d-duty Recife 10/06/2026
- [ ] Ajustar thresholds após testes

---

## 📊 Decisões Registradas

| Decisão | Valor | Contexto |
|-----------|-------|----------|
| Não mostrar estrutura YAML no brainstorm | Aprovado | Economia de tokens |
| Tabelas fora da encyclopedia | Adicionar sob demanda | Quando usuário indicar |
| Métrica inicial | d-duty | Outras virão depois |
| Formato período | Datas explícitas (YYYY-MM-DD) | Ex: 2026-06-10 |
| Baseline padrão | Dia anterior | Pode ser sobrescrito |
| Deep dive Gattaran | Sempre sugere, nunca automático | Pergunta ao usuário |
| Fonte de dados | Presto MCP | Sem Data-E |
| Máximo de orders | 10,000 | Limite nas queries |
| Path do relatório | `reports/anomaly-diagnostician/` | Com timestamp |

---

## 🔗 Tabelas Principais (Encyclopedia)

| Tabela | Uso |
|--------|-----|
| `dwd_order_wide_d_increment` | Dados principais das orders |
| `dwd_order_cancel_duty_d_increment` | Detalhes de cancelamento duty |
| `dwd_shop_base_d_whole` | Dados das lojas |
| `dim_regional_county` | Mapeamento cidade/regional |
| `dwd_rider_whole_d_whole` | Dados dos entregadores |

**Nota:** Se usuário indicar tabela fora da encyclopedia, adicionar via skill sql-encyclopedia.

---

## 🗓️ Registro de Sessão

**2026-07-29:** Brainstorm e definição completa da arquitetura. Dev Docs consolidado neste arquivo.

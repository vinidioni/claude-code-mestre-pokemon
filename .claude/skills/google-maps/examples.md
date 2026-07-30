# Exemplos - Google Maps

## Cenário 1: Geocodificar Endereço

```
Usuário: "Qual a latitude/longitude de 'Av. Paulista, 1000, São Paulo, SP'?"

Ação:
→ Skill: google-maps
→ Tool: geocode
→ Params:
  {
    "address": "Av. Paulista, 1000, São Paulo, SP"
  }

Resultado:
"📍 Localização encontrada:
- Latitude: -23.5632
- Longitude: -46.6543
- Endereço formatado: Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brasil"
```

## Cenário 2: Calcular Rota

```
Usuário: "Rota de São Paulo para Rio de Janeiro de carro"

Ação:
→ directions
→ Params:
  {
    "origin": "São Paulo, SP",
    "destination": "Rio de Janeiro, RJ",
    "mode": "driving"
  }

Resultado:
"🚗 Rota encontrada:
- Distância: 435 km
- Tempo estimado: 5h 20min
- Passos principais:
  1. Pegar Via Dutra (BR-116)
  2. Continuar por 420 km
  3. Entrar em Rio de Janeiro"
```

## Cenário 3: Buscar Lugares Próximos

```
Usuário: "Restaurantes perto da coordenada -23.5505,-46.6333 num raio de 1km"

Ação:
→ place_search
→ Params:
  {
    "query": "restaurante",
    "location": "-23.5505,-46.6333",
    "radius": 1000
  }

Resultado:
"🍽️ Restaurantes encontrados (5):
1. Restaurante A - 150m
2. Restaurante B - 320m
3. Restaurante C - 580m
..."
```

## Cenário 4: Matriz de Distâncias

```
Usuário: "Calcula distância entre São Paulo, Campinas e Rio"

Ação:
→ distance_matrix
→ Params:
  {
    "origins": ["São Paulo, SP", "Campinas, SP"],
    "destinations": ["Rio de Janeiro, RJ", "Santos, SP"],
    "mode": "driving"
  }

Resultado:
"📊 Matriz de Distâncias:

              | Rio de Janeiro | Santos
--------------|----------------|--------
São Paulo     | 435 km (5h20)  | 72 km (1h10)
Campinas      | 520 km (6h15)  | 145 km (2h)
```

## Cenário 5: Elevação/Altitude

```
Usuário: "Qual a altitude do Pico do Jaraguá?"

Ação:
1. geocode → Obter coordenadas do Pico do Jaraguá
2. elevation → Obter altitude

Params:
  {
    "locations": ["-23.4583,-46.7667"]
  }

Resultado:
"⛰️ Elevação:
- Pico do Jaraguá: 1,135 metros acima do nível do mar"
```

## Cenário 6: Análise Logística de Delivery

```
Usuário: "Analisa essas 3 entregas: quais são mais próximas entre si?"

Endereços:
- Pickup: Rua A, 100 - Centro
- Delivery 1: Rua B, 200 - Zona Sul
- Delivery 2: Rua C, 300 - Zona Norte

Fluxo:
1. geocode (3x) → Coordenadas de todos os endereços
2. distance_matrix → Calcular distâncias entre todos os pontos
3. Analisar: qual pickup fica mais próximo de qual delivery

Resultado:
"📍 Análise Geográfica:
- Pickup a Delivery 1: 2.5 km (8 min)
- Pickup a Delivery 2: 8.3 km (18 min)
- Delivery 1 a Delivery 2: 10.1 km (22 min)

💡 Recomendação: Priorizar Delivery 1 primeiro (menor distância)"
```

## Cenário 7: Combinação com Gattaran (Orders)

```
Usuário: "Pega os dados da order e mostra onde foi a entrega no mapa"

Fluxo:
1. gattaran-viewer → get_order_info
   → Extrair: endereço de entrega, coordenadas

2. google-maps → reverse_geocode
   → Converter coordenadas para endereço legível
   → Confirmar localização

3. place_search (opcional)
   → Buscar pontos de referência próximos
   → "Restaurantes perto do local de entrega"

Resultado:
"📦 Order #12345
📍 Local de entrega: Rua das Flores, 123 - Jardim das Oliveiras
🗺️ Coordenadas: -23.5555, -46.6666
🏪 Ponto de referência próximo: Supermercado XYZ (150m)"
```

## Cenário 8: Otimização de Rota Multi-stop

```
Usuário: "Qual a melhor ordem para fazer essas 4 entregas?"

Endereços:
- Base: Centro
- Stop A: Zona Norte
- Stop B: Zona Sul
- Stop C: Zona Leste

Fluxo:
1. geocode (todos)
2. distance_matrix (calcular todas as combinações)
3. Encontrar rota de menor distância total
   - Centro → Zona Norte → Zona Leste → Zona Sul
   - Total: 28 km
   - Alternativa: Centro → Zona Sul → Zona Leste → Zona Norte
   - Total: 35 km

Resultado:
"🚚 Rota Otimizada (menor distância):
1. Base → Zona Norte (8 km)
2. Zona Norte → Zona Leste (7 km)
3. Zona Leste → Zona Sul (13 km)
Total: 28 km"
```

## Cenário 9: Análise de Área de Cobertura

```
Usuário: "Quais bairros estão num raio de 5km do restaurante?"

Ação:
1. geocode → Coordenadas do restaurante
2. place_search (múltiplos)
   → Buscar bairros/districts ao redor
   → location: coordenadas do restaurante
   → radius: 5000 (5km)

Resultado:
"📍 Área de Cobertura (5km):
- Bairros atendidos: Centro, Jardins, Vila Mariana, Paraíso
- População estimada: ~500k habitantes
- Potencial: Alto"
```

## Cenário 10: Comparar Modos de Transporte

```
Usuário: "Compara carro vs bike para a mesma rota"

Ação:
→ directions (2x)
1. mode: "driving"
2. mode: "bicycling"

Comparação:
🚗 Carro: 12 km, 25 min
🚲 Bike:  10.5 km, 35 min, 85m elevação

Resultado: Análise de viabilidade por modo
```

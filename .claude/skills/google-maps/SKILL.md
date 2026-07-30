# Skill: google-maps

## Descrição
Integração com Google Maps API: geocodificação, lugares, direções, matriz de distância, elevação. Útil para análises logísticas e dados geográficos.

## Quando Usar
- Quando precisa de dados geográficos, rotas, ou análise de localização
- Keywords: "maps", "google maps", "geocode", "coordenadas", "rota", "distância", "direções", "elevação"

## Ferramentas MCP Disponíveis

### geocode
Converte endereço em coordenadas geográficas.

**Parâmetros:**
- `address` (string): Endereço para geocodificar

**Retorno:** Latitude, longitude, endereço formatado

**Exemplo:**
```json
{
  "address": "Av. Paulista, 1000, São Paulo, SP"
}
```

### reverse_geocode
Converte coordenadas em endereço.

**Parâmetros:**
- `lat` (number): Latitude
- `lng` (number): Longitude

**Exemplo:**
```json
{
  "lat": -23.5505,
  "lng": -46.6333
}
```

### place_search
Busca lugares próximos ou por texto.

**Parâmetros:**
- `query` (string): Termo de busca
- `location` (string): "lat,lng" do centro (opcional)
- `radius` (number): Raio em metros (opcional)

**Exemplo:**
```json
{
  "query": "restaurante",
  "location": "-23.5505,-46.6333",
  "radius": 1000
}
```

### place_details
Detalhes de um lugar específico.

**Parâmetros:**
- `place_id` (string): ID do lugar no Google Places

### directions
Calcula rota entre dois pontos.

**Parâmetros:**
- `origin` (string): Endereço ou "lat,lng"
- `destination` (string): Endereço ou "lat,lng"
- `mode` (string): "driving" | "walking" | "bicycling" | "transit"

**Exemplo:**
```json
{
  "origin": "São Paulo, SP",
  "destination": "Rio de Janeiro, RJ",
  "mode": "driving"
}
```

### distance_matrix
Calcula distâncias entre múltiplos pontos.

**Parâmetros:**
- `origins` (array): Lista de endereços/coordenadas
- `destinations` (array): Lista de endereços/coordenadas
- `mode` (string): Modo de transporte

**Exemplo:**
```json
{
  "origins": ["São Paulo, SP", "Campinas, SP"],
  "destinations": ["Rio de Janeiro, RJ", "Santos, SP"],
  "mode": "driving"
}
```

### elevation
Obtém elevação (altitude) de coordenadas.

**Parâmetros:**
- `locations` (array): Lista de "lat,lng"

**Exemplo:**
```json
{
  "locations": ["-23.5505,-46.6333", "-22.9068,-43.1729"]
}
```

## Uso

### Geocodificar endereço
```
Usuário: "Qual a latitude/longitude de 'Av. Paulista, 1000, SP'?"
→ geocode com address
```

### Calcular rota
```
Usuário: "Rota de São Paulo para Rio de Janeiro de carro"
→ directions com origin e destination
```

### Buscar lugares
```
Usuário: "Restaurantes perto da coordenada -23.5505,-46.6333 num raio de 2km"
→ place_search com query, location, radius
```

### Distância múltiplas
```
Usuário: "Calcula distância entre todas essas cidades"
→ distance_matrix com origins e destinations
```

### Elevação
```
Usuário: "Qual a altitude do Pico do Jaraguá?"
→ geocode (para coordenadas) → elevation
```

## Integração

- Combina com `gattaran-viewer`: Análise de rotas de delivery
- Combina com `everything-search`: Exportar dados geográficos
- Combina com `cooper-write`: Documentar análises geoespaciais

## Exemplo de Análise Logística

```
1. Geocodificar endereços de pickup e delivery
2. Calcular distâncias entre pontos
3. Otimizar rotas (menor distância/tempo)
4. Calcular elevação (relevante para bike/caminhada)
5. Gerar relatório no Cooper
```

## Limitações

- Requer `GOOGLE_MAPS_API_KEY` válido
- Rate limits da API Google aplicam-se
- Alguns lugares podem não estar no Google Places
- Elevação pode não estar disponível em todas as regiões

## Troubleshooting

**"API key not found"**
- Configurar `GOOGLE_MAPS_API_KEY` no `.env` ou ambiente

**"Rate limit exceeded"**
- Free tier: ~100 requests/day
- Considerar upgrade se necessário mais volume

**"Location not found"**
- Verificar ortografia do endereço
- Tentar coordenadas em vez de endereço textual

## Configuração

Obter API Key:
1. Acessar https://console.cloud.google.com/
2. Criar projeto (ou usar existente)
3. Habilitar APIs: Geocoding, Directions, Places, Distance Matrix
4. Criar credencial: API Key
5. Restringir chave (recomendado)

Adicionar ao `.env`:
```
GOOGLE_MAPS_API_KEY=sua-chave-aqui
```

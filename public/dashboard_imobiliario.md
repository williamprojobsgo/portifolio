# Dashboard Power BI - Análise Imobiliária
**Autor:** William Jose Francelino da Silva Junior  
**Data:** 2025

## Visão Geral
Dashboard interativo para análise do mercado imobiliário de Recife/PE, com foco em tendências de preços, análise geográfica e insights de investimento.

## Estrutura do Dashboard

### Página 1: Visão Executiva
**Objetivo:** Apresentar KPIs principais e visão geral do mercado

#### KPIs Principais (Cards)
- **Total de Imóveis:** 1.000
- **Preço Médio:** R$ 317.091
- **Preço/m² Médio:** R$ 2.223
- **Área Média:** 139,8 m²

#### Visualizações:
1. **Gráfico de Barras Horizontais:** Top 10 Bairros por Preço/m²
   - Eixo Y: Bairros
   - Eixo X: Preço por m²
   - Cores: Gradiente azul (mais claro = menor preço)

2. **Gráfico de Pizza:** Distribuição por Tipo de Imóvel
   - Segmentos: Apartamento, Casa, Studio, Cobertura, etc.
   - Cores: Paleta corporativa azul

3. **Gráfico de Linha:** Evolução Temporal dos Preços
   - Eixo X: Mês/Ano
   - Eixo Y: Preço médio
   - Linha secundária: Volume de cadastros

4. **Mapa de Calor:** Distribuição Geográfica
   - Pontos: Localização dos imóveis
   - Cor: Intensidade baseada no preço
   - Tooltip: Detalhes do imóvel

### Página 2: Análise de Preços
**Objetivo:** Análise detalhada de precificação e fatores de influência

#### Filtros Interativos:
- Tipo de Transação (Venda/Aluguel)
- Faixa de Preço
- Número de Quartos
- Bairro (Multi-seleção)

#### Visualizações:
1. **Scatter Plot:** Área vs Preço
   - Eixo X: Área (m²)
   - Eixo Y: Preço
   - Tamanho: Número de quartos
   - Cor: Tipo de imóvel

2. **Gráfico de Barras Agrupadas:** Impacto das Comodidades
   - Eixo X: Comodidades (Piscina, Academia, etc.)
   - Eixo Y: Diferença percentual no preço
   - Cores: Verde (positivo) / Vermelho (negativo)

3. **Histograma:** Distribuição de Preços por m²
   - Bins: Faixas de preço
   - Linha de referência: Média do mercado

4. **Tabela Dinâmica:** Estatísticas por Bairro
   - Colunas: Bairro, Qtd Imóveis, Preço Médio, Preço/m², Área Média
   - Ordenação: Por preço/m² decrescente

### Página 3: Análise Geográfica
**Objetivo:** Insights regionais e oportunidades por localização

#### Visualizações:
1. **Mapa Coroplético:** Preço Médio por Bairro
   - Regiões: Bairros de Recife
   - Cor: Intensidade baseada no preço médio
   - Tooltip: Estatísticas detalhadas

2. **Gráfico de Barras Empilhadas:** Tipos de Imóvel por Bairro
   - Eixo X: Bairros (top 10)
   - Eixo Y: Quantidade
   - Empilhamento: Tipos de imóvel

3. **Gráfico de Dispersão:** Preço vs Distância do Centro
   - Eixo X: Distância estimada do centro
   - Eixo Y: Preço médio
   - Linha de tendência

4. **Ranking Visual:** Bairros Mais Valorizados
   - Lista ranqueada com barras de progresso
   - Métricas: Preço/m², crescimento, volume

### Página 4: Oportunidades de Investimento
**Objetivo:** Identificar oportunidades e tendências de mercado

#### Visualizações:
1. **Gráfico de Bolhas:** Oportunidades por Bairro
   - Eixo X: Preço médio atual
   - Eixo Y: Potencial de valorização
   - Tamanho: Volume de imóveis
   - Cor: Categoria de oportunidade

2. **Waterfall Chart:** Fatores de Precificação
   - Componentes: Área base, localização, comodidades, idade
   - Mostra contribuição de cada fator no preço final

3. **Gauge Chart:** Índice de Atratividade
   - Medidor personalizado
   - Faixas: Baixa, Média, Alta atratividade

4. **Tabela de Recomendações:** Top Oportunidades
   - Filtros automáticos para imóveis abaixo da média
   - Colunas: ID, Bairro, Preço, Desconto %, ROI Estimado

## Funcionalidades Interativas

### Filtros Globais:
- **Período:** Seletor de data (últimos 6 meses, 1 ano, etc.)
- **Tipo de Transação:** Venda/Aluguel
- **Faixa de Preço:** Slider duplo
- **Localização:** Mapa interativo para seleção de região

### Drill-Through:
- Clique em qualquer bairro → Página detalhada do bairro
- Clique em tipo de imóvel → Análise específica do tipo

### Tooltips Personalizados:
- Informações detalhadas ao passar o mouse
- Imagens representativas quando disponível
- Métricas comparativas com a média

## Medidas DAX Principais

```dax
// Preço por m² médio
Preço_m2_Medio = AVERAGE(Imoveis[preco_por_m2])

// Variação percentual vs média
Variacao_vs_Media = 
DIVIDE(
    [Preço_m2_Medio] - [Preço_m2_Medio_Geral],
    [Preço_m2_Medio_Geral]
) * 100

// Índice de Atratividade
Indice_Atratividade = 
SWITCH(
    TRUE(),
    [Preço_m2_Medio] < [Preço_m2_Medio_Geral] * 0.8, "Alta",
    [Preço_m2_Medio] < [Preço_m2_Medio_Geral] * 0.9, "Média",
    "Baixa"
)

// ROI Estimado
ROI_Estimado = 
IF(
    [Tipo_Transacao] = "Aluguel",
    ([Preço_Medio] * 12) / [Valor_Mercado_Estimado],
    [Potencial_Valorizacao] * 0.1
)
```

## Paleta de Cores
- **Primária:** #1a1a2e (Azul escuro)
- **Secundária:** #3282b8 (Azul claro)
- **Accent:** #ff6b6b (Vermelho para alertas)
- **Sucesso:** #51cf66 (Verde para oportunidades)
- **Neutro:** #868e96 (Cinza para textos)

## Fontes de Dados
- **Tabela Principal:** imoveis_recife.csv
- **Tabela de Metadados:** metadata.json
- **Conexão:** Importação direta ou via Power Query

## Atualizações
- **Frequência:** Semanal
- **Método:** Refresh automático via Gateway
- **Alertas:** Configurados para variações > 5% nos preços médios

## Público-Alvo
- **Investidores Imobiliários:** Identificação de oportunidades
- **Corretores:** Análise de mercado e precificação
- **Construtoras:** Estudos de viabilidade
- **Analistas:** Relatórios executivos

## Métricas de Sucesso
- Tempo médio de sessão > 5 minutos
- Taxa de interação com filtros > 70%
- Feedback positivo dos usuários > 4.5/5
- Utilização regular por 80% dos usuários-alvo


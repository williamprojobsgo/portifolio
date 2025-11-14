-- =====================================================
-- ANÁLISE IMOBILIÁRIA - SCRIPTS SQL
-- Autor: William Jose Francelino da Silva Junior
-- Data: 2025
-- =====================================================

-- Estrutura da tabela de imóveis
CREATE TABLE IF NOT EXISTS imoveis (
    id_imovel VARCHAR(10) PRIMARY KEY,
    tipo_imovel VARCHAR(20) NOT NULL,
    tipo_transacao VARCHAR(10) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    preco DECIMAL(12,2) NOT NULL,
    area_m2 DECIMAL(8,2) NOT NULL,
    quartos INT,
    banheiros INT,
    vagas_garagem INT,
    andar INT,
    idade_anos INT,
    piscina BOOLEAN DEFAULT FALSE,
    academia BOOLEAN DEFAULT FALSE,
    churrasqueira BOOLEAN DEFAULT FALSE,
    portaria_24h BOOLEAN DEFAULT FALSE,
    elevador BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    data_cadastro DATE,
    preco_por_m2 DECIMAL(10,2)
);

-- =====================================================
-- 1. CONSULTAS BÁSICAS DE ANÁLISE
-- =====================================================

-- Estatísticas gerais do mercado
SELECT 
    COUNT(*) as total_imoveis,
    AVG(preco) as preco_medio,
    MEDIAN(preco) as preco_mediano,
    MIN(preco) as preco_minimo,
    MAX(preco) as preco_maximo,
    AVG(area_m2) as area_media,
    AVG(preco_por_m2) as preco_m2_medio
FROM imoveis;

-- Distribuição por tipo de transação
SELECT 
    tipo_transacao,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM imoveis), 2) as percentual,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio
FROM imoveis
GROUP BY tipo_transacao
ORDER BY quantidade DESC;

-- Top 10 bairros mais caros (preço por m²)
SELECT 
    bairro,
    COUNT(*) as total_imoveis,
    AVG(preco_por_m2) as preco_m2_medio,
    AVG(preco) as preco_medio,
    MIN(preco) as preco_minimo,
    MAX(preco) as preco_maximo
FROM imoveis
GROUP BY bairro
HAVING COUNT(*) >= 10  -- Apenas bairros com pelo menos 10 imóveis
ORDER BY preco_m2_medio DESC
LIMIT 10;

-- =====================================================
-- 2. ANÁLISES AVANÇADAS
-- =====================================================

-- Análise de correlação entre área e preço por tipo de imóvel
SELECT 
    tipo_imovel,
    COUNT(*) as quantidade,
    AVG(area_m2) as area_media,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio,
    CORR(area_m2, preco) as correlacao_area_preco
FROM imoveis
GROUP BY tipo_imovel
ORDER BY preco_medio DESC;

-- Impacto das comodidades no preço
WITH comodidades_impact AS (
    SELECT 
        'Piscina' as comodidade,
        AVG(CASE WHEN piscina = TRUE THEN preco END) as preco_com,
        AVG(CASE WHEN piscina = FALSE THEN preco END) as preco_sem
    FROM imoveis
    UNION ALL
    SELECT 
        'Academia' as comodidade,
        AVG(CASE WHEN academia = TRUE THEN preco END) as preco_com,
        AVG(CASE WHEN academia = FALSE THEN preco END) as preco_sem
    FROM imoveis
    UNION ALL
    SELECT 
        'Churrasqueira' as comodidade,
        AVG(CASE WHEN churrasqueira = TRUE THEN preco END) as preco_com,
        AVG(CASE WHEN churrasqueira = FALSE THEN preco END) as preco_sem
    FROM imoveis
    UNION ALL
    SELECT 
        'Portaria 24h' as comodidade,
        AVG(CASE WHEN portaria_24h = TRUE THEN preco END) as preco_com,
        AVG(CASE WHEN portaria_24h = FALSE THEN preco END) as preco_sem
    FROM imoveis
    UNION ALL
    SELECT 
        'Elevador' as comodidade,
        AVG(CASE WHEN elevador = TRUE THEN preco END) as preco_com,
        AVG(CASE WHEN elevador = FALSE THEN preco END) as preco_sem
    FROM imoveis
)
SELECT 
    comodidade,
    ROUND(preco_com, 2) as preco_com_comodidade,
    ROUND(preco_sem, 2) as preco_sem_comodidade,
    ROUND(((preco_com - preco_sem) / preco_sem) * 100, 2) as impacto_percentual
FROM comodidades_impact
ORDER BY impacto_percentual DESC;

-- Análise temporal de cadastros
SELECT 
    EXTRACT(YEAR FROM data_cadastro) as ano,
    EXTRACT(MONTH FROM data_cadastro) as mes,
    COUNT(*) as imoveis_cadastrados,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio
FROM imoveis
GROUP BY EXTRACT(YEAR FROM data_cadastro), EXTRACT(MONTH FROM data_cadastro)
ORDER BY ano, mes;

-- =====================================================
-- 3. VIEWS PARA RELATÓRIOS
-- =====================================================

-- View: Resumo por bairro
CREATE OR REPLACE VIEW vw_resumo_bairro AS
SELECT 
    bairro,
    COUNT(*) as total_imoveis,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio,
    AVG(area_m2) as area_media,
    COUNT(CASE WHEN tipo_transacao = 'Venda' THEN 1 END) as imoveis_venda,
    COUNT(CASE WHEN tipo_transacao = 'Aluguel' THEN 1 END) as imoveis_aluguel,
    -- Percentual de imóveis com comodidades
    ROUND(AVG(CASE WHEN piscina THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_piscina,
    ROUND(AVG(CASE WHEN academia THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_academia,
    ROUND(AVG(CASE WHEN portaria_24h THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_portaria
FROM imoveis
GROUP BY bairro;

-- View: Análise por faixa de preço
CREATE OR REPLACE VIEW vw_analise_faixa_preco AS
SELECT 
    CASE 
        WHEN preco <= 200000 THEN 'Até R$ 200k'
        WHEN preco <= 500000 THEN 'R$ 200k - 500k'
        WHEN preco <= 1000000 THEN 'R$ 500k - 1M'
        ELSE 'Acima R$ 1M'
    END as faixa_preco,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM imoveis), 2) as percentual,
    AVG(area_m2) as area_media,
    AVG(quartos) as quartos_medio,
    AVG(banheiros) as banheiros_medio
FROM imoveis
GROUP BY 
    CASE 
        WHEN preco <= 200000 THEN 'Até R$ 200k'
        WHEN preco <= 500000 THEN 'R$ 200k - 500k'
        WHEN preco <= 1000000 THEN 'R$ 500k - 1M'
        ELSE 'Acima R$ 1M'
    END
ORDER BY MIN(preco);

-- =====================================================
-- 4. CONSULTAS PARA INSIGHTS DE NEGÓCIO
-- =====================================================

-- Oportunidades de investimento (imóveis com preço abaixo da média do bairro)
WITH media_bairro AS (
    SELECT bairro, AVG(preco_por_m2) as preco_m2_medio_bairro
    FROM imoveis
    GROUP BY bairro
)
SELECT 
    i.id_imovel,
    i.bairro,
    i.tipo_imovel,
    i.preco,
    i.preco_por_m2,
    mb.preco_m2_medio_bairro,
    ROUND(((i.preco_por_m2 - mb.preco_m2_medio_bairro) / mb.preco_m2_medio_bairro) * 100, 2) as diferenca_percentual
FROM imoveis i
JOIN media_bairro mb ON i.bairro = mb.bairro
WHERE i.preco_por_m2 < mb.preco_m2_medio_bairro * 0.85  -- 15% abaixo da média
ORDER BY diferenca_percentual ASC
LIMIT 20;

-- Análise de competitividade por tipo de imóvel
SELECT 
    tipo_imovel,
    bairro,
    COUNT(*) as concorrencia,
    AVG(preco) as preco_medio,
    MIN(preco) as preco_minimo,
    MAX(preco) as preco_maximo,
    STDDEV(preco) as desvio_padrao_preco
FROM imoveis
WHERE tipo_transacao = 'Venda'
GROUP BY tipo_imovel, bairro
HAVING COUNT(*) >= 5  -- Apenas onde há competição
ORDER BY tipo_imovel, preco_medio DESC;

-- Tendência de preços por trimestre
SELECT 
    EXTRACT(YEAR FROM data_cadastro) as ano,
    CASE 
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 1 AND 3 THEN 'Q1'
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 4 AND 6 THEN 'Q2'
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 7 AND 9 THEN 'Q3'
        ELSE 'Q4'
    END as trimestre,
    COUNT(*) as imoveis_cadastrados,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio,
    -- Variação em relação ao trimestre anterior
    LAG(AVG(preco)) OVER (ORDER BY EXTRACT(YEAR FROM data_cadastro), 
                          CASE 
                              WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 1 AND 3 THEN 1
                              WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 4 AND 6 THEN 2
                              WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 7 AND 9 THEN 3
                              ELSE 4
                          END) as preco_trimestre_anterior
FROM imoveis
GROUP BY 
    EXTRACT(YEAR FROM data_cadastro),
    CASE 
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 1 AND 3 THEN 'Q1'
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 4 AND 6 THEN 'Q2'
        WHEN EXTRACT(MONTH FROM data_cadastro) BETWEEN 7 AND 9 THEN 'Q3'
        ELSE 'Q4'
    END
ORDER BY ano, trimestre;

-- =====================================================
-- 5. STORED PROCEDURES PARA RELATÓRIOS
-- =====================================================

-- Procedure para análise personalizada por bairro
DELIMITER //
CREATE PROCEDURE sp_analise_bairro(IN p_bairro VARCHAR(50))
BEGIN
    SELECT 
        'Estatísticas Gerais' as categoria,
        COUNT(*) as total_imoveis,
        AVG(preco) as valor_medio,
        AVG(area_m2) as area_media,
        NULL as percentual
    FROM imoveis 
    WHERE bairro = p_bairro
    
    UNION ALL
    
    SELECT 
        'Distribuição por Tipo' as categoria,
        NULL as total_imoveis,
        NULL as valor_medio,
        NULL as area_media,
        CONCAT(tipo_imovel, ': ', 
               ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM imoveis WHERE bairro = p_bairro), 1), 
               '%') as percentual
    FROM imoveis 
    WHERE bairro = p_bairro
    GROUP BY tipo_imovel;
END //
DELIMITER ;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

/*
PRINCIPAIS INSIGHTS OBTIDOS:

1. ANÁLISE DE PREÇOS:
   - Identificação de bairros mais valorizados
   - Correlação entre área e preço por tipo de imóvel
   - Impacto das comodidades na valorização

2. OPORTUNIDADES DE NEGÓCIO:
   - Imóveis com preço abaixo da média do bairro
   - Análise de competitividade por região
   - Tendências temporais de preços

3. MÉTRICAS DE PERFORMANCE:
   - Preço por m² como indicador principal
   - Distribuição por faixas de preço
   - Análise de comodidades vs valorização

4. VIEWS CRIADAS:
   - vw_resumo_bairro: Consolidação por localização
   - vw_analise_faixa_preco: Segmentação de mercado

Este conjunto de consultas SQL demonstra competências em:
- Análise exploratória de dados
- Criação de views e procedures
- Consultas complexas com CTEs e window functions
- Análise de correlações e tendências
- Geração de insights de negócio
*/


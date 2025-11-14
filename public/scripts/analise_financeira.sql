-- =====================================================
-- ANÁLISE FINANCEIRA - SCRIPTS SQL
-- Autor: William Jose Francelino da Silva Junior
-- Data: 2025
-- =====================================================

-- Estrutura das tabelas
CREATE TABLE IF NOT EXISTS clientes (
    cliente_id VARCHAR(10) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT,
    renda_mensal DECIMAL(10,2),
    score_credito INT,
    tempo_cliente_meses INT,
    regiao VARCHAR(50),
    conta_corrente BOOLEAN DEFAULT FALSE,
    poupanca BOOLEAN DEFAULT FALSE,
    cartao_credito BOOLEAN DEFAULT FALSE,
    emprestimo BOOLEAN DEFAULT FALSE,
    financiamento BOOLEAN DEFAULT FALSE,
    investimentos BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS transacoes (
    transacao_id VARCHAR(15) PRIMARY KEY,
    cliente_id VARCHAR(10),
    data_transacao DATETIME,
    tipo_transacao VARCHAR(20),
    valor DECIMAL(12,2),
    canal VARCHAR(20),
    status VARCHAR(15),
    mes INT,
    dia_semana VARCHAR(15),
    hora INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE IF NOT EXISTS investimentos (
    investimento_id VARCHAR(10) PRIMARY KEY,
    cliente_id VARCHAR(10),
    produto VARCHAR(30),
    valor_aplicado DECIMAL(12,2),
    valor_atual DECIMAL(12,2),
    rendimento DECIMAL(12,2),
    rentabilidade_perc DECIMAL(8,4),
    data_aplicacao DATE,
    dias_investido INT,
    risco VARCHAR(10),
    rentabilidade_anual DECIMAL(8,4),
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- =====================================================
-- 1. ANÁLISE DE PERFIL DE CLIENTES
-- =====================================================

-- Estatísticas gerais da base de clientes
SELECT 
    COUNT(*) as total_clientes,
    AVG(idade) as idade_media,
    AVG(renda_mensal) as renda_media,
    AVG(score_credito) as score_medio,
    AVG(tempo_cliente_meses) as tempo_medio_cliente_meses
FROM clientes;

-- Distribuição por faixa de renda
SELECT 
    CASE 
        WHEN renda_mensal <= 3000 THEN 'Até R$ 3k'
        WHEN renda_mensal <= 6000 THEN 'R$ 3k - 6k'
        WHEN renda_mensal <= 12000 THEN 'R$ 6k - 12k'
        ELSE 'Acima R$ 12k'
    END as faixa_renda,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM clientes), 2) as percentual,
    AVG(score_credito) as score_medio,
    AVG(tempo_cliente_meses) as tempo_medio_meses
FROM clientes
GROUP BY 
    CASE 
        WHEN renda_mensal <= 3000 THEN 'Até R$ 3k'
        WHEN renda_mensal <= 6000 THEN 'R$ 3k - 6k'
        WHEN renda_mensal <= 12000 THEN 'R$ 6k - 12k'
        ELSE 'Acima R$ 12k'
    END
ORDER BY MIN(renda_mensal);

-- Penetração de produtos por faixa de renda
SELECT 
    CASE 
        WHEN renda_mensal <= 3000 THEN 'Até R$ 3k'
        WHEN renda_mensal <= 6000 THEN 'R$ 3k - 6k'
        WHEN renda_mensal <= 12000 THEN 'R$ 6k - 12k'
        ELSE 'Acima R$ 12k'
    END as faixa_renda,
    COUNT(*) as total_clientes,
    ROUND(AVG(CASE WHEN conta_corrente THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_conta_corrente,
    ROUND(AVG(CASE WHEN poupanca THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_poupanca,
    ROUND(AVG(CASE WHEN cartao_credito THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_cartao,
    ROUND(AVG(CASE WHEN emprestimo THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_emprestimo,
    ROUND(AVG(CASE WHEN investimentos THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_investimentos
FROM clientes
GROUP BY 
    CASE 
        WHEN renda_mensal <= 3000 THEN 'Até R$ 3k'
        WHEN renda_mensal <= 6000 THEN 'R$ 3k - 6k'
        WHEN renda_mensal <= 12000 THEN 'R$ 6k - 12k'
        ELSE 'Acima R$ 12k'
    END
ORDER BY MIN(renda_mensal);

-- =====================================================
-- 2. ANÁLISE DE TRANSAÇÕES
-- =====================================================

-- Volume e quantidade de transações por tipo
SELECT 
    tipo_transacao,
    COUNT(*) as quantidade_transacoes,
    SUM(valor) as volume_total,
    AVG(valor) as ticket_medio,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transacoes), 2) as perc_quantidade,
    ROUND(SUM(valor) * 100.0 / (SELECT SUM(valor) FROM transacoes), 2) as perc_volume
FROM transacoes
WHERE status = 'Aprovada'
GROUP BY tipo_transacao
ORDER BY volume_total DESC;

-- Análise temporal de transações
SELECT 
    EXTRACT(YEAR FROM data_transacao) as ano,
    EXTRACT(MONTH FROM data_transacao) as mes,
    COUNT(*) as total_transacoes,
    SUM(valor) as volume_mensal,
    AVG(valor) as ticket_medio,
    COUNT(DISTINCT cliente_id) as clientes_ativos
FROM transacoes
WHERE status = 'Aprovada'
GROUP BY EXTRACT(YEAR FROM data_transacao), EXTRACT(MONTH FROM data_transacao)
ORDER BY ano, mes;

-- Análise por canal de atendimento
SELECT 
    canal,
    COUNT(*) as total_transacoes,
    SUM(valor) as volume_total,
    AVG(valor) as ticket_medio,
    ROUND(AVG(CASE WHEN status = 'Aprovada' THEN 1.0 ELSE 0.0 END) * 100, 2) as taxa_aprovacao
FROM transacoes
GROUP BY canal
ORDER BY volume_total DESC;

-- Comportamento por dia da semana e hora
SELECT 
    dia_semana,
    hora,
    COUNT(*) as total_transacoes,
    AVG(valor) as ticket_medio
FROM transacoes
WHERE status = 'Aprovada'
GROUP BY dia_semana, hora
ORDER BY total_transacoes DESC
LIMIT 20;

-- =====================================================
-- 3. ANÁLISE DE INVESTIMENTOS
-- =====================================================

-- Performance por produto de investimento
SELECT 
    produto,
    COUNT(*) as total_aplicacoes,
    SUM(valor_aplicado) as valor_total_aplicado,
    SUM(valor_atual) as patrimonio_atual,
    SUM(rendimento) as rendimento_total,
    AVG(rentabilidade_perc) as rentabilidade_media,
    AVG(dias_investido) as prazo_medio_dias
FROM investimentos
GROUP BY produto
ORDER BY rentabilidade_media DESC;

-- Análise de risco vs retorno
SELECT 
    risco,
    COUNT(*) as total_investimentos,
    SUM(valor_atual) as patrimonio_total,
    AVG(rentabilidade_perc) as rentabilidade_media,
    STDDEV(rentabilidade_perc) as volatilidade,
    MIN(rentabilidade_perc) as rentabilidade_minima,
    MAX(rentabilidade_perc) as rentabilidade_maxima
FROM investimentos
GROUP BY risco
ORDER BY rentabilidade_media DESC;

-- Top investidores por patrimônio
SELECT 
    i.cliente_id,
    c.nome,
    c.renda_mensal,
    COUNT(i.investimento_id) as total_investimentos,
    SUM(i.valor_atual) as patrimonio_total,
    AVG(i.rentabilidade_perc) as rentabilidade_media
FROM investimentos i
JOIN clientes c ON i.cliente_id = c.cliente_id
GROUP BY i.cliente_id, c.nome, c.renda_mensal
ORDER BY patrimonio_total DESC
LIMIT 20;

-- =====================================================
-- 4. ANÁLISE DE RISCO DE CRÉDITO
-- =====================================================

-- Distribuição de score de crédito
SELECT 
    CASE 
        WHEN score_credito < 500 THEN 'Baixo (<500)'
        WHEN score_credito < 600 THEN 'Regular (500-599)'
        WHEN score_credito < 700 THEN 'Bom (600-699)'
        WHEN score_credito < 800 THEN 'Muito Bom (700-799)'
        ELSE 'Excelente (800+)'
    END as categoria_score,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM clientes), 2) as percentual,
    AVG(renda_mensal) as renda_media,
    ROUND(AVG(CASE WHEN emprestimo THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_emprestimo
FROM clientes
GROUP BY 
    CASE 
        WHEN score_credito < 500 THEN 'Baixo (<500)'
        WHEN score_credito < 600 THEN 'Regular (500-599)'
        WHEN score_credito < 700 THEN 'Bom (600-699)'
        WHEN score_credito < 800 THEN 'Muito Bom (700-799)'
        ELSE 'Excelente (800+)'
    END
ORDER BY MIN(score_credito);

-- Análise de inadimplência por região
SELECT 
    regiao,
    COUNT(*) as total_clientes,
    AVG(score_credito) as score_medio,
    AVG(renda_mensal) as renda_media,
    ROUND(AVG(CASE WHEN emprestimo THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_emprestimo,
    ROUND(AVG(CASE WHEN score_credito < 600 THEN 1.0 ELSE 0.0 END) * 100, 1) as perc_alto_risco
FROM clientes
GROUP BY regiao
ORDER BY score_medio DESC;

-- =====================================================
-- 5. VIEWS PARA DASHBOARDS
-- =====================================================

-- View: KPIs principais
CREATE OR REPLACE VIEW vw_kpis_principais AS
SELECT 
    (SELECT COUNT(*) FROM clientes) as total_clientes,
    (SELECT AVG(renda_mensal) FROM clientes) as renda_media_clientes,
    (SELECT AVG(score_credito) FROM clientes) as score_medio,
    (SELECT COUNT(*) FROM transacoes WHERE status = 'Aprovada') as total_transacoes,
    (SELECT SUM(valor) FROM transacoes WHERE status = 'Aprovada') as volume_transacoes,
    (SELECT AVG(valor) FROM transacoes WHERE status = 'Aprovada') as ticket_medio,
    (SELECT COUNT(DISTINCT cliente_id) FROM investimentos) as total_investidores,
    (SELECT SUM(valor_atual) FROM investimentos) as patrimonio_total,
    (SELECT AVG(rentabilidade_perc) FROM investimentos) as rentabilidade_media;

-- View: Perfil completo do cliente
CREATE OR REPLACE VIEW vw_perfil_cliente AS
SELECT 
    c.cliente_id,
    c.nome,
    c.idade,
    c.renda_mensal,
    c.score_credito,
    c.regiao,
    -- Produtos contratados
    CASE WHEN c.conta_corrente THEN 'Sim' ELSE 'Não' END as conta_corrente,
    CASE WHEN c.cartao_credito THEN 'Sim' ELSE 'Não' END as cartao_credito,
    CASE WHEN c.investimentos THEN 'Sim' ELSE 'Não' END as investimentos,
    -- Atividade transacional
    COALESCE(t.total_transacoes, 0) as total_transacoes,
    COALESCE(t.volume_transacoes, 0) as volume_transacoes,
    -- Investimentos
    COALESCE(i.patrimonio_investido, 0) as patrimonio_investido,
    COALESCE(i.rentabilidade_media, 0) as rentabilidade_media
FROM clientes c
LEFT JOIN (
    SELECT 
        cliente_id,
        COUNT(*) as total_transacoes,
        SUM(valor) as volume_transacoes
    FROM transacoes 
    WHERE status = 'Aprovada'
    GROUP BY cliente_id
) t ON c.cliente_id = t.cliente_id
LEFT JOIN (
    SELECT 
        cliente_id,
        SUM(valor_atual) as patrimonio_investido,
        AVG(rentabilidade_perc) as rentabilidade_media
    FROM investimentos
    GROUP BY cliente_id
) i ON c.cliente_id = i.cliente_id;

-- View: Análise de rentabilidade por cliente
CREATE OR REPLACE VIEW vw_rentabilidade_cliente AS
SELECT 
    c.cliente_id,
    c.nome,
    c.renda_mensal,
    c.tempo_cliente_meses,
    -- Receitas estimadas
    COALESCE(t.volume_transacoes * 0.02, 0) as receita_transacoes, -- 2% do volume
    COALESCE(i.patrimonio_investido * 0.015, 0) as receita_investimentos, -- 1.5% do patrimônio
    -- Rentabilidade total
    COALESCE(t.volume_transacoes * 0.02, 0) + COALESCE(i.patrimonio_investido * 0.015, 0) as receita_total,
    -- Classificação do cliente
    CASE 
        WHEN COALESCE(t.volume_transacoes * 0.02, 0) + COALESCE(i.patrimonio_investido * 0.015, 0) > 1000 THEN 'Premium'
        WHEN COALESCE(t.volume_transacoes * 0.02, 0) + COALESCE(i.patrimonio_investido * 0.015, 0) > 500 THEN 'Gold'
        WHEN COALESCE(t.volume_transacoes * 0.02, 0) + COALESCE(i.patrimonio_investido * 0.015, 0) > 100 THEN 'Silver'
        ELSE 'Bronze'
    END as categoria_cliente
FROM clientes c
LEFT JOIN (
    SELECT cliente_id, SUM(valor) as volume_transacoes
    FROM transacoes WHERE status = 'Aprovada'
    GROUP BY cliente_id
) t ON c.cliente_id = t.cliente_id
LEFT JOIN (
    SELECT cliente_id, SUM(valor_atual) as patrimonio_investido
    FROM investimentos
    GROUP BY cliente_id
) i ON c.cliente_id = i.cliente_id;

-- =====================================================
-- 6. STORED PROCEDURES PARA RELATÓRIOS
-- =====================================================

-- Procedure para análise de cliente específico
DELIMITER //
CREATE PROCEDURE sp_analise_cliente(IN p_cliente_id VARCHAR(10))
BEGIN
    -- Dados básicos do cliente
    SELECT 'Perfil do Cliente' as secao, * FROM vw_perfil_cliente WHERE cliente_id = p_cliente_id;
    
    -- Histórico de transações (últimas 10)
    SELECT 'Últimas Transações' as secao, 
           data_transacao, tipo_transacao, valor, canal, status
    FROM transacoes 
    WHERE cliente_id = p_cliente_id 
    ORDER BY data_transacao DESC 
    LIMIT 10;
    
    -- Carteira de investimentos
    SELECT 'Carteira de Investimentos' as secao,
           produto, valor_aplicado, valor_atual, rendimento, rentabilidade_perc
    FROM investimentos 
    WHERE cliente_id = p_cliente_id
    ORDER BY valor_atual DESC;
END //
DELIMITER ;

-- Procedure para relatório mensal
DELIMITER //
CREATE PROCEDURE sp_relatorio_mensal(IN p_ano INT, IN p_mes INT)
BEGIN
    -- KPIs do mês
    SELECT 
        'KPIs Mensais' as secao,
        COUNT(DISTINCT cliente_id) as clientes_ativos,
        COUNT(*) as total_transacoes,
        SUM(valor) as volume_total,
        AVG(valor) as ticket_medio
    FROM transacoes 
    WHERE EXTRACT(YEAR FROM data_transacao) = p_ano 
      AND EXTRACT(MONTH FROM data_transacao) = p_mes
      AND status = 'Aprovada';
    
    -- Top produtos de investimento do mês
    SELECT 
        'Top Investimentos' as secao,
        produto,
        COUNT(*) as novas_aplicacoes,
        SUM(valor_aplicado) as volume_aplicado
    FROM investimentos 
    WHERE EXTRACT(YEAR FROM data_aplicacao) = p_ano 
      AND EXTRACT(MONTH FROM data_aplicacao) = p_mes
    GROUP BY produto
    ORDER BY volume_aplicado DESC
    LIMIT 5;
END //
DELIMITER ;

-- =====================================================
-- 7. CONSULTAS PARA MACHINE LEARNING
-- =====================================================

-- Dataset para modelo de propensão a investir
SELECT 
    c.cliente_id,
    c.idade,
    c.renda_mensal,
    c.score_credito,
    c.tempo_cliente_meses,
    CASE WHEN c.regiao = 'Recife' THEN 1 ELSE 0 END as regiao_recife,
    CASE WHEN c.conta_corrente THEN 1 ELSE 0 END as tem_conta_corrente,
    CASE WHEN c.cartao_credito THEN 1 ELSE 0 END as tem_cartao,
    COALESCE(t.volume_transacoes, 0) as volume_transacoes,
    COALESCE(t.total_transacoes, 0) as total_transacoes,
    CASE WHEN c.investimentos THEN 1 ELSE 0 END as target_investe
FROM clientes c
LEFT JOIN (
    SELECT cliente_id, SUM(valor) as volume_transacoes, COUNT(*) as total_transacoes
    FROM transacoes WHERE status = 'Aprovada'
    GROUP BY cliente_id
) t ON c.cliente_id = t.cliente_id;

-- Dataset para análise de churn
SELECT 
    c.cliente_id,
    c.idade,
    c.renda_mensal,
    c.score_credito,
    c.tempo_cliente_meses,
    COALESCE(t.dias_ultima_transacao, 999) as dias_ultima_transacao,
    COALESCE(t.total_transacoes_90d, 0) as transacoes_90_dias,
    CASE WHEN COALESCE(t.dias_ultima_transacao, 999) > 90 THEN 1 ELSE 0 END as possivel_churn
FROM clientes c
LEFT JOIN (
    SELECT 
        cliente_id,
        DATEDIFF(CURDATE(), MAX(DATE(data_transacao))) as dias_ultima_transacao,
        SUM(CASE WHEN data_transacao >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN 1 ELSE 0 END) as total_transacoes_90d
    FROM transacoes 
    WHERE status = 'Aprovada'
    GROUP BY cliente_id
) t ON c.cliente_id = t.cliente_id;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

/*
PRINCIPAIS ANÁLISES IMPLEMENTADAS:

1. PERFIL DE CLIENTES:
   - Segmentação por renda e score de crédito
   - Penetração de produtos por segmento
   - Análise de rentabilidade por cliente

2. COMPORTAMENTO TRANSACIONAL:
   - Volume e frequência por tipo de transação
   - Análise temporal e sazonal
   - Performance por canal de atendimento

3. GESTÃO DE INVESTIMENTOS:
   - Performance por produto e classe de risco
   - Análise de rentabilidade vs volatilidade
   - Identificação de top investidores

4. RISCO DE CRÉDITO:
   - Distribuição de score por região
   - Correlação entre renda e risco
   - Modelos preditivos para inadimplência

5. VIEWS E PROCEDURES:
   - Dashboards executivos automatizados
   - Relatórios personalizados por cliente
   - KPIs consolidados para gestão

Este conjunto demonstra competências em:
- Modelagem de dados financeiros
- Análise de risco e rentabilidade
- Criação de views e procedures complexas
- Preparação de dados para ML
- Geração de insights de negócio
*/


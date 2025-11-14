-- =====================================================
-- ANÁLISE EPIDEMIOLÓGICA DE SAÚDE - SCRIPTS SQL
-- Autor: William Jose Francelino da Silva Junior
-- Data: 2025
-- =====================================================

-- Estrutura das tabelas
CREATE TABLE IF NOT EXISTS pacientes (
    paciente_id VARCHAR(10) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
    peso_kg DECIMAL(5,2),
    altura_cm DECIMAL(5,2),
    imc DECIMAL(5,2),
    pressao_sistolica INT,
    pressao_diastolica INT,
    tipo_sanguineo VARCHAR(3),
    diabetes BOOLEAN DEFAULT FALSE,
    hipertensao BOOLEAN DEFAULT FALSE,
    obesidade BOOLEAN DEFAULT FALSE,
    fumante BOOLEAN DEFAULT FALSE,
    cidade VARCHAR(50),
    data_cadastro DATE
);

CREATE TABLE IF NOT EXISTS consultas (
    consulta_id VARCHAR(15) PRIMARY KEY,
    paciente_id VARCHAR(10),
    data_consulta DATE,
    especialidade VARCHAR(30),
    diagnostico VARCHAR(100),
    custo DECIMAL(8,2),
    status VARCHAR(15),
    medicamentos_prescritos INT,
    mes INT,
    dia_semana VARCHAR(15),
    trimestre VARCHAR(2),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id)
);

CREATE TABLE IF NOT EXISTS indicadores_cidades (
    cidade VARCHAR(50) PRIMARY KEY,
    total_pacientes INT,
    idade_media DECIMAL(5,2),
    imc_medio DECIMAL(5,2),
    prevalencia_diabetes DECIMAL(5,2),
    prevalencia_hipertensao DECIMAL(5,2),
    prevalencia_obesidade DECIMAL(5,2),
    prevalencia_fumantes DECIMAL(5,2),
    total_consultas INT,
    consultas_per_capita DECIMAL(5,2),
    custo_medio_consulta DECIMAL(8,2),
    taxa_comparecimento DECIMAL(5,2)
);

-- =====================================================
-- 1. ANÁLISE DEMOGRÁFICA E EPIDEMIOLÓGICA
-- =====================================================

-- Estatísticas gerais da população
SELECT 
    COUNT(*) as total_pacientes,
    AVG(idade) as idade_media,
    AVG(imc) as imc_medio,
    AVG(pressao_sistolica) as pressao_sistolica_media,
    AVG(pressao_diastolica) as pressao_diastolica_media,
    COUNT(CASE WHEN sexo = 'M' THEN 1 END) as total_masculino,
    COUNT(CASE WHEN sexo = 'F' THEN 1 END) as total_feminino
FROM pacientes;

-- Prevalência de doenças por faixa etária
SELECT 
    CASE 
        WHEN idade < 18 THEN '0-17'
        WHEN idade < 35 THEN '18-34'
        WHEN idade < 50 THEN '35-49'
        WHEN idade < 65 THEN '50-64'
        ELSE '65+'
    END as faixa_etaria,
    COUNT(*) as total_pacientes,
    ROUND(AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100, 2) as prevalencia_diabetes,
    ROUND(AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100, 2) as prevalencia_hipertensao,
    ROUND(AVG(CASE WHEN obesidade THEN 1.0 ELSE 0.0 END) * 100, 2) as prevalencia_obesidade,
    ROUND(AVG(CASE WHEN fumante THEN 1.0 ELSE 0.0 END) * 100, 2) as prevalencia_fumantes,
    AVG(imc) as imc_medio
FROM pacientes
GROUP BY 
    CASE 
        WHEN idade < 18 THEN '0-17'
        WHEN idade < 35 THEN '18-34'
        WHEN idade < 50 THEN '35-49'
        WHEN idade < 65 THEN '50-64'
        ELSE '65+'
    END
ORDER BY MIN(idade);

-- Prevalência por sexo
SELECT 
    sexo,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 2) as percentual,
    AVG(idade) as idade_media,
    AVG(imc) as imc_medio,
    ROUND(AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_diabetes,
    ROUND(AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_hipertensao,
    ROUND(AVG(CASE WHEN obesidade THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_obesidade
FROM pacientes
GROUP BY sexo;

-- Análise de comorbidades (doenças associadas)
SELECT 
    'Diabetes + Hipertensão' as comorbidade,
    COUNT(*) as casos,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 2) as prevalencia
FROM pacientes 
WHERE diabetes = TRUE AND hipertensao = TRUE

UNION ALL

SELECT 
    'Diabetes + Obesidade' as comorbidade,
    COUNT(*) as casos,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 2) as prevalencia
FROM pacientes 
WHERE diabetes = TRUE AND obesidade = TRUE

UNION ALL

SELECT 
    'Hipertensão + Obesidade' as comorbidade,
    COUNT(*) as casos,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 2) as prevalencia
FROM pacientes 
WHERE hipertensao = TRUE AND obesidade = TRUE

UNION ALL

SELECT 
    'Tripla Comorbidade' as comorbidade,
    COUNT(*) as casos,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 2) as prevalencia
FROM pacientes 
WHERE diabetes = TRUE AND hipertensao = TRUE AND obesidade = TRUE;

-- =====================================================
-- 2. ANÁLISE DE CONSULTAS E ATENDIMENTO
-- =====================================================

-- Volume de consultas por especialidade
SELECT 
    especialidade,
    COUNT(*) as total_consultas,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM consultas), 2) as percentual,
    AVG(custo) as custo_medio,
    SUM(custo) as custo_total,
    ROUND(AVG(CASE WHEN status = 'Realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) as taxa_comparecimento
FROM consultas
GROUP BY especialidade
ORDER BY total_consultas DESC;

-- Análise temporal de consultas
SELECT 
    EXTRACT(YEAR FROM data_consulta) as ano,
    EXTRACT(MONTH FROM data_consulta) as mes,
    COUNT(*) as total_consultas,
    SUM(custo) as custo_total,
    AVG(custo) as custo_medio,
    COUNT(DISTINCT paciente_id) as pacientes_atendidos,
    ROUND(AVG(CASE WHEN status = 'Realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) as taxa_comparecimento
FROM consultas
GROUP BY EXTRACT(YEAR FROM data_consulta), EXTRACT(MONTH FROM data_consulta)
ORDER BY ano, mes;

-- Diagnósticos mais frequentes por especialidade
WITH diagnosticos_ranking AS (
    SELECT 
        especialidade,
        diagnostico,
        COUNT(*) as frequencia,
        ROW_NUMBER() OVER (PARTITION BY especialidade ORDER BY COUNT(*) DESC) as ranking
    FROM consultas
    WHERE status = 'Realizada'
    GROUP BY especialidade, diagnostico
)
SELECT 
    especialidade,
    diagnostico,
    frequencia,
    ROUND(frequencia * 100.0 / SUM(frequencia) OVER (PARTITION BY especialidade), 2) as percentual_especialidade
FROM diagnosticos_ranking
WHERE ranking <= 3
ORDER BY especialidade, ranking;

-- Análise de custos por faixa etária do paciente
SELECT 
    CASE 
        WHEN p.idade < 18 THEN '0-17'
        WHEN p.idade < 35 THEN '18-34'
        WHEN p.idade < 50 THEN '35-49'
        WHEN p.idade < 65 THEN '50-64'
        ELSE '65+'
    END as faixa_etaria,
    COUNT(c.consulta_id) as total_consultas,
    SUM(c.custo) as custo_total,
    AVG(c.custo) as custo_medio,
    AVG(c.medicamentos_prescritos) as medicamentos_medio
FROM consultas c
JOIN pacientes p ON c.paciente_id = p.paciente_id
WHERE c.status = 'Realizada'
GROUP BY 
    CASE 
        WHEN p.idade < 18 THEN '0-17'
        WHEN p.idade < 35 THEN '18-34'
        WHEN p.idade < 50 THEN '35-49'
        WHEN p.idade < 65 THEN '50-64'
        ELSE '65+'
    END
ORDER BY MIN(p.idade);

-- =====================================================
-- 3. ANÁLISE GEOGRÁFICA E REGIONAL
-- =====================================================

-- Indicadores de saúde por cidade
SELECT 
    cidade,
    COUNT(*) as total_pacientes,
    AVG(idade) as idade_media,
    AVG(imc) as imc_medio,
    ROUND(AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_diabetes,
    ROUND(AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_hipertensao,
    ROUND(AVG(CASE WHEN obesidade THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_obesidade,
    ROUND(AVG(CASE WHEN fumante THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_fumantes
FROM pacientes
GROUP BY cidade
ORDER BY prev_diabetes DESC;

-- Custo per capita por cidade
SELECT 
    p.cidade,
    COUNT(DISTINCT p.paciente_id) as total_pacientes,
    COUNT(c.consulta_id) as total_consultas,
    SUM(c.custo) as custo_total,
    ROUND(SUM(c.custo) / COUNT(DISTINCT p.paciente_id), 2) as custo_per_capita,
    ROUND(COUNT(c.consulta_id) / COUNT(DISTINCT p.paciente_id), 2) as consultas_per_capita
FROM pacientes p
LEFT JOIN consultas c ON p.paciente_id = c.paciente_id AND c.status = 'Realizada'
GROUP BY p.cidade
ORDER BY custo_per_capita DESC;

-- Ranking de cidades por indicadores de saúde
WITH ranking_cidades AS (
    SELECT 
        cidade,
        AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100 as prev_diabetes,
        AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100 as prev_hipertensao,
        AVG(imc) as imc_medio,
        ROW_NUMBER() OVER (ORDER BY AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) DESC) as rank_diabetes,
        ROW_NUMBER() OVER (ORDER BY AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) DESC) as rank_hipertensao,
        ROW_NUMBER() OVER (ORDER BY AVG(imc) DESC) as rank_imc
    FROM pacientes
    GROUP BY cidade
)
SELECT 
    cidade,
    ROUND(prev_diabetes, 2) as prev_diabetes,
    rank_diabetes,
    ROUND(prev_hipertensao, 2) as prev_hipertensao,
    rank_hipertensao,
    ROUND(imc_medio, 2) as imc_medio,
    rank_imc
FROM ranking_cidades
ORDER BY cidade;

-- =====================================================
-- 4. VIEWS PARA DASHBOARDS DE SAÚDE PÚBLICA
-- =====================================================

-- View: Indicadores epidemiológicos principais
CREATE OR REPLACE VIEW vw_indicadores_epidemiologicos AS
SELECT 
    (SELECT COUNT(*) FROM pacientes) as total_populacao,
    (SELECT AVG(idade) FROM pacientes) as idade_media,
    (SELECT AVG(imc) FROM pacientes) as imc_medio,
    (SELECT ROUND(AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100, 2) FROM pacientes) as prevalencia_diabetes,
    (SELECT ROUND(AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100, 2) FROM pacientes) as prevalencia_hipertensao,
    (SELECT ROUND(AVG(CASE WHEN obesidade THEN 1.0 ELSE 0.0 END) * 100, 2) FROM pacientes) as prevalencia_obesidade,
    (SELECT ROUND(AVG(CASE WHEN fumante THEN 1.0 ELSE 0.0 END) * 100, 2) FROM pacientes) as prevalencia_fumantes,
    (SELECT COUNT(*) FROM consultas WHERE status = 'Realizada') as total_consultas_realizadas,
    (SELECT AVG(custo) FROM consultas WHERE status = 'Realizada') as custo_medio_consulta,
    (SELECT ROUND(AVG(CASE WHEN status = 'Realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) FROM consultas) as taxa_comparecimento;

-- View: Perfil completo do paciente
CREATE OR REPLACE VIEW vw_perfil_paciente AS
SELECT 
    p.paciente_id,
    p.nome,
    p.idade,
    p.sexo,
    p.imc,
    CASE 
        WHEN p.imc < 18.5 THEN 'Abaixo do peso'
        WHEN p.imc < 25 THEN 'Peso normal'
        WHEN p.imc < 30 THEN 'Sobrepeso'
        ELSE 'Obesidade'
    END as categoria_imc,
    p.pressao_sistolica,
    p.pressao_diastolica,
    p.diabetes,
    p.hipertensao,
    p.obesidade,
    p.fumante,
    p.cidade,
    -- Histórico de consultas
    COALESCE(c.total_consultas, 0) as total_consultas,
    COALESCE(c.custo_total, 0) as custo_total_consultas,
    COALESCE(c.ultima_consulta, NULL) as data_ultima_consulta,
    -- Classificação de risco
    CASE 
        WHEN (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) >= 3 THEN 'Alto Risco'
        WHEN (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) = 2 THEN 'Médio Risco'
        WHEN (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) = 1 THEN 'Baixo Risco'
        ELSE 'Sem Fatores de Risco'
    END as classificacao_risco
FROM pacientes p
LEFT JOIN (
    SELECT 
        paciente_id,
        COUNT(*) as total_consultas,
        SUM(custo) as custo_total,
        MAX(data_consulta) as ultima_consulta
    FROM consultas 
    WHERE status = 'Realizada'
    GROUP BY paciente_id
) c ON p.paciente_id = c.paciente_id;

-- View: Análise de eficiência por especialidade
CREATE OR REPLACE VIEW vw_eficiencia_especialidade AS
SELECT 
    especialidade,
    COUNT(*) as total_consultas,
    SUM(custo) as custo_total,
    AVG(custo) as custo_medio,
    ROUND(AVG(CASE WHEN status = 'Realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) as taxa_comparecimento,
    AVG(medicamentos_prescritos) as medicamentos_medio,
    -- Eficiência: consultas realizadas por real gasto
    ROUND(SUM(CASE WHEN status = 'Realizada' THEN 1 ELSE 0 END) / SUM(custo), 4) as eficiencia_custo
FROM consultas
GROUP BY especialidade
ORDER BY eficiencia_custo DESC;

-- =====================================================
-- 5. STORED PROCEDURES PARA RELATÓRIOS
-- =====================================================

-- Procedure para relatório epidemiológico por cidade
DELIMITER //
CREATE PROCEDURE sp_relatorio_cidade(IN p_cidade VARCHAR(50))
BEGIN
    -- Indicadores gerais da cidade
    SELECT 
        'Indicadores Gerais' as secao,
        COUNT(*) as total_pacientes,
        AVG(idade) as idade_media,
        AVG(imc) as imc_medio,
        ROUND(AVG(CASE WHEN diabetes THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_diabetes,
        ROUND(AVG(CASE WHEN hipertensao THEN 1.0 ELSE 0.0 END) * 100, 2) as prev_hipertensao
    FROM pacientes 
    WHERE cidade = p_cidade;
    
    -- Consultas na cidade
    SELECT 
        'Atendimento Médico' as secao,
        COUNT(c.consulta_id) as total_consultas,
        SUM(c.custo) as custo_total,
        AVG(c.custo) as custo_medio,
        ROUND(AVG(CASE WHEN c.status = 'Realizada' THEN 1.0 ELSE 0.0 END) * 100, 2) as taxa_comparecimento
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.paciente_id
    WHERE p.cidade = p_cidade;
    
    -- Top especialidades na cidade
    SELECT 
        'Top Especialidades' as secao,
        c.especialidade,
        COUNT(*) as total_consultas,
        AVG(c.custo) as custo_medio
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.paciente_id
    WHERE p.cidade = p_cidade AND c.status = 'Realizada'
    GROUP BY c.especialidade
    ORDER BY total_consultas DESC
    LIMIT 5;
END //
DELIMITER ;

-- Procedure para análise de paciente de alto risco
DELIMITER //
CREATE PROCEDURE sp_pacientes_alto_risco()
BEGIN
    SELECT 
        p.paciente_id,
        p.nome,
        p.idade,
        p.cidade,
        p.diabetes,
        p.hipertensao,
        p.obesidade,
        p.fumante,
        (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) as fatores_risco,
        COALESCE(c.total_consultas, 0) as total_consultas,
        COALESCE(c.custo_total, 0) as custo_total
    FROM pacientes p
    LEFT JOIN (
        SELECT paciente_id, COUNT(*) as total_consultas, SUM(custo) as custo_total
        FROM consultas WHERE status = 'Realizada'
        GROUP BY paciente_id
    ) c ON p.paciente_id = c.paciente_id
    WHERE (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) >= 2
    ORDER BY (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) DESC, p.idade DESC;
END //
DELIMITER ;

-- =====================================================
-- 6. CONSULTAS PARA ANÁLISE PREDITIVA
-- =====================================================

-- Dataset para modelo de predição de diabetes
SELECT 
    paciente_id,
    idade,
    CASE WHEN sexo = 'M' THEN 1 ELSE 0 END as sexo_masculino,
    imc,
    pressao_sistolica,
    pressao_diastolica,
    CASE WHEN hipertensao THEN 1 ELSE 0 END as tem_hipertensao,
    CASE WHEN obesidade THEN 1 ELSE 0 END as tem_obesidade,
    CASE WHEN fumante THEN 1 ELSE 0 END as eh_fumante,
    CASE WHEN diabetes THEN 1 ELSE 0 END as target_diabetes
FROM pacientes;

-- Dataset para análise de custos de saúde
SELECT 
    p.paciente_id,
    p.idade,
    p.sexo,
    p.imc,
    (p.diabetes::int + p.hipertensao::int + p.obesidade::int + p.fumante::int) as fatores_risco,
    COALESCE(c.total_consultas, 0) as total_consultas,
    COALESCE(c.custo_total, 0) as custo_total_anual,
    CASE 
        WHEN COALESCE(c.custo_total, 0) > 2000 THEN 'Alto Custo'
        WHEN COALESCE(c.custo_total, 0) > 1000 THEN 'Médio Custo'
        ELSE 'Baixo Custo'
    END as categoria_custo
FROM pacientes p
LEFT JOIN (
    SELECT 
        paciente_id, 
        COUNT(*) as total_consultas, 
        SUM(custo) as custo_total
    FROM consultas 
    WHERE status = 'Realizada' 
      AND data_consulta >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    GROUP BY paciente_id
) c ON p.paciente_id = c.paciente_id;

-- =====================================================
-- 7. INDICADORES DE QUALIDADE ASSISTENCIAL
-- =====================================================

-- Taxa de readmissão por especialidade (consultas repetidas em 30 dias)
WITH readmissoes AS (
    SELECT 
        c1.paciente_id,
        c1.especialidade,
        c1.data_consulta,
        COUNT(c2.consulta_id) as consultas_30_dias
    FROM consultas c1
    LEFT JOIN consultas c2 ON c1.paciente_id = c2.paciente_id 
                           AND c1.especialidade = c2.especialidade
                           AND c2.data_consulta BETWEEN c1.data_consulta AND DATE_ADD(c1.data_consulta, INTERVAL 30 DAY)
                           AND c2.consulta_id != c1.consulta_id
    WHERE c1.status = 'Realizada'
    GROUP BY c1.paciente_id, c1.especialidade, c1.data_consulta
)
SELECT 
    especialidade,
    COUNT(*) as total_consultas,
    SUM(CASE WHEN consultas_30_dias > 0 THEN 1 ELSE 0 END) as readmissoes,
    ROUND(SUM(CASE WHEN consultas_30_dias > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as taxa_readmissao
FROM readmissoes
GROUP BY especialidade
ORDER BY taxa_readmissao DESC;

-- Tempo médio entre consultas por paciente crônico
SELECT 
    p.paciente_id,
    p.nome,
    p.diabetes,
    p.hipertensao,
    COUNT(c.consulta_id) as total_consultas,
    DATEDIFF(MAX(c.data_consulta), MIN(c.data_consulta)) as periodo_dias,
    CASE 
        WHEN COUNT(c.consulta_id) > 1 THEN 
            ROUND(DATEDIFF(MAX(c.data_consulta), MIN(c.data_consulta)) / (COUNT(c.consulta_id) - 1), 1)
        ELSE NULL 
    END as intervalo_medio_dias
FROM pacientes p
JOIN consultas c ON p.paciente_id = c.paciente_id
WHERE (p.diabetes = TRUE OR p.hipertensao = TRUE) AND c.status = 'Realizada'
GROUP BY p.paciente_id, p.nome, p.diabetes, p.hipertensao
HAVING COUNT(c.consulta_id) >= 2
ORDER BY intervalo_medio_dias;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

/*
PRINCIPAIS ANÁLISES IMPLEMENTADAS:

1. EPIDEMIOLOGIA:
   - Prevalência de doenças por faixa etária e sexo
   - Análise de comorbidades e fatores de risco
   - Indicadores de saúde pública por região

2. GESTÃO ASSISTENCIAL:
   - Volume e custos por especialidade
   - Taxa de comparecimento e eficiência
   - Análise temporal de demanda

3. ANÁLISE GEOGRÁFICA:
   - Indicadores de saúde por cidade
   - Custo per capita regional
   - Ranking de cidades por indicadores

4. QUALIDADE ASSISTENCIAL:
   - Taxa de readmissão por especialidade
   - Tempo entre consultas para crônicos
   - Eficiência custo-benefício

5. VIEWS E PROCEDURES:
   - Dashboards epidemiológicos automatizados
   - Relatórios por cidade e especialidade
   - Identificação de pacientes de alto risco

Este conjunto demonstra competências em:
- Análise epidemiológica e de saúde pública
- Gestão de custos em saúde
- Indicadores de qualidade assistencial
- Análise geográfica e regional
- Preparação de dados para modelos preditivos
- Criação de views e procedures para relatórios
*/


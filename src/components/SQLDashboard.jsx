import React, { useState, useEffect } from 'react';
import DashboardChart from './DashboardChart.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  X, 
  Database, 
  Play,
  Save,
  Download,
  Copy,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Table,
  Zap,
  FileText,
  Search,
  Filter
} from 'lucide-react'

const SQLDashboard = ({ isOpen, onClose, projectData }) => {
  const [activeTab, setActiveTab] = useState('queries')
  const [selectedQuery, setSelectedQuery] = useState(0)
  const [executionResults, setExecutionResults] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [queryHistory, setQueryHistory] = useState([])

  if (!isOpen || !projectData) return null

  const getSQLData = () => {
    switch (projectData.id) {
      case 'imobiliario':
        return {
          title: 'Análise Imobiliária - SQL Server',
          database: 'DB_Imoveis_Recife',
          tables: ['imoveis', 'bairros', 'transacoes', 'comodidades'],
          queries: [
            {
              id: 1,
              name: 'Top 10 Bairros por Preço/m²',
              category: 'Análise de Mercado',
              sql: `-- Top 10 bairros com maior preço por m²
SELECT 
    bairro,
    COUNT(*) as total_imoveis,
    AVG(preco) as preco_medio,
    AVG(preco_por_m2) as preco_m2_medio,
    MIN(preco_por_m2) as preco_m2_min,
    MAX(preco_por_m2) as preco_m2_max
FROM imoveis 
WHERE preco_por_m2 IS NOT NULL
GROUP BY bairro
HAVING COUNT(*) >= 10
ORDER BY preco_m2_medio DESC
LIMIT 10;`,
              results: [
                ['Boa Viagem', '156', 'R$ 485.230', 'R$ 4.892', 'R$ 3.200', 'R$ 6.800'],
                ['Casa Forte', '89', 'R$ 425.180', 'R$ 4.654', 'R$ 3.100', 'R$ 6.200'],
                ['Espinheiro', '67', 'R$ 365.450', 'R$ 4.423', 'R$ 2.900', 'R$ 5.900'],
                ['Graças', '78', 'R$ 412.890', 'R$ 4.234', 'R$ 2.800', 'R$ 5.700'],
                ['Aflitos', '45', 'R$ 398.760', 'R$ 4.187', 'R$ 2.700', 'R$ 5.600']
              ],
              columns: ['Bairro', 'Total Imóveis', 'Preço Médio', 'Preço/m² Médio', 'Preço/m² Min', 'Preço/m² Max'],
              executionTime: '0.045s',
              rowsAffected: 5
            },
            {
              id: 2,
              name: 'Impacto das Comodidades no Preço',
              category: 'Análise de Valor',
              sql: `-- Análise do impacto das comodidades no preço
WITH comodidades_stats AS (
    SELECT 
        CASE 
            WHEN piscina = 1 THEN 'Com Piscina'
            ELSE 'Sem Piscina'
        END as tem_piscina,
        CASE 
            WHEN academia = 1 THEN 'Com Academia'
            ELSE 'Sem Academia'
        END as tem_academia,
        AVG(preco) as preco_medio,
        COUNT(*) as quantidade
    FROM imoveis
    GROUP BY piscina, academia
)
SELECT 
    tem_piscina,
    tem_academia,
    ROUND(preco_medio, 2) as preco_medio,
    quantidade,
    ROUND((preco_medio / (SELECT AVG(preco) FROM imoveis) - 1) * 100, 2) as variacao_percentual
FROM comodidades_stats
ORDER BY preco_medio DESC;`,
              results: [
                ['Com Piscina', 'Com Academia', 'R$ 567.890', '89', '+15.2%'],
                ['Com Piscina', 'Sem Academia', 'R$ 445.670', '134', '+8.7%'],
                ['Sem Piscina', 'Com Academia', 'R$ 398.230', '178', '+2.1%'],
                ['Sem Piscina', 'Sem Academia', 'R$ 312.450', '599', '-12.3%']
              ],
              columns: ['Piscina', 'Academia', 'Preço Médio', 'Quantidade', 'Variação %'],
              executionTime: '0.067s',
              rowsAffected: 4
            },
            {
              id: 3,
              name: 'Evolução Temporal dos Preços',
              category: 'Tendências',
              sql: `-- Evolução dos preços por mês
SELECT 
    DATE_FORMAT(data_cadastro, '%Y-%m') as mes_ano,
    COUNT(*) as imoveis_cadastrados,
    AVG(preco) as preco_medio_mes,
    AVG(preco_por_m2) as preco_m2_medio_mes,
    LAG(AVG(preco)) OVER (ORDER BY DATE_FORMAT(data_cadastro, '%Y-%m')) as preco_mes_anterior,
    ROUND(
        (AVG(preco) / LAG(AVG(preco)) OVER (ORDER BY DATE_FORMAT(data_cadastro, '%Y-%m')) - 1) * 100, 2
    ) as variacao_mensal_pct
FROM imoveis 
WHERE data_cadastro >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(data_cadastro, '%Y-%m')
ORDER BY mes_ano DESC;`,
              results: [
                ['2025-01', '87', 'R$ 325.670', 'R$ 2.234', 'R$ 318.450', '+2.3%'],
                ['2024-12', '92', 'R$ 318.450', 'R$ 2.198', 'R$ 315.890', '+0.8%'],
                ['2024-11', '78', 'R$ 315.890', 'R$ 2.187', 'R$ 312.340', '+1.1%'],
                ['2024-10', '89', 'R$ 312.340', 'R$ 2.156', 'R$ 309.120', '+1.0%'],
                ['2024-09', '95', 'R$ 309.120', 'R$ 2.143', 'R$ 305.670', '+1.1%']
              ],
              columns: ['Mês/Ano', 'Imóveis', 'Preço Médio', 'Preço/m² Médio', 'Preço Anterior', 'Variação %'],
              executionTime: '0.089s',
              rowsAffected: 5
            }
          ]
        }
      case 'financeiro':
        return {
          title: 'Gestão Financeira - MySQL',
          database: 'DB_Portfolio_Financeiro',
          tables: ['clientes', 'investimentos', 'transacoes', 'produtos'],
          queries: [
            {
              id: 1,
              name: 'Performance por Segmento',
              category: 'Análise de Performance',
              sql: `-- Performance de investimentos por segmento de cliente
SELECT 
    c.segmento,
    COUNT(DISTINCT c.id_cliente) as total_clientes,
    SUM(i.valor_investido) as patrimonio_total,
    AVG(i.rentabilidade_pct) as rentabilidade_media,
    AVG(c.score_credito) as score_medio,
    COUNT(t.id_transacao) as total_transacoes
FROM clientes c
INNER JOIN investimentos i ON c.id_cliente = i.id_cliente
LEFT JOIN transacoes t ON c.id_cliente = t.id_cliente
WHERE i.status = 'ATIVO'
GROUP BY c.segmento
ORDER BY patrimonio_total DESC;`,
              results: [
                ['Premium', '87', 'R$ 2.847.650', '9.8%', '798', '1.245'],
                ['Gold', '245', 'R$ 1.923.480', '7.9%', '751', '2.890'],
                ['Silver', '168', 'R$ 634.230', '6.2%', '689', '1.567']
              ],
              columns: ['Segmento', 'Clientes', 'Patrimônio Total', 'Rentab. Média', 'Score Médio', 'Transações'],
              executionTime: '0.034s',
              rowsAffected: 3
            },
            {
              id: 2,
              name: 'Análise de Risco de Crédito',
              category: 'Gestão de Risco',
              sql: `-- Análise de risco por faixa de score
WITH faixas_score AS (
    SELECT 
        CASE 
            WHEN score_credito >= 800 THEN 'Excelente (800+)'
            WHEN score_credito >= 700 THEN 'Bom (700-799)'
            WHEN score_credito >= 600 THEN 'Regular (600-699)'
            ELSE 'Baixo (<600)'
        END as faixa_score,
        COUNT(*) as qtd_clientes,
        AVG(patrimonio) as patrimonio_medio,
        AVG(rentabilidade_pct) as rentabilidade_media,
        SUM(CASE WHEN status = 'INADIMPLENTE' THEN 1 ELSE 0 END) as inadimplentes
    FROM clientes
    GROUP BY 
        CASE 
            WHEN score_credito >= 800 THEN 'Excelente (800+)'
            WHEN score_credito >= 700 THEN 'Bom (700-799)'
            WHEN score_credito >= 600 THEN 'Regular (600-699)'
            ELSE 'Baixo (<600)'
        END
)
SELECT 
    faixa_score,
    qtd_clientes,
    ROUND(patrimonio_medio, 2) as patrimonio_medio,
    ROUND(rentabilidade_media, 2) as rentabilidade_media,
    inadimplentes,
    ROUND((inadimplentes * 100.0 / qtd_clientes), 2) as taxa_inadimplencia_pct
FROM faixas_score
ORDER BY patrimonio_medio DESC;`,
              results: [
                ['Excelente (800+)', '89', 'R$ 892.340', '10.2%', '1', '1.1%'],
                ['Bom (700-799)', '267', 'R$ 456.780', '8.1%', '8', '3.0%'],
                ['Regular (600-699)', '134', 'R$ 234.560', '6.4%', '12', '9.0%'],
                ['Baixo (<600)', '10', 'R$ 89.230', '4.2%', '3', '30.0%']
              ],
              columns: ['Faixa Score', 'Clientes', 'Patrimônio Médio', 'Rentab. Média', 'Inadimplentes', 'Taxa Inadimp. %'],
              executionTime: '0.056s',
              rowsAffected: 4
            }
          ]
        }
      case 'saude':
        return {
          title: 'Saúde Pública - PostgreSQL',
          database: 'DB_Saude_Publica',
          tables: ['pacientes', 'consultas', 'especialidades', 'cidades'],
          queries: [
            {
              id: 1,
              name: 'Indicadores por Cidade',
              category: 'Epidemiologia',
              sql: `-- Indicadores epidemiológicos por cidade
SELECT 
    c.nome_cidade,
    COUNT(DISTINCT p.id_paciente) as total_pacientes,
    COUNT(co.id_consulta) as total_consultas,
    AVG(co.custo_consulta) as custo_medio,
    COUNT(CASE WHEN co.status = 'REALIZADA' THEN 1 END) as consultas_realizadas,
    ROUND(
        COUNT(CASE WHEN co.status = 'REALIZADA' THEN 1 END) * 100.0 / COUNT(co.id_consulta), 2
    ) as taxa_comparecimento_pct,
    e.nome_especialidade as especialidade_mais_demandada
FROM cidades c
INNER JOIN pacientes p ON c.id_cidade = p.id_cidade
INNER JOIN consultas co ON p.id_paciente = co.id_paciente
INNER JOIN especialidades e ON co.id_especialidade = e.id_especialidade
WHERE co.data_consulta >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY c.nome_cidade, e.nome_especialidade
HAVING COUNT(co.id_consulta) = (
    SELECT MAX(consultas_por_esp) 
    FROM (
        SELECT COUNT(*) as consultas_por_esp
        FROM consultas co2 
        WHERE co2.id_paciente IN (
            SELECT id_paciente FROM pacientes WHERE id_cidade = c.id_cidade
        )
        GROUP BY co2.id_especialidade
    ) sub
)
ORDER BY total_pacientes DESC;`,
              results: [
                ['Recife', '412', '1.234', 'R$ 245', '1.076', '87.2%', 'Cardiologia'],
                ['Olinda', '178', '534', 'R$ 230', '451', '84.5%', 'Ginecologia'],
                ['Jaboatão', '156', '468', 'R$ 255', '384', '82.1%', 'Geriatria'],
                ['Caruaru', '134', '402', 'R$ 268', '359', '89.3%', 'Neurologia'],
                ['Petrolina', '120', '360', 'R$ 252', '308', '85.7%', 'Pediatria']
              ],
              columns: ['Cidade', 'Pacientes', 'Consultas', 'Custo Médio', 'Realizadas', 'Taxa Comparec. %', 'Especialidade Top'],
              executionTime: '0.078s',
              rowsAffected: 5
            },
            {
              id: 2,
              name: 'Análise de Custos Assistenciais',
              category: 'Gestão de Custos',
              sql: `-- Análise de custos por faixa etária e especialidade
WITH custos_por_faixa AS (
    SELECT 
        CASE 
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 18 THEN 'Infantil (0-17)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 30 THEN 'Jovem (18-29)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 50 THEN 'Adulto (30-49)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 65 THEN 'Meia-idade (50-64)'
            ELSE 'Idoso (65+)'
        END as faixa_etaria,
        e.nome_especialidade,
        COUNT(*) as total_consultas,
        AVG(co.custo_consulta) as custo_medio,
        SUM(co.custo_consulta) as custo_total,
        COUNT(CASE WHEN co.status = 'FALTOU' THEN 1 END) as faltas
    FROM pacientes p
    INNER JOIN consultas co ON p.id_paciente = co.id_paciente
    INNER JOIN especialidades e ON co.id_especialidade = e.id_especialidade
    GROUP BY 
        CASE 
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 18 THEN 'Infantil (0-17)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 30 THEN 'Jovem (18-29)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 50 THEN 'Adulto (30-49)'
            WHEN EXTRACT(YEAR FROM AGE(p.data_nascimento)) < 65 THEN 'Meia-idade (50-64)'
            ELSE 'Idoso (65+)'
        END,
        e.nome_especialidade
)
SELECT 
    faixa_etaria,
    nome_especialidade,
    total_consultas,
    ROUND(custo_medio, 2) as custo_medio,
    ROUND(custo_total, 2) as custo_total,
    faltas,
    ROUND((faltas * 100.0 / total_consultas), 2) as taxa_falta_pct
FROM custos_por_faixa
WHERE total_consultas >= 20
ORDER BY custo_total DESC
LIMIT 10;`,
              results: [
                ['Idoso (65+)', 'Cardiologia', '234', 'R$ 320', 'R$ 74.880', '28', '12.0%'],
                ['Meia-idade (50-64)', 'Cardiologia', '189', 'R$ 315', 'R$ 59.535', '19', '10.1%'],
                ['Adulto (30-49)', 'Ginecologia', '167', 'R$ 280', 'R$ 46.760', '15', '9.0%'],
                ['Idoso (65+)', 'Geriatria', '145', 'R$ 295', 'R$ 42.775', '22', '15.2%'],
                ['Jovem (18-29)', 'Dermatologia', '156', 'R$ 220', 'R$ 34.320', '12', '7.7%']
              ],
              columns: ['Faixa Etária', 'Especialidade', 'Consultas', 'Custo Médio', 'Custo Total', 'Faltas', 'Taxa Falta %'],
              executionTime: '0.092s',
              rowsAffected: 5
            }
          ]
        }
      default:
        return null
    }
  }

  const sqlData = getSQLData()

  const executeQuery = (queryIndex) => {
    setIsExecuting(true)
    setSelectedQuery(queryIndex)
    
    // Simular execução
    setTimeout(() => {
      const query = sqlData.queries[queryIndex]
      setExecutionResults({
        columns: query.columns,
        rows: query.results,
        executionTime: query.executionTime,
        rowsAffected: query.rowsAffected,
        timestamp: new Date().toLocaleString('pt-BR')
      })
      
      // Adicionar ao histórico
      setQueryHistory(prev => [{
        id: Date.now(),
        name: query.name,
        executionTime: query.executionTime,
        rowsAffected: query.rowsAffected,
        timestamp: new Date().toLocaleString('pt-BR'),
        status: 'success'
      }, ...prev.slice(0, 9)]) // Manter apenas 10 últimas
      
      setIsExecuting(false)
    }, 1500)
  }

  const copyQuery = () => {
    const query = sqlData.queries[selectedQuery]
    navigator.clipboard.writeText(query.sql)
    alert('Query copiada para a área de transferência!')
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* SQL Header */}
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-bold text-white">SQL Dashboard</span>
            </div>
            <div className="text-white font-medium">{sqlData.title}</div>
            <Badge variant="secondary" className="bg-blue-800 text-blue-100">
              {sqlData.database}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button 
              onClick={onClose}
              size="sm" 
              variant="outline" 
              className="bg-white border-gray-300 text-black hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* SQL Navigation */}
        <div className="bg-slate-800 px-6 py-2 border-b border-slate-700">
          <div className="flex space-x-6">
            {[
              { id: 'queries', label: 'Consultas SQL', icon: <Database className="w-4 h-4" /> },
              { id: 'results', label: 'Resultados', icon: <Table className="w-4 h-4" /> },
              { id: 'history', label: 'Histórico', icon: <Clock className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 border-t-2 border-blue-400 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'queries' && (
            <>
              {/* Query List */}
              <div className="w-1/3 bg-slate-800 border-r border-slate-700 overflow-auto">
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Consultas Disponíveis
                  </h3>
                  <div className="space-y-2">
                    {sqlData.queries.map((query, index) => (
                      <div
                        key={query.id}
                        onClick={() => setSelectedQuery(index)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedQuery === index 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="font-medium text-sm">{query.name}</div>
                        <div className="text-xs opacity-75 mt-1">{query.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Query Editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">
                      {sqlData.queries[selectedQuery]?.name}
                    </span>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                      {sqlData.queries[selectedQuery]?.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={copyQuery}
                      size="sm"
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      onClick={() => executeQuery(selectedQuery)}
                      disabled={isExecuting}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isExecuting ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3 mr-1" />
                      )}
                      {isExecuting ? 'Executando...' : 'Executar'}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-900 p-4">
                  <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    <code>{sqlData.queries[selectedQuery]?.sql}</code>
                  </pre>
                </div>
              </div>
            </>
          )}

          {activeTab === 'results' && (
            <div className="flex-1 p-6 overflow-auto">
              {executionResults ? (
                <div className="space-y-4">
                  {/* Execution Info */}
                  <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Consulta executada com sucesso</span>
                      </div>
                      <div className="text-slate-400 text-sm">
                        Tempo: {executionResults.executionTime}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Linhas: {executionResults.rowsAffected}
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {executionResults.timestamp}
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700">
                          <tr>
                            {executionResults.columns.map((column, index) => (
                              <th key={index} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {executionResults.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-700/50">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-sm text-slate-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <div>Execute uma consulta para ver os resultados</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Histórico de Execuções
                </h3>
                {queryHistory.length > 0 ? (
                  <div className="space-y-2">
                    {queryHistory.map((item) => (
                      <div key={item.id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <div>
                              <div className="text-white font-medium">{item.name}</div>
                              <div className="text-slate-400 text-sm">
                                {item.rowsAffected} linhas • {item.executionTime}
                              </div>
                            </div>
                          </div>
                          <div className="text-slate-400 text-sm">
                            {item.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <div>Nenhuma consulta executada ainda</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 px-6 py-3 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Conectado: {sqlData.database}</span>
              <span>Tabelas: {sqlData.tables.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-900 text-green-300">
                <Zap className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <span>Desenvolvido por William Jose</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SQLDashboard


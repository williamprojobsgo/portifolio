import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { BarChart, PieChart, LineChart, ScatterPlot, BoxPlot } from '@/components/ChartComponents.jsx'
import { 
  X, 
  Code, 
  Play,
  Save,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Activity,
  FileText,
  Table,
  Eye,
  Settings,
  Maximize2
} from 'lucide-react'

const PythonDashboard = ({ isOpen, onClose, projectData }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const [selectedChart, setSelectedChart] = useState(0)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executedCharts, setExecutedCharts] = useState(new Set())

  if (!isOpen || !projectData) return null

  const getPythonAnalysis = () => {
    switch (projectData.id) {
      case 'imobiliario':
        return {
          title: 'Análise Imobiliária - Python Data Science',
          subtitle: 'Análise Completa do Mercado Imobiliário de Recife/PE',
          dataset: 'imoveis_recife.csv',
          libraries: ['pandas', 'numpy', 'plotly', 'seaborn', 'scikit-learn'],
          kpis: [
            { label: 'Total de Imóveis', value: '1.000', change: '+5.2%', icon: <MapPin className="w-4 h-4" /> },
            { label: 'Preço Médio', value: 'R$ 317.091', change: '+2.1%', icon: <DollarSign className="w-4 h-4" /> },
            { label: 'Preço/m² Médio', value: 'R$ 2.223', change: '+1.8%', icon: <TrendingUp className="w-4 h-4" /> },
            { label: 'Bairros Analisados', value: '27', change: '0%', icon: <MapPin className="w-4 h-4" /> }
          ],
          charts: [
            {
              id: 1,
              title: 'Distribuição de Preços por Bairro',
              type: 'bar',
              description: 'Top 10 bairros com maior preço médio por m²',
              code: `# Análise de preços por bairro
import pandas as pd
import plotly.express as px

# Carregar dados
df = pd.read_csv('imoveis_recife.csv')

# Calcular preço médio por bairro
preco_bairro = df.groupby('bairro').agg({
    'preco_por_m2': 'mean',
    'preco': 'mean',
    'id_imovel': 'count'
}).round(2)

# Filtrar bairros com pelo menos 10 imóveis
preco_bairro = preco_bairro[preco_bairro['id_imovel'] >= 10]

# Top 10 bairros
top_bairros = preco_bairro.nlargest(10, 'preco_por_m2')

# Criar gráfico
fig = px.bar(
    top_bairros.reset_index(),
    x='bairro',
    y='preco_por_m2',
    title='Top 10 Bairros - Preço por m²',
    color='preco_por_m2',
    color_continuous_scale='Blues'
)

fig.show()`,
              insights: [
                'Boa Viagem lidera com R$ 4.892/m²',
                'Casa Forte em 2º lugar com R$ 4.654/m²',
                'Diferença de 87% entre o mais caro e mais barato',
                'Bairros centrais têm valorização superior'
              ],
              chartData: [
                { label: 'Boa Viagem', value: 4892 },
                { label: 'Casa Forte', value: 4654 },
                { label: 'Espinheiro', value: 4423 },
                { label: 'Graças', value: 4234 },
                { label: 'Aflitos', value: 4187 },
                { label: 'Derby', value: 3987 },
                { label: 'Recife', value: 3876 },
                { label: 'Madalena', value: 3654 }
              ]
            },
            {
              id: 2,
              title: 'Correlação Preço vs Área',
              type: 'scatter',
              description: 'Análise da relação entre área do imóvel e preço',
              code: `# Análise de correlação
import numpy as np
from scipy.stats import pearsonr

# Calcular correlação
correlation, p_value = pearsonr(df['area_m2'], df['preco'])

# Criar scatter plot
fig = px.scatter(
    df,
    x='area_m2',
    y='preco',
    color='tipo_imovel',
    size='quartos',
    hover_data=['bairro', 'preco_por_m2'],
    title=f'Correlação Preço vs Área (r={correlation:.3f})'
)

# Adicionar linha de tendência
fig.add_scatter(
    x=df['area_m2'],
    y=np.poly1d(np.polyfit(df['area_m2'], df['preco'], 1))(df['area_m2']),
    mode='lines',
    name='Tendência'
)

print(f'Correlação: {correlation:.3f}')
print(f'P-value: {p_value:.3f}')`,
              insights: [
                'Correlação positiva forte (r=0.847)',
                'Cada m² adicional valoriza ~R$ 1.850',
                'Apartamentos têm melhor custo-benefício',
                'Outliers indicam imóveis premium'
              ],
              chartData: [
                { x: 45, y: 180000 }, { x: 65, y: 280000 }, { x: 85, y: 380000 },
                { x: 95, y: 420000 }, { x: 120, y: 520000 }, { x: 140, y: 680000 },
                { x: 160, y: 750000 }, { x: 180, y: 850000 }, { x: 200, y: 950000 },
                { x: 75, y: 320000 }, { x: 110, y: 480000 }, { x: 130, y: 590000 },
                { x: 90, y: 410000 }, { x: 170, y: 780000 }, { x: 55, y: 240000 }
              ]
            },
            {
              id: 3,
              title: 'Impacto das Comodidades',
              type: 'box',
              description: 'Análise do impacto de piscina e academia no preço',
              code: `# Análise de comodidades
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Criar categorias de comodidades
df['categoria_comodidades'] = df.apply(lambda row: 
    'Completo' if row['piscina'] and row['academia'] else
    'Piscina' if row['piscina'] else
    'Academia' if row['academia'] else
    'Básico', axis=1
)

# Análise estatística
stats = df.groupby('categoria_comodidades')['preco'].agg([
    'mean', 'median', 'std', 'count'
]).round(2)

# Box plot
fig = px.box(
    df,
    x='categoria_comodidades',
    y='preco',
    title='Distribuição de Preços por Comodidades'
)

print("Estatísticas por categoria:")
print(stats)`,
              insights: [
                'Imóveis completos custam 35% mais',
                'Piscina valoriza mais que academia',
                'ROI de comodidades varia por bairro',
                'Mercado premium concentrado em 3 bairros'
              ],
              chartData: [
                { min: 180000, q1: 280000, median: 350000, q3: 450000, max: 620000 }, // Básico
                { min: 220000, q1: 320000, median: 420000, q3: 520000, max: 680000 }, // Academia
                { min: 250000, q1: 380000, median: 480000, q3: 580000, max: 750000 }, // Piscina
                { min: 320000, q1: 480000, median: 580000, q3: 720000, max: 950000 }  // Completo
              ]
            }
          ],
          dataTable: {
            headers: ['Bairro', 'Qtd Imóveis', 'Preço Médio', 'Preço/m²', 'Área Média'],
            rows: [
              ['Boa Viagem', '156', 'R$ 485.230', 'R$ 4.892', '99.2m²'],
              ['Casa Forte', '89', 'R$ 425.180', 'R$ 4.654', '91.4m²'],
              ['Espinheiro', '67', 'R$ 365.450', 'R$ 4.423', '82.6m²'],
              ['Graças', '78', 'R$ 412.890', 'R$ 4.234', '97.5m²'],
              ['Aflitos', '45', 'R$ 398.760', 'R$ 4.187', '95.3m²']
            ]
          }
        }
      case 'financeiro':
        return {
          title: 'Gestão Financeira - Python Analytics',
          subtitle: 'Análise de Performance e Risco de Portfólio',
          dataset: 'portfolio_clientes.csv',
          libraries: ['pandas', 'numpy', 'plotly', 'scipy', 'yfinance'],
          kpis: [
            { label: 'Total Clientes', value: '500', change: '+8.3%', icon: <Users className="w-4 h-4" /> },
            { label: 'Patrimônio Total', value: 'R$ 5.3M', change: '+12.5%', icon: <DollarSign className="w-4 h-4" /> },
            { label: 'Rentabilidade Média', value: '8.13%', change: '+0.8%', icon: <TrendingUp className="w-4 h-4" /> },
            { label: 'Score Médio', value: '742', change: '+15', icon: <Activity className="w-4 h-4" /> }
          ],
          charts: [
            {
              id: 1,
              title: 'Performance por Segmento',
              type: 'bar',
              description: 'Análise de rentabilidade por segmento de cliente',
              code: `# Análise de performance por segmento
import pandas as pd
import plotly.express as px

# Carregar dados
df_clientes = pd.read_csv('portfolio_clientes.csv')
df_investimentos = pd.read_csv('investimentos.csv')

# Merge dos dados
df = df_clientes.merge(df_investimentos, on='id_cliente')

# Análise por segmento
performance = df.groupby('segmento').agg({
    'patrimonio': ['sum', 'mean'],
    'rentabilidade_pct': 'mean',
    'score_credito': 'mean',
    'id_cliente': 'count'
}).round(2)

# Gráfico de barras
fig = px.bar(
    performance.reset_index(),
    x='segmento',
    y=('rentabilidade_pct', 'mean'),
    title='Rentabilidade Média por Segmento',
    color=('patrimonio', 'sum')
)

fig.show()`,
              insights: [
                'Segmento Premium: 9.8% rentabilidade',
                'Gold: 7.9% com maior volume',
                'Silver: 6.2% mas crescimento estável',
                'Concentração de 60% da receita no Premium'
              ],
              chartData: [
                { label: 'Premium', value: 9.8 },
                { label: 'Gold', value: 7.9 },
                { label: 'Silver', value: 6.2 }
              ]
            },
            {
              id: 2,
              title: 'Análise de Risco vs Retorno',
              type: 'scatter',
              description: 'Matriz de risco-retorno por cliente',
              code: `# Análise de risco vs retorno
import numpy as np
from sklearn.preprocessing import StandardScaler

# Calcular métricas de risco
df['volatilidade'] = df.groupby('id_cliente')['rentabilidade_pct'].transform('std')
df['sharpe_ratio'] = df['rentabilidade_pct'] / df['volatilidade']

# Scatter plot risco vs retorno
fig = px.scatter(
    df,
    x='volatilidade',
    y='rentabilidade_pct',
    color='segmento',
    size='patrimonio',
    hover_data=['score_credito', 'sharpe_ratio'],
    title='Matriz Risco vs Retorno'
)

# Linha de eficiência
efficient_frontier = np.polyfit(df['volatilidade'], df['rentabilidade_pct'], 2)
x_line = np.linspace(df['volatilidade'].min(), df['volatilidade'].max(), 100)
y_line = np.polyval(efficient_frontier, x_line)

fig.add_scatter(x=x_line, y=y_line, mode='lines', name='Fronteira Eficiente')`,
              insights: [
                'Clientes Premium têm melhor Sharpe ratio',
                'Diversificação reduz volatilidade em 23%',
                'Oportunidade de otimização no segmento Gold',
                'Score de crédito correlaciona com performance'
              ],
              chartData: [
                { x: 2.1, y: 9.8 }, { x: 2.3, y: 10.2 }, { x: 1.9, y: 9.5 }, // Premium
                { x: 3.2, y: 7.9 }, { x: 3.5, y: 8.1 }, { x: 2.9, y: 7.6 }, // Gold
                { x: 4.1, y: 6.2 }, { x: 4.3, y: 6.5 }, { x: 3.8, y: 5.9 }, // Silver
                { x: 2.5, y: 9.1 }, { x: 3.1, y: 8.3 }, { x: 3.7, y: 7.2 }
              ]
            }
          ],
          dataTable: {
            headers: ['Segmento', 'Clientes', 'Patrimônio Médio', 'Rentabilidade', 'Score Médio'],
            rows: [
              ['Premium', '87', 'R$ 892.340', '9.8%', '798'],
              ['Gold', '245', 'R$ 456.780', '7.9%', '751'],
              ['Silver', '168', 'R$ 234.560', '6.2%', '689']
            ]
          }
        }
      case 'saude':
        return {
          title: 'Saúde Pública - Python Epidemiologia',
          subtitle: 'Análise de Indicadores Epidemiológicos e Custos',
          dataset: 'saude_publica.csv',
          libraries: ['pandas', 'numpy', 'plotly', 'scipy', 'geopandas'],
          kpis: [
            { label: 'Total Pacientes', value: '1.000', change: '+3.1%', icon: <Users className="w-4 h-4" /> },
            { label: 'Consultas Realizadas', value: '3.000', change: '+7.2%', icon: <Activity className="w-4 h-4" /> },
            { label: 'Taxa Comparecimento', value: '85.4%', change: '+2.3%', icon: <TrendingUp className="w-4 h-4" /> },
            { label: 'Custo Médio', value: 'R$ 245', change: '-1.2%', icon: <DollarSign className="w-4 h-4" /> }
          ],
          charts: [
            {
              id: 1,
              title: 'Distribuição por Cidade',
              type: 'pie',
              description: 'Distribuição de pacientes por cidade',
              code: `# Análise epidemiológica por cidade
import pandas as pd
import plotly.express as px

# Carregar dados
df_pacientes = pd.read_csv('saude_publica.csv')
df_consultas = pd.read_csv('consultas.csv')

# Merge dos dados
df = df_pacientes.merge(df_consultas, on='id_paciente')

# Análise por cidade
cidade_stats = df.groupby('cidade').agg({
    'id_paciente': 'nunique',
    'custo_consulta': 'mean',
    'id_consulta': 'count'
}).round(2)

# Gráfico de pizza
fig = px.pie(
    cidade_stats.reset_index(),
    values='id_paciente',
    names='cidade',
    title='Distribuição de Pacientes por Cidade'
)

fig.show()`,
              insights: [
                'Recife concentra 41.2% dos pacientes',
                'Olinda: 17.8% com foco em ginecologia',
                'Interior representa 35% dos casos',
                'Necessidade de descentralização'
              ],
              chartData: [
                { label: 'Recife', value: 412 },
                { label: 'Olinda', value: 178 },
                { label: 'Jaboatão', value: 156 },
                { label: 'Caruaru', value: 134 },
                { label: 'Petrolina', value: 120 }
              ]
            },
            {
              id: 2,
              title: 'Análise de Custos por Faixa Etária',
              type: 'bar',
              description: 'Custo médio por faixa etária e especialidade',
              code: `# Análise de custos por idade
import numpy as np

# Criar faixas etárias
df['faixa_etaria'] = pd.cut(
    df['idade'],
    bins=[0, 18, 30, 50, 65, 100],
    labels=['0-17', '18-29', '30-49', '50-64', '65+']
)

# Análise de custos
custo_idade = df.groupby(['faixa_etaria', 'especialidade']).agg({
    'custo_consulta': ['mean', 'sum', 'count']
}).round(2)

# Gráfico de barras agrupadas
fig = px.bar(
    custo_idade.reset_index(),
    x='faixa_etaria',
    y=('custo_consulta', 'mean'),
    color='especialidade',
    title='Custo Médio por Faixa Etária'
)

# Análise estatística
print("Custo por faixa etária:")
print(custo_idade.groupby('faixa_etaria')[('custo_consulta', 'mean')].mean())`,
              insights: [
                'Idosos (65+) têm custo 45% maior',
                'Cardiologia é a especialidade mais cara',
                'Pediatria tem melhor custo-benefício',
                'Oportunidade de prevenção em adultos'
              ],
              chartData: [
                { label: '0-17 anos', value: 180 },
                { label: '18-29 anos', value: 220 },
                { label: '30-49 anos', value: 245 },
                { label: '50-64 anos', value: 280 },
                { label: '65+ anos', value: 320 }
              ]
            }
          ],
          dataTable: {
            headers: ['Cidade', 'Pacientes', 'Consultas', 'Custo Médio', 'Taxa Comparec.'],
            rows: [
              ['Recife', '412', '1.234', 'R$ 245', '87.2%'],
              ['Olinda', '178', '534', 'R$ 230', '84.5%'],
              ['Jaboatão', '156', '468', 'R$ 255', '82.1%'],
              ['Caruaru', '134', '402', 'R$ 268', '89.3%'],
              ['Petrolina', '120', '360', 'R$ 252', '85.7%']
            ]
          }
        }
      default:
        return null
    }
  }

  const analysisData = getPythonAnalysis()

  const executeCode = (chartIndex) => {
    setIsExecuting(true)
    setSelectedChart(chartIndex)
    
    setTimeout(() => {
      setExecutedCharts(prev => new Set([...prev, chartIndex]))
      setIsExecuting(false)
    }, 2000)
  }

  const renderChart = (chart, isExecuted = false) => {
    if (!isExecuted) {
      return (
        <div className="h-64 bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            {getChartIcon(chart.type)}
            <div className="text-gray-600 mt-2">Clique "Executar" para ver o gráfico</div>
            <div className="text-sm text-gray-500">{chart.description}</div>
          </div>
        </div>
      )
    }

    // Renderizar gráfico real baseado no tipo
    switch (chart.type) {
      case 'bar':
        return (
          <BarChart
            data={chart.chartData}
            title={chart.title}
            xLabel="Categorias"
            yLabel="Valores"
            color="#f59e0b"
          />
        )
      case 'pie':
        return (
          <PieChart
            data={chart.chartData}
            title={chart.title}
          />
        )
      case 'scatter':
        return (
          <ScatterPlot
            data={chart.chartData}
            title={chart.title}
            xLabel="Volatilidade (%)"
            yLabel="Rentabilidade (%)"
            color="#3b82f6"
          />
        )
      case 'box':
        return (
          <BoxPlot
            data={chart.chartData}
            title={chart.title}
            categories={['Básico', 'Academia', 'Piscina', 'Completo']}
          />
        )
      case 'line':
        return (
          <LineChart
            data={chart.chartData}
            title={chart.title}
            xLabel="Período"
            yLabel="Valores"
            color="#10b981"
          />
        )
      default:
        return (
          <BarChart
            data={chart.chartData}
            title={chart.title}
            xLabel="Categorias"
            yLabel="Valores"
            color="#f59e0b"
          />
        )
    }
  }

  const getChartIcon = (type) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-4 h-4" />
      case 'line': return <LineChart className="w-4 h-4" />
      case 'pie': return <PieChart className="w-4 h-4" />
      case 'scatter': return <TrendingUp className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Python Header */}
        <div className="bg-orange-500 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Code className="w-5 h-5 text-orange-500" />
              </div>
              <span className="font-bold text-white">Python Data Science</span>
            </div>
            <div className="text-white font-medium">{analysisData.title}</div>
            <Badge variant="secondary" className="bg-orange-800 text-orange-100">
              {analysisData.dataset}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-1" />
              Restart Kernel
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Save className="w-4 h-4 mr-1" />
              Save
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

        {/* Python Navigation */}
        <div className="bg-gray-100 px-6 py-2 border-b">
          <div className="flex space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'analysis', label: 'Análise Exploratória', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'data', label: 'Dados', icon: <Table className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeSection === tab.id 
                    ? 'bg-white border-t-2 border-orange-400 text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {activeSection === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Project Info */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-orange-500" />
                    <span>{analysisData.subtitle}</span>
                  </CardTitle>
                  <CardDescription>
                    Análise completa usando Python para ciência de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Bibliotecas utilizadas:</span>
                    {analysisData.libraries.map((lib, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {lib}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                {analysisData.kpis.map((kpi, index) => (
                  <Card key={index} className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-500">
                          {kpi.icon}
                        </div>
                        <div className={`text-sm font-medium ${
                          kpi.change.startsWith('+') ? 'text-green-600' : 
                          kpi.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {kpi.change}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                      <div className="text-sm text-gray-600">{kpi.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Overview */}
              <div className="grid grid-cols-3 gap-4">
                {analysisData.charts.map((chart, index) => (
                  <Card key={chart.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getChartIcon(chart.type)}
                        <span>{chart.title}</span>
                      </CardTitle>
                      <CardDescription>{chart.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          {getChartIcon(chart.type)}
                          <div className="text-sm text-gray-600 mt-2">Gráfico {chart.type}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setActiveSection('analysis')
                          setSelectedChart(index)
                        }}
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Ver Análise
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analysis' && (
            <div className="p-6 space-y-6">
              {/* Chart Selection */}
              <div className="flex space-x-2 mb-4">
                {analysisData.charts.map((chart, index) => (
                  <Button
                    key={chart.id}
                    onClick={() => setSelectedChart(index)}
                    variant={selectedChart === index ? "default" : "outline"}
                    size="sm"
                    className={selectedChart === index ? "bg-orange-500 text-white" : ""}
                  >
                    {getChartIcon(chart.type)}
                    <span className="ml-2">{chart.title}</span>
                  </Button>
                ))}
              </div>

              {/* Selected Chart Analysis */}
              <div className="grid grid-cols-2 gap-6">
                {/* Code Cell */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        Código Python
                      </CardTitle>
                      <Button
                        onClick={() => executeCode(selectedChart)}
                        disabled={isExecuting}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {isExecuting ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        {isExecuting ? 'Executando...' : 'Executar'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="p-4 text-sm font-mono bg-gray-900 text-green-400 overflow-auto max-h-96">
                      <code>{analysisData.charts[selectedChart]?.code}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Insights */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                      Insights da Análise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisData.charts[selectedChart]?.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="text-sm text-gray-700">{insight}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Visualization */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getChartIcon(analysisData.charts[selectedChart]?.type)}
                    <span className="ml-2">{analysisData.charts[selectedChart]?.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart(
                    analysisData.charts[selectedChart], 
                    executedCharts.has(selectedChart)
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="p-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Table className="w-4 h-4 mr-2" />
                    Dataset Analisado
                  </CardTitle>
                  <CardDescription>
                    Amostra dos dados utilizados na análise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          {analysisData.dataTable.headers.map((header, index) => (
                            <th key={index} className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.dataTable.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Python 3.11.0</span>
              <span>Jupyter Notebook</span>
              <span>Dataset: {analysisData.dataset}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Kernel Ready
              </Badge>
              <span>Desenvolvido por William Jose</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PythonDashboard


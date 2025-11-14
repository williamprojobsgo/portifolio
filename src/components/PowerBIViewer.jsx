import React, { useState } from 'react';
import DashboardChart from './DashboardChart.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  Share,
  RefreshCw
} from 'lucide-react'

const PowerBIViewer = ({ isOpen, onClose, projectData }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen || !projectData) return null

  const getProjectAnalysis = () => {
    switch (projectData.id) {
      case 'imobiliario':
        return {
          title: 'Dashboard Imobiliário - Recife/PE',
          kpis: [
            { label: 'Total Imóveis', value: '1.000', trend: '+5.2%' },
            { label: 'Preço Médio', value: 'R$ 317k', trend: '+2.1%' },
            { label: 'Preço/m²', value: 'R$ 2.223', trend: '+1.8%' },
            { label: 'Área Média', value: '139.8m²', trend: '-0.5%' }
          ],
          insights: [
            'Boa Viagem é o bairro com maior preço/m² (R$ 3.500)',
            'Apartamentos representam 65% do mercado',
            'Imóveis com piscina valorizam 15% mais',
            'Mercado aquecido nos últimos 6 meses'
          ],
          problems: [
            'Dados de alguns bairros periféricos limitados',
            'Falta integração com dados de financiamento'
          ],
          strengths: [
            'Análise geográfica detalhada por bairro',
            'Correlação preço vs comodidades',
            'Tendências temporais claras',
            'Segmentação por tipo de imóvel'
          ]
        }
      case 'financeiro':
        return {
          title: 'Dashboard Financeiro - Gestão de Portfólio',
          kpis: [
            { label: 'Total Clientes', value: '500', trend: '+8.3%' },
            { label: 'Patrimônio', value: 'R$ 5.3M', trend: '+12.5%' },
            { label: 'Rentabilidade', value: '8.13%', trend: '+0.8%' },
            { label: 'Score Médio', value: '742', trend: '+15' }
          ],
          insights: [
            'Clientes Premium geram 60% da receita',
            'Investimentos em renda fixa dominam (70%)',
            'Score de crédito médio melhorou 15 pontos',
            'Taxa de inadimplência em 2.1%'
          ],
          problems: [
            'Concentração em poucos produtos',
            'Dados de compliance ainda manuais'
          ],
          strengths: [
            'Análise de risco em tempo real',
            'Segmentação avançada de clientes',
            'KPIs executivos automatizados',
            'Monitoramento de performance'
          ]
        }
      case 'saude':
        return {
          title: 'Dashboard Saúde - Indicadores Epidemiológicos',
          kpis: [
            { label: 'Total Pacientes', value: '1.000', trend: '+3.1%' },
            { label: 'Consultas', value: '3.000', trend: '+7.2%' },
            { label: 'Taxa Comparec.', value: '85.4%', trend: '+2.3%' },
            { label: 'Custo Médio', value: 'R$ 245', trend: '-1.2%' }
          ],
          insights: [
            'Recife concentra 40% dos atendimentos',
            'Cardiologia é a especialidade mais demandada',
            'Pacientes idosos representam 35% dos custos',
            'Taxa de readmissão em 12%'
          ],
          problems: [
            'Integração com sistemas legados complexa',
            'Dados de algumas cidades incompletos'
          ],
          strengths: [
            'Análise epidemiológica por região',
            'Monitoramento de custos assistenciais',
            'Indicadores de qualidade',
            'Previsão de demanda'
          ]
        }
      default:
        return null
    }
  }

  const analysis = getProjectAnalysis()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Power BI Header */}
        <div className="bg-[#F2C811] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#F2C811]" />
              </div>
              <span className="font-bold text-black">Power BI</span>
            </div>
            <div className="text-black font-medium">{analysis.title}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-1" />
              Atualizar
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Share className="w-4 h-4 mr-1" />
              Compartilhar
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Download className="w-4 h-4 mr-1" />
              Exportar
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

        {/* Power BI Navigation */}
        <div className="bg-gray-100 px-6 py-2 border-b">
          <div className="flex space-x-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'analysis', label: 'Análise Detalhada', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'insights', label: 'Insights', icon: <CheckCircle className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white border-t-2 border-[#F2C811] text-black' 
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
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                {analysis.kpis.map((kpi, index) => (
                  <Card key={index} className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">{kpi.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                      <div className={`text-sm flex items-center ${
                        kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {kpi.trend}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Simulation */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Distribuição por Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DashboardChart type="bar" title="Distribuição por Categoria" data={[]}/>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-green-600" />
                      Tendência Temporal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="w-16 h-16 text-green-400 mx-auto mb-2" />
                        <div className="text-gray-600">Gráfico de Linha Dinâmico</div>
                        <div className="text-sm text-gray-500">Últimos 12 meses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Problemas Identificados */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-orange-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Problemas Identificados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.problems.map((problem, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <div className="text-sm text-gray-700">{problem}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pontos Fortes */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Principais Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <div className="text-sm text-gray-700">{strength}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros Ativos */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                    Filtros Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Período: Últimos 12 meses
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Status: Ativo
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Região: Recife/PE
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                    Insights Principais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="text-gray-700">{insight}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center space-x-4">
              <span>Desenvolvido por William Jose</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Dados Atualizados
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PowerBIViewer


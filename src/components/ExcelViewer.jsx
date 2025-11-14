import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  X, 
  FileText, 
  Download,
  Save,
  Printer,
  Filter,
  SortAsc,
  Calculator,
  BarChart3
} from 'lucide-react'

const ExcelViewer = ({ isOpen, onClose, projectData }) => {
  const [activeSheet, setActiveSheet] = useState('dados')

  if (!isOpen || !projectData) return null

  const getExcelData = () => {
    switch (projectData.id) {
      case 'imobiliario':
        return {
          title: 'Análise_Imobiliaria_Recife.xlsx',
          sheets: [
            { id: 'dados', name: 'Dados_Brutos', icon: '📊' },
            { id: 'analise', name: 'Análise_Preços', icon: '📈' },
            { id: 'dashboard', name: 'Dashboard', icon: '📋' },
            { id: 'formulas', name: 'Fórmulas_Avançadas', icon: '🧮' }
          ],
          data: {
            dados: {
              headers: ['ID_Imovel', 'Tipo', 'Bairro', 'Preço', 'Area_m2', 'Preço_m2', 'Quartos', 'Banheiros', 'Vagas', 'Piscina', 'Academia'],
              rows: [
                ['IMV001', 'Apartamento', 'Boa Viagem', 'R$ 450.000', '85', 'R$ 5.294', '3', '2', '1', 'Sim', 'Não'],
                ['IMV002', 'Casa', 'Casa Forte', 'R$ 380.000', '120', 'R$ 3.167', '3', '3', '2', 'Não', 'Sim'],
                ['IMV003', 'Apartamento', 'Espinheiro', 'R$ 320.000', '75', 'R$ 4.267', '2', '2', '1', 'Não', 'Não'],
                ['IMV004', 'Cobertura', 'Boa Viagem', 'R$ 850.000', '180', 'R$ 4.722', '4', '4', '3', 'Sim', 'Sim'],
                ['IMV005', 'Studio', 'Recife', 'R$ 180.000', '35', 'R$ 5.143', '1', '1', '0', 'Não', 'Não']
              ]
            },
            analise: {
              headers: ['Bairro', 'Qtd_Imoveis', 'Preço_Médio', 'Preço_m2_Médio', 'Valorização_%'],
              rows: [
                ['Boa Viagem', '156', 'R$ 485.230', 'R$ 4.892', '12.5%'],
                ['Casa Forte', '89', 'R$ 425.180', 'R$ 3.654', '8.7%'],
                ['Espinheiro', '67', 'R$ 365.450', 'R$ 4.123', '6.2%'],
                ['Recife', '134', 'R$ 298.760', 'R$ 3.987', '4.1%'],
                ['Graças', '78', 'R$ 412.890', 'R$ 4.234', '9.3%']
              ]
            }
          }
        }
      case 'financeiro':
        return {
          title: 'Gestao_Portfolio_Financeiro.xlsx',
          sheets: [
            { id: 'dados', name: 'Clientes', icon: '👥' },
            { id: 'analise', name: 'Performance', icon: '📊' },
            { id: 'dashboard', name: 'Dashboard_Exec', icon: '📈' },
            { id: 'formulas', name: 'Cálculos_Risco', icon: '⚠️' }
          ],
          data: {
            dados: {
              headers: ['ID_Cliente', 'Nome', 'Segmento', 'Patrimônio', 'Score_Credito', 'Rentabilidade_%', 'Risco', 'Status'],
              rows: [
                ['CLI001', 'João Silva', 'Premium', 'R$ 850.000', '785', '9.2%', 'Baixo', 'Ativo'],
                ['CLI002', 'Maria Santos', 'Gold', 'R$ 420.000', '742', '7.8%', 'Médio', 'Ativo'],
                ['CLI003', 'Pedro Costa', 'Silver', 'R$ 180.000', '698', '6.5%', 'Médio', 'Ativo'],
                ['CLI004', 'Ana Oliveira', 'Premium', 'R$ 1.200.000', '812', '10.1%', 'Baixo', 'Ativo'],
                ['CLI005', 'Carlos Lima', 'Gold', 'R$ 350.000', '756', '8.3%', 'Baixo', 'Ativo']
              ]
            },
            analise: {
              headers: ['Segmento', 'Qtd_Clientes', 'Patrimônio_Total', 'Rentab_Média', 'Score_Médio'],
              rows: [
                ['Premium', '87', 'R$ 2.8M', '9.8%', '798'],
                ['Gold', '245', 'R$ 1.9M', '7.9%', '751'],
                ['Silver', '168', 'R$ 0.6M', '6.2%', '689']
              ]
            }
          }
        }
      case 'saude':
        return {
          title: 'Indicadores_Saude_Publica.xlsx',
          sheets: [
            { id: 'dados', name: 'Pacientes', icon: '🏥' },
            { id: 'analise', name: 'Epidemiologia', icon: '📊' },
            { id: 'dashboard', name: 'Indicadores', icon: '📋' },
            { id: 'formulas', name: 'Cálculos_Custo', icon: '💰' }
          ],
          data: {
            dados: {
              headers: ['ID_Paciente', 'Idade', 'Sexo', 'Cidade', 'Especialidade', 'Custo_Consulta', 'Data_Consulta', 'Status'],
              rows: [
                ['PAC001', '45', 'M', 'Recife', 'Cardiologia', 'R$ 280', '15/01/2025', 'Realizada'],
                ['PAC002', '32', 'F', 'Olinda', 'Ginecologia', 'R$ 220', '16/01/2025', 'Realizada'],
                ['PAC003', '67', 'M', 'Jaboatão', 'Geriatria', 'R$ 250', '17/01/2025', 'Realizada'],
                ['PAC004', '28', 'F', 'Recife', 'Dermatologia', 'R$ 180', '18/01/2025', 'Agendada'],
                ['PAC005', '55', 'M', 'Caruaru', 'Neurologia', 'R$ 320', '19/01/2025', 'Agendada']
              ]
            },
            analise: {
              headers: ['Cidade', 'Total_Pacientes', 'Custo_Médio', 'Taxa_Comparec_%', 'Especialidade_Top'],
              rows: [
                ['Recife', '412', 'R$ 245', '87.2%', 'Cardiologia'],
                ['Olinda', '178', 'R$ 230', '84.5%', 'Ginecologia'],
                ['Jaboatão', '156', 'R$ 255', '82.1%', 'Geriatria'],
                ['Caruaru', '134', 'R$ 268', '89.3%', 'Neurologia'],
                ['Petrolina', '120', 'R$ 252', '85.7%', 'Pediatria']
              ]
            }
          }
        }
      default:
        return null
    }
  }

  const excelData = getExcelData()
  const currentData = excelData.data[activeSheet]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Excel Header */}
        <div className="bg-[#217346] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#217346]" />
              </div>
              <span className="font-bold text-white">Microsoft Excel</span>
            </div>
            <div className="text-white font-medium">{excelData.title}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-1" />
              Imprimir
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

        {/* Excel Toolbar */}
        <div className="bg-gray-100 px-6 py-2 border-b">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-1" />
              Filtrar
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <SortAsc className="w-4 h-4 mr-1" />
              Classificar
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <Calculator className="w-4 h-4 mr-1" />
              Fórmulas
            </Button>
            <Button size="sm" variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              <BarChart3 className="w-4 h-4 mr-1" />
              Gráficos
            </Button>
          </div>
        </div>

        {/* Sheet Tabs */}
        <div className="bg-gray-50 px-6 py-2 border-b">
          <div className="flex space-x-2">
            {excelData.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheet(sheet.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeSheet === sheet.id 
                    ? 'bg-white border-t-2 border-[#217346] text-black shadow-sm' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <span>{sheet.icon}</span>
                <span className="font-medium text-sm">{sheet.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Excel Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-4">
            {/* Column Headers (A, B, C...) */}
            <div className="flex border-b border-gray-300">
              <div className="w-12 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
                
              </div>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((col, index) => (
                <div key={col} className="w-32 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
                  {col}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            <div className="space-y-0">
              {/* Header Row */}
              <div className="flex border-b border-gray-300">
                <div className="w-12 h-10 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
                  1
                </div>
                {currentData.headers.map((header, index) => (
                  <div key={index} className="w-32 h-10 border-r border-gray-300 flex items-center px-2 bg-blue-50">
                    <span className="text-xs font-semibold text-blue-900 truncate">{header}</span>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {currentData.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex border-b border-gray-200 hover:bg-gray-50">
                  <div className="w-12 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
                    {rowIndex + 2}
                  </div>
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} className="w-32 h-8 border-r border-gray-200 flex items-center px-2">
                      <span className="text-xs text-gray-700 truncate">{cell}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Excel Status Bar */}
        <div className="bg-gray-100 px-6 py-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Planilha: {excelData.sheets.find(s => s.id === activeSheet)?.name}</span>
              <span>Linhas: {currentData.rows.length + 1}</span>
              <span>Colunas: {currentData.headers.length}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Dados Organizados
              </Badge>
              <span>Desenvolvido por William Jose</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExcelViewer


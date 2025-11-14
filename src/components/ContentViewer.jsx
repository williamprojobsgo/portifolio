import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Copy, 
  Download, 
  Code, 
  Database,
  FileText,
  BarChart3,
  X,
  Eye,
  TrendingUp,
  PieChart,
  BarChart,
  LineChart,
  Table
} from 'lucide-react'

const ContentViewer = ({ isOpen, onClose, type, title, filePath }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [parsedContent, setParsedContent] = useState(null)

  useEffect(() => {
    if (isOpen && filePath) {
      fetch(filePath)
        .then(response => response.text())
        .then(data => {
          setContent(data)
          if (type === 'powerbi' || type === 'excel') {
            parseMarkdownContent(data)
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Erro ao carregar arquivo:', error)
          setContent('Erro ao carregar o conteúdo.')
          setLoading(false)
        })
    }
  }, [isOpen, filePath, type])

  const parseMarkdownContent = (markdown) => {
    const lines = markdown.split('\n')
    const sections = []
    let currentSection = null
    
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        if (currentSection) sections.push(currentSection)
        currentSection = { title: line.replace('# ', ''), content: [], type: 'title' }
      } else if (line.startsWith('## ')) {
        if (currentSection) sections.push(currentSection)
        currentSection = { title: line.replace('## ', ''), content: [], type: 'section' }
      } else if (line.startsWith('### ')) {
        if (currentSection) sections.push(currentSection)
        currentSection = { title: line.replace('### ', ''), content: [], type: 'subsection' }
      } else if (line.startsWith('#### ')) {
        if (currentSection) sections.push(currentSection)
        currentSection = { title: line.replace('#### ', ''), content: [], type: 'item' }
      } else if (line.trim()) {
        if (currentSection) {
          currentSection.content.push(line)
        }
      }
    })
    
    if (currentSection) sections.push(currentSection)
    setParsedContent(sections)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    alert('Conteúdo copiado para a área de transferência!')
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filePath.split('/').pop()
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getIcon = () => {
    switch (type) {
      case 'sql': return <Database className="w-5 h-5" />
      case 'powerbi': return <BarChart3 className="w-5 h-5" />
      case 'excel': return <FileText className="w-5 h-5" />
      default: return <Code className="w-5 h-5" />
    }
  }

  const getLanguage = () => {
    switch (type) {
      case 'sql': return 'SQL'
      case 'powerbi': return 'Power BI'
      case 'excel': return 'Excel'
      default: return 'Código'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'sql': return 'bg-purple-600'
      case 'powerbi': return 'bg-yellow-600'
      case 'excel': return 'bg-green-600'
      default: return 'bg-blue-600'
    }
  }

  const getSectionIcon = (sectionTitle) => {
    const title = sectionTitle.toLowerCase()
    if (title.includes('gráfico de barras') || title.includes('barras')) return <BarChart className="w-4 h-4" />
    if (title.includes('gráfico de linha') || title.includes('linha')) return <LineChart className="w-4 h-4" />
    if (title.includes('gráfico de pizza') || title.includes('pizza')) return <PieChart className="w-4 h-4" />
    if (title.includes('tabela') || title.includes('planilha')) return <Table className="w-4 h-4" />
    if (title.includes('kpi') || title.includes('métrica')) return <TrendingUp className="w-4 h-4" />
    return <Eye className="w-4 h-4" />
  }

  const renderParsedContent = () => {
    if (!parsedContent) return null

    return (
      <div className="space-y-6">
        {parsedContent.map((section, index) => (
          <div key={index} className={`
            ${section.type === 'title' ? 'border-b-2 border-blue-500 pb-4' : ''}
            ${section.type === 'section' ? 'bg-slate-800/30 rounded-lg p-4' : ''}
            ${section.type === 'subsection' ? 'bg-slate-700/20 rounded-lg p-3 ml-4' : ''}
            ${section.type === 'item' ? 'border-l-4 border-blue-400 pl-4 ml-8' : ''}
          `}>
            <div className={`
              flex items-center space-x-2 mb-2
              ${section.type === 'title' ? 'text-2xl font-bold text-white' : ''}
              ${section.type === 'section' ? 'text-xl font-semibold text-blue-300' : ''}
              ${section.type === 'subsection' ? 'text-lg font-medium text-green-300' : ''}
              ${section.type === 'item' ? 'text-base font-medium text-yellow-300' : ''}
            `}>
              {(section.type === 'subsection' || section.type === 'item') && (
                <div className="text-blue-400">
                  {getSectionIcon(section.title)}
                </div>
              )}
              <span>{section.title}</span>
            </div>
            
            {section.content.length > 0 && (
              <div className="space-y-2">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className={`
                    ${line.startsWith('- ') || line.startsWith('* ') ? 'ml-4 text-gray-300' : 'text-gray-300'}
                    ${line.startsWith('**') && line.endsWith('**') ? 'font-semibold text-white' : ''}
                  `}>
                    {line.replace(/^\*\*(.*)\*\*$/, '$1').replace(/^[*-] /, '• ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderSQLContent = () => (
    <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
      <code>{content}</code>
    </pre>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getColor()} rounded-lg flex items-center justify-center text-white`}>
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {getLanguage()}
                </Badge>
                <span className="text-slate-400 text-sm">{filePath.split('/').pop()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            <Button
              onClick={downloadFile}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-400">Carregando...</div>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              {type === 'sql' ? renderSQLContent() : renderParsedContent()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>
              {type === 'sql' && 'Scripts SQL otimizados para análise de dados'}
              {type === 'powerbi' && 'Documentação detalhada do dashboard Power BI com visualizações e KPIs'}
              {type === 'excel' && 'Especificações das planilhas Excel avançadas com fórmulas e análises'}
            </div>
            <div className="flex items-center space-x-4">
              <span>Linhas: {content.split('\n').length}</span>
              {(type === 'powerbi' || type === 'excel') && parsedContent && (
                <span>Seções: {parsedContent.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentViewer


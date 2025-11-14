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
  X
} from 'lucide-react'

const CodeViewer = ({ isOpen, onClose, type, title, filePath }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && filePath) {
      fetch(filePath)
        .then(response => response.text())
        .then(data => {
          setContent(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Erro ao carregar arquivo:', error)
          setContent('Erro ao carregar o conteúdo.')
          setLoading(false)
        })
    }
  }, [isOpen, filePath])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    alert('Código copiado para a área de transferência!')
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
            <div className="h-full overflow-auto">
              <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                <code>{content}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>
              {type === 'sql' && 'Scripts SQL otimizados para análise de dados'}
              {type === 'powerbi' && 'Documentação detalhada do dashboard Power BI'}
              {type === 'excel' && 'Especificações das planilhas Excel avançadas'}
            </div>
            <div>
              Linhas: {content.split('\n').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeViewer


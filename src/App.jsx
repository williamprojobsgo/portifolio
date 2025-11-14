import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import ContentViewer from '@/components/ContentViewer.jsx'
import PowerBIViewer from '@/components/PowerBIViewer.jsx'
import ExcelViewer from '@/components/ExcelViewer.jsx'
import SQLDashboard from '@/components/SQLDashboard.jsx';
import PythonDashboard from './components/PythonDashboard.jsx';
import AutomationShowcase from './components/AutomationShowcase.jsx';
import CallToAction from './components/CallToAction.jsx';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Database, 
  BarChart3, 
  TrendingUp,
  Brain,
  Code,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  Star,
  Award,
  Target,
  Users,
  DollarSign,
  Activity,
  Eye,
  FileCode,
  BarChart,
  Table
} from 'lucide-react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [contentViewer, setContentViewer] = useState({
    isOpen: false,
    type: '',
    title: '',
    filePath: ''
  })
  const [powerBIViewer, setPowerBIViewer] = useState({
    isOpen: false,
    projectData: null
  })
  const [excelViewer, setExcelViewer] = useState({
    isOpen: false,
    projectData: null
  })
  const [sqlDashboard, setSqlDashboard] = useState({
    isOpen: false,
    projectData: null
  })
  const [pythonDashboard, setPythonDashboard] = useState({
    isOpen: false,
    projectData: null
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const openContentViewer = (type, title, filePath) => {
    setContentViewer({
      isOpen: true,
      type,
      title,
      filePath
    })
  }

  const closeContentViewer = () => {
    setContentViewer({
      isOpen: false,
      type: '',
      title: '',
      filePath: ''
    })
  }

  const openPowerBIViewer = (projectData) => {
    setPowerBIViewer({
      isOpen: true,
      projectData
    })
  }

  const closePowerBIViewer = () => {
    setPowerBIViewer({
      isOpen: false,
      projectData: null
    })
  }

  const openExcelViewer = (projectData) => {
    setExcelViewer({
      isOpen: true,
      projectData
    })
  }

  const closeExcelViewer = () => {
    setExcelViewer({
      isOpen: false,
      projectData: null
    })
  }

  const openSQLDashboard = (projectData) => {
    setSqlDashboard({
      isOpen: true,
      projectData
    })
  }

  const closeSQLDashboard = () => {
    setSqlDashboard({
      isOpen: false,
      projectData: null
    })
  }

  const openPythonDashboard = (projectData) => {
    setPythonDashboard({
      isOpen: true,
      projectData
    })
  }

  const closePythonDashboard = () => {
    setPythonDashboard({
      isOpen: false,
      projectData: null
    })
  }

  const projects = [
    {
      id: 'imobiliario',
      title: 'Análise do Mercado Imobiliário',
      description: 'Análise completa de 1.000 imóveis em Recife/PE com insights de precificação, tendências e oportunidades de investimento.',
      icon: <TrendingUp className="w-6 h-6" />,
      technologies: ['Python', 'Power BI', 'Excel', 'SQL'],
      metrics: ['1.000 imóveis analisados', 'R$ 317k preço médio', '27 bairros mapeados'],
      highlights: ['Correlações de preço', 'Análise temporal', 'Impacto de comodidades'],
      color: 'bg-blue-500',
      links: {
        python: '/dashboards/dashboard_interativo.html',
        powerbi: '/dashboard_imobiliario.md',
        sql: '/scripts/analise_imobiliaria.sql',
        excel: '/planilhas_analises.md'
      }
    },
    {
      id: 'financeiro',
      title: 'Análise Financeira e Risco',
      description: 'Gestão de portfólio de 500 clientes com análise de risco de crédito, performance de investimentos e KPIs executivos.',
      icon: <DollarSign className="w-6 h-6" />,
      technologies: ['Python', 'Power BI', 'Excel', 'SQL'],
      metrics: ['500 clientes', 'R$ 5.3M patrimônio', '8.13% rentabilidade média'],
      highlights: ['Análise de risco', 'Performance de investimentos', 'Segmentação de clientes'],
      color: 'bg-green-500',
      links: {
        python: '/dashboards/dashboard_financeiro.html',
        powerbi: '/dashboard_financeiro.md',
        sql: '/scripts/analise_financeira.sql',
        excel: '/planilhas_analises.md'
      }
    },
    {
      id: 'saude',
      title: 'Análise Epidemiológica',
      description: 'Indicadores de saúde pública de 1.000 pacientes com análise de custos assistenciais e gestão hospitalar.',
      icon: <Activity className="w-6 h-6" />,
      technologies: ['Python', 'Power BI', 'Excel', 'SQL'],
      metrics: ['1.000 pacientes', '3.000 consultas', '85.4% taxa comparecimento'],
      highlights: ['Indicadores epidemiológicos', 'Análise de custos', 'Gestão assistencial'],
      color: 'bg-red-500',
      links: {
        python: '/dashboards/dashboard_saude.html',
        powerbi: '/dashboard_saude.md',
        sql: '/scripts/analise_saude.sql',
        excel: '/planilhas_analises.md'
      }
    }
  ]

  const skills = [
    { name: 'Python', level: 90, icon: <Code className="w-5 h-5" /> },
    { name: 'SQL', level: 85, icon: <Database className="w-5 h-5" /> },
    { name: 'Power BI', level: 88, icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Excel', level: 95, icon: <FileText className="w-5 h-5" /> },
    { name: 'Análise de Dados', level: 80, icon: <Brain className="w-5 h-5" /> }
  ]

  const experience = [
    {
      period: '2014 - 2024',
      company: 'Setor Financeiro',
      role: 'Analista Financeiro Senior',
      description: 'Mais de 10 anos de experiência em instituições como Losango e Bradesco, atuando em análise de crédito, gestão de risco e produtos financeiros.'
    },
    {
      period: '2024 - Atual',
      company: 'Transição de Carreira',
      role: 'Estudante de Engenharia de Dados',
      description: 'Migração para área de dados com foco em Python, SQL, Power BI e análise avançada de dados.'
    }
  ]

  const openProject = (url, title) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Content Viewer Modal */}
      <ContentViewer
        isOpen={contentViewer.isOpen}
        onClose={closeContentViewer}
        type={contentViewer.type}
        title={contentViewer.title}
        filePath={contentViewer.filePath}
      />

      {/* Power BI Viewer */}
      <PowerBIViewer
        isOpen={powerBIViewer.isOpen}
        onClose={closePowerBIViewer}
        projectData={powerBIViewer.projectData}
      />

      {/* Excel Viewer */}
      <ExcelViewer
        isOpen={excelViewer.isOpen}
        onClose={closeExcelViewer}
        projectData={excelViewer.projectData}
      />

      {/* SQL Dashboard */}
      <SQLDashboard
        isOpen={sqlDashboard.isOpen}
        onClose={closeSQLDashboard}
        projectData={sqlDashboard.projectData}
      />

      {/* Python Dashboard */}
      <PythonDashboard
        isOpen={pythonDashboard.isOpen}
        onClose={closePythonDashboard}
        projectData={pythonDashboard.projectData}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              William Jose
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'sobre', 'automation-project', 'projetos', 'contato'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    activeSection === section ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Transformando
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {' '}Dados{' '}
              </span>
              em Insights
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Profissional financeiro migrando para Engenharia de Dados com mais de 10 anos de experiência 
              em análise e gestão de risco
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => scrollToSection('projetos')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Ver Meus Projetos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => scrollToSection('contato')}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 text-lg"
            >
              Entre em Contato
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">10+</div>
              <div className="text-gray-400">Anos Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">3</div>
              <div className="text-gray-400">Projetos Completos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">4</div>
              <div className="text-gray-400">Tecnologias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">100%</div>
              <div className="text-gray-400">Dedicação</div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Sobre Mim</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Minha jornada da área financeira para engenharia de dados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Minha Jornada</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Com mais de 10 anos de experiência no setor financeiro, trabalhei em instituições renomadas 
                como Losango e Bradesco, desenvolvendo expertise em análise de crédito, gestão de risco e 
                produtos financeiros.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Atualmente, estou em transição para a área de Engenharia de Dados, aplicando minha experiência 
                analítica em tecnologias modernas como Python, SQL, Power BI e Excel avançado.
              </p>
              
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="text-blue-400 font-semibold">{exp.period}</div>
                    <div className="text-white font-bold">{exp.role}</div>
                    <div className="text-gray-400 text-sm">{exp.company}</div>
                    <div className="text-gray-300 text-sm mt-2">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Competências Técnicas</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-blue-400">{skill.icon}</div>
                        <span className="text-white font-medium">{skill.name}</span>
                      </div>
                      <span className="text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-white font-bold mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Objetivo Profissional
                </h4>
                <p className="text-gray-300 text-sm">
                  Migração total para área de dados, aplicando experiência financeira em projetos de 
                  engenharia de dados, análise avançada e business intelligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="automation-project" className="bg-slate-900">
          <AutomationShowcase />
        </section>

        <section id="projetos" className="py-30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meus Projetos</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Três projetos completos demonstrando competências em Python, Power BI, Excel e SQL
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Projeto de Machine Learning</CardTitle>
                  <CardDescription className="text-gray-400">Em breve: um projeto de machine learning para previsão de churn.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Projeto Web com HTML/CSS</CardTitle>
                  <CardDescription className="text-gray-400">Em breve: um site responsivo e moderno com HTML e CSS.</CardDescription>
                </CardHeader>
              </Card>
            {projects.map((project, index) => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 ${project.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {project.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Tecnologias:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-blue-900/50 text-blue-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Métricas:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {project.metrics.map((metric, i) => (
                          <li key={i} className="flex items-center">
                            <Star className="w-3 h-3 mr-2 text-yellow-400" />
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Destaques:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center">
                            <Award className="w-3 h-3 mr-2 text-blue-400" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botões Funcionais por Tecnologia */}
                    <div className="space-y-3 pt-4 border-t border-slate-600">
                      <h4 className="text-white font-semibold text-sm">Explorar Análises:</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => openPythonDashboard(project)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3"
                          size="sm"
                        >
                          <Code className="w-3 h-3 mr-1" />
                          Python
                        </Button>
                        
                        <Button
                          onClick={() => openPowerBIViewer(project)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3"
                          size="sm"
                        >
                          <BarChart className="w-3 h-3 mr-1" />
                          Power BI
                        </Button>
                        
                        <Button
                          onClick={() => openSQLDashboard(project)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3"
                          size="sm"
                        >
                          <Database className="w-3 h-3 mr-1" />
                          SQL
                        </Button>
                        
                        <Button
                          onClick={() => openExcelViewer(project)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3"
                          size="sm"
                        >
                          <Table className="w-3 h-3 mr-1" />
                          Excel
                        </Button>
                      </div>

                      <Button 
                        onClick={() => {
                          // Abrir dashboard Python
                          openPythonDashboard(project)
                          // Abrir Power BI
                          setTimeout(() => {
                            openPowerBIViewer(project)
                          }, 500)
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Projeto Completo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Demonstração Completa</h3>
                <p className="text-gray-300 mb-6">
                  Cada projeto inclui análises em Python, dashboards Power BI, planilhas Excel avançadas 
                  e scripts SQL otimizados, demonstrando domínio completo das 4 tecnologias.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <Code className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                    <div className="text-white font-semibold">Python</div>
                    <div className="text-gray-400 text-sm">Análise & ML</div>
                  </div>
                  <div>
                    <BarChart3 className="w-8 h-8 mx-auto text-green-400 mb-2" />
                    <div className="text-white font-semibold">Power BI</div>
                    <div className="text-gray-400 text-sm">Dashboards</div>
                  </div>
                  <div>
                    <FileText className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                    <div className="text-white font-semibold">Excel</div>
                    <div className="text-gray-400 text-sm">Planilhas</div>
                  </div>
                  <div>
                    <Database className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                    <div className="text-white font-semibold">SQL</div>
                    <div className="text-gray-400 text-sm">Consultas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Entre em Contato</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Vamos conversar sobre oportunidades em engenharia de dados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-400">williamprojobs@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Telefone</div>
                    <div className="text-gray-400">(81) 97905-2166</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Localização</div>
                    <div className="text-gray-400">Recife, PE - Brasil</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/in/william-jos%C3%A9-4271a8306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-gray-600 text-gray-400 hover:text-white hover:border-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                  </a>
                  <a href="https://github.com/williamprojobsgo" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-gray-600 text-gray-400 hover:text-white hover:border-blue-400">
                      <Github className="w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Vamos Conversar</CardTitle>
                <CardDescription className="text-gray-400">
                  Interessado em oportunidades de engenharia de dados ou colaborações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Nome</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Mensagem</label>
                    <textarea 
                      rows="4"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none resize-none"
                      placeholder="Sua mensagem..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Enviar Mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2025 William Jose Francelino da Silva Junior. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Portfólio desenvolvido com React, Tailwind CSS e muito ☕
          </p>
        </div>
      </footer>
      <CallToAction />
    </div>
  )
}

export default App


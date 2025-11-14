import React from 'react';
import BotViewer from './BotViewer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { CheckCircle, Zap } from 'lucide-react';

const AutomationShowcase = () => {
  return (
    <div className="bg-slate-900 text-white py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Projeto de Automação de Mensagens</h2>
          <p className="text-lg text-gray-400">Um case de eficiência e automação com Python.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">O Desafio</h3>
            <p className="text-gray-300 mb-6">Envio manual e demorado de milhares de mensagens, consumindo horas de trabalho e suscetível a erros humanos.</p>
            
            <h3 className="text-2xl font-bold mb-4">A Solução</h3>
            <p className="text-gray-300 mb-6">Desenvolvimento de um script em Python que automatiza todo o processo, desde a leitura de uma base de contatos em uma planilha até o envio personalizado de cada mensagem.</p>

            <h3 className="text-2xl font-bold mb-4">Tecnologias</h3>
            <div className="flex space-x-4 mb-8">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Python</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Selenium</span>
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">Pandas</span>
            </div>
          </div>

          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center"><Zap className="text-yellow-400 mr-2" />Resultados de Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" />
                    <p><span className="font-bold text-xl">+1000</span> mensagens enviadas por hora.</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" />
                    <p><span className="font-bold text-xl">95%</span> de redução no tempo de trabalho manual.</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" />
                    <p><span className="font-bold text-xl">100%</span> de precisão no envio.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-20">
          <BotViewer />
          <h3 className="text-2xl font-bold text-center mb-8">Fluxo da Automação</h3>
          <div className="flex justify-between items-center text-center text-sm">
            <div className="w-1/4">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">1</div>
              <p>Leitura da Planilha</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            <div className="w-1/4">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">2</div>
              <p>Login na Plataforma</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            <div className="w-1/4">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">3</div>
              <p>Envio da Mensagem</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            <div className="w-1/4">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">4</div>
              <p>Relatório de Envio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationShowcase;



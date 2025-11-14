import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { CheckCircle } from 'lucide-react';

const AutomationProject = () => {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Projeto de Automação de Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Este projeto demonstra a automação de envio de mensagens em massa, utilizando Python e bibliotecas de automação web.</p>
        <h3 className="font-semibold text-lg mb-2">Tecnologias Utilizadas:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Python</li>
          <li>Selenium</li>
          <li>Pandas</li>
        </ul>
        <h3 className="font-semibold text-lg mb-2">Resultados:</h3>
        <div className="flex items-center mb-2">
          <CheckCircle className="text-green-500 mr-2" />
          <span>Envio de mais de 1000 mensagens por hora.</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2" />
          <span>Redução de 95% no tempo de envio manual.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationProject;



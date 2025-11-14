import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const CallToAction = () => {
  return (
    <div className="bg-blue-600 text-white text-center py-20">
      <h2 className="text-3xl font-bold mb-4">Vamos Conversar?</h2>
      <p className="mb-8">Estou sempre aberto a novas oportunidades e desafios. Se você tem um projeto em mente, vamos conversar sobre como posso ajudar.</p>
      <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-200">
        Agende uma Conversa
      </Button>
    </div>
  );
};

export default CallToAction;



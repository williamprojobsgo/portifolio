import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';

const BotViewer = () => {
  const [code, setCode] = useState('');

  useEffect(() => {
    fetch('/bot.py')
      .then(response => response.text())
      .then(text => setCode(text));
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Código do Bot de Automação</h3>
      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto">
        <code>{code}</code>
      </pre>
      <a href="/bot.py" download>
        <Button className="mt-4">Baixar Código</Button>
      </a>
    </div>
  );
};

export default BotViewer;



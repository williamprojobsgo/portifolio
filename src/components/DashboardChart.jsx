import React from 'react';

const DashboardChart = ({ type, data, title }) => {
  // Simulação de gráficos para Power BI e SQL
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      {/* Adicionar simulação de gráfico aqui */}
      <div className="text-center text-gray-500">Simulação de Gráfico: {type}</div>
    </div>
  );
};

export default DashboardChart;



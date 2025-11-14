import React from 'react'

// Componente de Gráfico de Barras
export const BarChart = ({ data, title, xLabel, yLabel, color = '#3b82f6' }) => {
  const maxValue = Math.max(...data.map(item => item.value))
  
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex items-end justify-between h-48 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div className="relative w-full flex items-end justify-center" style={{ height: '180px' }}>
              <div
                className="w-full rounded-t transition-all duration-1000 ease-out flex items-end justify-center text-white text-xs font-medium"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: '20px'
                }}
              >
                <span className="mb-1">{item.value}</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span className="font-semibold">{xLabel}</span>
        <span className="font-semibold">{yLabel}</span>
      </div>
    </div>
  )
}

// Componente de Gráfico de Pizza
export const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-40 h-40">
          <svg width="160" height="160" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              currentAngle += angle
              
              const x1 = 80 + 70 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 80 + 70 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 80 + 70 * Math.cos(((startAngle + angle) * Math.PI) / 180)
              const y2 = 80 + 70 * Math.sin(((startAngle + angle) * Math.PI) / 180)
              
              const largeArcFlag = angle > 180 ? 1 : 0
              
              return (
                <path
                  key={index}
                  d={`M 80 80 L ${x1} ${y1} A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-1000 ease-out"
                />
              )
            })}
          </svg>
        </div>
        <div className="flex-1 ml-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente de Gráfico de Linhas
export const LineChart = ({ data, title, xLabel, yLabel, color = '#3b82f6' }) => {
  const maxValue = Math.max(...data.map(item => item.value))
  const minValue = Math.min(...data.map(item => item.value))
  const range = maxValue - minValue
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="relative h-48">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="transition-all duration-1000 ease-out"
              />
            )
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index} className="transform rotate-45 origin-bottom-left">
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span className="font-semibold">{xLabel}</span>
        <span className="font-semibold">{yLabel}</span>
      </div>
    </div>
  )
}

// Componente de Scatter Plot
export const ScatterPlot = ({ data, title, xLabel, yLabel, color = '#3b82f6' }) => {
  const maxX = Math.max(...data.map(item => item.x))
  const maxY = Math.max(...data.map(item => item.y))
  
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="relative h-48">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(pos => (
            <g key={pos}>
              <line x1={pos} y1="0" x2={pos} y2="100" stroke="#f3f4f6" strokeWidth="0.5" />
              <line x1="0" y1={pos} x2="100" y2={pos} stroke="#f3f4f6" strokeWidth="0.5" />
            </g>
          ))}
          
          {/* Points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={(item.x / maxX) * 100}
              cy={100 - (item.y / maxY) * 100}
              r="2"
              fill={color}
              opacity="0.7"
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span className="font-semibold">{xLabel}</span>
        <span className="font-semibold">{yLabel}</span>
      </div>
    </div>
  )
}

// Componente de Box Plot
export const BoxPlot = ({ data, title, categories }) => {
  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex items-end justify-between h-48 px-4">
        {data.map((category, index) => {
          const { min, q1, median, q3, max } = category
          const range = max - min
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-2">
              <div className="relative" style={{ height: '180px', width: '40px' }}>
                {/* Box */}
                <div
                  className="absolute w-full bg-blue-200 border-2 border-blue-500"
                  style={{
                    bottom: `${((q1 - min) / range) * 100}%`,
                    height: `${((q3 - q1) / range) * 100}%`
                  }}
                >
                  {/* Median line */}
                  <div
                    className="absolute w-full h-0.5 bg-blue-800"
                    style={{
                      bottom: `${((median - q1) / (q3 - q1)) * 100}%`
                    }}
                  ></div>
                </div>
                
                {/* Whiskers */}
                <div
                  className="absolute left-1/2 w-0.5 bg-blue-500 transform -translate-x-1/2"
                  style={{
                    bottom: `${((min - min) / range) * 100}%`,
                    height: `${((q1 - min) / range) * 100}%`
                  }}
                ></div>
                <div
                  className="absolute left-1/2 w-0.5 bg-blue-500 transform -translate-x-1/2"
                  style={{
                    bottom: `${((q3 - min) / range) * 100}%`,
                    height: `${((max - q3) / range) * 100}%`
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {categories[index]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente de Gauge (Velocímetro)
export const GaugeChart = ({ value, max, title, color = '#3b82f6' }) => {
  const percentage = (value / max) * 100
  const angle = (percentage / 100) * 180 - 90
  
  return (
    <div className="w-full h-48 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <div className="relative w-32 h-32 mx-auto">
        <svg width="128" height="128" className="absolute inset-0">
          {/* Background arc */}
          <path
            d="M 16 64 A 48 48 0 0 1 112 64"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* Value arc */}
          <path
            d="M 16 64 A 48 48 0 0 1 112 64"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 1.51} 151`}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Needle */}
          <line
            x1="64"
            y1="64"
            x2={64 + 40 * Math.cos((angle * Math.PI) / 180)}
            y2={64 + 40 * Math.sin((angle * Math.PI) / 180)}
            stroke="#374151"
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Center dot */}
          <circle cx="64" cy="64" r="4" fill="#374151" />
        </svg>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xl font-bold text-gray-800">{value}</div>
          <div className="text-xs text-gray-500">de {max}</div>
        </div>
      </div>
    </div>
  )
}

// Componente de Heatmap
export const Heatmap = ({ data, title, xLabels, yLabels }) => {
  const maxValue = Math.max(...data.flat())
  
  const getColor = (value) => {
    const intensity = value / maxValue
    const opacity = Math.max(0.1, intensity)
    return `rgba(59, 130, 246, ${opacity})`
  }
  
  return (
    <div className="w-full bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${xLabels.length}, 1fr)` }}>
        {data.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square flex items-center justify-center text-xs font-medium text-white rounded transition-all duration-500"
              style={{ backgroundColor: getColor(value) }}
            >
              {value}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {xLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  )
}


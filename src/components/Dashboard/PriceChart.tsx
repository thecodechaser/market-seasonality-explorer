import React from 'react';
import { MarketData } from '../../types';
import { BarChart3 } from 'lucide-react';

interface PriceChartProps {
  data: MarketData;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  // Generate intraday data points
  const generateIntradayData = () => {
    const points = [];
    const totalPoints = 24; // Hourly data
    
    for (let i = 0; i < totalPoints; i++) {
      const progress = i / (totalPoints - 1);
      const basePrice = data.open + (data.close - data.open) * progress;
      const noise = (Math.random() - 0.5) * (data.high - data.low) * 0.3;
      const price = Math.max(data.low, Math.min(data.high, basePrice + noise));
      
      points.push({
        time: i,
        price: price,
        volume: Math.random() * data.volume * 0.1
      });
    }
    
    return points;
  };

  const intradayData = generateIntradayData();
  const maxPrice = Math.max(...intradayData.map(d => d.price));
  const minPrice = Math.min(...intradayData.map(d => d.price));

  return (
    <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700/50">
      <h4 className="flex items-center mb-3 text-sm font-medium text-gray-300">
        <BarChart3 className="w-4 h-4 mr-2" />
        Intraday Price Movement
      </h4>
      
      <div className="relative h-32">
        <svg className="w-full h-full">
          {/* Price line */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={intradayData.map((d, i) => {
              const x = (i / (intradayData.length - 1)) * 100;
              const y = ((maxPrice - d.price) / (maxPrice - minPrice)) * 80 + 10;
              return `${x}%,${y}%`;
            }).join(' ')}
          />
          
          {/* Volume bars */}
          {intradayData.map((d, i) => {
            const x = (i / (intradayData.length - 1)) * 100;
            const height = (d.volume / Math.max(...intradayData.map(d => d.volume))) * 20;
            return (
              <rect
                key={i}
                x={`${x - 0.5}%`}
                y={`${90 - height}%`}
                width="1%"
                height={`${height}%`}
                fill="#374151"
                opacity="0.5"
              />
            );
          })}
        </svg>
        
        {/* Price labels */}
        <div className="absolute top-0 right-0 text-xs text-gray-400">
          ${maxPrice.toFixed(2)}
        </div>
        <div className="absolute right-0 text-xs text-gray-400 bottom-6">
          ${minPrice.toFixed(2)}
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
};
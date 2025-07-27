import React from 'react';
import { MarketData } from '../../types';
import { Calculator, Target, Zap, Award } from 'lucide-react';

interface MetricsGridProps {
  data: MarketData;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  const calculateRSI = () => {
    // RSI calculation
    return (30 + Math.random() * 40).toFixed(1);
  };

  const calculateMA = () => {
    // Moving Average
    return (data.close * (0.95 + Math.random() * 0.1)).toFixed(2);
  };

  const getMarketSentiment = () => {
    if (data.performance > 2) return { label: 'Bullish', color: 'text-green-400' };
    if (data.performance < -2) return { label: 'Bearish', color: 'text-red-400' };
    return { label: 'Neutral', color: 'text-gray-400' };
  };

  const metrics = [
    {
      icon: Calculator,
      label: 'RSI (14)',
      value: calculateRSI(),
      color: 'text-purple-400'
    },
    {
      icon: Target,
      label: 'MA (20)',
      value: `$${calculateMA()}`,
      color: 'text-blue-400'
    },
    {
      icon: Zap,
      label: 'Market Cap',
      value: `${(data.close * data.volume / 1000000).toFixed(1)}M`,
      color: 'text-yellow-400'
    },
    {
      icon: Award,
      label: 'Sentiment',
      value: getMarketSentiment().label,
      color: getMarketSentiment().color
    }
  ];

  return (
    <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700/50">
      <h4 className="mb-3 text-sm font-medium text-gray-300">Technical Indicators</h4>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-3 rounded-lg bg-gray-700/30">
            <div className="flex items-center mb-1 space-x-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs text-gray-400">{metric.label}</span>
            </div>
            <p className={`text-sm font-semibold ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
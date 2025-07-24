import React from 'react';
import { MarketData } from '../../types';
import { Calculator, Target, Zap, Award } from 'lucide-react';

interface MetricsGridProps {
  data: MarketData;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  const calculateRSI = () => {
    // Mock RSI calculation
    return (30 + Math.random() * 40).toFixed(1);
  };

  const calculateMA = () => {
    // Mock Moving Average
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
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
      <h4 className="text-sm font-medium text-gray-300 mb-3">Technical Indicators</h4>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
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
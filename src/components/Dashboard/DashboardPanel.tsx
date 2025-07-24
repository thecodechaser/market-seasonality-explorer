import React from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { DashboardData } from '../../types';
import { PriceChart } from './PriceChart';
import { MetricsGrid } from './MetricsGrid';

interface DashboardPanelProps {
  dashboardData: DashboardData;
  onClose: () => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  dashboardData,
  onClose
}) => {
  if (!dashboardData.isVisible || !dashboardData.data) {
    return null;
  }

  const { data, selectedDate } = dashboardData;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700/50 shadow-2xl z-50 transform transition-transform">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h3 className="text-lg font-semibold text-white">Market Details</h3>
            <p className="text-sm text-gray-400">
              {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Price Overview */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Price Overview
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Open</p>
                <p className="text-lg font-semibold text-white">${data.open.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Close</p>
                <p className="text-lg font-semibold text-white">${data.close.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">High</p>
                <p className="text-lg font-semibold text-green-400">${data.high.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Low</p>
                <p className="text-lg font-semibold text-red-400">${data.low.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              {data.performance >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
              )}
              Performance
            </h4>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-400">Daily Change</p>
                <p className={`text-xl font-bold ${
                  data.performance >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {data.performance >= 0 ? '+' : ''}{data.performance}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Change ($)</p>
                <p className={`text-lg font-semibold ${
                  data.performance >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${(data.close - data.open).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Volatility & Liquidity */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Market Metrics
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">Volatility</p>
                  <p className="text-sm font-medium text-white">{data.volatility}%</p>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      data.volatility < 2 ? 'bg-green-500' :
                      data.volatility < 4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.volatility / 6 * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">Liquidity Score</p>
                  <p className="text-sm font-medium text-white">{data.liquidity.toFixed(1)}</p>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${data.liquidity}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">Volume</p>
                  <p className="text-sm font-medium text-white">
                    {(data.volume / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Price Chart */}
          <PriceChart data={data} />
          
          {/* Additional Metrics */}
          <MetricsGrid data={data} />
        </div>
      </div>
    </div>
  );
};
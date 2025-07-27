import React, { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { X, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { MetricsGrid } from './MetricsGrid';
import { updateDashboardData } from '../../store/marketDataSlice';
import { useSelector, useDispatch } from 'react-redux';

export const DashboardPanel = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.marketData);

  const panelRef = useRef<HTMLDivElement>(null);

  const { data, selectedDate, timeframe = 'daily' } = dashboardData;

  useClickOutside(
    [panelRef.current],
    () => {
      if (dashboardData.isVisible) {
        handleClose();
      }
    },
    dashboardData.isVisible
  );

  if (!dashboardData.isVisible || !dashboardData.data) {
    return null;
  }

  const handleClose = () => {
    dispatch(updateDashboardData({ isVisible: false }));
  };

  const parsedDate = new Date(selectedDate);

  return (
    <div
      className="fixed inset-y-0 right-0 w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700/50 shadow-2xl z-[150] transform transition-transform"
      data-dashboard-panel
      ref={panelRef}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h3 className="font-semibold text-white text-md md:text-lg">
              Market Details
            </h3>
            <p className="text-xs text-gray-400 md:text-sm">
              {(() => {
                if (!parsedDate) return '';

                if (timeframe === 'monthly') {
                  return `Month: ${parsedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}`;
                }

                if (timeframe === 'weekly') {
                  const weekStart = new Date(selectedDate);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  return `Week: ${weekStart.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })} - ${weekEnd.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}`;
                }
                return parsedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              })()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Price Overview */}
          <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700/50">
            <h4 className="flex items-center mb-3 text-sm font-medium text-gray-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              {timeframe === 'monthly'
                ? 'Monthly Price Overview'
                : timeframe === 'weekly'
                ? 'Weekly Price Overview'
                : 'Price Overview'}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Open</p>
                <p className="font-semibold text-white text-md md:text-lg">
                  ${data.open.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Close</p>
                <p className="font-semibold text-white text-md md:text-lg">
                  ${data.close.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">High</p>
                <p className="font-semibold text-green-400 text-md md:text-lg">
                  ${data.high.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Low</p>
                <p className="font-semibold text-red-400 text-md md:text-lg">
                  ${data.low.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700/50">
            <h4 className="flex items-center mb-3 text-sm font-medium text-gray-300">
              {data.performance >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
              )}
              Performance
            </h4>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-400">
                  {(() => {
                    const dataDate = new Date(data.date);
                    const isMonthlyData = dataDate.getDate() === 1;
                    return isMonthlyData ? 'Monthly Change' : 'Daily Change';
                  })()}
                </p>
                <p
                  className={`text-md md:text-lg font-bold ${
                    data.performance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {data.performance >= 0 ? '+' : ''}
                  {data.performance}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Change ($)</p>
                <p
                  className={`text-md md:text-lg font-semibold ${
                    data.performance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ${(data.close - data.open).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Volatility & Liquidity */}
          <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700/50">
            <h4 className="flex items-center mb-3 text-sm font-medium text-gray-300">
              <Activity className="w-4 h-4 mr-2" />
              Market Metrics
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Volatility</p>
                  <p className="text-sm font-medium text-white">
                    {data.volatility}%
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700/50">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      data.volatility < 2
                        ? 'bg-green-500'
                        : data.volatility < 4
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min((data.volatility / 6) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Liquidity Score</p>
                  <p className="text-sm font-medium text-white">
                    {data.liquidity.toFixed(1)}
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700/50">
                  <div
                    className="h-2 transition-all bg-blue-500 rounded-full"
                    style={{ width: `${data.liquidity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Volume</p>
                  <p className="text-sm font-medium text-white">
                    {timeframe === 'monthly'
                      ? `${(data.volume / 1000000000).toFixed(2)}B`
                      : `${(data.volume / 1000000).toFixed(2)}M`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Price Chart */}
          <PriceChart />

          {/* Additional Metrics */}
          <MetricsGrid />
        </div>
      </div>
    </div>
  );
};

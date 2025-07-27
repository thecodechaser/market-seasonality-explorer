import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { DashboardPanel } from './components/Dashboard/DashboardPanel';
import { FilterPanel } from './components/Controls/FilterPanel';
import { CalendarCell, FilterOptions, DashboardData } from './types';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Footer } from './components/Footer.tsx';
import { Legends } from './components/Legends.tsx';

function App() {

  const [filters, setFilters] = useState<FilterOptions>({
    symbol: 'BTC',
    timeframe: 'daily',
    metrics: ['Volatility', 'Liquidity', 'Performance', 'Volume'],
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    selectedDate: null,
    data: null,
    isVisible: false,
  });

  const [hoveredCell, setHoveredCell] = useState<CalendarCell | null>(null);

  // Close dashboard if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardData.isVisible) {
        const dashboardElement = document.querySelector(
          '[data-dashboard-panel]'
        );
        if (
          dashboardElement &&
          !dashboardElement.contains(event.target as Node)
        ) {
          handleDashboardClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dashboardData.isVisible]);

  const handleCellClick = (cell: CalendarCell) => {
    if (cell.data) {
      setDashboardData({
        selectedDate: cell.date,
        data: cell.data,
        isVisible: true,
        timeframe: cell.timeframe || 'daily',
      });
    }
  };

  const handleCellHover = (cell: CalendarCell | null) => {
    setHoveredCell(cell);
  };

  const handleDashboardClose = () => {
    setDashboardData((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b md:px-8 bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
        <div className="px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white md:text-xl text-md">
                  Market Seasonality Explorer
                </h1>
                <p className="text-xs text-gray-400 md:text-sm">
                  Interactive financial market analysis platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Binance API</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              {hoveredCell && hoveredCell.data && (
                <div className="items-center hidden px-4 py-2 space-x-4 text-sm rounded-lg md:flex bg-gray-800/50">
                  <span className="text-gray-400">Quick View:</span>
                  <span className="font-medium text-white">
                    ${hoveredCell.data.close.toLocaleString()}
                  </span>
                  <span
                    className={`font-medium ${
                      hoveredCell.data.performance >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {hoveredCell.data.performance >= 0 ? '+' : ''}
                    {hoveredCell.data.performance}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto lg:mx-8 sm:px-6 lg:px-8">
        <FilterPanel filters={filters} onFiltersChange={setFilters} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <Calendar
              symbol={filters.symbol}
              selectedMetrics={filters.metrics}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
            />
          </div>
        </div>

        {/* Legend */}
        <Legends />
      </main>

      {/* Dashboard Panel */}
      <DashboardPanel
        dashboardData={dashboardData}
        onClose={handleDashboardClose}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

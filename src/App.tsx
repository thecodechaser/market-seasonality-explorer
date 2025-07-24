import React, { useState } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { DashboardPanel } from './components/Dashboard/DashboardPanel';
import { FilterPanel } from './components/Controls/FilterPanel';
import { CalendarCell, FilterOptions, DashboardData, ColorTheme } from './types';
import { BarChart3, TrendingUp } from 'lucide-react';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    symbol: 'BTC',
    timeframe: 'daily',
    metrics: ['Volatility', 'Performance']
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    selectedDate: null,
    data: null,
    isVisible: false
  });

  const [currentTheme, setCurrentTheme] = useState<ColorTheme>({
    id: 'default',
    name: 'Default',
    colors: { low: '#10B981', medium: '#F59E0B', high: '#EF4444' }
  });

  const [hoveredCell, setHoveredCell] = useState<CalendarCell | null>(null);

  const handleCellClick = (cell: CalendarCell) => {
    if (cell.data) {
      setDashboardData({
        selectedDate: cell.date,
        data: cell.data,
        isVisible: true
      });
    }
  };

  const handleCellHover = (cell: CalendarCell | null) => {
    setHoveredCell(cell);
  };

  const handleDashboardClose = () => {
    setDashboardData(prev => ({ ...prev, isVisible: false }));
  };

  const handleExport = () => {
    // Export functionality
    const exportData = {
      filters,
      theme: currentTheme,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-data-${filters.symbol}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleThemeChange = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--color-low', theme.colors.low);
    document.documentElement.style.setProperty('--color-medium', theme.colors.medium);
    document.documentElement.style.setProperty('--color-high', theme.colors.high);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Market Seasonality Explorer</h1>
                <p className="text-sm text-gray-400">Interactive financial market analysis platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Live Data</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              {hoveredCell && hoveredCell.data && (
                <div className="hidden md:flex items-center space-x-4 text-sm bg-gray-800/50 rounded-lg px-4 py-2">
                  <span className="text-gray-400">Quick View:</span>
                  <span className="text-white font-medium">
                    ${hoveredCell.data.close.toLocaleString()}
                  </span>
                  <span className={`font-medium ${
                    hoveredCell.data.performance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {hoveredCell.data.performance >= 0 ? '+' : ''}{hoveredCell.data.performance}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          onThemeChange={handleThemeChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <Calendar
              symbol={filters.symbol}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500/30 border border-green-500/50 rounded"></div>
              <span className="text-gray-300">Low Volatility (&lt; 2%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500/50 rounded"></div>
              <span className="text-gray-300">Medium Volatility (2-4%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500/30 border border-red-500/50 rounded"></div>
              <span className="text-gray-300">High Volatility (&gt; 4%)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Dashboard Panel */}
      <DashboardPanel
        dashboardData={dashboardData}
        onClose={handleDashboardClose}
      />

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Market Seasonality Explorer - Real-time financial market analysis
            </p>
            <p className="text-sm text-gray-400">
              Data updates every minute • {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { DashboardPanel } from './components/Dashboard/DashboardPanel';
import { FilterPanel } from './components/Controls/FilterPanel';
import { CalendarCell, FilterOptions, DashboardData, ColorTheme } from './types';
import { BarChart3, TrendingUp } from 'lucide-react';

function App() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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

 // Close dashboard if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardData.isVisible) {
        const dashboardElement = document.querySelector('[data-dashboard-panel]');
        if (dashboardElement && !dashboardElement.contains(event.target as Node)) {
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
        timeframe: cell.timeframe || 'daily'
      });
    }
  };

  const handleCellHover = (cell: CalendarCell | null) => {
    setHoveredCell(cell);
  };

  const handleDashboardClose = () => {
    setDashboardData(prev => ({ ...prev, isVisible: false }));
  };

  const handleExport = (format: 'pdf' | 'csv' | 'image') => {
    const exportData = {
      filters,
      theme: currentTheme,
      exportDate: new Date().toISOString()
    };

    const filename = `market-data-${filters.symbol}-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      // Create CSV content
      const csvContent = [
        'Date,Symbol,Open,High,Low,Close,Volume,Volatility,Liquidity,Performance',
        `${new Date().toISOString().split('T')[0]},${filters.symbol},45000,46000,44000,45500,1000000,2.5,75.0,1.11`
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Create PDF content (simplified)
      const pdfContent = `Market Seasonality Report
Symbol: ${filters.symbol}
Date: ${new Date().toLocaleDateString()}
Timeframe: ${filters.timeframe}
Selected Metrics: ${filters.metrics.join(', ')}
Theme: ${currentTheme.name}

This is a sample PDF export. In a production environment, 
this would contain detailed market analysis and charts.`;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'image') {
      // Create canvas and export as image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;
      
      if (ctx) {
        // Draw background
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.fillText('Market Seasonality Explorer', 50, 50);
        
        // Draw symbol
        ctx.font = '18px Arial';
        ctx.fillText(`Symbol: ${filters.symbol}`, 50, 100);
        
        // Draw date
        ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 50, 130);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const handleThemeChange = (theme: ColorTheme) => {
    setCurrentTheme(theme);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                <span className="text-gray-300">Binance API</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              {hoveredCell && hoveredCell.data && (
                <div className="items-center hidden px-4 py-2 space-x-4 text-sm rounded-lg md:flex bg-gray-800/50">
                  <span className="text-gray-400">Quick View:</span>
                  <span className="font-medium text-white">
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
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          onThemeChange={handleThemeChange}
          currentTheme={currentTheme}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <Calendar
              symbol={filters.symbol}
              selectedMetrics={filters.metrics}
              currentTheme={currentTheme}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 mt-8 border rounded-lg bg-gray-900/50 backdrop-blur-sm border-gray-700/50" style={{
          '--color-low': currentTheme.colors.low,
          '--color-medium': currentTheme.colors.medium,
          '--color-high': currentTheme.colors.high
        } as React.CSSProperties}>
          <h3 className="mb-3 text-sm font-medium text-gray-300">Legend</h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ 
                backgroundColor: `${currentTheme.colors.low}30`, 
                borderColor: `${currentTheme.colors.low}80`,
                border: '1px solid'
              }}></div>
              <span className="text-gray-300">Low Volatility (&lt; 2%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ 
                backgroundColor: `${currentTheme.colors.medium}30`, 
                borderColor: `${currentTheme.colors.medium}80`,
                border: '1px solid'
              }}></div>
              <span className="text-gray-300">Medium Volatility (2-4%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ 
                backgroundColor: `${currentTheme.colors.high}30`, 
                borderColor: `${currentTheme.colors.high}80`,
                border: '1px solid'
              }}></div>
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
      <footer className="mt-16 border-t bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
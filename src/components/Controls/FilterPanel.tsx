import React, { useState, useEffect } from 'react';
import { Filter, Download, Palette, Settings, Search, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { FilterOptions, ColorTheme } from '../../types';
import { binanceApi, BinanceSymbol } from '../../services/binanceApi';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: () => void;
  onThemeChange: (theme: ColorTheme) => void;
  currentTheme: ColorTheme;
}

const metrics = ['Volatility', 'Liquidity', 'Performance', 'Volume'];

const colorThemes: ColorTheme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: { low: '#10B981', medium: '#F59E0B', high: '#EF4444' }
  },
  {
    id: 'colorblind',
    name: 'Colorblind Friendly',
    colors: { low: '#3B82F6', medium: '#8B5CF6', high: '#EC4899' }
  },
  {
    id: 'dark',
    name: 'High Contrast',
    colors: { low: '#06B6D4', medium: '#F97316', high: '#DC2626' }
  }
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onThemeChange,
  currentTheme
}) => {
  const [symbols, setSymbols] = useState<BinanceSymbol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [filteredSymbols, setFilteredSymbols] = useState<BinanceSymbol[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadSymbols();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = symbols.filter(symbol => 
        symbol.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        symbol.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 20);
      setFilteredSymbols(filtered);
    } else {
      setFilteredSymbols(symbols.slice(0, 20));
    }
  }, [searchQuery, symbols]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const symbolDropdown = document.querySelector('[data-symbol-dropdown]');
      const exportDropdown = document.querySelector('[data-export-dropdown]');
      
      if (showSymbolSearch && symbolDropdown && !symbolDropdown.contains(event.target as Node)) {
        setShowSymbolSearch(false);
      }
      
      if (showExportMenu && exportDropdown && !exportDropdown.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSymbolSearch, showExportMenu]);

  const loadSymbols = async () => {
    try {
      const allSymbols = await binanceApi.getAllSymbols();
      // Sort by popularity (volume) and take top symbols
      const popularSymbols = allSymbols
        .filter(s => ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI'].includes(s.baseAsset))
        .concat(allSymbols.filter(s => !['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI'].includes(s.baseAsset)))
        .slice(0, 100);
      
      setSymbols(popularSymbols);
      setFilteredSymbols(popularSymbols.slice(0, 20));
    } catch (error) {
      console.error('Failed to load symbols:', error);
      // Fallback to default symbols
      const fallbackSymbols = [
        { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT' },
        { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT' },
        { symbol: 'DOTUSDT', baseAsset: 'DOT', quoteAsset: 'USDT' }
      ] as BinanceSymbol[];
      setSymbols(fallbackSymbols);
      setFilteredSymbols(fallbackSymbols);
    }
  };

  const handleExportOption = (format: 'pdf' | 'csv' | 'image') => {
    setShowExportMenu(false);
    onExport(format);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters & Controls
        </h3>
        
        <div className="flex space-x-2 relative">
          <div className="relative" data-export-dropdown>
          <button
              onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
            
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-[100]">
                <button
                  onClick={() => handleExportOption('pdf')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={() => handleExportOption('csv')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExportOption('image')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-white hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span>Export as Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Symbol Selection */}
        <div className="relative" data-symbol-dropdown>
          <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
          <div className="relative">
            <button
              onClick={() => setShowSymbolSearch(!showSymbolSearch)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{filters.symbol}</span>
                <Search className="w-4 h-4" />
              </div>
            </button>
            
            {showSymbolSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-[100] max-h-64 overflow-hidden">
                <div className="p-2 border-b border-gray-700">
                  <input
                    type="text"
                    placeholder="Search symbols..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredSymbols.map(symbol => (
                    <button
                      key={symbol.symbol}
                      onClick={() => {
                        onFiltersChange({ ...filters, symbol: symbol.baseAsset });
                        setShowSymbolSearch(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{symbol.baseAsset}</span>
                        <span className="text-xs text-gray-400">{symbol.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Metrics</label>
          <div className="space-y-2">
            {metrics.map(metric => (
              <label key={metric} className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.metrics.includes(metric)}
                  onChange={(e) => {
                    const newMetrics = e.target.checked
                      ? [...filters.metrics, metric]
                      : filters.metrics.filter(m => m !== metric);
                    onFiltersChange({ ...filters, metrics: newMetrics });
                  }}
                  className="mr-2 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />
                {metric}
              </label>
            ))}
          </div>
        </div>

        {/* Color Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Palette className="w-4 h-4 inline mr-1" />
            Color Theme
          </label>
          <select
            value={currentTheme.id}
            onChange={(e) => {
              const theme = colorThemes.find(t => t.id === e.target.value);
              if (theme) onThemeChange(theme);
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
          >
            {colorThemes.map(theme => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Settings className="w-4 h-4 inline mr-1" />
            Quick Actions
          </label>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
              Reset Filters
            </button>
            <button className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
              Save View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect, useRef } from 'react';
import {
  Filter,
  Download,
  Palette,
  Settings,
  Search,
  FileText,
  Image,
  FileSpreadsheet,
} from 'lucide-react';
import { BinanceSymbol } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTheme, updateFilters } from '../../store/marketDataSlice';
import { exportMarketData } from '../../utils/exportMarketData.ts';
import { metrics, colorThemes } from '../../config/metricsConfig';
import { loadSymbols } from '../../store/marketDataThunks';
import { useClickOutside } from '../../hooks/useClickOutside';
import { RootState, AppDispatch } from '../../store/store';

export const FilterPanel = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTheme, exportData, filters, symbols } = useSelector(
    (state: RootState) => state.marketData
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [filteredSymbols, setFilteredSymbols] = useState<BinanceSymbol[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const symbolRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useClickOutside([symbolRef.current, exportRef.current], () => {
    setShowSymbolSearch(false);
    setShowExportMenu(false);
  });

  useEffect(() => {
    dispatch(loadSymbols());
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = symbols
        .filter(
          (symbol) =>
            symbol.baseAsset
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            symbol.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 20);
      setFilteredSymbols(filtered);
    } else {
      setFilteredSymbols(symbols.slice(0, 20));
    }
  }, [searchQuery, symbols]);

  const handleExportOption = (format: 'pdf' | 'csv' | 'image') => {
    setShowExportMenu(false);
    exportMarketData({
      data: exportData,
      format,
    });
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(updateFilters(newFilters));
  };

  return (
    <div className="p-4 mb-6 border rounded-lg bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center font-semibold text-white text-md md:text-lg">
          <Filter className="w-5 h-5 mr-2" />
          Filters & Controls
        </h3>

        <div className="relative flex space-x-2">
          <div className="relative" data-export-dropdown ref={exportRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-[100]">
                <button
                  onClick={() => handleExportOption('pdf')}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-left text-white transition-colors rounded-t-lg hover:bg-gray-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={() => handleExportOption('csv')}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-left text-white transition-colors hover:bg-gray-700"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExportOption('image')}
                  className="flex items-center w-full px-4 py-2 space-x-2 text-left text-white transition-colors rounded-b-lg hover:bg-gray-700"
                >
                  <Image className="w-4 h-4" />
                  <span>Export as Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Symbol Selection */}
        <div className="relative z-[100]" data-symbol-dropdown ref={symbolRef}>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Symbol
          </label>
          <div className="relative">
            <button
              onClick={() => setShowSymbolSearch(!showSymbolSearch)}
              className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{filters.symbol}</span>
                <Search className="w-4 h-4" />
              </div>
            </button>

            {showSymbolSearch && (
              <div className="absolute left-0 right-0 mt-1 overflow-hidden border border-gray-600 rounded-lg shadow-xl top-full bg-gray-800/95 backdrop-blur-sm max-h-64">
                <div className="p-2 border-b border-gray-700">
                  <input
                    type="text"
                    placeholder="Search symbols..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="overflow-y-auto max-h-48">
                  {filteredSymbols.map((symbol) => (
                    <button
                      key={symbol.symbol}
                      onClick={() => {
                        handleFilterChange({
                          symbol: symbol.baseAsset,
                        });
                        setShowSymbolSearch(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left text-white transition-colors hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{symbol.baseAsset}</span>
                        <span className="text-xs text-gray-400">
                          {symbol.symbol}
                        </span>
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
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Metrics
          </label>
          <div className="space-y-2">
            {metrics.map((metric) => (
              <label
                key={metric}
                className="flex items-center text-sm text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={filters.metrics.includes(metric)}
                  onChange={(e) => {
                    const newMetrics = e.target.checked
                      ? [...filters.metrics, metric]
                      : filters.metrics.filter((m) => m !== metric);
                    handleFilterChange({ metrics: newMetrics });
                  }}
                  className="mr-2 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                {metric}
              </label>
            ))}
          </div>
        </div>

        {/* Color Theme */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            <Palette className="inline w-4 h-4 mr-1" />
            Color Theme
          </label>
          <select
            value={currentTheme.id}
            onChange={(e) => {
              const theme = colorThemes.find((t) => t.id === e.target.value);
              if (theme) dispatch(updateCurrentTheme(theme));
            }}
            className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {colorThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            <Settings className="inline w-4 h-4 mr-1" />
            Quick Actions
          </label>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left text-gray-300 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700">
              Reset Filters
            </button>
            <button className="w-full px-3 py-2 text-sm text-left text-gray-300 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700">
              Save View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

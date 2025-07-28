import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { BinanceSymbol } from '../../types/index.ts';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilters } from '../../store/marketDataSlice.ts';
import { loadSymbols } from '../../store/marketDataThunks.ts';
import { useClickOutside } from '../../hooks/useClickOutside.ts';
import { RootState, AppDispatch } from '../../store/store.ts';

export const SymbolSelection = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, symbols } = useSelector(
    (state: RootState) => state.marketData
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [filteredSymbols, setFilteredSymbols] = useState<BinanceSymbol[]>([]);
  const symbolRef = useRef<HTMLDivElement>(null);

  useClickOutside([symbolRef.current], () => {
    setShowSymbolSearch(false);
  });

  useEffect(() => {
    dispatch(loadSymbols());
  }, []);

  // handle the search for symbols, Initially show 20
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

  const handleFilterChange = (newFilters: any) => {
    dispatch(updateFilters(newFilters));
  };

  return (
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
  );
};

import { Filter, Settings } from 'lucide-react';
import { MetricsSelection } from './MetricsSelection.tsx';
import { SymbolSelection } from './SymbolSelection.tsx';
import { ExportData } from './ExportData.tsx';
import { ThemeSelection } from './ThemeSelection.tsx';

export const ControlPanel = () => {
  return (
    <div className="p-4 mb-6 border rounded-lg bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center font-semibold text-white text-md md:text-lg">
          <Filter className="w-5 h-5 mr-2" />
          Filters & Controls
        </h3>

        <div className="relative flex space-x-2">
          <ExportData />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SymbolSelection />
        <MetricsSelection />
        <ThemeSelection />

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

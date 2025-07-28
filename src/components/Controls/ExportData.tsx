import { useState, useRef } from 'react';
import {
  Download,
  FileText,
  Image,
  FileSpreadsheet,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { exportMarketData } from '../../utils/exportMarketData.ts';
import { useClickOutside } from '../../hooks/useClickOutside.ts';
import { RootState } from '../../store/store.ts';

export const ExportData = ({}) => {
  const { exportData } = useSelector(
    (state: RootState) => state.marketData
  );
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useClickOutside([exportRef.current], () => {
    setShowExportMenu(false);
  });


  const handleExportOption = (format: 'pdf' | 'csv' | 'image') => {
    setShowExportMenu(false);
    exportMarketData({
      data: exportData,
      format,
    });
  };

  return (
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
  );
};

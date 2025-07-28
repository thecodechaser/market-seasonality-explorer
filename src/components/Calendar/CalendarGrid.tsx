import { useMemo, useEffect } from 'react';
import { CalendarCell } from './CalendarCell';
import { useDispatch, useSelector } from 'react-redux';
import { updateExportData } from '../../store/marketDataSlice';
import {
  generateCalendarCells,
  getGridLayout,
  getHeaders,
} from '../../utils/calenderHelpers';
import { RootState, AppDispatch } from '../../store/store';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { loadMarketData } from '../../store/marketDataThunks';

export const CalendarGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDate, timeframe, marketData, currentDate, loading, error } =
    useSelector((state: RootState) => state.marketData);
  const layoutClass = getGridLayout(timeframe);
  const headers = getHeaders(timeframe);

  // Generate calendar cells with api data
  const cells = useMemo(() => {
    return generateCalendarCells(
      currentDate,
      timeframe,
      marketData,
      selectedDate
    );
  }, [currentDate, timeframe, marketData, selectedDate]);

  useEffect(() => {
    dispatch(updateExportData(cells.map(({ date, ...rest }) => rest)));
  }, [dispatch, cells]);

  return (
    <div className="p-4 border rounded-lg bg-gray-900/50 border-gray-700/50">
      {/* Headers/Days */}
      {timeframe === 'daily' && (
        <div className="grid grid-cols-7 gap-2 mb-4">
          {headers.map((header) => (
            <div
              key={header}
              className="py-2 text-sm font-medium text-center text-gray-400"
            >
              {header}
            </div>
          ))}
        </div>
      )}

      {/* Calendar grid */}
      {loading ? (
        <div className="flex items-center justify-center border rounded-lg h-96 bg-gray-900/50 border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading market data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center border rounded-lg h-96 bg-gray-900/50 border-gray-700/50">
          <AlertCircle className="w-8 h-8 text-yellow-400" />
          <p className="px-4 text-sm text-gray-300">{error}</p>
          <button
            onClick={() => dispatch(loadMarketData())}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded hover:bg-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : (
        <div className={`grid ${layoutClass} gap-2`}>
          {cells.map((cell, index) => (
            <CalendarCell key={index} cell={cell} />
          ))}
        </div>
      )}
    </div>
  );
};

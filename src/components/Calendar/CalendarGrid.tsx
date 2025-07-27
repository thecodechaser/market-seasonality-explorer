import { useMemo, useEffect } from 'react';
import { CalendarCell } from './CalendarCell';
import { useDispatch, useSelector } from 'react-redux';
import { updateExportData } from '../../store/marketDataSlice';
import {
  generateCalendarCells,
  getGridLayout,
  getHeaders,
} from '../../utils/calenderHelpers';

export const CalendarGrid = () => {
  const dispatch = useDispatch();
  const { selectedDate, timeframe, marketData, currentDate } = useSelector(
    (state) => state.marketData
  );

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

  const layoutClass = getGridLayout(timeframe);

  const headers = getHeaders(timeframe);

  return (
    <div className="p-4 border rounded-lg bg-gray-900/50 border-gray-700/50">
      {/* Headers */}
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
      <div className={`grid ${layoutClass} gap-2`}>
        {cells.map((cell, index) => (
          <CalendarCell key={index} cell={cell} />
        ))}
      </div>
    </div>
  );
};

import { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTimeframe,
  updateCurrentDate,
  updateCustomDateRange,
} from '../../store/marketDataSlice';
import { timeframes } from '../../config/metricsConfig';
import { formatHeaderDate, formatDateRange } from '../../utils/calenderHelpers';
import { RootState } from '../../store/store';
import { TimeFrame } from '../../types';
import { AppDispatch } from '../../store/store';
import { useClickOutside } from '../../hooks/useClickOutside';
import { CustomDatePicker } from './CustomDatePicker';

export const CalendarHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timeframe, currentDate, customDateRange } = useSelector(
    (state: RootState) => state.marketData
  );
  const [showPicker, setShowPicker] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useClickOutside([calendarRef], () => setShowPicker(false), showPicker);

  const handleTimeChange = (newTimeframe: TimeFrame['id']) => {
    dispatch(updateTimeframe(newTimeframe));
    if (newTimeframe !== 'custom') {
      dispatch(updateCustomDateRange({ startDate: null, endDate: null }));
    }
  };

  const handlePrevious = () => {
    if (timeframe === 'custom') return;
    const newDate = new Date(currentDate || new Date());
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    dispatch(updateCurrentDate(newDate.toISOString()));
  };

  const handleNext = () => {
    if (timeframe === 'custom') return;
    const newDate = new Date(currentDate || new Date());
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (timeframe === 'monthly') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    dispatch(updateCurrentDate(newDate.toISOString()));
  };

  return (
    <div className="relative z-20 flex flex-col gap-4 p-4 mb-6 border rounded-lg md:flex-row bg-white/5 border-white/10">
      <div className="flex flex-col justify-between w-full gap-4 md:flex-row md:items-center">
        <div className="flex items-center justify-between md:justify-start md:space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-white text-md md:text-xl">
              {timeframe === 'custom'
                ? formatDateRange(customDateRange?.startDate, customDateRange?.endDate)
                : formatHeaderDate(timeframe, currentDate)}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={timeframe === 'custom'}
              className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={timeframe === 'custom'}
              className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {timeframe === 'custom' && (
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-md">
            <div
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center justify-between w-[220px] px-3 py-2 text-sm rounded-md bg-gray-700 text-white cursor-pointer hover:bg-gray-600 transition"
            >
              <span>{formatDateRange(customDateRange?.startDate, customDateRange?.endDate)}</span>
              <CalendarIcon className="w-4 h-4 ml-2 text-blue-400" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 md:ml-auto">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => handleTimeChange(tf.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeframe === tf.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {timeframe === 'custom' && showPicker && (
        <CustomDatePicker
          ref={calendarRef}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

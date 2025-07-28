import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { TimeFrame } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTimeframe,
  updateCurrentDate,
} from '../../store/marketDataSlice';
import { timeframes } from '../../config/metricsConfig';
import { formatHeaderDate } from '../../utils/calenderHelpers';
import { RootState } from '../../store/store';

export const CalendarHeader = () => {
  const dispatch = useDispatch();
  const { timeframe, currentDate } = useSelector(
    (state: RootState) => state.marketData
  );

  const handleTimeChange = (newTimeframe: TimeFrame['id']) => {
    dispatch(updateTimeframe(newTimeframe));
  };

  // Update current date on previous
  const handlePrevious = () => {
    const newDate = new Date(currentDate || new Date());
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    dispatch(updateCurrentDate(newDate.toISOString()));
  };

  // Update current date on next
  const handleNext = () => {
    const newDate = new Date(currentDate || new Date());
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (timeframe === 'monthly') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    dispatch(updateCurrentDate(newDate.toISOString()));
  };

  return (
    <div className="flex items-center justify-between p-4 mb-6 border rounded-lg bg-white/5 border-white/10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white text-md md:text-xl">
            {formatHeaderDate(timeframe, currentDate)}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex p-1 rounded-lg bg-gray-800/50">
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
  );
};

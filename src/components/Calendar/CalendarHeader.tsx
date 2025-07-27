import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TimeFrame } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { updateTimeframe } from '../../store/marketDataSlice';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

const timeframes: TimeFrame[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' }
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevious,
  onNext,
}) => {

  const dispatch = useDispatch();
  const { timeframe } = useSelector((state) => state.marketData);
  const formatHeaderDate = () => {
    if (timeframe === 'daily') {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long'
      };
      return currentDate.toLocaleDateString('en-US', options);
    } else if (timeframe === 'weekly') {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long'
      };
      return `${currentDate.toLocaleDateString('en-US', options)} - Weekly View`;
    } else {
      return `${currentDate.getFullYear()} - Monthly Overview`;
    }
  };

  const handleTimeChange = (newTimeframe: TimeFrame['id']) => {
    dispatch(updateTimeframe(newTimeframe));
  };

  return (
    <div className="flex items-center justify-between p-4 mb-6 border rounded-lg bg-white/5 border-white/10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white text-md md:text-xl">{formatHeaderDate()}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevious}
            className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
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
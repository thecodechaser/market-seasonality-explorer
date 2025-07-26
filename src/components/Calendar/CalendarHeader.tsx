import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TimeFrame } from '../../types';

interface CalendarHeaderProps {
  currentDate: Date;
  timeframe: TimeFrame['id'];
  onPrevious: () => void;
  onNext: () => void;
  onTimeframeChange: (timeframe: TimeFrame['id']) => void;
}

const timeframes: TimeFrame[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' }
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  timeframe,
  onPrevious,
  onNext,
  onTimeframeChange
}) => {
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

  return (
    <div className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">{formatHeaderDate()}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevious}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex bg-gray-800/50 rounded-lg p-1">
        {timeframes.map((tf) => (
          <button
            key={tf.id}
            onClick={() => onTimeframeChange(tf.id)}
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
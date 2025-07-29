import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCustomDateRange,
  updateTimeframe,
  clearFilters,
} from '../../store/marketDataSlice.ts';
import { loadMarketData } from '../../store/marketDataThunks.ts';
import { quickRanges } from '../../config/metricsConfig.ts';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useClickOutside } from '../../hooks/useClickOutside.ts';
import { formatDateRange } from '../../utils/calenderHelpers.ts';

export const QuickDateSelection = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { customDateRange } = useSelector(
    (state: RootState) => state.marketData
  );

  const quickDateRef = useRef<HTMLDivElement>(null);

  useClickOutside([quickDateRef], () => setOpen(false), open);

  const handleSelect = (option: any) => {
    setOpen(false);

    if (option.type === 'clear') {
      dispatch(clearFilters());
      return;
    }

    const now = new Date();
    let startDate, endDate;

    if (option.type === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    } else {
      endDate = now;
      startDate = new Date(now);
      startDate.setDate(endDate.getDate() - option.days);
    }

    dispatch(
      updateCustomDateRange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );
    dispatch(updateTimeframe('custom'));
    dispatch(loadMarketData());
  };

  return (
    <div className="relative" ref={quickDateRef}>
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-left text-gray-300 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        {formatDateRange(customDateRange?.startDate, customDateRange?.endDate)}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {quickRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handleSelect(range)}
              className="w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700"
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

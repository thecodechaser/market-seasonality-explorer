import { forwardRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomDateRange } from '../../store/marketDataSlice';
import { loadMarketData } from '../../store/marketDataThunks';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store/store';

type Props = {
  onClose: () => void;
};

export const CustomDatePicker = forwardRef<HTMLDivElement, Props>(
  ({ onClose }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { customDateRange } = useSelector(
      (state: RootState) => state.marketData
    );

    const handleSelect = (
      field: 'startDate' | 'endDate',
      date: Date | undefined
    ) => {
      if (!date) return;

      const updatedRange = {
        ...customDateRange,
        [field]: date.toISOString(),
      };

      dispatch(updateCustomDateRange(updatedRange));

      const bothDatesSelected = updatedRange.startDate && updatedRange.endDate;

      if (bothDatesSelected) {
        dispatch(loadMarketData());
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className="absolute left-0 z-20 w-full p-4 mt-2 text-gray-300 rounded-lg shadow-xl bg-gray-800/95 top-full md:w-max"
      >
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="text-sm">
            <p className="mb-1 font-medium text-gray-300">Start Date</p>
            <DayPicker
              mode="single"
              selected={
                customDateRange?.startDate
                  ? new Date(customDateRange.startDate)
                  : undefined
              }
              onSelect={(date) => handleSelect('startDate', date)}
              className="text-xs"
            />
          </div>

          <div className="text-sm">
            <p className="mb-1 font-medium text-gray-300">End Date</p>
            <DayPicker
              mode="single"
              selected={
                customDateRange?.endDate
                  ? new Date(customDateRange.endDate)
                  : undefined
              }
              onSelect={(date) => handleSelect('endDate', date)}
              className="text-xs"
            />
          </div>
        </div>
      </div>
    );
  }
);

CustomDatePicker.displayName = 'CustomDatePicker';

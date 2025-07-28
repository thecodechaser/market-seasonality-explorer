import { useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadMarketData,
  updateRealtimeData,
} from '../../store/marketDataThunks';
import { RootState, AppDispatch } from '../../store/store';

export const Calendar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentDate, filters, timeframe } = useSelector(
    (state: RootState) => state.marketData
  );

  useEffect(() => {
    dispatch(loadMarketData());
  }, [currentDate, filters.symbol, timeframe, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateRealtimeData());
    }, 60000); // every 1 min

    return () => clearInterval(interval);
  }, [filters.symbol, timeframe, dispatch]);

  return (
    <div className="space-y-6">
      <CalendarHeader />

      <CalendarGrid />
    </div>
  );
};

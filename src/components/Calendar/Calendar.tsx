import React, { useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadMarketData,
  updateRealtimeData,
} from '../../store/marketDataThunks';

export const Calendar = () => {
  const dispatch = useDispatch();
  const { currentDate, loading, filters, timeframe } = useSelector(
    (state: any) => state.marketData
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

      {loading ? (
        <div className="flex items-center justify-center border rounded-lg h-96 bg-gray-900/50 border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading market data...</p>
          </div>
        </div>
      ) : (
        <CalendarGrid />
      )}
    </div>
  );
};

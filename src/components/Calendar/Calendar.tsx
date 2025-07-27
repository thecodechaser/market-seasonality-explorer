import React, { useState, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { MarketData } from '../../types';
import { marketDataService } from '../../services/marketDataService';
import { useSelector } from 'react-redux';

export const Calendar = ({}) => {
  const { timeframe, filters } = useSelector((state) => state.marketData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const symbol = filters.symbol || 'BTC';

  useEffect(() => {
    loadMarketData();
  }, [currentDate, symbol, timeframe]);

  // Add real-time data updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (timeframe === 'daily') {
        try {
          const realtimeData = await marketDataService.getRealtimeData(symbol);
          setMarketData((prevData) => {
            const updatedData = [...prevData];
            const todayIndex = updatedData.findIndex(
              (d) => d.date === realtimeData.date
            );
            if (todayIndex >= 0) {
              updatedData[todayIndex] = realtimeData;
            } else {
              updatedData.push(realtimeData);
            }
            return updatedData;
          });
        } catch (error) {
          console.error('Failed to update realtime data:', error);
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [symbol, timeframe]);
  const loadMarketData = async () => {
    setLoading(true);
    try {
      let startDate: Date, endDate: Date;

      if (timeframe === 'daily' || timeframe === 'weekly') {
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
      } else {
        // Monthly view - get full year data
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
      }

      const data = await marketDataService.getMarketData(
        startDate,
        endDate,
        symbol,
        timeframe
      );
      setMarketData(data);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'daily' || timeframe === 'weekly') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (timeframe === 'monthly') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {loading ? (
        <div className="flex items-center justify-center border rounded-lg h-96 bg-gray-900/50 border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading market data...</p>
          </div>
        </div>
      ) : (
        <CalendarGrid currentDate={currentDate} marketData={marketData} />
      )}
    </div>
  );
};

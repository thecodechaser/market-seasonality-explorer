import React, { useState, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarCell as CalendarCellType, MarketData, TimeFrame } from '../../types';
import { marketDataService } from '../../services/marketDataService';

interface CalendarProps {
  symbol: string;
  selectedMetrics: string[];
  currentTheme?: { colors: { low: string; medium: string; high: string } };
  onCellClick: (cell: CalendarCellType) => void;
  onCellHover: (cell: CalendarCellType | null) => void;
  onTimeframeChange?: (timeframe: 'daily' | 'weekly' | 'monthly') => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  symbol,
  selectedMetrics,
  currentTheme,
  onCellClick,
  onCellHover
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeframe, setTimeframe] = useState<TimeFrame['id']>('daily');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketData();
  }, [currentDate, symbol, timeframe]);

  // Add real-time data updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (timeframe === 'daily') {
        try {
          const realtimeData = await marketDataService.getRealtimeData(symbol);
          setMarketData(prevData => {
            const updatedData = [...prevData];
            const todayIndex = updatedData.findIndex(d => d.date === realtimeData.date);
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
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else {
        // Monthly view - get full year data
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
      }
      
      const data = await marketDataService.getMarketData(startDate, endDate, symbol, timeframe);
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

  const handleCellClick = (cell: CalendarCellType) => {
    setSelectedDate(cell.date);
    const cellWithTimeframe = { ...cell, timeframe };
    onCellClick(cellWithTimeframe);
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        timeframe={timeframe}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTimeframeChange={setTimeframe}
      />

      {loading ? (
        <div className="flex items-center justify-center border rounded-lg h-96 bg-gray-900/50 border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading market data...</p>
          </div>
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          timeframe={timeframe}
          marketData={marketData}
          selectedDate={selectedDate}
          selectedMetrics={selectedMetrics}
          currentTheme={currentTheme}
          onCellClick={handleCellClick}
          onCellHover={onCellHover}
        />
      )}
    </div>
  );
};
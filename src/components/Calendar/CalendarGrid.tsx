import React, { useMemo, useEffect } from 'react';
import {
  CalendarCell as CalendarCellType,
  MarketData,
} from '../../types';
import { CalendarCell } from './CalendarCell';
import { useDispatch, useSelector } from 'react-redux';
import { updateExportData } from '../../store/marketDataSlice';

interface CalendarGridProps {
  currentDate: Date;
  marketData: MarketData[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  marketData,
}) => {
  const dispatch = useDispatch();
  const { selectedDate, timeframe } = useSelector((state) => state.marketData);
   const parsedDate = new Date(selectedDate);
  const cells = useMemo(() => {
    const cells: CalendarCellType[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timeframe === 'daily') {
      // Generate daily calendar grid
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dateStr = date.toISOString().split('T')[0];
        const data = marketData.find((d) => d.date === dateStr);

        cells.push({
          date: new Date(date),
          data,
          isToday: date.getTime() === today.getTime(),
          isSelected: parsedDate
            ? date.getTime() === parsedDate.getTime()
            : false,
          isInRange: false,
          timeframe: 'daily',
        });
      }
    } else if (timeframe === 'weekly') {
      // Generate weekly view
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Start from the beginning of the week containing the first day
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      // Generate weeks (up to 6 weeks to cover the month)
      for (let week = 0; week < 6; week++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + week * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Aggregate data for this week
        const weekData = marketData.filter((d) => {
          const dataDate = new Date(d.date);
          return dataDate >= weekStart && dataDate <= weekEnd;
        });

        let aggregatedData: MarketData | undefined;
        if (weekData.length > 0) {
          const totalVolume = weekData.reduce((sum, d) => sum + d.volume, 0);
          const avgVolatility =
            weekData.reduce((sum, d) => sum + d.volatility, 0) /
            weekData.length;
          const avgLiquidity =
            weekData.reduce((sum, d) => sum + d.liquidity, 0) / weekData.length;
          const weekPerformance =
            weekData.length > 0
              ? ((weekData[weekData.length - 1].close - weekData[0].open) /
                  weekData[0].open) *
                100
              : 0;

          aggregatedData = {
            date: weekStart.toISOString().split('T')[0],
            symbol: weekData[0].symbol,
            open: weekData[0].open,
            close: weekData[weekData.length - 1].close,
            high: Math.max(...weekData.map((d) => d.high)),
            low: Math.min(...weekData.map((d) => d.low)),
            volume: totalVolume,
            volatility: Number(avgVolatility.toFixed(2)),
            liquidity: Number(avgLiquidity.toFixed(2)),
            performance: Number(weekPerformance.toFixed(2)),
          };
        }

        const isCurrentWeek = today >= weekStart && today <= weekEnd;

        cells.push({
          date: new Date(weekStart),
          data: aggregatedData,
          isToday: isCurrentWeek,
          isSelected: parsedDate
            ? parsedDate >= weekStart && parsedDate <= weekEnd
            : false,
          isInRange: false,
          timeframe: 'weekly',
        });
      }
    } else if (timeframe === 'monthly') {
      // Generate monthly view
      const year = currentDate.getFullYear();

      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        // Aggregate data for this month
        const monthData = marketData.filter((d) => {
          const dataDate = new Date(d.date);
          return dataDate >= monthStart && dataDate <= monthEnd;
        });

        let aggregatedData: MarketData | undefined;
        if (monthData.length > 0) {
          const totalVolume = monthData.reduce((sum, d) => sum + d.volume, 0);
          const avgVolatility =
            monthData.reduce((sum, d) => sum + d.volatility, 0) /
            monthData.length;
          const avgLiquidity =
            monthData.reduce((sum, d) => sum + d.liquidity, 0) /
            monthData.length;
          const monthPerformance =
            monthData.length > 0
              ? ((monthData[monthData.length - 1].close - monthData[0].open) /
                  monthData[0].open) *
                100
              : 0;

          aggregatedData = {
            date: monthStart.toISOString().split('T')[0],
            symbol: monthData[0].symbol,
            open: monthData[0].open,
            close: monthData[monthData.length - 1].close,
            high: Math.max(...monthData.map((d) => d.high)),
            low: Math.min(...monthData.map((d) => d.low)),
            volume: totalVolume,
            volatility: Number(avgVolatility.toFixed(2)),
            liquidity: Number(avgLiquidity.toFixed(2)),
            performance: Number(monthPerformance.toFixed(2)),
          };
        }

        const isCurrentMonth =
          today.getMonth() === month && today.getFullYear() === year;

        cells.push({
          date: new Date(monthStart),
          data: aggregatedData,
          isToday: isCurrentMonth,
          isSelected: parsedDate
            ? parsedDate.getMonth() === month &&
              parsedDate.getFullYear() === year
            : false,
          isInRange: false,
          timeframe: 'monthly',
        });
      }
    }
    
    return cells;
  }, [currentDate, timeframe, marketData, selectedDate]);

  useEffect(() => {
  dispatch(updateExportData(cells.map(({ date, ...rest }) => rest)));
}, [dispatch, cells]);

  const getGridLayout = () => {
    if (timeframe === 'daily') {
      return 'grid-cols-7';
    } else if (timeframe === 'weekly') {
      return 'grid-cols-2 md:grid-cols-3';
    } else {
      return 'grid-cols-3 md:grid-cols-4';
    }
  };

  const getHeaders = () => {
    if (timeframe === 'daily') {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    } else if (timeframe === 'weekly') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    } else {
      return ['Q1', '', '', 'Q2', '', '', 'Q3', '', '', 'Q4', '', ''];
    }
  };

  const headers = getHeaders();

  return (
    <div className="p-4 border rounded-lg bg-gray-900/50 border-gray-700/50">
      {/* Headers */}
      {timeframe === 'daily' && (
        <div className="grid grid-cols-7 gap-2 mb-4">
          {headers.map((header) => (
            <div
              key={header}
              className="py-2 text-sm font-medium text-center text-gray-400"
            >
              {header}
            </div>
          ))}
        </div>
      )}

      {/* Calendar grid */}
      <div className={`grid ${getGridLayout()} gap-2`}>
        {cells.map((cell, index) => (
          <CalendarCell
            key={index}
            cell={cell}
          />
        ))}
      </div>
    </div>
  );
};

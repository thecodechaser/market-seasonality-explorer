import { CalendarCell, MarketData } from '../types';

export const formatNumberCompact = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
};

export const getCellContent = (timeframe: string, date: Date): string => {
  if (timeframe === 'daily') return date.getDate().toString();
  if (timeframe === 'weekly') {
    const weekEnd = new Date(date);
    weekEnd.setDate(date.getDate() + 6);
    return `${date.getDate()}-${weekEnd.getDate()}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short' });
};

export const getCellHeight = (timeframe: string): string => {
  if (timeframe === 'daily') return 'h-20';
  if (timeframe === 'weekly') return 'h-24';
  return 'h-28';
};

export const getWeekRangeString = (start: Date): string => {
  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 6);
  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${weekEnd.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;
};

export const formatHeaderDate = (
  timeframe: string,
  currentDate: string | Date
): string => {
  const parsedDate = new Date(currentDate || new Date());
  if (timeframe === 'daily') {
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  } else if (timeframe === 'weekly') {
    return `${parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })} - Weekly View`;
  } else {
    return `${parsedDate.getFullYear()} - Monthly Overview`;
  }
};

export const generateCalendarCells = (
  currentDate: string,
  timeframe: string,
  marketData: MarketData[],
  selectedDate: string
): CalendarCell[] => {
  const cells: CalendarCell[] = [];
  const parsedCurrentDate = new Date(currentDate || new Date());
  const parsedSelectedDate = new Date(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (timeframe === 'daily') {
    // Generate daily calendar grid
    const year = parsedCurrentDate.getFullYear();
    const month = parsedCurrentDate.getMonth();
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
        isSelected: parsedSelectedDate
          ? date.getTime() === parsedSelectedDate.getTime()
          : false,
        isInRange: false,
        timeframe: 'daily',
      });
    }
  } else if (timeframe === 'weekly') {
    // Generate weekly view
    const year = parsedCurrentDate.getFullYear();
    const month = parsedCurrentDate.getMonth();
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
          weekData.reduce((sum, d) => sum + d.volatility, 0) / weekData.length;
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
        isSelected: parsedSelectedDate
          ? parsedSelectedDate >= weekStart && parsedSelectedDate <= weekEnd
          : false,
        isInRange: false,
        timeframe: 'weekly',
      });
    }
  } else if (timeframe === 'monthly') {
    // Generate monthly view
    const year = parsedCurrentDate.getFullYear();

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
          monthData.reduce((sum, d) => sum + d.liquidity, 0) / monthData.length;
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
        isSelected: parsedSelectedDate
          ? parsedSelectedDate.getMonth() === month &&
            parsedSelectedDate.getFullYear() === year
          : false,
        isInRange: false,
        timeframe: 'monthly',
      });
    }
  }

  return cells;
};

export const getGridLayout = (timeframe: string) => {
  if (timeframe === 'daily') return 'grid-cols-7';
  if (timeframe === 'weekly') return 'grid-cols-2 md:grid-cols-3';
  return 'grid-cols-3 md:grid-cols-4';
};

export const getHeaders = (timeframe: string) => {
  if (timeframe === 'daily')
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (timeframe === 'weekly')
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  return ['Q1', '', '', 'Q2', '', '', 'Q3', '', '', 'Q4', '', ''];
};

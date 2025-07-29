import { forwardRef } from 'react';
import { CalendarCell as CalendarCellType } from '../../types';
import { TrendingUp, TrendingDown, Volume2, AlertCircle } from 'lucide-react';
import {
  updateHoveredCell,
  updateDashboardData,
  updateSelectedDate,
} from '../../store/marketDataSlice';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCellContent,
  getCellHeight,
  formatNumberCompact,
  getWeekRangeString,
} from '../../utils/calenderHelpers';
import { RootState } from '../../store/store';

interface CalendarCellProps {
  cell: CalendarCellType;
  tabIndex?: number;
  isFocused?: boolean;
  onFocus?: () => void;
}

export const CalendarCell = forwardRef<HTMLDivElement, CalendarCellProps>(
  (props, ref) => {
    const { cell, tabIndex = -1, isFocused, onFocus } = props;
    const dispatch = useDispatch();
    const { currentTheme, filters, cellTimeframe } = useSelector(
      (state: RootState) => state.marketData
    );
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const isFuture = cell.date > today;
    const selectedMetrics = filters.metrics || [];

    const getPerformanceIndicator = (performance?: number) => {
      if (!selectedMetrics.includes('Performance')) return null;
      if (isFuture) return null;
      if (!performance) return null;

      if (performance > 0) {
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      } else if (performance < 0) {
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      }
      return null;
    };

    const getLiquidityIndicator = (liquidity?: number) => {
      if (!selectedMetrics.includes('Liquidity')) return null;
      if (isFuture) return null;
      if (!liquidity) return null;

      const opacity = Math.min(liquidity / 100, 1);
      return (
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full bottom-1 left-1"
          style={{ opacity }}
        />
      );
    };

    // Update Hover cell data in store
    const handleHoveredCell = (cell: CalendarCellType | null) =>
      dispatch(
        cell
          ? updateHoveredCell(
              Object.fromEntries(
                Object.entries(cell).filter(([key]) => key !== 'date')
              ) as Omit<CalendarCellType, 'date'>
            )
          : updateHoveredCell(null)
      );

    // Update click cell data in store
    const handleCellClick = (cell: CalendarCellType) => {
      if (cell.data) {
        dispatch(updateSelectedDate(cell.date.toISOString()));
        dispatch(
          updateDashboardData({
            selectedDate: cell.date.toISOString(),
            data: cell.data,
            isVisible: true,
            timeframe: cellTimeframe,
          })
        );
      }
    };

    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        onFocus={onFocus}
        className={`
        relative ${getCellHeight(
          cellTimeframe
        )} border rounded-lg transition-all duration-200 group z-10
        ${isFuture ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${cell.isToday ? 'ring-2 ring-blue-400' : 'border-gray-700/50'}
        ${cell.isSelected ? 'ring-2 ring-blue-300' : ''}
        ${cell.isInRange ? 'bg-blue-500/20' : ''}
        ${!isFuture ? 'hover:scale-105 hover:shadow-lg' : ''}
        ${isFocused ? 'ring-2 ring-white' : ''}
      `}
        style={
          currentTheme &&
          cell.data &&
          !isFuture &&
          selectedMetrics.includes('Volatility')
            ? {
                backgroundColor:
                  cell.data.volatility < 2
                    ? `${currentTheme.colors.low}30`
                    : cell.data.volatility < 4
                    ? `${currentTheme.colors.medium}30`
                    : `${currentTheme.colors.high}30`,
                borderColor:
                  cell.data.volatility < 2
                    ? `${currentTheme.colors.low}80`
                    : cell.data.volatility < 4
                    ? `${currentTheme.colors.medium}80`
                    : `${currentTheme.colors.high}80`,
              }
            : {}
        }
        onClick={() => handleCellClick(cell)}
        onMouseEnter={() => handleHoveredCell(cell)}
        onMouseLeave={() => handleHoveredCell(null)}
      >
        <div className="flex flex-col justify-between h-full p-2">
          <div className="flex items-start justify-between">
            <span
              className={`text-sm font-medium ${
                cell.isToday
                  ? 'text-blue-400'
                  : isFuture
                  ? 'text-gray-500'
                  : 'text-white'
              }`}
            >
              {getCellContent(cellTimeframe, cell.date)}
            </span>
            {getPerformanceIndicator(cell.data?.performance)}
          </div>

          {cell.data && !isFuture && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={`hidden md:block text-xs text-gray-300 ${
                    cellTimeframe !== 'daily' ? 'text-[10px]' : ''
                  }`}
                >
                  ${cell.data.close.toLocaleString()}
                </span>
                <span
                  className={`block ml-[-5px] md:hidden text-[9px] sm:text-xs text-gray-300 ${
                    cellTimeframe !== 'daily' ? 'text-[10px]' : ''
                  }`}
                >
                  ${formatNumberCompact(cell.data.close)}
                </span>
                <Volume2 className="w-3 h-3 text-gray-400" />
              </div>
              {selectedMetrics.includes('Volume') && (
                <div className="w-full h-1 rounded-full bg-gray-700/50">
                  <div
                    className="h-1 transition-all bg-blue-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        (cell.data.volatility / 6) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {getLiquidityIndicator(cell.data?.liquidity)}
        </div>

        {/* Tooltip on hover */}
        {isFuture ? (
          <div className="absolute mb-2 transition-opacity transform -translate-x-1/2 opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
            <div className="p-3 text-xs text-white bg-gray-900 border border-gray-700 rounded-lg shadow-xl min-w-48">
              <div className="flex items-center mb-2 space-x-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Future Date</span>
              </div>
              <p className="text-gray-300">
                No data available for this date yet. Try selecting a past period
                or set up an alert.
              </p>
            </div>
          </div>
        ) : (
          cell.data && (
            <div className="absolute mb-2 transition-opacity transform -translate-x-1/2 opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
              <div className="p-3 text-xs text-white bg-gray-900 border border-gray-700 rounded-lg shadow-xl min-w-48">
                <div className="mb-2 font-semibold">
                  {cellTimeframe === 'daily'
                    ? cell.date.toLocaleDateString()
                    : cellTimeframe === 'weekly'
                    ? getWeekRangeString(cell.date)
                    : cell.date.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                  <div className="mt-1 text-xs text-gray-400">
                    Real Binance Data
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Close:</span>
                    <span>${cell.data.close.toLocaleString()}</span>
                  </div>
                  {selectedMetrics.includes('Volatility') && (
                    <div className="flex justify-between">
                      <span>Volatility:</span>
                      <span>{cell.data.volatility}%</span>
                    </div>
                  )}
                  {selectedMetrics.includes('Volume') && (
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <span>
                        {cellTimeframe === 'monthly'
                          ? `${(cell.data.volume / 1000000).toFixed(1)}M`
                          : `${(cell.data.volume / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                  )}
                  {selectedMetrics.includes('Performance') && (
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span
                        className={
                          cell.data.performance >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {cell.data.performance >= 0 ? '+' : ''}
                        {cell.data.performance}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
);

CalendarCell.displayName = 'CalendarCell';

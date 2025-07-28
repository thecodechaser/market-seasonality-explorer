import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarCell } from '../CalendarCell';
import { useDispatch, useSelector } from 'react-redux';
import { updateHoveredCell, updateDashboardData, updateSelectedDate } from '../../../store/marketDataSlice';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../store/marketDataSlice', () => ({
  updateHoveredCell: jest.fn(),
  updateDashboardData: jest.fn(),
  updateSelectedDate: jest.fn(),
}));

jest.mock('../../../utils/calenderHelpers', () => ({
  getCellContent: jest.fn(() => '28'),
  getCellHeight: jest.fn(() => 'h-20'),
  formatNumberCompact: jest.fn(() => '12K'),
  getWeekRangeString: jest.fn(() => 'Jul 22 - Jul 28'),
}));

describe('CalendarCell', () => {
  const mockDispatch = jest.fn();

  const baseCell = {
    date: new Date('2025-07-28T00:00:00Z'),
    data: {
      close: 12345.67,
      volume: 45000,
      volatility: 3.2,
      performance: 2.5,
      liquidity: 80,
    },
    isToday: false,
    isSelected: false,
    isInRange: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        marketData: {
          currentTheme: {
            id: 'dark',
            name: 'Dark',
            colors: {
              low: '#00ff00',
              medium: '#ffff00',
              high: '#ff0000',
            },
          },
          timeframe: 'daily',
          filters: {
            symbol: 'BTC',
            metrics: ['Performance', 'Volume', 'Volatility', 'Liquidity'],
          },
        },
      })
    );
  });

  it('should render cell content and metric icons', () => {
    render(<CalendarCell cell={baseCell} />);
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('$12K')).toBeInTheDocument();
  });

  it('should call dispatch on hover and click', () => {
    render(<CalendarCell cell={baseCell} />);
    const cellDiv = screen.getByText('28').closest('div')!;

    fireEvent.mouseEnter(cellDiv);
    expect(updateHoveredCell).toHaveBeenCalledWith(expect.any(Object));
    expect(mockDispatch).toHaveBeenCalled();

    fireEvent.click(cellDiv);
    expect(updateSelectedDate).toHaveBeenCalledWith('2025-07-28T00:00:00.000Z');
    expect(updateDashboardData).toHaveBeenCalledWith({
      selectedDate: '2025-07-28T00:00:00.000Z',
      data: baseCell.data,
      isVisible: true,
      timeframe: 'daily',
    });
  });

  it('should render tooltip for future dates', () => {
    const futureCell = {
      ...baseCell,
      date: new Date(Date.now() + 86400000 * 10),
    };
    render(<CalendarCell cell={futureCell} />);
    expect(screen.getByText(/future date/i)).toBeInTheDocument();
  });
});

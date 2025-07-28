import { render, screen } from '@testing-library/react';
import { CalendarGrid } from '../CalendarGrid';
import { useSelector, useDispatch } from 'react-redux';
import { updateExportData } from '../../../store/marketDataSlice';
import { generateCalendarCells } from '../../../utils/calenderHelpers';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../store/marketDataThunks', () => ({
  loadMarketData: jest.fn(() => ({ type: 'LOAD_MARKET_DATA' })),
}));

jest.mock('../../../store/marketDataSlice', () => ({
  updateExportData: jest.fn(),
}));

jest.mock('../../../utils/calenderHelpers', () => ({
  generateCalendarCells: jest.fn(),
  getGridLayout: jest.fn(() => 'grid-cols-7'),
  getHeaders: jest.fn(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
}));

jest.mock('../CalendarCell', () => ({
  CalendarCell: ({ cell }: any) => <div data-testid="calendar-cell">{cell?.date?.toString?.()}</div>,
}));

describe('CalendarGrid', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  const baseState = {
    marketData: {
      selectedDate: null,
      timeframe: 'daily',
      currentDate: new Date('2025-07-01'),
      marketData: { '2025-07-01': { close: 500 } },
      loading: false,
      error: null,
    },
  };

  it('should render calendar cells and calls updateExportData', () => {
    const fakeCells = [
      { date: new Date('2025-07-01'), data: { close: 100 } },
      { date: new Date('2025-07-02'), data: { close: 200 } },
    ];

    (useSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (generateCalendarCells as jest.Mock).mockReturnValue(fakeCells);

    render(<CalendarGrid />);
    expect(screen.getAllByTestId('calendar-cell')).toHaveLength(2);
    expect(updateExportData).toHaveBeenCalledWith(
      fakeCells.map(({ date, ...rest }) => rest)
    );
  });
});

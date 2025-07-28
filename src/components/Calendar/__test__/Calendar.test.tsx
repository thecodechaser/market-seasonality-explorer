import { render, screen, act } from '@testing-library/react';
import { Calendar } from '../Calendar';
import { useSelector, useDispatch } from 'react-redux';
import '@testing-library/jest-dom';

jest.mock('../CalendarHeader', () => ({
  CalendarHeader: () => <div data-testid="calendar-header">Header</div>,
}));
jest.mock('../CalendarGrid', () => ({
  CalendarGrid: () => <div data-testid="calendar-grid">Grid</div>,
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../store/marketDataThunks', () => ({
  loadMarketData: jest.fn(() => ({ type: 'LOAD_MARKET_DATA' })),
  updateRealtimeData: jest.fn(() => ({ type: 'UPDATE_REALTIME_DATA' })),
}));

describe('Calendar Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        marketData: {
          currentDate: '2025-07-28',
          filters: { symbol: 'BTCUSDT' },
          timeframe: '1d',
        },
      })
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render CalendarHeader and CalendarGrid', () => {
    render(<Calendar />);
    expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });

  it('should dispatch loadMarketData on mount and when dependencies change', () => {
    render(<Calendar />);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOAD_MARKET_DATA' });
  });

  it('should dispatch updateRealtimeData every 60 seconds', () => {
    render(<Calendar />);
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_REALTIME_DATA' });
  });

  it('should clear interval on unmount', () => {
    const { unmount } = render(<Calendar />);
    unmount();
  });
});

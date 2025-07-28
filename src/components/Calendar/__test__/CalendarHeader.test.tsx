import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarHeader } from '../CalendarHeader';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeframe } from '../../../store/marketDataSlice';
import { formatHeaderDate } from '../../../utils/calenderHelpers';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../store/marketDataSlice', () => ({
  updateTimeframe: jest.fn(),
  updateCurrentDate: jest.fn(),
}));

jest.mock('../../../utils/calenderHelpers', () => ({
  formatHeaderDate: jest.fn(() => 'Formatted Date'),
}));

describe('CalendarHeader', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        marketData: {
          timeframe: 'daily',
          currentDate: '2025-07-28T00:00:00.000Z',
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the formatted date from helper', () => {
    render(<CalendarHeader />);
    expect(formatHeaderDate).toHaveBeenCalledWith(
      'daily',
      '2025-07-28T00:00:00.000Z'
    );
    expect(screen.getByText('Formatted Date')).toBeInTheDocument();
  });

  it('should dispatch updateTimeframe when a timeframe button is clicked', () => {
    render(<CalendarHeader />);
    const button = screen.getByText('Weekly');
    fireEvent.click(button);
    expect(updateTimeframe).toHaveBeenCalledWith(expect.any(String));
    expect(mockDispatch).toHaveBeenCalled();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MetricsSelection } from '../MetricsSelection';
import { useSelector } from 'react-redux';
import { metrics } from '../../../config/metricsConfig';
import '@testing-library/jest-dom';

// Mock useDispatch
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('../../../config/metricsConfig.ts', () => ({
  metrics: ['avgClose', 'avgOpen', 'avgHigh'],
}));

describe('MetricsSelection', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render all metric buttons', () => {
    (useSelector as jest.Mock).mockReturnValue({
      filters: { metrics: [] },
    });

    render(<MetricsSelection />);
    metrics.forEach((metric) => {
      expect(screen.getByText(metric)).toBeInTheDocument();
    });
  });

  it('should dispatch updateFilters with added metric on click', () => {
    (useSelector as jest.Mock).mockReturnValue({
      filters: { metrics: ['avgClose'] },
    });

    render(<MetricsSelection />);
    const targetButton = screen.getByText('avgOpen');
    fireEvent.click(targetButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'marketData/updateFilters',
      payload: { metrics: ['avgClose', 'avgOpen'] },
    });
  });

  it('should dispatch updateFilters with removed metric on second click', () => {
    (useSelector as jest.Mock).mockReturnValue({
      filters: { metrics: ['avgClose', 'avgOpen'] },
    });

    render(<MetricsSelection />);
    const targetButton = screen.getByText('avgOpen');
    fireEvent.click(targetButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'marketData/updateFilters',
      payload: { metrics: ['avgClose'] },
    });
  });

  it('should apply active styles to selected metrics', () => {
    (useSelector as jest.Mock).mockReturnValue({
      filters: { metrics: ['avgClose'] },
    });

    render(<MetricsSelection />);
    const activeButton = screen.getByText('avgClose');
    expect(activeButton).toHaveClass('bg-blue-600');
  });
});

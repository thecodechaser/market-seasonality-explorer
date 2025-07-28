import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SymbolSelection } from '../SymbolSelection';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/useClickOutside', () => ({
  useClickOutside: jest.fn(),
}));

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

// Mock thunk
jest.mock('../../../store/marketDataThunks', () => ({
  loadSymbols: jest.fn(() => ({ type: 'LOAD_SYMBOLS' })),
}));

describe('SymbolSelection', () => {
  const mockSymbols = [
    { symbol: 'BTCUSDT', baseAsset: 'BTC' },
    { symbol: 'ETHUSDT', baseAsset: 'ETH' },
    { symbol: 'BNBUSDT', baseAsset: 'BNB' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockReturnValue({
      filters: { symbol: 'BTC' },
      symbols: mockSymbols,
    });
  });

  it('should render selected symbol button', () => {
    render(<SymbolSelection />);
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should dispatch loadSymbols on mount', () => {
    render(<SymbolSelection />);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOAD_SYMBOLS' });
  });

  it('should open symbol dropdown on button click', () => {
    render(<SymbolSelection />);
    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.getByPlaceholderText('Search symbols...')
    ).toBeInTheDocument();
  });

  it('should filter symbols based on search query', async () => {
    render(<SymbolSelection />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByPlaceholderText('Search symbols...');
    fireEvent.change(input, { target: { value: 'eth' } });

    await waitFor(() => {
      expect(screen.getByText('ETH')).toBeInTheDocument();
    });
  });

  it('should dispatch updateFilters when a symbol is selected', async () => {
    render(<SymbolSelection />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('ETH'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'marketData/updateFilters',
        payload: { symbol: 'ETH' },
      });
    });
  });
});

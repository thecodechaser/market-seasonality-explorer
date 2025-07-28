import { render, screen } from '@testing-library/react';
import { PriceChart } from '../PriceChart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';
import { RootState } from '../../../store/store';
import '@testing-library/jest-dom';

// Helper to render with mock store
const renderWithStore = (partialState: Partial<RootState>) => {
  const store = configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
    preloadedState: partialState as RootState,
  });

  return render(
    <Provider store={store}>
      <PriceChart />
    </Provider>
  );
};

describe('PriceChart', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the price chart header', () => {
    renderWithStore({
      marketData: {
        dashboardData: {
          open: 100,
          close: 200,
          high: 210,
          low: 90,
          volume: 1000000,
        },
        filters: { symbol: 'BTCUSDT' },
        timeframe: 'daily',
        currentDate: new Date().toISOString(),
        loading: false,
        error: null,
        symbolList: [],
        marketData: [],
      },
    });

    expect(
      screen.getByText('Intraday Price Movement')
    ).toBeInTheDocument();
  });

  it('should render time labels correctly', () => {
    renderWithStore({
      marketData: {
        dashboardData: {
          open: 100,
          close: 200,
          high: 210,
          low: 90,
          volume: 750000,
        },
        filters: { symbol: 'BTCUSDT' },
        timeframe: 'daily',
        currentDate: new Date().toISOString(),
        loading: false,
        error: null,
        symbolList: [],
        marketData: [],
      },
    });

    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('23:59')).toBeInTheDocument();
  });
});

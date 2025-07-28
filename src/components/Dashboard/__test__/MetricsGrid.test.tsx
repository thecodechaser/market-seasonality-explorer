import { render, screen } from '@testing-library/react';
import { MetricsGrid } from '../MetricsGrid';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';
import { RootState } from '../../../store/store';
import '@testing-library/jest-dom';

// Helper to render with mocked store
const renderWithStore = (partialState: Partial<RootState>) => {
  const store = configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
    preloadedState: partialState as RootState,
  });

  return render(
    <Provider store={store}>
      <MetricsGrid />
    </Provider>
  );
};

describe('MetricsGrid', () => {
  it('should render all technical indicators with valid dashboard data', () => {
    const mockDashboardData = {
      close: 200,
      volume: 500000,
      performance: 3.2,
    };

    renderWithStore({
      marketData: {
        dashboardData: mockDashboardData,
        filters: { symbol: 'BTCUSDT' },
        timeframe: 'daily',
        currentDate: new Date().toISOString(),
        loading: false,
        error: null,
        symbolList: [],
        marketData: [],
      },
    });

    expect(screen.getByText('Technical Indicators')).toBeInTheDocument();
    expect(screen.getByText('RSI (14)')).toBeInTheDocument();
    expect(screen.getByText('MA (20)')).toBeInTheDocument();
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('Sentiment')).toBeInTheDocument();

    const sentiment = screen.getByText(/Bullish|Neutral|Bearish/);
    expect(sentiment).toBeInTheDocument();
  });

  it('should render safely when dashboardData is null', () => {
    renderWithStore({
      marketData: {
        dashboardData: null,
        filters: { symbol: 'BTCUSDT' },
        timeframe: 'daily',
        currentDate: new Date().toISOString(),
        loading: false,
        error: null,
        symbolList: [],
        marketData: [],
      },
    });

    expect(screen.getByText('Technical Indicators')).toBeInTheDocument();
    expect(screen.getByText('RSI (14)')).toBeInTheDocument();
    expect(screen.getByText('MA (20)')).toBeInTheDocument();
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('Sentiment')).toBeInTheDocument();
  });

  it('should show Neutral sentiment when performance is near 0', () => {
    const mockDashboardData = {
      close: 120,
      volume: 10000,
      performance: 0.3,
    };

    renderWithStore({
      marketData: {
        dashboardData: mockDashboardData,
        filters: { symbol: 'ETHUSDT' },
        timeframe: 'daily',
        currentDate: new Date().toISOString(),
        loading: false,
        error: null,
        symbolList: [],
        marketData: [],
      },
    });

    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });
});

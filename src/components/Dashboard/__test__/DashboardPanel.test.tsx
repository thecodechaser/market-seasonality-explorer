import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';
import { DashboardPanel } from '../DashboardPanel';
import type { DashboardData } from '../../../types';
import userEvent from '@testing-library/user-event';

jest.mock('../PriceChart', () => ({
  PriceChart: () => <div data-testid="price-chart" />,
}));

jest.mock('../MetricsGrid', () => ({
  MetricsGrid: () => <div data-testid="metrics-grid" />,
}));

/// Helper to create mocked store
const createStore = (dashboardData: DashboardData) =>
  configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
    preloadedState: {
      marketData: {
        dashboardData,
      },
    },
  });

const mockData = {
  date: '2025-07-28',
  open: 1000,
  high: 1100,
  low: 950,
  close: 1050,
  volume: 2000000,
  volatility: 3.5,
  liquidity: 70.2,
  performance: 5,
  symbol: 'BTCUSDT',
};

describe('DashboardPanel', () => {
  it('should not render when isVisible is false', () => {
    const store = createStore({
      isVisible: false,
      selectedDate: new Date(),
      data: mockData,
    });

    render(
      <Provider store={store}>
        <DashboardPanel />
      </Provider>
    );

    expect(screen.queryByTestId('price-chart')).not.toBeInTheDocument();
  });

  it('should render correctly when visible and data is present', () => {
    const store = createStore({
      isVisible: true,
      selectedDate: new Date('2025-07-28'),
      data: mockData,
      timeframe: 'daily',
    });

    render(
      <Provider store={store}>
        <DashboardPanel />
      </Provider>
    );

    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('$1,050')).toBeInTheDocument();
    expect(screen.getByTestId('price-chart')).toBeInTheDocument();
    expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
  });

  it('should render correct date format for monthly', () => {
    const store = createStore({
      isVisible: true,
      selectedDate: new Date('2025-06-01'),
      data: mockData,
      timeframe: 'monthly',
    });

    render(
      <Provider store={store}>
        <DashboardPanel />
      </Provider>
    );

    expect(screen.getByText(/Month: June 2025/)).toBeInTheDocument();
  });

  it('should render correct date format for weekly', () => {
    const store = createStore({
      isVisible: true,
      selectedDate: new Date('2025-07-01'),
      data: mockData,
      timeframe: 'weekly',
    });

    render(
      <Provider store={store}>
        <DashboardPanel />
      </Provider>
    );

    expect(screen.getByText(/Week:/)).toBeInTheDocument();
  });

  it('should dispatch updateDashboardData when close button is clicked', async () => {
    const store = createStore({
      isVisible: true,
      selectedDate: new Date().toISOString(),
      data: mockData,
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DashboardPanel />
      </Provider>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    const actions = store.getState().marketData;
    expect(actions.dashboardData.isVisible).toBe(false);
  });
});

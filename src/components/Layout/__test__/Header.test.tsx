import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';

// Helper to render with mocked store
const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Header />
    </Provider>
  );
};

describe('Header', () => {
  it('should render title and description', () => {
    renderWithStore();
    expect(
      screen.getByText(/Market Seasonality Explorer/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Interactive financial market analysis platform/i)
    ).toBeInTheDocument();
  });

  it('should render Binance API indicator', () => {
    renderWithStore();
    expect(screen.getByText(/Binance API/i)).toBeInTheDocument();
  });

  it('should not render quick view if hoveredCell is null', () => {
    renderWithStore({
      marketData: {
        hoveredCell: null,
      },
    });
    expect(screen.queryByText(/Quick View/i)).not.toBeInTheDocument();
  });

  it('should render quick view when hoveredCell has data', () => {
    const testClose = 1234.56;
    const testPerformance = 2.5;

    renderWithStore({
      marketData: {
        hoveredCell: {
          data: {
            close: testClose,
            performance: testPerformance,
          },
        },
      },
    });

    expect(screen.getByText(/Quick View/i)).toBeInTheDocument();
    expect(
      screen.getByText(`$${testClose.toLocaleString()}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`+${testPerformance}%`)).toBeInTheDocument();
  });

  it('should render red performance if negative', () => {
    const testPerformance = -1.2;

    renderWithStore({
      marketData: {
        hoveredCell: {
          data: {
            close: 1000,
            performance: testPerformance,
          },
        },
      },
    });

    expect(screen.getByText(`${testPerformance}%`)).toHaveClass('text-red-400');
  });
});

import { render, screen } from '@testing-library/react';
import { Legends } from '../Legends';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';
import '@testing-library/jest-dom';

const renderWithStore = (preloadedState?: any) => {
  const store = configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Legends />
    </Provider>
  );
};

describe('Legends', () => {
  const mockTheme = {
    low: '#22c55e',
    medium: '#facc15',
    high: '#ef4444',
  };

  const initialState = {
    marketData: {
      currentTheme: {
        colors: mockTheme,
      },
    },
  };

  it('should render all volatility labels', () => {
    renderWithStore(initialState);

    expect(screen.getByText(/Low Volatility/)).toBeInTheDocument();
    expect(screen.getByText(/Medium Volatility/)).toBeInTheDocument();
    expect(screen.getByText(/High Volatility/)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { Layout } from '../Layout';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from '../../../store/marketDataSlice';

jest.mock('../../Calendar/Calendar', () => ({
  Calendar: () => <div data-testid="calendar" />,
}));

jest.mock('../../Dashboard/DashboardPanel', () => ({
  DashboardPanel: () => <div data-testid="dashboard-panel" />,
}));

jest.mock('../../Controls/ControlPanel', () => ({
  ControlPanel: () => <div data-testid="control-panel" />,
}));

jest.mock('../Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

jest.mock('../Legends', () => ({
  Legends: () => <div data-testid="legends" />,
}));

jest.mock('../Header', () => ({
  Header: () => <div data-testid="header" />,
}));

// Helper to render with mocked store
const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      marketData: marketDataReducer,
    },
  });

  return render(
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};

describe('Layout', () => {
  it('should render all layout sections correctly', () => {
    renderWithStore();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('legends')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-panel')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should has correct background gradient', () => {
    const layoutWrapper = renderWithStore().container.firstChild;
    expect(layoutWrapper).toHaveClass(
      'min-h-screen',
      'bg-gradient-to-br',
      'from-gray-900',
      'via-gray-800',
      'to-blue-900'
    );
  });
});

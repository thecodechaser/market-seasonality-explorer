import { render, screen, fireEvent } from '@testing-library/react';
import { CustomDatePicker } from '../CustomDatePicker';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState } from '../../../store/store';

// Mocks
jest.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: any) => (
    <button onClick={() => onSelect(new Date('2024-01-15'))}>
      MockDayPicker
    </button>
  ),
}));

jest.mock('../../../store/marketDataThunks', () => ({
  loadMarketData: () => ({ type: 'marketData/loadMarketData' }),
}));

const mockStore = configureStore([thunk]);

const initialState: Partial<RootState> = {
  marketData: {
    customDateRange: {
      startDate: '2024-01-01T00:00:00Z',
      endDate: null,
    },
  },
};

describe('CustomDatePicker', () => {
  it('renders both start and end date pickers', () => {
    const store = mockStore(initialState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByText(/End Date/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MockDayPicker/i)).toHaveLength(2);
  });

  it('calls onClose when close button is clicked', () => {
    const store = mockStore(initialState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: '' })); // the <X /> icon
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('dispatches updateCustomDateRange when a date is selected', () => {
    const store = mockStore(initialState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getAllByText(/MockDayPicker/)[0]); // startDate picker
    const actions = store.getActions();

    expect(actions).toContainEqual({
      type: 'marketData/updateCustomDateRange',
      payload: {
        startDate: new Date('2024-01-15').toISOString(),
        endDate: null,
      },
    });
  });

  it('dispatches loadMarketData when both dates are set', () => {
    const completeState: Partial<RootState> = {
      marketData: {
        customDateRange: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-10T00:00:00Z',
        },
      },
    };
    const store = mockStore(completeState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getAllByText(/MockDayPicker/)[0]);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'marketData/updateCustomDateRange',
      payload: {
        startDate: new Date('2024-01-15').toISOString(),
        endDate: '2024-01-10T00:00:00Z',
      },
    });

    expect(actions).toContainEqual({ type: 'marketData/loadMarketData' });
  });
});

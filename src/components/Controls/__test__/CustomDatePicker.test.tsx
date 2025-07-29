import { render, screen, fireEvent } from '@testing-library/react';
import { CustomDatePicker } from '../CustomDatePicker';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState } from '../../../store/store';
import { format } from 'date-fns';

const mockStore = configureStore([thunk]);

const initialState: Partial<RootState> = {
  marketData: {
    customDateRange: {
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-10T00:00:00Z',
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

    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
  });

  it('calls onClose when X is clicked', () => {
    const store = mockStore(initialState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('dispatches updateCustomDateRange on start date selection', () => {
    const store = mockStore(initialState);
    const mockOnClose = jest.fn();

    render(
      <Provider store={store}>
        <CustomDatePicker onClose={mockOnClose} />
      </Provider>
    );

    // simulate a DayPicker cell click manually
    const dateCells = screen.getAllByRole('button');
    const dateToSelect = dateCells.find((cell) =>
      !cell.className.includes('rdp-day_disabled')
    );

    if (dateToSelect) {
      fireEvent.click(dateToSelect);
    }

    const actions = store.getActions();
    const updateAction = actions.find((a) =>
      a.type === 'marketData/updateCustomDateRange'
    );
    expect(updateAction).toBeTruthy();
  });
});

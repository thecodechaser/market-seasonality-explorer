import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSelection } from '../ThemeSelection';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTheme } from '../../../store/marketDataSlice';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../store/marketDataSlice', () => ({
  updateCurrentTheme: jest.fn(),
}));

describe('ThemeSelection', () => {
  const mockDispatch = jest.fn();
  const mockTheme = { id: 'dark', name: 'Dark' };
  const mockThemes = [
    { id: 'dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockReturnValue({
      currentTheme: mockTheme,
    });
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // mock colorThemes globally
    jest.mock('../../../config/metricsConfig.ts', () => ({
      colorThemes: mockThemes,
    }));
  });

  it('should render with the current theme selected', () => {
    render(<ThemeSelection />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('dark');
  });

  it('should list all color theme options', () => {
    render(<ThemeSelection />);
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should dispatch updateCurrentTheme on theme change', () => {
    render(<ThemeSelection />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'dark' } });

    expect(updateCurrentTheme).toHaveBeenCalledWith({
      colors: { low: '#06B6D4', medium: '#F97316', high: '#DC2626' },
      id: 'dark',
      name: 'High Contrast',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});

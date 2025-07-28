import { render, screen } from '@testing-library/react';
import { ControlPanel } from '../ControlPanel';
import '@testing-library/jest-dom';

jest.mock('../MetricsSelection.tsx', () => ({
  MetricsSelection: () => <div data-testid="metrics-selection">MetricsSelection</div>,
}));

jest.mock('../SymbolSelection.tsx', () => ({
  SymbolSelection: () => <div data-testid="symbol-selection">SymbolSelection</div>,
}));

jest.mock('../ThemeSelection.tsx', () => ({
  ThemeSelection: () => <div data-testid="theme-selection">ThemeSelection</div>,
}));

jest.mock('../ExportData.tsx', () => ({
  ExportData: () => <div data-testid="export-data">ExportData</div>,
}));

describe('ControlPanel', () => {
  it('renders section title', () => {
    render(<ControlPanel />);
    expect(screen.getByText(/Filters & Controls/i)).toBeInTheDocument();
  });

  it('should render all subcomponents', () => {
    render(<ControlPanel />);

    expect(screen.getByTestId('symbol-selection')).toBeInTheDocument();
    expect(screen.getByTestId('metrics-selection')).toBeInTheDocument();
    expect(screen.getByTestId('theme-selection')).toBeInTheDocument();
    expect(screen.getByTestId('export-data')).toBeInTheDocument();
  });

  it('should render quick actions', () => {
    render(<ControlPanel />);

    expect(screen.getByText(/Reset Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Save View/i)).toBeInTheDocument();
  });

  it('should render Settings icon label', () => {
    render(<ControlPanel />);
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
  });
});

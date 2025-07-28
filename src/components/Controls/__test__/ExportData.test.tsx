import { render, screen, fireEvent } from '@testing-library/react';
import { ExportData } from '../ExportData';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

jest.mock('../../../utils/exportMarketData.ts', () => ({
  exportMarketData: jest.fn(),
}));

jest.mock('../../../hooks/useClickOutside.ts', () => ({
  useClickOutside: jest.fn(),
}));

// Mock Redux state
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ExportData', () => {
  const mockData = [
    { symbol: 'BTCUSDT', close: 60000, performance: 2.5 },
    { symbol: 'ETHUSDT', close: 3000, performance: -1.2 },
  ];

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        marketData: {
          exportData: mockData,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Export button', () => {
    render(<ExportData />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('should show export menu when clicked', () => {
    render(<ExportData />);
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText(/Export as PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as Image/i)).toBeInTheDocument();
  });

  it('should call exportMarketData with correct format when PDF is clicked', () => {
    const { exportMarketData } = require('../../../utils/exportMarketData.ts');
    render(<ExportData />);
    fireEvent.click(screen.getByText('Export'));
    fireEvent.click(screen.getByText(/Export as PDF/i));
    expect(exportMarketData).toHaveBeenCalledWith({
      data: mockData,
      format: 'pdf',
    });
  });

  it('should call exportMarketData with correct format when CSV is clicked', () => {
    const { exportMarketData } = require('../../../utils/exportMarketData.ts');
    render(<ExportData />);
    fireEvent.click(screen.getByText('Export'));
    fireEvent.click(screen.getByText(/Export as CSV/i));
    expect(exportMarketData).toHaveBeenCalledWith({
      data: mockData,
      format: 'csv',
    });
  });

  it('should call exportMarketData with correct format when Image is clicked', () => {
    const { exportMarketData } = require('../../../utils/exportMarketData.ts');
    render(<ExportData />);
    fireEvent.click(screen.getByText('Export'));
    fireEvent.click(screen.getByText(/Export as Image/i));
    expect(exportMarketData).toHaveBeenCalledWith({
      data: mockData,
      format: 'image',
    });
  });
});

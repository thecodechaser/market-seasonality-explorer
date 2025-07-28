import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('should render all footer text elements correctly', () => {
    render(<Footer />);

    expect(
      screen.getByText(/Market Seasonality Explorer/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /thecodechaser\.com/i });
    expect(link).toHaveAttribute('href', 'https://thecodechaser.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should render current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('should render current time', () => {
    render(<Footer />);

    expect(
      screen.getByText((content) =>
        content.includes('Data updates every minute')
      )
    ).toBeInTheDocument();
  });
});

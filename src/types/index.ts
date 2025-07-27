export interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility: number;
  liquidity: number;
  performance: number;
  symbol: string;
}

export interface CalendarCell {
  date: Date;
  data?: MarketData;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

export interface TimeFrame {
  id: 'daily' | 'weekly' | 'monthly';
  label: string;
}

export interface FilterOptions {
  symbol: string;
  timeframe: TimeFrame['id'];
  metrics: string[];
}

export interface ColorTheme {
  id: string;
  name: string;
  colors: {
    low: string;
    medium: string;
    high: string;
  };
}

export interface DashboardData {
  selectedDate: Date | null;
  data: MarketData | null;
  isVisible: boolean;
  timeframe?: 'daily' | 'weekly' | 'monthly';
}
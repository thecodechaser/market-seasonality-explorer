export interface BinanceKlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface BinanceTicker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: any[];
  permissions: string[];
}

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
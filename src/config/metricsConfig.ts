// Constants

import { ColorTheme, TimeFrame, BinanceSymbol } from '../types';

export const metrics = ['Volatility', 'Liquidity', 'Volume', 'Performance'];

export const colorThemes: ColorTheme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: { low: '#10B981', medium: '#F59E0B', high: '#EF4444' },
  },
  {
    id: 'colorblind',
    name: 'Colorblind Friendly',
    colors: { low: '#3B82F6', medium: '#8B5CF6', high: '#EC4899' },
  },
  {
    id: 'dark',
    name: 'High Contrast',
    colors: { low: '#06B6D4', medium: '#F97316', high: '#DC2626' },
  },
];

export const fallbackSymbols = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT' },
  { symbol: 'XRPUSDT', baseAsset: 'XRP', quoteAsset: 'USDT' },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT' },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT' },
  { symbol: 'SHIBUSDT', baseAsset: 'SHIB', quoteAsset: 'USDT' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT' },
  { symbol: 'DOTUSDT', baseAsset: 'DOT', quoteAsset: 'USDT' },
] as BinanceSymbol[];

export const filterSymbols = [
  'BTC',
  'ETH',
  'DOGE',
  'SHIB',
  'BNB',
  'ADA',
  'SOL',
  'DOT',
  'MATIC',
  'AVAX',
  'LINK',
  'UNI',
];

export const timeframes: TimeFrame[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

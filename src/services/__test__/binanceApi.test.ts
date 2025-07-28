import { binanceApi } from '../binanceApi';
import { BinanceSymbol, BinanceTicker24hr } from '../../types';

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe('BinanceApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear cache
    (binanceApi as any).symbolsCache = [];
    (binanceApi as any).symbolsCacheTime = 0;
  });

  describe('getAllSymbols', () => {
    it('should fetch and cache USDT trading symbols', async () => {
      const mockSymbols: BinanceSymbol[] = [
        {
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          status: 'TRADING',
          isSpotTradingAllowed: true,
        },
        {
          symbol: 'ETHBTC',
          baseAsset: 'ETH',
          quoteAsset: 'BTC',
          status: 'TRADING',
          isSpotTradingAllowed: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbols: mockSymbols }),
      });

      const result = await binanceApi.getAllSymbols();
      expect(result).toEqual([mockSymbols[0]]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return cached data if not expired', async () => {
      (binanceApi as any).symbolsCache = [{ symbol: 'BTCUSDT' }];
      (binanceApi as any).symbolsCacheTime = Date.now();

      const result = await binanceApi.getAllSymbols();
      expect(result).toEqual([{ symbol: 'BTCUSDT' }]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('searchSymbols', () => {
    it('should return matching symbols', async () => {
      const mockSymbols: BinanceSymbol[] = [
        { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
        { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
      ];

      (binanceApi as any).symbolsCache = mockSymbols;
      (binanceApi as any).symbolsCacheTime = Date.now();

      const result = await binanceApi.searchSymbols('eth');
      expect(result).toEqual([mockSymbols[1]]);
    });
  });

  describe('getKlineData', () => {
    it('should fetch and map kline data', async () => {
      const mockKlines = [[1, '10', '20', '5', '15', '100', 2, '200', 10, '50', '60']];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockKlines,
      });

      const result = await binanceApi.getKlineData('BTCUSDT', '1d');
      expect(result[0]).toMatchObject({
        openTime: 1,
        open: '10',
        high: '20',
        low: '5',
        close: '15',
      });
    });
  });

  describe('get24hrTicker', () => {
    it('should fetch 24hr ticker', async () => {
      const mockTicker: BinanceTicker24hr = {
        symbol: 'BTCUSDT',
        priceChange: '10',
        priceChangePercent: '1.5',
        weightedAvgPrice: '20000',
        lastPrice: '20500',
        lastQty: '1',
        openPrice: '20000',
        highPrice: '21000',
        lowPrice: '19000',
        volume: '1000',
        quoteVolume: '20000000',
        openTime: 0,
        closeTime: 0,
        firstId: 0,
        lastId: 0,
        count: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicker,
      });

      const result = await binanceApi.get24hrTicker('BTCUSDT');
      expect(result).toEqual(mockTicker);
    });
  });

  describe('getCurrentPrice', () => {
    it('should fetch current price', async () => {
      const mockPrice = { symbol: 'BTCUSDT', price: '30000' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrice,
      });

      const result = await binanceApi.getCurrentPrice('BTCUSDT');
      expect(result).toEqual(mockPrice);
    });
  });

  describe('getOrderBookDepth', () => {
    it('should fetch order book depth', async () => {
      const mockDepth = {
        lastUpdateId: 1,
        bids: [['30000', '1']],
        asks: [['31000', '2']],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDepth,
      });

      const result = await binanceApi.getOrderBookDepth('BTCUSDT');
      expect(result).toEqual(mockDepth);
    });
  });

  describe('calculateVolatility', () => {
    it('should calculate correct volatility', () => {
      const prices = Array.from({ length: 21 }, (_, i) => 100 + i);
      const result = binanceApi.calculateVolatility(prices);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for insufficient data', () => {
      const prices = [100, 101];
      expect(binanceApi.calculateVolatility(prices)).toBe(0);
    });
  });

  describe('calculateLiquidityScore', () => {
    it('should calculate correct liquidity score', () => {
      const mockOrderBook = {
        bids: Array(10).fill(['30000', '1']),
        asks: Array(10).fill(['31000', '1']),
      };
      const score = binanceApi.calculateLiquidityScore(mockOrderBook);
      expect(score).toBe(2);
    });
  });
});

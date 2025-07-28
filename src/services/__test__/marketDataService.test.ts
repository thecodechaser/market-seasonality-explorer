import { marketDataService } from '../marketDataService';
import { binanceApi } from '../binanceApi';
import { BinanceKlineData, BinanceTicker24hr } from '../../types';

// Mock the binanceApi methods
jest.mock('../binanceApi', () => ({
  binanceApi: {
    getKlineData: jest.fn(),
    get24hrTicker: jest.fn(),
    getCurrentPrice: jest.fn(),
    getOrderBookDepth: jest.fn(),
    calculateLiquidityScore: jest.fn(),
  },
}));

const mockedApi = binanceApi as jest.Mocked<typeof binanceApi>;

describe('MarketDataService', () => {
  const symbol = 'BTCUSDT';
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');

  beforeEach(() => {
    jest.clearAllMocks();
    marketDataService.clearCache();
  });

  describe('getMarketData', () => {
    const mockKline: BinanceKlineData = {
      openTime: Date.now(),
      open: '100',
      high: '110',
      low: '90',
      close: '105',
      volume: '1000',
      numberOfTrades: 200,
    };

    it('should fetch and convert data correctly', async () => {
      mockedApi.getKlineData.mockResolvedValue([mockKline]);

      const result = await marketDataService.getMarketData(startDate, endDate, symbol, 'daily');

      expect(result.length).toBe(1);
      expect(result[0].symbol).toBe(symbol);
      expect(result[0].performance).toBeCloseTo(5);
      expect(mockedApi.getKlineData).toHaveBeenCalled();
    });

    it('should use cache if data is available and fresh', async () => {
      mockedApi.getKlineData.mockResolvedValue([mockKline]);

      const firstCall = await marketDataService.getMarketData(startDate, endDate, symbol, 'daily');
      const secondCall = await marketDataService.getMarketData(startDate, endDate, symbol, 'daily');

      expect(firstCall).toEqual(secondCall);
      expect(mockedApi.getKlineData).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no kline data returned', async () => {
      mockedApi.getKlineData.mockResolvedValue([]);

      await expect(
        marketDataService.getMarketData(startDate, endDate, symbol, 'daily')
      ).rejects.toThrow('No data received from Binance API');
    });

    it('should throw friendly error for network failure', async () => {
      mockedApi.getKlineData.mockRejectedValue(new Error('fetch failed'));

      await expect(
        marketDataService.getMarketData(startDate, endDate, symbol, 'daily')
      ).rejects.toThrow('Failed to fetch market data');
    });
  });

  describe('getRealtimeData', () => {
    it('should fetch and compute realtime data correctly', async () => {
      mockedApi.get24hrTicker.mockResolvedValue({
        openPrice: '100',
        highPrice: '110',
        lowPrice: '90',
        priceChangePercent: '10',
        volume: '1000',
      } as any as BinanceTicker24hr);

      mockedApi.getCurrentPrice.mockResolvedValue({ symbol, price: '110' });
      mockedApi.getOrderBookDepth.mockResolvedValue({
        bids: [],
        asks: [],
      });
      mockedApi.calculateLiquidityScore.mockReturnValue(42);

      const data = await marketDataService.getRealtimeData(symbol);

      expect(data.symbol).toBe(symbol);
      expect(data.performance).toBe(10);
      expect(data.close).toBe(110);
      expect(data.liquidity).toBe(42);
      expect(mockedApi.get24hrTicker).toHaveBeenCalledWith(symbol);
    });

    it('should throw friendly error for network failure', async () => {
      mockedApi.get24hrTicker.mockRejectedValue(new Error('fetch failed'));

      await expect(marketDataService.getRealtimeData(symbol)).rejects.toThrow(
        'Failed to fetch market data'
      );
    });
  });

  describe('getVolatilityLevel', () => {
    it('should return "low" for volatility < 2', () => {
      expect(marketDataService.getVolatilityLevel(1.5)).toBe('low');
    });

    it('should return "medium" for volatility between 2 and 4', () => {
      expect(marketDataService.getVolatilityLevel(3)).toBe('medium');
    });

    it('should return "high" for volatility >= 4', () => {
      expect(marketDataService.getVolatilityLevel(5)).toBe('high');
    });
  });

  describe('Cache operations', () => {
    it('should clear cache and return stats', async () => {
      mockedApi.getKlineData.mockResolvedValue([
        {
          open,
          openTime: Date.now(),
        },
      ]);

      await marketDataService.getMarketData(startDate, endDate, symbol, 'daily');
      const stats = marketDataService.getCacheStats();

      expect(stats.size).toBe(1);
      expect(stats.keys[0]).toContain(symbol);

      marketDataService.clearCache();
      expect(marketDataService.getCacheStats().size).toBe(0);
    });
  });
});

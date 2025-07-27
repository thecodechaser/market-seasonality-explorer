import { MarketData } from '../types';
import { binanceApi, BinanceKlineData } from './binanceApi';

class MarketDataService {
  private cache = new Map<string, { data: MarketData[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(startDate: Date, endDate: Date, symbol: string, timeframe: string): string {
    return `${symbol}-${timeframe}-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getBinanceInterval(timeframe: 'daily' | 'weekly' | 'monthly'): '1d' | '1w' | '1M' {
    switch (timeframe) {
      case 'weekly': return '1w';
      case 'monthly': return '1M';
      default: return '1d';
    }
  }

  private convertBinanceToMarketData(klineData: BinanceKlineData[], symbol: string): MarketData[] {
    return klineData.map(kline => {
      const open = parseFloat(kline.open);
      const close = parseFloat(kline.close);
      const high = parseFloat(kline.high);
      const low = parseFloat(kline.low);
      const volume = parseFloat(kline.volume);
      
      // Calculate performance as percentage change
      const performance = ((close - open) / open) * 100;
      
      // Calculate simple volatility as (high - low) / close * 100
      const volatility = ((high - low) / close) * 100;
      
      // Simple liquidity score based on volume and number of trades
      const liquidity = Math.min((volume / 1000) + (kline.numberOfTrades / 100), 100);

      return {
        date: new Date(kline.openTime).toISOString().split('T')[0],
        symbol,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(volume),
        volatility: Number(volatility.toFixed(2)),
        liquidity: Number(liquidity.toFixed(1)),
        performance: Number(performance.toFixed(2))
      };
    });
  }

  private generateFallbackData(startDate: Date, endDate: Date, symbol: string): MarketData[] {
    console.warn('Using fallback mock data due to API failure');
    
    const data: MarketData[] = [];
    const basePrice = symbol === 'BTC' ? 45000 : symbol === 'ETH' ? 3000 : 100;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        const volatility = Math.random() * 5 + 1;
        const dayOfYear = this.getDayOfYear(currentDate);
        const seasonalFactor = Math.sin(dayOfYear / 365 * 2 * Math.PI) * 0.1 + 1;
        
        const open = basePrice * seasonalFactor * (0.9 + Math.random() * 0.2);
        const change = (Math.random() - 0.5) * volatility * 0.02;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        
        data.push({
          date: currentDate.toISOString().split('T')[0],
          symbol,
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000 + 100000),
          volatility: Number(volatility.toFixed(2)),
          liquidity: Math.random() * 100 + 50,
          performance: Number(((close - open) / open * 100).toFixed(2))
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  async getMarketData(
    startDate: Date, 
    endDate: Date, 
    symbol: string, 
    timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<MarketData[]> {
    const cacheKey = this.getCacheKey(startDate, endDate, symbol, timeframe);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      // For better data coverage, extend the date range
      const extendedStartDate = new Date(startDate);
      if (timeframe === 'monthly') {
        extendedStartDate.setFullYear(extendedStartDate.getFullYear() - 1);
      } else if (timeframe === 'weekly') {
        extendedStartDate.setMonth(extendedStartDate.getMonth() - 3);
      } else {
        extendedStartDate.setMonth(extendedStartDate.getMonth() - 1);
      }

      const binanceInterval = this.getBinanceInterval(timeframe);
      const startTime = extendedStartDate.getTime();
      const endTime = endDate.getTime();
      
      console.log(`Fetching ${symbol} data from Binance API...`);
      
      const klineData = await binanceApi.getKlineData(
        symbol,
        binanceInterval,
        startTime,
        endTime,
        1000
      );

      if (!klineData || klineData.length === 0) {
        console.warn('No data received from Binance API, using fallback data');
        const fallbackData = this.generateFallbackData(startDate, endDate, symbol);
        return fallbackData;
      }

      const marketData = this.convertBinanceToMarketData(klineData, symbol);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: marketData,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${marketData.length} data points for ${symbol}`);
      return marketData;

    } catch (error) {
      console.error('Failed to fetch data from Binance API:', error);
      
      // Return fallback data
      const fallbackData = this.generateFallbackData(startDate, endDate, symbol);
      return fallbackData;
    }
  }

  async getRealtimeData(symbol: string): Promise<MarketData> {
    try {
      const [ticker24hr, currentPrice, orderBook] = await Promise.all([
        binanceApi.get24hrTicker(symbol),
        binanceApi.getCurrentPrice(symbol),
        binanceApi.getOrderBookDepth(symbol, 20)
      ]);

      const liquidity = binanceApi.calculateLiquidityScore(orderBook);
      
      return {
        date: new Date().toISOString().split('T')[0],
        symbol,
        open: Number(parseFloat(ticker24hr.openPrice).toFixed(2)),
        high: Number(parseFloat(ticker24hr.highPrice).toFixed(2)),
        low: Number(parseFloat(ticker24hr.lowPrice).toFixed(2)),
        close: Number(parseFloat(currentPrice.price).toFixed(2)),
        volume: Math.floor(parseFloat(ticker24hr.volume)),
        volatility: Number(Math.abs(parseFloat(ticker24hr.priceChangePercent)).toFixed(2)),
        liquidity: Number(liquidity.toFixed(1)),
        performance: Number(parseFloat(ticker24hr.priceChangePercent).toFixed(2))
      };
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
      
      // Return fallback data
      return this.generateFallbackData(new Date(), new Date(), symbol)[0];
    }
  }

  getVolatilityLevel(volatility: number): 'low' | 'medium' | 'high' {
    if (volatility < 2) return 'low';
    if (volatility < 4) return 'medium';
    return 'high';
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const marketDataService = new MarketDataService();
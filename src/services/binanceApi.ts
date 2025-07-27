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

class BinanceApiService {
  private readonly baseUrl = 'https://api.binance.com/api/v3';
  
  private symbolsCache: BinanceSymbol[] = [];
  private symbolsCacheTime = 0;
  private readonly SYMBOLS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async getAllSymbols(): Promise<BinanceSymbol[]> {
    // Check cache first
    if (this.symbolsCache.length > 0 && Date.now() - this.symbolsCacheTime < this.SYMBOLS_CACHE_DURATION) {
      return this.symbolsCache;
    }

    try {
      const url = `${this.baseUrl}/exchangeInfo`;
      const data = await this.fetchWithRetry(url);
      
      // Filter for USDT pairs only and active symbols
      this.symbolsCache = data.symbols.filter((symbol: BinanceSymbol) => 
        symbol.quoteAsset === 'USDT' && 
        symbol.status === 'TRADING' &&
        symbol.isSpotTradingAllowed
      );
      
      this.symbolsCacheTime = Date.now();
      return this.symbolsCache;
    } catch (error) {
      console.error('Failed to fetch symbols:', error);
      return [];
    }
  }

  async searchSymbols(query: string): Promise<BinanceSymbol[]> {
    const allSymbols = await this.getAllSymbols();
    const searchTerm = query.toUpperCase();
    
    return allSymbols.filter(symbol => 
      symbol.baseAsset.includes(searchTerm) || 
      symbol.symbol.includes(searchTerm)
    ).slice(0, 50); // Limit results
  }

  async getKlineData(
    symbol: string, 
    interval: '1d' | '1w' | '1M', 
    startTime?: number, 
    endTime?: number,
    limit = 1000
  ): Promise<BinanceKlineData[]> {
    // If symbol doesn't end with USDT, assume it's a base asset and add USDT
    const binanceSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
    
    let url = `${this.baseUrl}/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`;
    
    if (startTime) {
      url += `&startTime=${startTime}`;
    }
    if (endTime) {
      url += `&endTime=${endTime}`;
    }

    try {
      const data = await this.fetchWithRetry(url);
      
      return data.map((kline: any[]) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10]
      }));
    } catch (error) {
      console.error('Failed to fetch Binance kline data:', error);
      throw error;
    }
  }

  async get24hrTicker(symbol: string): Promise<BinanceTicker24hr> {
    const binanceSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
    const url = `${this.baseUrl}/ticker/24hr?symbol=${binanceSymbol}`;

    try {
      return await this.fetchWithRetry(url);
    } catch (error) {
      console.error('Failed to fetch 24hr ticker:', error);
      throw error;
    }
  }

  async getCurrentPrice(symbol: string): Promise<{ symbol: string; price: string }> {
    const binanceSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
    const url = `${this.baseUrl}/ticker/price?symbol=${binanceSymbol}`;

    try {
      return await this.fetchWithRetry(url);
    } catch (error) {
      console.error('Failed to fetch current price:', error);
      throw error;
    }
  }

  async getOrderBookDepth(symbol: string, limit = 100): Promise<{
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
  }> {
    const binanceSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
    const url = `${this.baseUrl}/depth?symbol=${binanceSymbol}&limit=${limit}`;

    try {
      return await this.fetchWithRetry(url);
    } catch (error) {
      console.error('Failed to fetch order book depth:', error);
      throw error;
    }
  }

  // Calculate volatility from price data
  calculateVolatility(prices: number[], period = 20): number {
    if (prices.length < period) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance * 365) * 100;
  }

  // Calculate liquidity score based on order book depth
  calculateLiquidityScore(orderBook: { bids: [string, string][]; asks: [string, string][] }): number {
    const bidVolume = orderBook.bids.slice(0, 10).reduce((sum, [, qty]) => sum + parseFloat(qty), 0);
    const askVolume = orderBook.asks.slice(0, 10).reduce((sum, [, qty]) => sum + parseFloat(qty), 0);
    const totalVolume = bidVolume + askVolume;
  
    return Math.min(totalVolume / 1000 * 100, 100);
  }
}

export const binanceApi = new BinanceApiService();
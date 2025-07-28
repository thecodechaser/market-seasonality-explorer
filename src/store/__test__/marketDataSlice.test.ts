import reducer, {
  updateCurrentTheme,
  updateExportData,
  updateHoveredCell,
  updateDashboardData,
  updateSelectedDate,
  updateTimeframe,
  updateFilters,
  updateMarketData,
  updateLoading,
  updateCurrentDate,
  updateSymbolList,
  updateError,
} from '../marketDataSlice'

import { CalendarCell, ColorTheme, DashboardData, FilterOptions, MarketData, BinanceSymbol } from '../../types'

describe('marketDataSlice', () => {
  const initialState = reducer(undefined, { type: '' })

  it('should handle updateCurrentTheme', () => {
    const theme: ColorTheme = {
      id: 'dark',
      name: 'Dark Mode',
      colors: { low: '#111111', medium: '#888888', high: '#ffffff' },
    }

    const state = reducer(initialState, updateCurrentTheme(theme))
    expect(state.currentTheme).toEqual(theme)
  })

  it('should handle updateExportData', () => {
    const exportData: CalendarCell[] = [
      {
        date: new Date(),
        data: {
          date: '2025-07-28',
          open: 1,
          high: 2,
          low: 0.5,
          close: 1.5,
          volume: 100,
          volatility: 0.1,
          liquidity: 0.8,
          performance: 0.5,
          symbol: 'BTC',
        },
        isToday: true,
        isSelected: false,
        isInRange: false,
        timeframe: 'daily',
      },
    ]

    const state = reducer(initialState, updateExportData(exportData))
    expect(state.exportData).toEqual(exportData)
  })

  it('should handle updateHoveredCell', () => {
    const cell: CalendarCell = {
      date: new Date(),
      isToday: false,
      isSelected: true,
      isInRange: true,
    }

    const state = reducer(initialState, updateHoveredCell(cell))
    expect(state.hoveredCell).toEqual(cell)
  })

  it('should handle updateDashboardData', () => {
    const data: DashboardData = {
      selectedDate: new Date('2025-01-01'),
      data: {
        date: '2025-01-01',
        open: 100,
        high: 110,
        low: 90,
        close: 105,
        volume: 10000,
        volatility: 0.3,
        liquidity: 0.6,
        performance: 0.9,
        symbol: 'ETH',
      },
      isVisible: true,
      timeframe: 'weekly',
    }

    const state = reducer(initialState, updateDashboardData(data))
    expect(state.dashboardData).toEqual(expect.objectContaining(data))
  })

  it('should handle updateSelectedDate', () => {
    const date = new Date('2025-07-28')
    const state = reducer(initialState, updateSelectedDate(date))
    expect(state.selectedDate).toEqual(date)
  })

  it('should handle updateTimeframe', () => {
    const state = reducer(initialState, updateTimeframe('weekly'))
    expect(state.timeframe).toBe('weekly')
  })

  it('should handle updateFilters', () => {
    const filters: Partial<FilterOptions> = {
      symbol: 'ETH',
      metrics: ['Volume'],
    }

    const state = reducer(initialState, updateFilters(filters))
    expect(state.filters.symbol).toBe('ETH')
    expect(state.filters.metrics).toContain('Volume')
  })

  it('should handle updateMarketData', () => {
    const marketData: MarketData[] = [
      {
        date: '2025-07-28',
        open: 100,
        high: 120,
        low: 90,
        close: 110,
        volume: 5000,
        volatility: 0.2,
        liquidity: 0.75,
        performance: 0.85,
        symbol: 'BTC',
      },
    ]

    const state = reducer(initialState, updateMarketData(marketData))
    expect(state.marketData).toEqual(marketData)
  })

  it('should handle updateLoading', () => {
    const state = reducer(initialState, updateLoading(true))
    expect(state.loading).toBe(true)
  })

  it('should handle updateCurrentDate', () => {
    const date = new Date()
    const state = reducer(initialState, updateCurrentDate(date))
    expect(state.currentDate).toEqual(date)
  })

  it('should handle updateSymbolList', () => {
    const symbols: BinanceSymbol[] = [
      {
        symbol: 'BTCUSDT',
        status: 'TRADING',
        baseAsset: 'BTC',
        baseAssetPrecision: 8,
        quoteAsset: 'USDT',
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        quoteCommissionPrecision: 8,
        orderTypes: ['LIMIT', 'MARKET'],
        icebergAllowed: true,
        ocoAllowed: true,
        quoteOrderQtyMarketAllowed: true,
        allowTrailingStop: false,
        cancelReplaceAllowed: false,
        isSpotTradingAllowed: true,
        isMarginTradingAllowed: false,
        filters: [],
        permissions: ['SPOT'],
      },
    ]

    const state = reducer(initialState, updateSymbolList(symbols))
    expect(state.symbols).toEqual(symbols)
  })

  it('should handle updateError', () => {
    const error = 'Something went wrong'
    const state = reducer(initialState, updateError(error))
    expect(state.error).toBe(error)
  })
})

import { createSlice } from '@reduxjs/toolkit';
import {
  FilterOptions,
  DashboardData,
  ColorTheme,
  TimeFrame,
  CalendarCell as CalendarCellType,
  BinanceSymbol
} from '../types';

// Initial state
const initialState: {
  currentTheme: ColorTheme;
  exportData: CalendarCellType[];
  hoveredCell: CalendarCellType | null;
  dashboardData: DashboardData;
  selectedDate: Date | null;
  timeframe: TimeFrame['id'];
  filters: FilterOptions;
  marketData: [];
  loading: boolean;
  currentDate: Date | null;
  symbols: BinanceSymbol[];
  error: string | null
} = {
  currentTheme: {
    id: 'default',
    name: 'Default',
    colors: { low: '#10B981', medium: '#F59E0B', high: '#EF4444' },
  },
  exportData: [],
  hoveredCell: null,
  dashboardData: {
    selectedDate: null,
    data: null,
    isVisible: false,
  },
  selectedDate: null,
  timeframe: 'daily',
  filters: {
    symbol: 'BTC',
    timeframe: 'daily',
    metrics: ['Volatility', 'Liquidity', 'Performance', 'Volume'],
  },
  marketData: [],
  loading: false,
  currentDate: null,
  symbols: [],
  error: null,
};

// Actions
const marketDataSlice = createSlice({
  name: 'marketData',
  initialState,
  reducers: {
    updateCurrentTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    updateExportData: (state, action) => {
      state.exportData = action.payload;
    },
    updateHoveredCell: (state, action) => {
      state.hoveredCell = action.payload;
    },
    updateDashboardData: (state, action) => {
      state.dashboardData = {
        ...state.dashboardData,
        ...action.payload,
      };
    },
    updateSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    updateTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    updateMarketData: (state, action) => {
      state.marketData = action.payload;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    updateSymbolList: (state, action) => {
      state.symbols = action.payload;
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.timeframe = initialState.timeframe;
      state.currentTheme = initialState.currentTheme
    }
  },
});

export const {
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
  clearFilters
} = marketDataSlice.actions;

export default marketDataSlice.reducer;

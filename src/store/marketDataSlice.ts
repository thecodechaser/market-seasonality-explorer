import { createSlice } from '@reduxjs/toolkit';
import {
  FilterOptions,
  DashboardData,
  ColorTheme,
  TimeFrame,
  CalendarCell as CalendarCellType,
} from '../types';

const initialState: {
  currentTheme: ColorTheme;
  exportData: CalendarCellType[];
  hoveredCell: CalendarCellType | null;
  dashboardData: DashboardData;
  selectedDate: Date | null;
  timeframe: TimeFrame['id'];
  filters: FilterOptions;
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
  }
};

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
  updateFilters
} = marketDataSlice.actions;

export default marketDataSlice.reducer;

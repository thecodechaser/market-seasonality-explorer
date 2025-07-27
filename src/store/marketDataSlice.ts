import { createSlice, current } from '@reduxjs/toolkit';
import {
  CalendarCell,
  FilterOptions,
  DashboardData,
  ColorTheme,
  CalendarCell as CalendarCellType
} from '../types';

const initialState: { currentTheme: ColorTheme, exportData: CalendarCellType[] } = {
  currentTheme: {
    id: 'default',
    name: 'Default',
    colors: { low: '#10B981', medium: '#F59E0B', high: '#EF4444' },
  },
  exportData: [],
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
    }
  },
});

export const {
  updateCurrentTheme,
  updateExportData
} = marketDataSlice.actions;

export default marketDataSlice.reducer;

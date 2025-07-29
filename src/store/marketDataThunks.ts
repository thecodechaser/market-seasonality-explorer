import { createAsyncThunk } from '@reduxjs/toolkit';
import { marketDataService } from '../services/marketDataService';
import {
  updateLoading,
  updateMarketData,
  updateSymbolList,
  updateError,
} from './marketDataSlice';
import { binanceApi } from '../services/binanceApi';
import { fallbackSymbols, filterSymbols } from '../config/metricsConfig';
import { RootState } from './store';

// Methods to call APIs functions
export const loadMarketData = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('marketData/load', async (_, { getState, dispatch }) => {
  const state = getState();
  const { currentDate, timeframe, filters } = state.marketData;
  const parsedCurrentDate = new Date(currentDate || new Date());
  const symbol = filters.symbol;

  dispatch(updateLoading(true));
  try {
    let startDate: Date, endDate: Date;

    if (timeframe === 'custom') {
      const { startDate: rawStart, endDate: rawEnd } =
        state.marketData.customDateRange || {};
      if (!rawStart || !rawEnd) {
        dispatch(updateMarketData([]));
        return;
      }
      startDate = new Date(rawStart);
      endDate = new Date(rawEnd);
    } else if (timeframe === 'daily' || timeframe === 'weekly') {
      startDate = new Date(
        parsedCurrentDate.getFullYear(),
        parsedCurrentDate.getMonth(),
        1
      );
      endDate = new Date(
        parsedCurrentDate.getFullYear(),
        parsedCurrentDate.getMonth() + 1,
        0
      );
    } else {
      startDate = new Date(parsedCurrentDate.getFullYear(), 0, 1);
      endDate = new Date(parsedCurrentDate.getFullYear(), 11, 31);
    }

    const data = await marketDataService.getMarketData(
      startDate,
      endDate,
      symbol,
      timeframe
    );
    dispatch(updateMarketData(data));
    dispatch(updateError(null));
  } catch (error: unknown) {
    let message = 'Unknown error occurred';
    if (error instanceof Error) message = error.message;
    dispatch(updateError(message));
    dispatch(updateMarketData([]));
  } finally {
    dispatch(updateLoading(false));
  }
});

export const updateRealtimeData = createAsyncThunk(
  'marketData/updateRealtimeData',
  async (_, { getState, dispatch }) => {
    const state: any = getState();
    const { timeframe, filters, marketData } = state.marketData;
    const symbol = filters.symbol;

    if (timeframe !== 'daily') return;

    try {
      const realtimeData = await marketDataService.getRealtimeData(symbol);

      const updatedData = [...marketData];
      const todayIndex = updatedData.findIndex(
        (d) => d.date === realtimeData.date
      );
      if (todayIndex >= 0) {
        updatedData[todayIndex] = realtimeData;
      } else {
        updatedData.push(realtimeData);
      }
      dispatch(updateMarketData(updatedData));
      dispatch(updateError(null));
    } catch (error: unknown) {
      let message = 'Unknown error occurred';
      if (error instanceof Error) message = error.message;
      dispatch(updateError(message));
      dispatch(updateMarketData([]));
    }
  }
);

export const loadSymbols = createAsyncThunk(
  'marketData/loadSymbols',
  async (_, { dispatch }) => {
    try {
      const allSymbols = await binanceApi.getAllSymbols();
      const popularSymbols = allSymbols
        .filter((s) => filterSymbols.includes(s.baseAsset))
        .concat(allSymbols.filter((s) => !filterSymbols.includes(s.baseAsset)))
        .slice(0, 100);

      dispatch(updateSymbolList(popularSymbols));
    } catch (error) {
      console.error('Failed to load symbols:', error);
      dispatch(updateSymbolList(fallbackSymbols));
    }
  }
);

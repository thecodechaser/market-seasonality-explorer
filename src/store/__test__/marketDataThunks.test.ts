import {
  loadMarketData,
  updateRealtimeData,
  loadSymbols,
} from '../marketDataThunks';
import { marketDataService } from '../../services/marketDataService';
import { binanceApi } from '../../services/binanceApi';
import { fallbackSymbols } from '../../config/metricsConfig';

import {
  updateMarketData,
  updateLoading,
  updateSymbolList,
  updateError,
} from '../marketDataSlice';

jest.mock('../../services/marketDataService');
jest.mock('../../services/binanceApi');

// Helper to create mock dispatch/getState
const createThunkApi = (overrides = {}) => {
  const defaultState = {
    marketData: {
      currentDate: '2025-07-01',
      timeframe: 'daily',
      filters: { symbol: 'BTCUSDT' },
      marketData: [],
    },
  };

  return {
    dispatch: jest.fn(),
    getState: () => ({ ...defaultState, ...overrides }),
  };
};

const mockMarketData = [{ date: '2025-07-01', open: 1000, close: 1050 }];

describe('marketDataThunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadMarketData', () => {
    it('should dispatch market data and loading on success', async () => {
      (marketDataService.getMarketData as jest.Mock).mockResolvedValue(
        mockMarketData
      );

      const { dispatch, getState } = createThunkApi();
      await loadMarketData()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(updateLoading(true));
      expect(marketDataService.getMarketData).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(updateMarketData(mockMarketData));
      expect(dispatch).toHaveBeenCalledWith(updateError(null));
      expect(dispatch).toHaveBeenCalledWith(updateLoading(false));
    });

    it('should dispatch error on failure', async () => {
      (marketDataService.getMarketData as jest.Mock).mockRejectedValue(
        new Error('Failed')
      );

      const { dispatch, getState } = createThunkApi();
      await loadMarketData()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(updateLoading(true));
      expect(dispatch).toHaveBeenCalledWith(updateError('Failed'));
      expect(dispatch).toHaveBeenCalledWith(updateMarketData([]));
      expect(dispatch).toHaveBeenCalledWith(updateLoading(false));
    });
  });

  describe('updateRealtimeData', () => {
    it('should merge realtime data into existing data', async () => {
      (marketDataService.getRealtimeData as jest.Mock).mockResolvedValue({
        date: '2025-07-01',
        open: 1010,
        close: 1060,
      });

      const { dispatch, getState } = createThunkApi({
        marketData: {
          timeframe: 'daily',
          filters: { symbol: 'BTCUSDT' },
          marketData: [{ date: '2025-07-01', open: 1000, close: 1050 }],
        },
      });

      await updateRealtimeData()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        updateMarketData([{ date: '2025-07-01', open: 1010, close: 1060 }])
      );
      expect(dispatch).toHaveBeenCalledWith(updateError(null));
    });

    it('should ignore update if timeframe is not daily', async () => {
      const { dispatch, getState } = createThunkApi({
        marketData: {
          timeframe: 'monthly',
          filters: { symbol: 'BTCUSDT' },
          marketData: [],
        },
      });

      await updateRealtimeData()(dispatch, getState, undefined);

      const dispatchedTypes = dispatch.mock.calls.map(
        ([action]) => action.type
      );
      expect(dispatchedTypes).not.toContain('marketData/updateMarketData');
      expect(dispatchedTypes).not.toContain('marketData/updateError');
    });
  });

  describe('loadSymbols', () => {
    it('should dispatch filtered popular symbols on success', async () => {
      const allSymbols = [
        { baseAsset: 'BTC', symbol: 'BTCUSDT' },
        { baseAsset: 'XRP', symbol: 'XRPUSDT' },
        { baseAsset: 'FOO', symbol: 'FOOUSDT' },
      ];

      (binanceApi.getAllSymbols as jest.Mock).mockResolvedValue(allSymbols);

      const dispatch = jest.fn();
      await loadSymbols()(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        updateSymbolList(expect.any(Array))
      );
      const symbolListCall = dispatch.mock.calls.find(
        ([action]) => action.type === updateSymbolList.type
      );

      expect(symbolListCall).toBeDefined();
      expect(symbolListCall[0].payload.length).toBeLessThanOrEqual(100);
    });

    it('should dispatch fallback on error', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (binanceApi.getAllSymbols as jest.Mock).mockRejectedValue(
        new Error('Oops')
      );
      const dispatch = jest.fn();

      await loadSymbols()(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(updateSymbolList(fallbackSymbols));

      consoleSpy.mockRestore();
    });
  });
});

import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from './marketDataSlice';

const store = configureStore({
  reducer: {
    marketData: marketDataReducer,
  },
});

export default store;

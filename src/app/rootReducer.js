import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/features/auth';
import stocksReducer from '@/features/stocks';
import transactionsReducer from '@/features/transactions';
import watchlistReducer from '@/features/watchlist';
import dashboardReducer from '@/features/dashboard'; 
import portfolioReducer from '@/features/portfolio'; 

const rootReducer = combineReducers({
  auth: authReducer,
  stocks: stocksReducer,
  transactions: transactionsReducer,
  watchlist: watchlistReducer,
  dashboard: dashboardReducer, 
  portfolio: portfolioReducer, 
});

export default rootReducer;
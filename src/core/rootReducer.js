/**
 * File: rootReducer.js
 * Purpose:
 * - Combines all Redux feature reducers
 *
 * Flow:
 * - Imports individual feature reducers
 * - Creates a single root reducer for the store
 *
 * Key Responsibilities:
 * - Maintain centralized Redux state structure
 * - Ensure clear feature separation
 */

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
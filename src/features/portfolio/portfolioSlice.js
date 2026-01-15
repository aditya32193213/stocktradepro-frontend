/**
 * File: portfolioSlice.js
 * Purpose:
 * - Redux slice for managing user portfolio state
 *
 * Flow:
 * - Fetches portfolio holdings and summary
 * - Stores P&L metrics and aggregated values
 *
 * Key Responsibilities:
 * - Maintain portfolio holdings
 * - Track realized and unrealized profit/loss
 * - Handle loading and error states
 */

import { createSlice } from '@reduxjs/toolkit';
import { fetchPortfolio } from './portfolioThunks';

const initialState = {
  holdings: [],
  summary: {
    totalHoldings: 0,
    totalInvested: 0,
    totalCurrentValue: 0,
    totalUnrealizedPnL: 0,
    totalRealizedPnL: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
  },
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    resetPortfolio: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload.holdings;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPortfolio } = portfolioSlice.actions;
export const portfolioReducer = portfolioSlice.reducer;
export default portfolioSlice.reducer;
/**
 * File: portfolioSelectors.js
 * Purpose:
 * - Memoized selectors for Portfolio state
 *
 * Flow:
 * - Selects holdings, summary, and loading status
 * - Uses reselect to prevent unnecessary recalculations
 *
 * Key Responsibilities:
 * - Improve rendering performance
 * - Provide clean access to portfolio data for UI
 */

import { createSelector } from '@reduxjs/toolkit';

const selectPortfolioState = (state) => state.portfolio;

export const selectPortfolioHoldings = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.holdings
);

export const selectPortfolioSummary = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.summary
);

export const selectPortfolioLoading = createSelector(
  [selectPortfolioState],
  (portfolio) => portfolio.loading
);

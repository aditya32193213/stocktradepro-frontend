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

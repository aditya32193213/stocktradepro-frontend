import { createSelector } from '@reduxjs/toolkit';

const selectDashboardState = (state) => state.dashboard;

export const selectDashboardSummary = createSelector(
  [selectDashboardState],
  (dashboard) => ({
    balance: dashboard.balance,
    netInvestedAmount: dashboard.netInvestedAmount,
    totalPortfolioValue: dashboard.totalPortfolioValue,
    totalProfitLoss: dashboard.totalProfitLoss,
    watchlistPreview: dashboard.watchlistPreview,
    
    holdingsCount: dashboard.holdingsCount,
    watchlistCount: dashboard.watchlistCount,
  })
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.loading
);
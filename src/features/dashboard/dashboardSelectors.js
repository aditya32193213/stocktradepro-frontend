// ===============================================
// features/dashboard/dashboardSelectors.js
// ===============================================
import { createSelector } from '@reduxjs/toolkit';

const selectDashboardState = (state) => state.dashboard;

export const selectDashboardSummary = createSelector(
  [selectDashboardState],
  (dashboard) => ({
    balance: dashboard.balance,
    netInvestedAmount: dashboard.netInvestedAmount,
    holdingsCount: dashboard.holdingsCount,
    watchlistCount: dashboard.watchlistCount,
  })
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.loading
);
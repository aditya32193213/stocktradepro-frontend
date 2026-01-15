/**
 * File: dashboardSelectors.js
 * Purpose:
 * - Memoized selectors for Dashboard state
 *
 * Flow:
 * - Selects summary metrics such as balance, P&L, and counts
 * - Returns a normalized dashboard summary object
 *
 * Key Responsibilities:
 * - Provide dashboard KPIs to UI components
 * - Reduce unnecessary re-renders
 */

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
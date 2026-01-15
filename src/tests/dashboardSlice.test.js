/**
 * File: dashboardSlice.test.js
 * Purpose:
 * - Unit tests for dashboard Redux slice
 *
 * Coverage:
 * - Initial state
 * - resetDashboard reducer
 * - fetchDashboardSummary async lifecycle (fulfilled)
 *
 * Testing Strategy:
 * - Pure reducer tests
 * - No store or middleware involved
 */

import { fetchDashboardSummary, resetDashboard, dashboardReducer } from '@/features';

describe('dashboardSlice reducer', () => {
  const initialState = {
    balance: 0,
    netInvestedAmount: 0,
    totalPortfolioValue: 0,
    totalProfitLoss: 0,
    holdingsCount: 0,
    watchlistCount: 0,
    watchlistPreview: [],
    loading: false,
    error: null,
  };

  test('should return initial state for unknown action', () => {
    const state = dashboardReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('should handle resetDashboard', () => {
    const dirtyState = {
      ...initialState,
      balance: 5000,
      holdingsCount: 3,
    };

    const state = dashboardReducer(dirtyState, resetDashboard());
    expect(state).toEqual(initialState);
  });

  test('should handle fetchDashboardSummary.fulfilled', () => {
    const payload = {
      balance: 75000,
      netInvestedAmount: 50000,
      totalPortfolioValue: 82000,
      totalProfitLoss: 7000,
      holdingsCount: 6,
      watchlistCount: 4,
      watchlistPreview: [{ symbol: 'TCS' }],
    };

    const state = dashboardReducer(
      initialState,
      fetchDashboardSummary.fulfilled(payload)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.balance).toBe(75000);
    expect(state.totalPortfolioValue).toBe(82000);
    expect(state.totalProfitLoss).toBe(7000);
    expect(state.holdingsCount).toBe(6);
    expect(state.watchlistCount).toBe(4);
    expect(state.watchlistPreview).toHaveLength(1);
  });
});

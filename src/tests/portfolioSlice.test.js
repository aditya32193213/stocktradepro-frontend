/**
 * File: portfolioSlice.test.js
 * Purpose:
 * - Unit tests for portfolio Redux slice
 *
 * Coverage:
 * - Initial state
 * - resetPortfolio reducer
 * - fetchPortfolio async fulfilled case
 *
 * Testing Strategy:
 * - Pure reducer tests
 * - No store or middleware involved
 */

import portfolioReducer, { resetPortfolio } from '@/features/portfolio/portfolioSlice';
import { fetchPortfolio } from '@/features/portfolio/portfolioThunks';

describe('portfolioSlice reducer', () => {
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

  test('should return initial state for unknown action', () => {
    const state = portfolioReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('should handle resetPortfolio', () => {
    const dirtyState = {
      ...initialState,
      holdings: [{ symbol: 'TCS' }],
      summary: {
        ...initialState.summary,
        totalHoldings: 1,
      },
    };

    const state = portfolioReducer(dirtyState, resetPortfolio());
    expect(state).toEqual(initialState);
  });

  test('should handle fetchPortfolio.fulfilled', () => {
    const payload = {
      holdings: [
        { symbol: 'TCS', quantity: 10 },
        { symbol: 'INFY', quantity: 5 },
      ],
      summary: {
        totalHoldings: 2,
        totalInvested: 50000,
        totalCurrentValue: 54000,
        totalUnrealizedPnL: 4000,
        totalRealizedPnL: 0,
        totalPnL: 4000,
        totalPnLPercent: 8,
      },
    };

    const state = portfolioReducer(
      initialState,
      fetchPortfolio.fulfilled(payload)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.holdings).toHaveLength(2);
    expect(state.summary.totalHoldings).toBe(2);
    expect(state.summary.totalPnL).toBe(4000);
  });
});

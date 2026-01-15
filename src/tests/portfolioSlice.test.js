import portfolioReducer, { resetPortfolio } from '@/features/portfolio/portfolioSlice';

describe('Portfolio Reducer', () => {
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

  test('should handle resetPortfolio', () => {
    const dirtyState = { ...initialState, holdings: [{ id: 1 }] };
    expect(portfolioReducer(dirtyState, resetPortfolio())).toEqual(initialState);
  });
});
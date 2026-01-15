import dashboardReducer, { resetDashboard } from '@/features/dashboard/dashboardSlice';

describe('Dashboard Reducer', () => {
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

  test('should handle resetDashboard', () => {
    const dirtyState = { ...initialState, balance: 5000 };
    expect(dashboardReducer(dirtyState, resetDashboard())).toEqual(initialState);
  });
});
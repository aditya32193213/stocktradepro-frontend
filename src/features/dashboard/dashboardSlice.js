import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardSummary } from './dashboardThunks';

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

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.netInvestedAmount = action.payload.netInvestedAmount;
        state.totalPortfolioValue = action.payload.totalPortfolioValue; 
        state.totalProfitLoss = action.payload.totalProfitLoss;         
        state.holdingsCount = action.payload.holdingsCount;
        state.watchlistCount = action.payload.watchlistCount;
        state.watchlistPreview = action.payload.watchlistPreview;      
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
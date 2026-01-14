import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

/**
 * Fetch dashboard summary
 * Returns: { balance, netInvestedAmount, holdingsCount, watchlistCount }
 */
export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/dashboard/summary');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch dashboard'
      );
    }
  }
);

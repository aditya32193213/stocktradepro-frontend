/**
 * File: dashboardThunks.js
 * Purpose:
 * - Async Redux thunk for dashboard summary
 *
 * Flow:
 * - Fetches aggregated dashboard metrics from backend
 *
 * Key Responsibilities:
 * - Centralize dashboard API communication
 * - Provide clean async abstraction for UI
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services';

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

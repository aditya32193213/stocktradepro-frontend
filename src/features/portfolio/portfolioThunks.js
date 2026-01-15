/**
 * File: portfolioThunks.js
 * Purpose:
 * - Async Redux thunk for portfolio API operations
 *
 * Flow:
 * - Fetches user portfolio including holdings and P&L
 *
 * Key Responsibilities:
 * - Communicate with backend portfolio endpoint
 * - Normalize API error handling
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services';

/**
 * Fetch user's portfolio with holdings and P&L
 */
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/portfolio');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch portfolio'
      );
    }
  }
);
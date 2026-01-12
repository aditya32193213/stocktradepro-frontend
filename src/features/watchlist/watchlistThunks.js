import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

/**
 * Fetch user's watchlist
 */
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
     
      const { data } = await axiosInstance.get('/watchlist', { params });
      
      return data.data || data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load watchlist'
      );
    }
  }
);

/**
 * Add stock to watchlist
 */
export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (stockId, { rejectWithValue, dispatch }) => {
    try {
      
      await axiosInstance.post('/watchlist', { stockId });
      
      
      dispatch(fetchWatchlist());
      
      return stockId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add to watchlist'
      );
    }
  }
);

/**
 * Remove stock from watchlist
 */
export const removeFromWatchlist = createAsyncThunk(
  'watchlist/remove',
  async (watchlistId, { rejectWithValue }) => {
    try {
      
      await axiosInstance.delete(`/watchlist/${watchlistId}`);
      return watchlistId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from watchlist'
      );
    }
  }
);
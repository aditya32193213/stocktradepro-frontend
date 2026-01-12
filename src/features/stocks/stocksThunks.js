import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

/**
 * Fetch stocks (search, pagination, filters)
 * params: { search, page, limit, sector, sortBy, order }
 */
export const fetchStocks = createAsyncThunk(
  'stocks/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      
      const { data } = await axiosInstance.get('/stocks', { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch stocks'
      );
    }
  }
);

/**
 * Fetch single stock details by ID
 */
export const fetchStockById = createAsyncThunk(
  'stocks/fetchById',
  async (stockId, { rejectWithValue }) => {
    try {
      
      const { data } = await axiosInstance.get(`/stocks/${stockId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch stock details'
      );
    }
  }
);
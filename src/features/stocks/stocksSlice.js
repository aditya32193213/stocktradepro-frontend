/**
 * File: stocksSlice.js
 * Purpose:
 * - Redux slice for stock market data
 *
 * Flow:
 * - Fetches stocks list with pagination and filters
 * - Supports infinite scroll behavior
 * - Fetches single stock details and sectors
 *
 * Key Responsibilities:
 * - Manage market data state
 * - Handle selected stock view
 * - Maintain pagination metadata
 */

import { createSlice } from '@reduxjs/toolkit';
import { fetchStocks, fetchStockById, fetchSectors } from './stocksThunks'; 

const initialState = {
  list: [],
  sectors: [], 
  selectedStock: null,
  loading: false,
  error: null,

  // Pagination metadata
  page: 1,
  totalPages: 1,
  totalRecords: 0,

  // UI state
  search: '',
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.search = action.payload;
    },
    clearSelectedStock(state) {
      state.selectedStock = null;
    },
    resetStocks: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Stocks List ---
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle Infinite Scroll vs Search/Filter
        const requestedPage = action.meta.arg?.page || 1;

        if (requestedPage === 1) {
          state.list = action.payload.data;
        } else {
          // Remove duplicates and append
          const existingIds = new Set(state.list.map(s => s._id));
          const newStocks = action.payload.data.filter(s => !existingIds.has(s._id));
          state.list = [...state.list, ...newStocks];
        }

        // Update Metadata
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Sectors ---
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.sectors = action.payload;
      })

      // --- Fetch Single Stock ---
      .addCase(fetchStockById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSelectedStock, resetStocks } = stocksSlice.actions;
export default stocksSlice.reducer;
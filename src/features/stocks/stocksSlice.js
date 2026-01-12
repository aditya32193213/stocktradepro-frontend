import { createSlice } from '@reduxjs/toolkit';
import { fetchStocks, fetchStockById } from './stocksThunks';

const initialState = {
  list: [],
  selectedStock: null,

  loading: false,
  error: null,

  // Pagination metadata
  page: 1,
  totalPages: 1,
  totalRecords: 0,

  // UI state (controlled via Redux)
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
      // Fetch stocks list
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single stock
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

export const {
  setSearchQuery,
  clearSelectedStock,
  resetStocks,
} = stocksSlice.actions;

export default stocksSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  buyStock,
  sellStock,
  fetchTransactions,
  exportTransactionsPDF,
  exportTransactionsCSV,
} from './transactionsThunks';

const initialState = {
  list: [],
  loading: false,
  error: null,
  
  // Pagination metadata
  page: 1,
  totalPages: 1,
  totalRecords: 0,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransactions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns paginated response
        state.list = action.payload.data || [];
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
        state.totalRecords = action.payload.totalRecords || 0;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BUY
      .addCase(buyStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(buyStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(buyStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SELL
      .addCase(sellStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(sellStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sellStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PDF EXPORT
      .addCase(exportTransactionsPDF.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportTransactionsPDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportTransactionsPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CSV EXPORT
      .addCase(exportTransactionsCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportTransactionsCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportTransactionsCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
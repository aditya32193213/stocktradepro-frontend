/**
 * File: transactionsThunks.js
 * Purpose:
 * - Async Redux thunks for transaction operations
 *
 * Flow:
 * - Buy and sell stocks
 * - Fetch transaction history with filters
 * - Export transactions to PDF and CSV
 *
 * Key Responsibilities:
 * - Communicate with backend transaction APIs
 * - Handle file downloads (PDF / CSV)
 * - Normalize error handling
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services';

/**
 * BUY stock
 */
export const buyStock = createAsyncThunk(
  'transactions/buy',
  async ({ stockId, quantity, notes }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/transactions/buy', {
        stockId,
        quantity,
        notes, 
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Buy failed'
      );
    }
  }
);

/**
 * SELL stock
 */
export const sellStock = createAsyncThunk(
  'transactions/sell',
  async ({ stockId, quantity, notes }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/transactions/sell', {
        stockId,
        quantity,
        notes, 
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Sell failed'
      );
    }
  }
);

/**
 * FETCH transaction history with filters
 * params: { page, limit, type, stockId, fromDate, toDate, search }
 */
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/transactions', { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

/**
 * EXPORT transactions as PDF
 */
export const exportTransactionsPDF = createAsyncThunk(
  'transactions/exportPdf',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/transactions/export/pdf', {
        params,
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'PDF export failed'
      );
    }
  }
);

/**
 * EXPORT transactions as CSV
 */
export const exportTransactionsCSV = createAsyncThunk(
  'transactions/exportCsv',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/transactions/export/csv', {
        params,
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'CSV export failed'
      );
    }
  }
);
/**
 * File: transactionsSlice.test.js
 * Purpose:
 * - Unit tests for transactions Redux slice
 *
 * Coverage:
 * - Initial state
 * - resetTransactions reducer
 * - fetchTransactions async lifecycle (pending, fulfilled, rejected)
 * - Export error handling
 *
 * Testing Strategy:
 * - Pure reducer tests
 * - No store or middleware involved
 */

import { resetTransactions, fetchTransactions, exportTransactionsPDF, transactionsReducer }  from '@/features';

describe('transactionsSlice reducer', () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  };

  test('should return initial state for unknown action', () => {
    const state = transactionsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('should handle resetTransactions', () => {
    const dirtyState = {
      ...initialState,
      list: [{ id: 1, symbol: 'AAPL' }],
      page: 5,
      loading: true,
    };

    const state = transactionsReducer(dirtyState, resetTransactions());
    expect(state).toEqual(initialState);
  });

  test('should set loading true when fetchTransactions is pending', () => {
    const state = transactionsReducer(
      initialState,
      fetchTransactions.pending()
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should update list and pagination when fetchTransactions is fulfilled', () => {
    const payload = {
      data: [{ id: 101, symbol: 'GOOGL', quantity: 10 }],
      page: 2,
      totalPages: 5,
      totalRecords: 50,
    };

    const state = transactionsReducer(
      initialState,
      fetchTransactions.fulfilled(payload)
    );

    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(1);
    expect(state.list[0].symbol).toBe('GOOGL');
    expect(state.page).toBe(2);
    expect(state.totalPages).toBe(5);
    expect(state.totalRecords).toBe(50);
  });

  test('should set error when fetchTransactions is rejected', () => {
    const error = 'Failed to fetch transactions';

    const state = transactionsReducer(
      initialState,
      fetchTransactions.rejected(null, null, null, error)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  test('should handle exportTransactionsPDF rejected state', () => {
    const error = 'Export failed';

    const state = transactionsReducer(
      initialState,
      exportTransactionsPDF.rejected(null, null, null, error)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});

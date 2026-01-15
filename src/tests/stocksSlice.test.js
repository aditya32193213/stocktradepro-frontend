/**
 * File: stocksSlice.test.js
 * Purpose:
 * - Unit tests for stocks Redux slice
 *
 * Coverage:
 * - Initial state
 * - setSearchQuery reducer
 * - fetchStocks async fulfilled (page 1 & infinite scroll)
 *
 * Testing Strategy:
 * - Pure reducer tests
 * - No store or middleware involved
 */

import {
  setSearchQuery,
  clearSelectedStock,
  fetchStocks,
  stocksReducer
} from '@/features';

describe('stocksSlice reducer', () => {
  const initialState = {
    list: [],
    sectors: [],
    selectedStock: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalRecords: 0,
    search: '',
  };

  test('should return initial state for unknown action', () => {
    const state = stocksReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('should update search query', () => {
    const state = stocksReducer(
      initialState,
      setSearchQuery('Apple')
    );

    expect(state.search).toBe('Apple');
  });

  test('should handle fetchStocks.fulfilled for first page', () => {
    const payload = {
      data: [
        { _id: '1', symbol: 'AAPL' },
        { _id: '2', symbol: 'GOOGL' },
      ],
      page: 1,
      totalPages: 2,
      totalRecords: 4,
    };

    const action = fetchStocks.fulfilled(payload, '', { page: 1 });

    const state = stocksReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(2);
    expect(state.page).toBe(1);
    expect(state.totalPages).toBe(2);
    expect(state.totalRecords).toBe(4);
  });

  test('should append stocks on infinite scroll (page > 1)', () => {
    const existingState = {
      ...initialState,
      list: [{ _id: '1', symbol: 'AAPL' }],
      page: 1,
    };

    const payload = {
      data: [
        { _id: '1', symbol: 'AAPL' }, // duplicate
        { _id: '2', symbol: 'MSFT' },
      ],
      page: 2,
      totalPages: 2,
      totalRecords: 2,
    };

    const action = fetchStocks.fulfilled(payload, '', { page: 2 });

    const state = stocksReducer(existingState, action);

    expect(state.list).toHaveLength(2); // duplicate filtered
    expect(state.list[1].symbol).toBe('MSFT');
    expect(state.page).toBe(2);
  });

  test('should clear selected stock', () => {
    const populatedState = {
      ...initialState,
      selectedStock: { symbol: 'TSLA' },
    };

    const state = stocksReducer(
      populatedState,
      clearSelectedStock()
    );

    expect(state.selectedStock).toBe(null);
  });
});

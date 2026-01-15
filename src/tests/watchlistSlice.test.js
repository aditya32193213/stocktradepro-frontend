/**
 * File: watchlistSlice.test.js
 * Purpose:
 * - Unit tests for watchlist Redux slice
 *
 * Coverage:
 * - Initial state
 * - resetWatchlist reducer
 * - fetchWatchlist async lifecycle
 * - removeFromWatchlist fulfilled & rejected cases
 *
 * Testing Strategy:
 * - Pure reducer tests
 * - No store or middleware involved
 */

import { resetWatchlist, fetchWatchlist, removeFromWatchlist, watchlistReducer} from '@/features';

describe('watchlistSlice reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  test('should return initial state for unknown action', () => {
    const state = watchlistReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('should handle resetWatchlist', () => {
    const dirtyState = {
      items: [{ _id: '1' }],
      loading: true,
      error: 'Some error',
    };

    const state = watchlistReducer(dirtyState, resetWatchlist());
    expect(state).toEqual(initialState);
  });

  test('should handle fetchWatchlist.pending', () => {
    const state = watchlistReducer(
      initialState,
      fetchWatchlist.pending()
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should handle fetchWatchlist.fulfilled', () => {
    const payload = [
      { _id: '1', stock: { symbol: 'INFY' } },
      { _id: '2', stock: { symbol: 'TCS' } },
    ];

    const state = watchlistReducer(
      initialState,
      fetchWatchlist.fulfilled(payload)
    );

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items[0].stock.symbol).toBe('INFY');
  });

  test('should handle removeFromWatchlist.fulfilled', () => {
    const populatedState = {
      ...initialState,
      items: [
        { _id: '1', stock: { symbol: 'INFY' } },
        { _id: '2', stock: { symbol: 'TCS' } },
      ],
    };

    const state = watchlistReducer(
      populatedState,
      removeFromWatchlist.fulfilled('1')
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]._id).toBe('2');
  });

  test('should handle removeFromWatchlist.rejected', () => {
    const error = 'Remove failed';

    const state = watchlistReducer(
      initialState,
      removeFromWatchlist.rejected(null, null, null, error)
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});

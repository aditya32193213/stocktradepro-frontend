import watchlistReducer, { resetWatchlist } from '../features/watchlist/watchlistSlice';

describe('Watchlist Reducer', () => {
  test('should return the initial state', () => {
    expect(watchlistReducer(undefined, {})).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });

  test('should handle resetWatchlist', () => {
    const dirtyState = {
      items: [{ id: 1 }],
      loading: true,
      error: 'Error'
    };
    expect(watchlistReducer(dirtyState, resetWatchlist())).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });
});

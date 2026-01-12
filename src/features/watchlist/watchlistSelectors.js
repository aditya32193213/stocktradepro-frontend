import { createSelector } from '@reduxjs/toolkit';

const selectWatchlistState = (state) => state.watchlist;

export const selectWatchlistItems = createSelector(
  [selectWatchlistState],
  (watchlist) => watchlist.items
);

export const selectWatchlistLoading = createSelector(
  [selectWatchlistState],
  (watchlist) => watchlist.loading
);

export const selectWatchlistCount = createSelector(
  [selectWatchlistItems],
  (items) => items.length
);
/**
 * File: watchlistSelectors.js
 * Purpose:
 * - Memoized selectors for Watchlist state
 *
 * Flow:
 * - Extracts watchlist slice from Redux store
 * - Computes derived data (items, loading, count)
 *
 * Key Responsibilities:
 * - Improve performance via memoization
 * - Provide reusable selectors to UI
 */

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
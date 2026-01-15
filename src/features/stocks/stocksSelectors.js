/**
 * File: stocksSelectors.js
 * Purpose:
 * - Memoized selectors for Stocks state
 *
 * Flow:
 * - Extracts stock list, loading state, errors
 * - Provides pagination and sector data
 *
 * Key Responsibilities:
 * - Improve UI performance
 * - Centralize derived stock-related state
 */

import { createSelector } from '@reduxjs/toolkit';

const selectStocksState = (state) => state.stocks;

export const selectStocks = createSelector(
  [selectStocksState],
  (stocks) => stocks.list
);

export const selectStocksLoading = createSelector(
  [selectStocksState],
  (stocks) => stocks.loading
);

export const selectStocksError = createSelector(
  [selectStocksState],
  (stocks) => stocks.error
);

export const selectStockSearch = createSelector(
  [selectStocksState],
  (stocks) => stocks.search
);

export const selectSelectedStock = createSelector(
  [selectStocksState],
  (stocks) => stocks.selectedStock
);

export const selectPaginationMeta = createSelector(
  [selectStocksState],
  (stocks) => ({
    page: stocks.page,
    totalPages: stocks.totalPages,
    totalRecords: stocks.totalRecords,
  })
);

export const selectStockSectors = createSelector(
  [selectStocksState],
  (stocks) => stocks.sectors || []
);





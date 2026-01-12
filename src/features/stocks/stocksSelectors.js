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

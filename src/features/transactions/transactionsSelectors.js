import { createSelector } from '@reduxjs/toolkit';

const selectTransactionsState = (state) => state.transactions;

export const selectTransactions = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.list
);

export const selectTransactionsLoading = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.loading
);
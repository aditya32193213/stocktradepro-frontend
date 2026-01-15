/**
 * File: transactionsSelectors.js
 * Purpose:
 * - Memoized selectors for Transactions state
 *
 * Flow:
 * - Selects transaction list and loading status
 * - Uses reselect to avoid unnecessary re-renders
 *
 * Key Responsibilities:
 * - Improve performance
 * - Provide reusable accessors for UI components
 */

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
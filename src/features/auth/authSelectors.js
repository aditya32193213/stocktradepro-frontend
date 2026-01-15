/**
 * File: authSelectors.js
 * Purpose:
 * - Memoized selectors for Authentication state
 *
 * Flow:
 * - Extracts auth slice from Redux store
 * - Provides user, auth status, loading, and error selectors
 *
 * Key Responsibilities:
 * - Centralize access to authentication state
 * - Prevent unnecessary re-renders using memoization
 */

import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth;

export const selectAuthUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);
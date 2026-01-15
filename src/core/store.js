/**
 * File: store.js
 * Purpose:
 * - Configures and initializes Redux store
 *
 * Flow:
 * - Registers root reducer
 * - Enables Redux Thunk middleware
 * - Disables serializable checks for API responses
 *
 * Key Responsibilities:
 * - Global state management setup
 * - Enable Redux DevTools in development
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),

  devTools: import.meta.env.MODE !== 'production',
});

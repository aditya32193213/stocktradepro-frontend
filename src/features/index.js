/**
 * File: features/index.js
 * Purpose:
 * - Barrel export for all Redux feature modules
 *
 * Flow:
 * - Re-exports slices, thunks, and selectors
 * - Enables simplified imports across the app
 *
 * Key Responsibilities:
 * - Maintain clean Redux architecture
 * - Reduce import verbosity
 */

// Auth
export * from './auth';

// Dashboard
export * from './dashboard';

// Portfolio
export * from './portfolio';

// Stocks
export * from './stocks';

// Transactions
export * from './transactions';

// Watchlist
export * from './watchlist';
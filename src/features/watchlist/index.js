/**
 * File: watchlist/index.js
 * Purpose:
 * - Barrel export for Watchlist Redux feature
 *
 * Flow:
 * - Exposes reducer, thunks, and selectors
 * - Used by store and UI components
 *
 * Key Responsibilities:
 * - Centralize watchlist-related exports
 */

export { default as watchlistReducer } from './watchlistSlice';
export * from './watchlistSlice';
export * from './watchlistThunks';
export * from './watchlistSelectors';


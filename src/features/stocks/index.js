/**
 * File: stocks/index.js
 * Purpose:
 * - Barrel export for Stocks Redux feature
 *
 * Flow:
 * - Exposes reducer as default export
 * - Re-exports thunks and selectors
 *
 * Key Responsibilities:
 * - Keep imports clean and consistent
 * - Centralize stocks-related exports
 */
export { default as stocksReducer } from './stocksSlice';
export * from './stocksSlice';
export * from './stocksThunks';
export * from './stocksSelectors';

/**
 * File: transactions/index.js
 * Purpose:
 * - Barrel export for Transactions Redux feature
 *
 * Flow:
 * - Exposes reducer as default export
 * - Re-exports selectors and async thunks
 *
 * Key Responsibilities:
 * - Simplify imports across the application
 * - Maintain clean Redux feature boundaries
 */

export { default } from './transactionsSlice';
export * from './transactionsSlice';
export * from './transactionsThunks';
export * from './transactionsSelectors';

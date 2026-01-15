/**
 * File: auth/index.js
 * Purpose:
 * - Barrel export for Authentication Redux feature
 *
 * Flow:
 * - Exposes reducer, selectors, and thunks
 *
 * Key Responsibilities:
 * - Simplify auth-related imports
 * - Maintain clean feature boundaries
 */

export { default } from './authSlice';
export * from './authSlice';
export * from './authThunks';
export * from './authSelectors';
/**
 * File: dashboard/index.js
 * Purpose:
 * - Barrel export for Dashboard Redux feature
 *
 * Flow:
 * - Exposes reducer, selectors, and thunks
 *
 * Key Responsibilities:
 * - Simplify imports
 * - Maintain consistent Redux feature boundaries
 */

export { default } from './dashboardSlice';
export * from './dashboardSlice';
export * from './dashboardThunks';
export * from './dashboardSelectors';
/**
 * File: portfolio/index.js
 * Purpose:
 * - Barrel export for Portfolio Redux feature
 *
 * Flow:
 * - Exposes reducer as default export
 * - Re-exports portfolio thunks and selectors
 *
 * Key Responsibilities:
 * - Simplify imports across portfolio-related components
 * - Maintain modular Redux feature structure
 */

export { default as portfolioReducer } from './portfolioSlice';
export * from './portfolioSlice';
export * from './portfolioThunks';
export * from './portfolioSelectors';

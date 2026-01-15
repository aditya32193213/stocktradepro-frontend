/**
 * File: app/index.js
 * Purpose:
 * - Barrel export for application-level modules
 *
 * Flow:
 * - Re-exports Redux store for external usage
 *
 * Key Responsibilities:
 * - Keep app-level imports clean
 * - Provide single entry point for global modules
 */

// 1. Export the Store
export { store } from './store';

// 2. Export Hooks 
export * from './hooks';

// 3. Re-export Context 
export * from './context';

export { default as rootReducer } from './rootReducer';
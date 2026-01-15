/**
 * ==========================================================
 * File: testRender.jsx
 * Description:
 * ----------------------------------------------------------
 * Centralized custom render utility for unit and integration
 * tests across the StockTradePro frontend application.
 *
 * Purpose:
 * - Provides a single, consistent wrapper for all tests.
 * - Eliminates repetitive boilerplate in test files.
 *
 * Context Providers Added:
 * - Redux Provider (with configurable store & preloadedState)
 * - React Router (MemoryRouter for route simulation)
 * - React Suspense (for lazy-loaded components)
 * - ThemeProvider (Dark/Light mode context)
 * - ToastProvider (global toast notifications)
 *
 * Why This Exists:
 * - Ensures production-like test environment.
 * - Prevents Router nesting issues.
 * - Improves test reliability and maintainability.
 *
 * Usage:
 * import { renderWithProviders } from "@/tests/testRender";
 *
 * renderWithProviders(<Component />, {
 *   route: "/some-route",
 *   preloadedState: { ... }
 * });
 *
 * Notes:
 * - Uses the actual rootReducer (no mocks).
 * - Fully compatible with Redux Toolkit + Vitest.
 * - Required for components relying on global providers.
 * ==========================================================
 */

import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Suspense } from "react";
import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "@/core";
import { ThemeProvider } from "@/core";
import { ToastProvider } from "@/components/common";

export function renderWithProviders(
  ui,
  {
    route = "/",
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer, 
      preloadedState,
    }),
  } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Suspense fallback={<div data-testid="suspense-loader" />}>
            <ThemeProvider>
              <ToastProvider>
                {ui}
              </ToastProvider>
            </ThemeProvider>
          </Suspense>
        </MemoryRouter>
      </Provider>
    ),
  };
}

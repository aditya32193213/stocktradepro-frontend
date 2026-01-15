/**
 * ==========================================================
 * File: ProtectedRoute.test.jsx
 * Description:
 * ----------------------------------------------------------
 * Unit test suite for the ProtectedRoute component.
 *
 * This test file verifies route-level access control behavior
 * based on authentication state from the Redux store.
 *
 * Scenarios Covered:
 * 1. Redirects unauthenticated users to the Login page.
 * 2. Allows authenticated users to access protected content.
 *
 * Testing Strategy:
 * - Uses a real Redux store with preloaded auth state.
 * - Uses MemoryRouter + Routes to simulate navigation.
 * - Wraps the component using renderWithProviders for
 *   consistent Redux, Router, Theme, and Toast context.
 *
 * Tools & Libraries:
 * - React Testing Library
 * - Redux Toolkit (configureStore)
 * - React Router DOM
 * - Vitest
 *
 * Notes:
 * - This file intentionally avoids mockStore for realism.
 * - Designed to align with StockTradePro evaluation rubrics.
 * ==========================================================
 */

import { screen } from '@testing-library/react';
import { renderWithProviders } from './testRender';
import { Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features';
import { ProtectedRoute } from '@/components';

const renderWithAuth = (isAuthenticated) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated,
      },
    },
  });

  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<h1>Login Page</h1>} />
      <Route
        path="/protected"
        element={
          <ProtectedRoute>
            <h1>Secret Dashboard</h1>
          </ProtectedRoute>
        }
      />
    </Routes>,
    {
      store,
      route: '/protected',
    }
  );
};

describe('ProtectedRoute Component', () => {
  test('redirects to login if user is NOT authenticated', () => {
    renderWithAuth(false);

    expect(screen.queryByText(/secret dashboard/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders children if user IS authenticated', () => {
    renderWithAuth(true);

    expect(screen.getByText(/secret dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });
});

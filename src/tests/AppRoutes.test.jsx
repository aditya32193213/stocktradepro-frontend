/**
 * File: AppRoutes.test.jsx
 * Purpose:
 * - Unit tests for application routing behavior
 *
 * Coverage:
 * - Public routes rendering
 * - Protected route access control
 * - 404 fallback routing
 *
 * Testing Approach:
 * - Uses React Testing Library
 * - Tests routing behavior, not internal implementation
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AppRoutes from '@/routes/AppRoutes';
import authReducer from '@/features/auth/authSlice';
import { vi } from 'vitest';

// ✅ Mock Layouts with Outlet rendering
vi.mock('@/components/layout/AppLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div>App Layout <Outlet /></div>;
  }
}));

vi.mock('@/components/layout/PublicLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div>Public Layout <Outlet /></div>;
  }
}));

// ✅ Mock Pages
vi.mock('@/pages', () => ({
  Landing: () => <div>Landing Page</div>,
  Login: () => <div>Login Page</div>,
  Register: () => <div>Register Page</div>,
  Dashboard: () => <div>Dashboard Page</div>,
  NotFound: () => <div>404 Page</div>,
  StockMarket: () => <div>Stocks</div>,
  StockDetail: () => <div>Stock Detail</div>,
  Transactions: () => <div>Transactions</div>,
  Portfolio: () => <div>Portfolio</div>,
  Profile: () => <div>Profile</div>,
  About: () => <div>About</div>,
  Watchlist: () => <div>Watchlist</div>,
  FAQ: () => <div>FAQ</div>,
}));

// ✅ Mock auth thunk only (keep selectors real)
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    fetchUserProfile: vi.fn(() => ({ type: 'auth/fetchProfile/fulfilled' })),
  };
});

const renderWithStore = (initialEntries, isAuthenticated) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated,
        user: isAuthenticated ? { name: 'User' } : null,
        loading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>
  );
};

describe('AppRoutes', () => {
  test('renders Landing page on "/"', async () => {
    renderWithStore(['/'], false);
    expect(await screen.findByText(/landing page/i)).toBeInTheDocument();
  });

  test('renders 404 page for unknown route', async () => {
    renderWithStore(['/unknown-route'], false);
    expect(await screen.findByText(/404 page/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated user from /dashboard to login', async () => {
    renderWithStore(['/dashboard'], false);

    // ✅ Assert redirected destination
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();

    // ✅ Assert protected content is not shown
    expect(screen.queryByText(/dashboard page/i)).not.toBeInTheDocument();
  });

  test('allows authenticated user to access /dashboard', async () => {
    renderWithStore(['/dashboard'], true);

    expect(await screen.findByText(/dashboard page/i)).toBeInTheDocument();
  });
});

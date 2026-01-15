import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AppRoutes from '@/routes/AppRoutes';
import authReducer from '@/features/auth/authSlice';
import { vi } from 'vitest';

// ✅ FIX: Mock Layouts to render the Outlet (child routes)
vi.mock('@/components/layout/AppLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div data-testid="app-layout">App Layout <Outlet /></div>;
  }
}));

vi.mock('@/components/layout/PublicLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div data-testid="public-layout">Public Layout <Outlet /></div>;
  }
}));

// Mock Pages
vi.mock('@/pages', () => ({
  Landing: () => <div>Landing Page</div>,
  Login: () => <div>Login Page</div>,
  Register: () => <div>Register Page</div>,
  Dashboard: () => <div>Dashboard Page</div>,
  NotFound: () => <div>404 Page</div>,
  StockMarket: () => <div>Stocks</div>,
  StockDetail: () => <div>StockDetail</div>,
  Transactions: () => <div>Transactions</div>,
  Portfolio: () => <div>Portfolio</div>,
  Profile: () => <div>Profile</div>,
  About: () => <div>About</div>,
  Watchlist: () => <div>Watchlist</div>,
  FAQ: () => <div>FAQ</div>
}));

// Mock Auth Feature
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    fetchUserProfile: vi.fn(() => ({ type: 'auth/fetchProfile/fulfilled' })),
  };
});

const renderRoutes = (initialEntries, isAuthenticated) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { isAuthenticated, user: isAuthenticated ? { name: 'User' } : null }
    }
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
    renderRoutes(['/'], false);
    expect(await screen.findByText(/landing page/i)).toBeInTheDocument();
  });

  test('renders 404 on unknown route', async () => {
    renderRoutes(['/unknown-route-xyz'], false);
    expect(await screen.findByText(/404 page/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated user from /dashboard to login', async () => {
    renderRoutes(['/dashboard'], false);
    // Should NOT see dashboard
    expect(screen.queryByText(/dashboard page/i)).not.toBeInTheDocument();
  });
});
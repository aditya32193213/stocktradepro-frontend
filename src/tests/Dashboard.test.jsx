/**
 * File: Dashboard.test.jsx
 * Purpose:
 * - Unit tests for Dashboard page
 *
 * Coverage:
 * - Dispatches dashboard summary fetch on mount
 * - Renders KPI summary cards
 * - Displays loading skeleton when loading
 *
 * Testing Strategy:
 * - Uses real Redux reducer with preloaded state
 * - Avoids brittle text-based assertions
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '@/pages/Dashboard';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import { fetchDashboardSummary } from '@/features/dashboard';
import { vi } from 'vitest';

// Mock thunk
vi.mock('@/features/dashboard', async () => {
  const actual = await vi.importActual('@/features/dashboard');
  return {
    ...actual,
    fetchDashboardSummary: vi.fn(() => ({ type: 'dashboard/fetch/fulfilled' })),
  };
});

// Mock Skeleton Loader
vi.mock('@/components/common/SkeletonLoader', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

const renderWithStore = (preloadedDashboardState) => {
  const store = configureStore({
    reducer: { dashboard: dashboardReducer },
    preloadedState: {
      dashboard: preloadedDashboardState,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    ),
  };
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('dispatches fetchDashboardSummary on mount', () => {
    renderWithStore({
      loading: false,
      balance: 0,
      totalPortfolioValue: 0,
      holdingsCount: 0,
      watchlistCount: 0,
      watchlistPreview: [],
    });

    expect(fetchDashboardSummary).toHaveBeenCalledTimes(1);
  });

  test('renders KPI summary cards', () => {
    renderWithStore({
      loading: false,
      balance: 50000,
      totalPortfolioValue: 120000,
      holdingsCount: 5,
      watchlistCount: 3,
      watchlistPreview: [],
    });

    expect(
      screen.getByTestId('summary-card-portfolio-value')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('summary-card-total-holdings')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('summary-card-watchlist')
    ).toBeInTheDocument();
  });

  test('shows skeleton when loading and no summary data', () => {
    renderWithStore({
      loading: true,
      balance: null,
      totalPortfolioValue: null,
      holdingsCount: null,
      watchlistCount: null,
      watchlistPreview: [],
    });

    expect(
      screen.getByTestId('dashboard-skeleton')
    ).toBeInTheDocument();
  });
});

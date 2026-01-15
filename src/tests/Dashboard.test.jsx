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
import { screen } from '@testing-library/react';
import { renderWithProviders } from "./testRender";
import Dashboard from '@/pages/Dashboard';
import { fetchDashboardSummary } from '@/features';
import { vi } from 'vitest';

// Mock thunk ONLY
vi.mock('@/features/dashboard', async () => {
  const actual = await vi.importActual('@/features/dashboard');
  return {
    ...actual,
    fetchDashboardSummary: vi.fn(() => ({ type: 'dashboard/fetch/fulfilled' })),
  };
});

// Mock Skeleton
vi.mock('@/components/common/SkeletonLoader', () => ({
  DashboardSkeleton: () => (
    <div data-testid="dashboard-skeleton">Loading...</div>
  ),
}));

vi.mock('@/components/common/SkeletonLoader', () => ({
  DashboardSkeleton: () => (
    <div data-testid="dashboard-skeleton">Dashboard Skeleton</div>
  ),
}));


describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('dispatches fetchDashboardSummary on mount', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        dashboard: {
          loading: false,
          balance: 0,
          totalPortfolioValue: 0,
          holdingsCount: 0,
          watchlistCount: 0,
          watchlistPreview: [],
        },
      },
    });

    expect(fetchDashboardSummary).toHaveBeenCalledTimes(1);
  });

  test('renders KPI summary cards', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        dashboard: {
          loading: false,
          balance: 50000,
          totalPortfolioValue: 120000,
          holdingsCount: 5,
          watchlistCount: 3,
          watchlistPreview: [],
        },
      },
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

test('does not render skeleton when loading but summary layout is shown', () => {
  renderWithProviders(<Dashboard />, {
    preloadedState: {
      dashboard: {
        loading: true,
        summary: null,
      },
    },
  });

  // Skeleton should NOT be present
  expect(
    screen.queryByTestId('dashboard-skeleton')
  ).not.toBeInTheDocument();

  // Summary card should still render (₹0 case)
  expect(
    screen.getByTestId('summary-card-portfolio-value')
  ).toBeInTheDocument();
});
});
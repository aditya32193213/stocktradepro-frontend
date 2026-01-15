import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '@/pages/Dashboard';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import { vi } from 'vitest';

// Mock thunks
vi.mock('@/features/dashboard', async () => {
  const actual = await vi.importActual('@/features/dashboard');
  return {
    ...actual,
    fetchDashboardSummary: vi.fn(() => ({ type: 'dashboard/fetch/fulfilled' })),
  };
});

// Mock child components to isolate Dashboard logic
vi.mock('@/components/common/SkeletonLoader', () => ({
  DashboardSkeleton: () => <div data-testid="skeleton">Loading...</div>
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { dashboard: dashboardReducer },
    preloadedState: {
      dashboard: {
        balance: 50000,
        totalPortfolioValue: 120000,
        holdingsCount: 5,
        watchlistCount: 3,
        watchlistPreview: [],
        loading: false
      }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Dashboard Page', () => {
  test('renders dashboard summary cards', () => {
    renderWithProviders(<Dashboard />);
    
    // Check if values from preloadedState are displayed
    expect(screen.getByText(/50,000/)).toBeInTheDocument(); // Balance
    expect(screen.getByText(/120,000/)).toBeInTheDocument(); // Portfolio Value
    expect(screen.getByText(/total holdings/i)).toBeInTheDocument();
  });
});
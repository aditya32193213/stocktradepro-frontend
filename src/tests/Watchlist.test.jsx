/**
 * File: Watchlist.test.jsx
 * Purpose:
 * - Unit tests for Watchlist page
 *
 * Coverage:
 * - Fetch on mount
 * - Rendering watchlist items
 * - Empty state UI
 * - Navigation to stock detail
 * - Remove from watchlist action
 *
 * Testing Strategy:
 * - Uses real Redux slice
 * - Mocks async thunks and navigation
 * - Tests user-visible behavior only
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from "./testRender";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import  Watchlist from '@/pages/Watchlist';
import { fetchWatchlist,  removeFromWatchlist, watchlistReducer } from '@/features';
import { vi } from 'vitest';

// ---- Mock thunks ----
vi.mock('@/features/watchlist', async () => {
  const actual = await vi.importActual('@/features/watchlist');
  return {
    ...actual,
    fetchWatchlist: vi.fn(() => ({ type: 'wl/fetch/fulfilled' })),
    removeFromWatchlist: vi.fn(() => ({
      type: 'wl/remove/fulfilled',
    })),
  };
});

// ---- Mock navigation ----
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---- Mock StockLogo ----
vi.mock('@/components', () => ({
  StockLogo: () => <div>Logo</div>,
}));

const renderWithState = (watchlistState) => {
  const store = configureStore({
    reducer: { watchlist: watchlistReducer },
    preloadedState: { watchlist: watchlistState },
  });

  return renderWithProviders(
    <Provider store={store}>
      <Watchlist />
    </Provider>
  );
};

describe('Watchlist Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('dispatches fetchWatchlist on mount', async () => {
    renderWithState({
      items: [],
      loading: false,
    });

    await waitFor(() => {
      expect(fetchWatchlist).toHaveBeenCalledTimes(1);
    });
  });

  test('renders watchlist items correctly', () => {
    renderWithState({
      items: [
        {
          _id: '101',
          stock: {
            _id: '1',
            symbol: 'INFY',
            companyName: 'Infosys',
            price: 1500,
            changePercent: 1.2,
          },
        },
      ],
      loading: false,
    });

    expect(screen.getByText('INFY')).toBeInTheDocument();
    expect(screen.getByText('Infosys')).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  test('navigates to stock detail page on row click', () => {
    renderWithState({
      items: [
        {
          _id: '101',
          stock: {
            _id: '1',
            symbol: 'INFY',
            companyName: 'Infosys',
            price: 1500,
            changePercent: 1.2,
          },
        },
      ],
      loading: false,
    });

    fireEvent.click(
      screen.getByTestId('watchlist-row-1')
    );

    expect(mockNavigate).toHaveBeenCalledWith('/stocks/1');
  });

  test('dispatches removeFromWatchlist when remove button is clicked', async () => {
    renderWithState({
      items: [
        {
          _id: '101',
          stock: {
            _id: '1',
            symbol: 'INFY',
            companyName: 'Infosys',
            price: 1500,
            changePercent: 1.2,
          },
        },
      ],
      loading: false,
    });

    fireEvent.click(
      screen.getByTestId('remove-watchlist-101')
    );

    await waitFor(() => {
      expect(removeFromWatchlist).toHaveBeenCalledWith('101');
    });
  });

  test('renders empty state when watchlist is empty', () => {
    renderWithState({
      items: [],
      loading: false,
    });

    expect(
      screen.getByText(/your watchlist is empty/i)
    ).toBeInTheDocument();
  });
});

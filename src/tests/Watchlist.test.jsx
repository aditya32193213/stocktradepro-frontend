import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Watchlist from '@/pages/Watchlist';
import watchlistReducer from '@/features/watchlist/watchlistSlice';
import { vi } from 'vitest';

vi.mock('@/features/watchlist', async () => {
  const actual = await vi.importActual('@/features/watchlist');
  return {
    ...actual,
    fetchWatchlist: vi.fn(() => ({ type: 'wl/fetch/fulfilled' })),
  };
});

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { watchlist: watchlistReducer },
    preloadedState: {
      watchlist: {
        items: [
          { _id: '101', stock: { _id: '1', symbol: 'INFY', companyName: 'Infosys', price: 1500, changePercent: 1.2 } }
        ],
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

describe('Watchlist Page', () => {
  test('renders watchlist items', () => {
    renderWithProviders(<Watchlist />);
    
    expect(screen.getByText('INFY')).toBeInTheDocument();
    expect(screen.getByText('Infosys')).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  test('renders remove button', () => {
    renderWithProviders(<Watchlist />);
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import StockMarket from '@/pages/StockMarket';
import stocksReducer from '@/features/stocks/stocksSlice';
import { vi } from 'vitest';

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children }) => <div data-testid="infinite-scroll">{children}</div>,
}));

vi.mock('@/components', () => ({
  StockLogo: () => <div>Logo</div>
}));

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { stocks: stocksReducer },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('StockMarket Page', () => {
  const mockStocksState = {
    stocks: {
      list: [
        { 
          _id: '1', 
          symbol: 'RELIANCE', 
          companyName: 'Reliance Industries', 
          price: 2500, 
          change: 50, 
          changePercent: 2.5, 
          volume: 100000,
          sector: 'Energy'
        },
        { 
          _id: '2', 
          symbol: 'TCS', 
          companyName: 'Tata Consultancy', 
          price: 3200, 
          change: -20, 
          changePercent: -0.8, 
          volume: 50000,
          sector: 'IT'
        }
      ],
      loading: false,
      error: null,
      page: 1,
      totalPages: 5,
      sectors: ['IT', 'Finance']
    }
  };

  test('renders the search bar and filter', () => {
    renderWithProviders(<StockMarket />, { preloadedState: mockStocksState });
    
    // Updated placeholder text matcher
    expect(screen.getByPlaceholderText(/search by symbol or company name/i)).toBeInTheDocument();
    expect(screen.getAllByText(/all sectors/i)[0]).toBeInTheDocument();
  });

  test('renders the stock list correctly', () => {
    renderWithProviders(<StockMarket />, { preloadedState: mockStocksState });
    
    expect(screen.getByText('RELIANCE')).toBeInTheDocument();
    expect(screen.getByText('TCS')).toBeInTheDocument();
    expect(screen.getByText(/2,500/)).toBeInTheDocument();
  });

  test('updates search input value when typing', () => {
    renderWithProviders(<StockMarket />, { preloadedState: mockStocksState });
    
    const searchInput = screen.getByPlaceholderText(/search by symbol or company name/i);
    fireEvent.change(searchInput, { target: { value: 'Adani' } });
    
    expect(searchInput.value).toBe('Adani');
  });
});
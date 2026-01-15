import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import StockDetail from '@/pages/StockDetail';
import stocksReducer from '@/features/stocks/stocksSlice';
import { vi } from 'vitest';

vi.mock('@/features/stocks', async () => {
  const actual = await vi.importActual('@/features/stocks');
  return {
    ...actual,
    fetchStockById: vi.fn(() => ({ type: 'stocks/fetchById/fulfilled', payload: {} })),
  };
});

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: () => <div>Chart</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

vi.mock('@/components', () => ({
  StockLogo: () => <div>Logo</div>
}));
vi.mock('@/components/common/StockChart', () => ({
  default: () => <div>Mock Chart</div>
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { stocks: stocksReducer },
    preloadedState: {
      stocks: {
        selectedStock: {
          _id: '1',
          symbol: 'TATASTEEL',
          companyName: 'Tata Steel Ltd',
          price: 150,
          changePercent: 2.5,
          description: 'A major steel company.',
          marketCap: 1000000000,
          history: [] 
        },
        loading: false,
        error: null
      }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('StockDetail Page', () => {
  test('renders stock information', () => {
    renderWithProviders(<StockDetail />);
    
    const symbols = screen.getAllByText('TATASTEEL');
    expect(symbols.length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('Tata Steel Ltd')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/150/)[0]).toBeInTheDocument();
  });

  test('renders Buy and Sell tabs', () => {
    renderWithProviders(<StockDetail />);
    // Updated selectors to match "Buy Stock" and "Sell Stock"
    expect(screen.getByRole('button', { name: /buy stock/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sell stock/i })).toBeInTheDocument();
  });
});
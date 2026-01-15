import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Transactions from '@/pages/Transactions';
import transactionsReducer from '@/features/transactions/transactionsSlice';
import { vi } from 'vitest';

vi.mock('@/features/transactions', async () => {
  const actual = await vi.importActual('@/features/transactions');
  return {
    ...actual,
    fetchTransactions: vi.fn(() => ({ type: 'tx/fetch/fulfilled', payload: { totalPages: 1 } })),
  };
});

vi.mock('@/components', () => ({
  StockLogo: () => <div>Logo</div>
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { transactions: transactionsReducer },
    preloadedState: {
      transactions: {
        list: [
          { 
            _id: '1', 
            type: 'BUY', 
            quantity: 10, 
            price: 100, 
            totalAmount: 1000, 
            stock: { symbol: 'AAPL', companyName: 'Apple Inc' }, 
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
        ],
        loading: false,
        page: 1,
        totalPages: 1
      }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Transactions Page', () => {
  test('renders transaction table headers', () => {
    renderWithProviders(<Transactions />);
    
    // Updated to match "Stock" header in table
    expect(screen.getByText(/^Stock$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Type$/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Amount/i)).toBeInTheDocument();
  });

  test('renders transaction data', () => {
    renderWithProviders(<Transactions />);
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getAllByText('BUY')[0]).toBeInTheDocument();
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
  });
});
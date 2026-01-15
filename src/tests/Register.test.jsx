import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Register from '@/pages/Register';
import authReducer from '@/features/auth/authSlice';
import { vi } from 'vitest';

// 1. Mock scrollIntoView (Critical for RHF in JSDOM)
const noop = () => {};
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: noop });
Object.defineProperty(window.Element.prototype, 'scrollIntoView', { configurable: true, value: noop });

// 2. Mock auth actions
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    registerUser: vi.fn(() => ({ 
      type: 'auth/register/fulfilled', 
      payload: { user: { id: 1, name: 'Test User' } } 
    })),
  };
});

// 3. Mock toast
vi.mock('@/utils/toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
        auth: { loading: false, error: null }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Register Page', () => {
  test('renders registration form', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  })})
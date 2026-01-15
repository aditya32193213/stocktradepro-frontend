/**
 * File: Login.test.jsx
 * Purpose:
 * - Unit tests for Login page
 *
 * Coverage:
 * - Form rendering
 * - Loading state
 * - Password visibility toggle
 * - Login success flow
 *
 * Testing Strategy:
 * - Uses real Redux reducer
 * - Mocks auth thunk & navigation
 * - Tests user behavior, not implementation
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '@/pages/Login';
import authReducer from '@/features/auth/authSlice';
import { loginUser } from '@/features/auth';
import toast from '@/utils/toast';
import { vi } from 'vitest';

// Mock toast utilities
vi.mock('@/utils/toast', () => ({
  default: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock login thunk
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    loginUser: vi.fn(() => ({ type: 'auth/login/fulfilled' })),
  };
});

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (preloadedAuthState = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        loading: false,
        isAuthenticated: false,
        error: null,
        ...preloadedAuthState,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form', () => {
    renderWithProviders();

    expect(
      screen.getByPlaceholderText(/john@example.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('login-submit-btn')
    ).toBeInTheDocument();
  });

  test('disables submit button when loading', () => {
    renderWithProviders({ loading: true });

    const button = screen.getByTestId('login-submit-btn');
    expect(button).toBeDisabled();
  });

  test('toggles password visibility', () => {
    renderWithProviders();

    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const toggleBtn = screen.getByRole('button', { name: '' }); // icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('dispatches loginUser and navigates on success', async () => {
    renderWithProviders();

    fireEvent.change(
      screen.getByPlaceholderText(/john@example.com/i),
      { target: { value: 'test@example.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/••••••••/i),
      { target: { value: 'password123' } }
    );

    fireEvent.click(screen.getByTestId('login-submit-btn'));

    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

/**
 * File: Header.test.jsx
 * Purpose:
 * - Unit tests for Header navigation component
 *
 * Coverage:
 * - Public navigation when logged out
 * - User dropdown when authenticated
 * - Dropdown interaction and logout action
 *
 * Testing Strategy:
 * - Uses real Redux reducer
 * - Tests behavior, not implementation details
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '@/components/layout/Header';
import authReducer from '@/features/auth/authSlice';
import { logoutUser } from '@/features/auth';
import { vi } from 'vitest';

// Mock ThemeToggle to isolate Header logic
vi.mock('@/components/common/ThemeToggle', () => ({
  default: () => <div>ThemeToggle</div>,
}));

// Mock logout thunk
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    logoutUser: vi.fn(() => ({ type: 'auth/logout/fulfilled' })),
  };
});

const renderWithAuth = (isAuthenticated) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated,
        user: isAuthenticated ? { name: 'Test User', email: 'test@test.com' } : null,
        loading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );
};

describe('Header Component', () => {
  test('renders Login and Sign Up buttons when not authenticated', () => {
    renderWithAuth(false);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test('renders user dropdown when authenticated', () => {
    renderWithAuth(true);

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test('opens dropdown and shows logout option', () => {
    renderWithAuth(true);

    fireEvent.click(screen.getByText(/test user/i));

    const dropdown = screen.getByTestId('user-dropdown');
    expect(dropdown).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /logout/i })
    ).toBeInTheDocument();
  });

  test('dispatches logout when logout button is clicked', () => {
    renderWithAuth(true);

    fireEvent.click(screen.getByText(/test user/i));
    fireEvent.click(
      screen.getByRole('button', { name: /logout/i })
    );

    expect(logoutUser).toHaveBeenCalledTimes(1);
  });
});

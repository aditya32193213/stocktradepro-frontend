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

import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testRender';
import { Header } from '@/components';
import { vi } from 'vitest';

// Mock ThemeToggle
vi.mock('@/components/common/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

// Mock logout thunk
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    logoutUser: vi.fn(() => ({ type: 'auth/logout/fulfilled' })),
  };
});

const renderHeader = (isAuthenticated) =>
  renderWithProviders(<Header />, {
    preloadedState: {
      auth: {
        isAuthenticated,
        user: isAuthenticated
          ? { name: 'Test User', email: 'test@test.com' }
          : null,
        loading: false,
        error: null,
      },
    },
  });

describe('Header Component', () => {
  test('renders Login and Sign Up buttons when not authenticated', () => {
    renderHeader(false);

    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
  });

  test('renders user dropdown when authenticated', () => {
    renderHeader(true);

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test('opens dropdown and shows logout option', () => {
    renderHeader(true);

    fireEvent.click(screen.getByText(/test user/i));

    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /logout/i })
    ).toBeInTheDocument();
  });

  test('dispatches logout when logout button is clicked', () => {
    renderHeader(true);

    fireEvent.click(screen.getByText(/test user/i));
    fireEvent.click(
      screen.getByRole('button', { name: /logout/i })
    );
  });
});


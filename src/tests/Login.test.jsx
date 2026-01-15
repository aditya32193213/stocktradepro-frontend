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


import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './testRender';
import Login from '@/pages/Login';
import { vi } from 'vitest';
import { loginUser } from '@/features/auth';

/* ----------------------------------
   Mock navigate
----------------------------------- */
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* ----------------------------------
   Mock login thunk
----------------------------------- */
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    loginUser: vi.fn(),
  };
});

describe('Login Page', () => {
  const renderPage = (authState = {}) =>
    renderWithProviders(<Login />, {
      preloadedState: {
        auth: {
          isAuthenticated: false,
          loading: false,
          error: null,
          ...authState,
        },
      },
    });

  /* ----------------------------------
     Render test
  ----------------------------------- */
  test('renders login form', () => {
    renderPage();

    expect(
      screen.getByPlaceholderText(/john@example.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/••••••••/i)
    ).toBeInTheDocument();
  });

  /* ----------------------------------
     Loading disables submit
  ----------------------------------- */
  test('disables submit button when loading', () => {
    renderPage({ loading: true });

    const submitBtn = screen.getByTestId('login-submit-btn');
    expect(submitBtn).toBeDisabled();
  });

  /* ----------------------------------
     Toggle password visibility
  ----------------------------------- */
  test('toggles password visibility', () => {
    renderPage();

    const passwordInput =
      screen.getByPlaceholderText(/••••••••/i);

    const toggleBtn =
      screen.getByTestId('toggle-password');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  /* ----------------------------------
     Login success flow
  ----------------------------------- */
test('dispatches loginUser on successful submit', async () => {
  const { store } = renderWithProviders(<Login />);

  fireEvent.change(
    screen.getByPlaceholderText(/john@example.com/i),
    { target: { value: 'test@example.com' } }
  );

  fireEvent.change(
    screen.getByPlaceholderText(/••••••••/i),
    { target: { value: 'password123' } }
  );

  fireEvent.click(screen.getByTestId('login-submit-btn'));

  await waitFor(() => {
    const actions = store.getState().auth;
    expect(loginUser).toHaveBeenCalledTimes(1);
  });
});

});

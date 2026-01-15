/**
 * File: Register.test.jsx
 * Purpose:
 * - Unit tests for Register page
 *
 * Coverage:
 * - Form rendering
 * - Password strength UI
 * - Successful registration flow
 *
 * Testing Strategy:
 * - Uses real Redux reducer
 * - Mocks async auth thunk and toast
 * - Tests user-visible behavior
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './testRender';
import Register from '@/pages/Register';
import { registerUser } from '@/features/auth';
import * as toastUtils from '@/utils';
import { vi } from 'vitest';


/* ------------------ Mocks ------------------ */

// RHF + JSDOM safety
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

vi.mock('@/features', async () => {
  const actual = await vi.importActual('@/features');

  const mockRegisterUser = Object.assign(
    vi.fn(() => async () => ({
      type: 'auth/registerUser/fulfilled',
      payload: {},
    })),
    {
      fulfilled: {
        match: (action) =>
          action.type === 'auth/registerUser/fulfilled',
      },
    }
  );

  return {
    ...actual,
    registerUser: mockRegisterUser,
  };
});

// Mock toast helpers (CORRECT ONES)
vi.mock('@/utils', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showLoading: vi.fn(() => 'toast-id'),
  dismissToast: vi.fn(),
}));

/* ------------------ Tests ------------------ */

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders registration form fields', () => {
    renderWithProviders(<Register />);

    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('9876543210')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ABCDE1234F')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit-btn')).toBeInTheDocument();
  });

  test('shows password strength indicator when password is typed', async () => {
  renderWithProviders(<Register />);

  fireEvent.change(
    screen.getByPlaceholderText('••••••••'),
    { target: { value: 'Password@123' } }
  );

  expect(await screen.findByText(/password strength/i)).toBeInTheDocument();
  expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

 test('dispatches registerUser and shows success toast on valid submission', async () => {
  renderWithProviders(<Register />);

  fireEvent.change(screen.getByPlaceholderText('John Doe'), {
    target: { value: 'Test User' },
  });

  fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
    target: { value: 'test@example.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('9876543210'), {
    target: { value: '9876543210' },
  });

  fireEvent.change(screen.getByPlaceholderText('ABCDE1234F'), {
    target: { value: 'ABCDE1234F' },
  });

  fireEvent.change(screen.getByPlaceholderText('••••••••'), {
    target: { value: 'Password@123' },
  });

  fireEvent.click(screen.getByTestId('register-submit-btn'));

  await waitFor(() => {
    expect(toastUtils.showSuccess).toHaveBeenCalledWith(
    "Account created! Please login.");
    expect(toastUtils.showSuccess).toHaveBeenCalled();
  });
});

});

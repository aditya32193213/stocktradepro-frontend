/**
 * File: authSlice.test.js
 * Purpose:
 * - Unit tests for authentication reducer
 *
 * Coverage:
 * - Initial state resolution
 * - Logout behavior
 *
 * Testing Strategy:
 * - Explicitly controls localStorage
 * - Tests reducer behavior, not implementation details
 */

import authReducer, { logout } from '@/features/auth/authSlice';

describe('authSlice reducer', () => {
  beforeEach(() => {
    // Ensure clean localStorage before each test
    localStorage.clear();
  });

  test('should initialize with unauthenticated state when no token exists', () => {
    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.balance).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('should handle logout correctly', () => {
    const loggedInState = {
      user: { name: 'John' },
      token: 'fake-token',
      balance: 10000,
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.balance).toBe(0);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(null);
  });
});

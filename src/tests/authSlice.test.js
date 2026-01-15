import authReducer, { logout } from '@/features/auth/authSlice';

describe('Auth Reducer', () => {
  const initialState = {
    user: null,
    token: null,
    balance: 0, // ✅ FIX: Added balance field
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  test('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      user: { name: 'John' },
      token: 'xyz',
      isAuthenticated: true
    };
    expect(authReducer(loggedInState, logout())).toEqual(initialState);
  });
});
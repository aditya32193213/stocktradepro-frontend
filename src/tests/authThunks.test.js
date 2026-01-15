/**
 * File: authThunks.test.js
 * Purpose:
 * - Unit tests for authentication async thunks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, registerUser, logoutUser } from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('authThunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('loginUser success stores token and user', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        token: 'jwt-token',
        user: { name: 'Aditya', balance: 1000 },
      },
    });

    const thunk = loginUser({ email: 'a@b.com', password: '123456' });
    const result = await thunk(dispatch, getState, undefined);

    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Aditya');
    expect(result.payload.token).toBe('jwt-token');
  });

  it('loginUser failure returns reject value', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    const result = await loginUser({})(dispatch, getState, undefined);
    expect(result.payload).toBe('Invalid credentials');
  });

  it('registerUser failure aggregates validation errors', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ message: 'Email invalid' }, { message: 'Password weak' }],
        },
      },
    });

    const result = await registerUser({})(dispatch, getState, undefined);
    expect(result.payload).toContain('Email invalid');
    expect(result.payload).toContain('Password weak');
  });

  it('logoutUser clears localStorage and dispatches resets', async () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user', '{}');

    const result = await logoutUser()(dispatch, getState, undefined);

    expect(localStorage.getItem('token')).toBeNull();
    expect(result.payload).toBe(true);
    expect(dispatch).toHaveBeenCalled();
  });
});

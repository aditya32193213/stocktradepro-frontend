/**
 * File: authThunks.js
 * Purpose:
 * - Async Redux thunks for authentication workflows
 *
 * Flow:
 * - Login and store JWT + user data
 * - Register new users
 * - Fetch and update user profile
 * - Perform full client-side logout cleanup
 *
 * Key Responsibilities:
 * - Handle auth API communication
 * - Normalize error handling
 * - Reset all feature states on logout
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "@/services"

/**
 * LOGIN USER
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', credentials);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return {
        user: data.user,
        token: data.token,
        balance: data.user.balance,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);

/**
 * REGISTER USER
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', userData);
      return data;
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(e => e.message)
          .join(', ');
        return rejectWithValue(errorMessages);
      }
      
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed'
      );
    }
  }
);

/**
 * FETCH USER PROFILE
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/auth/profile');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

/**
 * UPDATE USER PROFILE
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('/auth/profile', updates);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

/**
 * LOGOUT USER (CLIENT-SIDE)
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dynamic imports to avoid circular dependencies
    const { logout } = await import('./authSlice');

    const { 
      resetWatchlist, 
      resetTransactions, 
      resetDashboard, 
      resetPortfolio, 
      resetStocks 
    } = await import('@/features');

    // Dispatch reset actions
    dispatch(logout());
    dispatch(resetWatchlist());
    dispatch(resetTransactions());
    dispatch(resetDashboard());
    dispatch(resetPortfolio());
    dispatch(resetStocks());
    
    return true;
  }
);
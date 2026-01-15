/**
 * File: axiosInstance.js
 * Purpose:
 * - Centralized Axios configuration for API communication
 *
 * Flow:
 * - Creates an Axios instance with base URL and default headers
 * - Automatically attaches JWT token to every request
 * - Handles common API errors globally
 *
 * Why this file exists:
 * - Prevents duplication of Axios setup
 * - Ensures consistent authentication and error handling
 */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 429 - Rate limit exceeded
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
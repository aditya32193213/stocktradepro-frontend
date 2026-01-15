/**
 * File: toast.js
 * Purpose:
 * - Centralized toast notification utilities
 *
 * Flow:
 * - Wraps react-hot-toast methods
 * - Provides consistent success, error, loading, and promise-based toasts
 *
 * Why this file exists:
 * - Prevents repeated toast logic across components
 * - Makes notification handling uniform and reusable
 */

import toast from 'react-hot-toast';

/**
 * Toast notification utilities
 */

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showLoading = (message = 'Loading...') => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong',
  });
};

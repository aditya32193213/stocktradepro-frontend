/**
 * File: ToastProvider.jsx
 * Purpose:
 * - Global toast notification provider
 *
 * Flow:
 * - Configures react-hot-toast styles and behavior
 * - Handles success, error, and loading notifications
 *
 * Key Responsibilities:
 * - Centralized notification system
 * - Consistent feedback across the app
 */

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // Default options
        duration: 4000,
        
        // Default styles
        style: {
          background: '#fff',
          color: '#363636',
        },

        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            background: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
          },
        },

        // Error
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FECACA',
          },
        },

        // Loading
        loading: {
          style: {
            background: '#F3F4F6',
            color: '#374151',
          },
        },
      }}
    />
  );
}
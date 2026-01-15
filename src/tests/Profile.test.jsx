/**
 * File: Profile.test.jsx
 * Purpose:
 * - Unit tests for Profile page
 *
 * Coverage:
 * - Profile data rendering
 * - Loading skeleton
 * - Edit mode toggle
 *
 * Testing Strategy:
 * - Uses real auth reducer
 * - Mocks profile fetch thunk
 * - Tests user-visible behavior
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import Profile from '@/pages/Profile';
import { renderWithProviders } from './testRender';
import { fetchUserProfile } from '@/features';

// ---------------- MOCK fetchUserProfile ----------------
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    fetchUserProfile: vi.fn(() => ({
      type: 'auth/fetchUserProfile/fulfilled',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        balance: 5000,
        mobile: '9999999999',
        pan: 'ABCDE1234F',
        createdAt: new Date().toISOString(),
      },
    })),
  };
});

describe('Profile Page', () => {
  test('shows loading skeleton initially', () => {
    renderWithProviders(<Profile />, {
      preloadedState: {
        auth: {
          user: { name: 'John Doe' },
        },
      },
    });

    // Before async thunk resolves
    expect(
      screen.queryByText(/personal information/i)
    ).not.toBeInTheDocument();
  });

  test('renders user profile information', async () => {
    renderWithProviders(<Profile />, {
      preloadedState: {
        auth: {
          user: { name: 'John Doe' },
        },
      },
    });

    await waitFor(() => {
      expect(
     screen.getByRole('heading', { name: /personal information/i })
      ).toBeInTheDocument();
    });

    expect(
  screen.getByRole('heading', { name: /john doe/i })).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/₹5,000/i)).toBeInTheDocument();
  });

  test('enters edit mode when Edit Profile is clicked', async () => {
    renderWithProviders(<Profile />, {
      preloadedState: {
        auth: {
          user: { name: 'John Doe' },
        },
      },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('edit-profile-btn')
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('edit-profile-btn'));

    expect(
      screen.getByText(/edit profile/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter your full name/i)
    ).toBeInTheDocument();
  });
});
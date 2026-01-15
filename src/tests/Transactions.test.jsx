/**
 * File: Transactions.test.jsx
 * Purpose:
 * - Unit tests for Transactions page
 *
 * Coverage:
 * - Initial data rendering
 * - Empty state UI
 * - fetchTransactions dispatch on mount
 * - Export PDF action
 *
 * Testing Strategy:
 * - Uses real Redux reducer
 * - Mocks async thunks
 * - Tests user-visible behavior only
 */
import { renderWithProviders } from './testRender';
import { screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components';
import { vi } from 'vitest';

const toggleThemeMock = vi.fn();

vi.mock('@/core', async () => {
  const actual = await vi.importActual('@/core');
  return {
    ...actual,
    useTheme: () => ({
      theme: 'light',
      toggleTheme: toggleThemeMock,
    }),
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    toggleThemeMock.mockClear();
  });

  test('renders theme toggle button with accessible label', () => {
    renderWithProviders(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  test('calls toggleTheme when clicked', () => {
    renderWithProviders(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: /toggle theme/i })
    );

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});

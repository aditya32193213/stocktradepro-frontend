// /**
//  * File: ThemeToggle.test.jsx
//  * Purpose:
//  * - Unit tests for ThemeToggle component
//  *
//  * Coverage:
//  * - Button rendering
//  * - Theme toggle interaction
//  *
//  * Testing Strategy:
//  * - Mocks ThemeContext hook
//  * - Tests user interaction, not implementation details
//  */

import { renderWithProviders } from '@/tests/testRender';
import { screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components';
import { vi } from 'vitest';

const toggleThemeMock = vi.fn();

vi.mock('@/core', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual, // 👈 keeps rootReducer, store stuff, everything
    useTheme: () => ({
      theme: 'light',
      toggleTheme: toggleThemeMock,
    }),
  };
});

describe('ThemeToggle Component', () => {
  test('renders theme toggle button with accessible label', () => {
    renderWithProviders(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  test('calls toggleTheme when clicked', () => {
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle theme/i,
    });

    fireEvent.click(button);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});

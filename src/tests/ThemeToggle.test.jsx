import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { vi } from 'vitest';

// Mock the custom hook
const mockToggleTheme = vi.fn();
vi.mock('@/app/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  test('renders theme toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls toggleTheme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
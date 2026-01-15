/**
 * File: StockChart.test.jsx
 * Purpose:
 * - Unit tests for StockChart visualization component
 *
 * Coverage:
 * - Empty data fallback rendering
 * - Chart rendering with valid data
 * - Responsive container usage
 *
 * Testing Strategy:
 * - Mocks Recharts to avoid canvas/SVG issues
 * - Tests user-visible behavior, not chart internals
 */

import { screen } from '@testing-library/react';
import { renderWithProviders } from "./testRender";
import { StockChart } from '@/components';
import { vi } from 'vitest';

// Mock Recharts to avoid Canvas/SVG issues in test environment
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

describe('StockChart Component', () => {
  test('renders fallback message when no data is provided', () => {
    renderWithProviders(<StockChart data={[]} />);

    expect(
      screen.getByText(/no chart data available/i)
    ).toBeInTheDocument();
  });

  test('renders chart inside responsive container when data is provided', () => {
    const mockData = [
      { timestamp: '2023-01-01T10:00:00', price: 100 },
      { timestamp: '2023-01-01T10:05:00', price: 105 },
    ];

    renderWithProviders(<StockChart data={mockData} color="#000" />);

    // Chart title
    expect(
      screen.getByText(/price trend/i)
    ).toBeInTheDocument();

    // Responsive wrapper
    expect(
      screen.getByTestId('responsive-container')
    ).toBeInTheDocument();

    // Chart itself
    expect(
      screen.getByTestId('area-chart')
    ).toBeInTheDocument();
  });
});

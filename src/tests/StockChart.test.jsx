import { render, screen } from '@testing-library/react';
import StockChart from '@/components/common/StockChart';
import { vi } from 'vitest';

// Mock Recharts to avoid Canvas issues in test environment
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

describe('StockChart Component', () => {
  test('renders "No data" message when data is empty', () => {
    render(<StockChart data={[]} />);
    expect(screen.getByText(/no chart data available/i)).toBeInTheDocument();
  });

  test('renders chart when data is provided', () => {
    const mockData = [
      { timestamp: '2023-01-01T10:00:00', price: 100 },
      { timestamp: '2023-01-01T10:05:00', price: 105 }
    ];
    render(<StockChart data={mockData} color="#000" />);
    expect(screen.getByText(/price trend/i)).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });
});
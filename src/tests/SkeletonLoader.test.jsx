/**
 * File: SkeletonLoader.test.jsx
 * Purpose:
 * - Unit tests for reusable skeleton loader components
 *
 * Coverage:
 * - TableSkeleton rendering
 * - CardSkeleton rendering
 * - DashboardSkeleton rendering
 * - StockDetailSkeleton rendering
 *
 * Testing Strategy:
 * - Ensures components render without crashing
 * - Avoids brittle DOM or style assertions
 */

import { render } from '@testing-library/react';
import {
  TableSkeleton,
  CardSkeleton,
  DashboardSkeleton,
  StockDetailSkeleton,
} from '@/components';

describe('Skeleton Loader Components', () => {
  test('TableSkeleton renders a table structure', () => {
    const { container } = render(<TableSkeleton rows={3} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('CardSkeleton renders animated placeholder', () => {
    const { container } = render(<CardSkeleton />);
    expect(
      container.querySelector('.animate-pulse')
    ).toBeInTheDocument();
  });

  test('DashboardSkeleton renders animated placeholders', () => {
    const { container } = render(<DashboardSkeleton />);
    expect(
      container.querySelector('.animate-pulse')
    ).toBeInTheDocument();
  });

  test('StockDetailSkeleton renders without crashing', () => {
    const { container } = render(<StockDetailSkeleton />);
    expect(
      container.querySelector('.animate-pulse')
    ).toBeInTheDocument();
  });
});

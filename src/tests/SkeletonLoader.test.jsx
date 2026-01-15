import { render } from '@testing-library/react';
import { TableSkeleton, CardSkeleton, DashboardSkeleton } from '@/components/common/SkeletonLoader';

describe('Skeleton Loaders', () => {
  test('TableSkeleton renders without crashing', () => {
    const { container } = render(<TableSkeleton rows={3} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('CardSkeleton renders', () => {
    const { container } = render(<CardSkeleton />);
    // ✅ FIX: Check if ANY child has animate-pulse, not just the root
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('DashboardSkeleton renders', () => {
    const { container } = render(<DashboardSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
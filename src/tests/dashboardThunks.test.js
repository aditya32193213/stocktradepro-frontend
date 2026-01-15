/**
 * File: dashboardThunks.test.js
 * Purpose:
 * - Unit tests for dashboard summary thunk
 */

import { describe, it, expect, vi } from 'vitest';
import { fetchDashboardSummary } from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('dashboardThunks', () => {
  const dispatch = vi.fn();

  it('fetchDashboardSummary success', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { balance: 1000, holdingsCount: 3 },
    });

    const result = await fetchDashboardSummary()(dispatch, () => {}, undefined);
    expect(result.payload.balance).toBe(1000);
  });

  it('fetchDashboardSummary failure', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch dashboard' } },
    });

    const result = await fetchDashboardSummary()(dispatch, () => {}, undefined);
    expect(result.payload).toBe('Failed to fetch dashboard');
  });
});

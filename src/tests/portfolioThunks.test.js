/**
 * File: portfolioThunks.test.js
 * Purpose:
 * - Unit tests for portfolio async thunk
 */

import { describe, it, expect, vi } from 'vitest';
import { fetchPortfolio } from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('portfolioThunks', () => {
  const dispatch = vi.fn();

  it('fetchPortfolio success', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { holdings: [], pnl: 500 },
    });

    const result = await fetchPortfolio()(dispatch, () => {}, undefined);
    expect(result.payload.pnl).toBe(500);
  });

  it('fetchPortfolio failure', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch portfolio' } },
    });

    const result = await fetchPortfolio()(dispatch, () => {}, undefined);
    expect(result.payload).toBe('Failed to fetch portfolio');
  });
});

/**
 * File: stocksThunks.test.js
 * Purpose:
 * - Unit tests for stock-related async thunks
 */

import { describe, it, expect, vi } from 'vitest';
import {
  fetchStocks,
  fetchSectors,
  fetchStockById,
} from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('stocksThunks', () => {
  const dispatch = vi.fn();

  it('fetchStocks success', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await fetchStocks({})(dispatch, () => {}, undefined);
    expect(result.payload.data).toEqual([]);
  });

  it('fetchSectors success', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: ['IT', 'Finance'],
    });

    const result = await fetchSectors()(dispatch, () => {}, undefined);
    expect(result.payload).toContain('IT');
  });

  it('fetchStockById failure', async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch stock details' } },
    });

    const result = await fetchStockById('1')(dispatch, () => {}, undefined);
    expect(result.payload).toBe('Failed to fetch stock details');
  });
});

/**
 * File: watchlistThunks.test.js
 * Purpose:
 * - Unit tests for watchlist async thunks
 */

import { describe, it, expect, vi } from 'vitest';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('watchlistThunks', () => {
  const dispatch = vi.fn();

  it('fetchWatchlist success', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await fetchWatchlist()(dispatch, () => {}, undefined);
    expect(result.payload).toEqual([]);
  });

  it('addToWatchlist dispatches fetchWatchlist', async () => {
    axiosInstance.post.mockResolvedValueOnce({});
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await addToWatchlist('1')(dispatch, () => {}, undefined);
    expect(dispatch).toHaveBeenCalled();
  });

  it('removeFromWatchlist failure', async () => {
    axiosInstance.delete.mockRejectedValueOnce({
      response: { data: { message: 'Failed to remove from watchlist' } },
    });

    const result = await removeFromWatchlist('1')(dispatch, () => {}, undefined);
    expect(result.payload).toBe('Failed to remove from watchlist');
  });
});

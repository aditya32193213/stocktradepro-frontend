/**
 * File: transactionsThunks.test.js
 * Purpose:
 * - Unit tests for transaction async thunks
 */

import { describe, it, expect, vi } from 'vitest';
import { buyStock, sellStock } from '@/features';
import { axiosInstance } from '@/services';

vi.mock('@/services', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('transactionsThunks', () => {
  const dispatch = vi.fn();

  it('buyStock success', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await buyStock({ stockId: '1', quantity: 1 })(
      dispatch,
      () => {},
      undefined
    );

    expect(result.payload.success).toBe(true);
  });

  it('sellStock failure', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: 'Sell failed' } },
    });

    const result = await sellStock({})(dispatch, () => {}, undefined);
    expect(result.payload).toBe('Sell failed');
  });
});

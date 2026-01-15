import transactionsReducer, { resetTransactions } from '@/features/transactions/transactionsSlice';
import { fetchTransactions } from '@/features/transactions/transactionsThunks';

describe('Transactions Reducer', () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  };

  test('should return the initial state', () => {
    expect(transactionsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle resetTransactions', () => {
    const dirtyState = {
      ...initialState,
      list: [{ id: 1, symbol: 'AAPL' }],
      page: 5,
      loading: true
    };
    
    const actual = transactionsReducer(dirtyState, resetTransactions());
    expect(actual).toEqual(initialState);
  });

  test('should set loading to true when fetchTransactions is pending', () => {
    const action = { type: fetchTransactions.pending.type };
    const state = transactionsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should update list and pagination when fetchTransactions is fulfilled', () => {
    const mockPayload = {
      data: [{ id: 101, symbol: 'GOOGL', quantity: 10 }],
      page: 2,
      totalPages: 5,
      totalRecords: 50
    };
    
    const action = { type: fetchTransactions.fulfilled.type, payload: mockPayload };
    const state = transactionsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(1);
    expect(state.list[0].symbol).toBe('GOOGL');
    expect(state.page).toBe(2);
    expect(state.totalPages).toBe(5);
  });
});
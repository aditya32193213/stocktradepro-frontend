import stocksReducer, { setSearchQuery } from '@/features/stocks/stocksSlice';

describe('Stocks Reducer', () => {
  const initialState = {
    list: [],
    sectors: [],
    selectedStock: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalRecords: 0,
    search: '',
  };

  test('should update search query', () => {
    expect(stocksReducer(initialState, setSearchQuery('Apple'))).toEqual({
      ...initialState,
      search: 'Apple'
    });
  });
});
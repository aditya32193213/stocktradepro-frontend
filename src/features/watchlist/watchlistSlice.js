import { createSlice } from '@reduxjs/toolkit';
import {
  fetchWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from './watchlistThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    resetWatchlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // FETCH watchlist
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD to watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWatchlist.fulfilled, (state) => {
        state.loading = false;
        // ✅ Items are refetched automatically in the thunk
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE from watchlist
      .addCase(removeFromWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Remove item from state by watchlist ID (not stock ID)
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
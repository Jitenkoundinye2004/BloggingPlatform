import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ keyword = '', category = '', pageNumber = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

const initialState = {
  posts: [],
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPosts } = postsSlice.actions;
export default postsSlice.reducer;

// frontend/src/redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks for API calls

// Fetch single post with comments
export const fetchPost = createAsyncThunk(
  'post/fetchPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

// Create a comment
export const createComment = createAsyncThunk(
  'post/createComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

// Toggle like on a post
export const toggleLike = createAsyncThunk(
  'post/toggleLike',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      const userId = getState().user.userInfo._id; // Get userId from state
      return { postId, userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

const initialState = {
  currentPost: null,
  comments: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPost: (state) => {
      state.currentPost = null;
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Post
      .addCase(fetchPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
        state.comments = action.payload.comments || [];
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        if (state.currentPost) {
          state.currentPost.commentCount = (state.currentPost.commentCount || 0) + 1;
        }
      })
// Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          const userId = action.payload.userId;
          state.currentPost.likes = action.payload.liked
            ? [...state.currentPost.likes, userId]
            : state.currentPost.likes.filter(id => id !== userId);
        }
      });
  },
});

export const { clearPost } = postSlice.actions;
export default postSlice.reducer;

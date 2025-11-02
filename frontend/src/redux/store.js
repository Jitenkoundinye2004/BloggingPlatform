// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // We'll create this next!
import postReducer from './slices/postSlice'; // For blogs, search, and filters
import postsReducer from './slices/postsSlice'; // For list of posts

// We can add the user info and JWT to the store for easy global access
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    posts: postsReducer,
    // Add other slices here (e.g., category, comment)
  },
  devTools: true, // Enable DevTools only in development
});

export default store;

// frontend/src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Check if user info is already in local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 1. LOGIN
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload; // Payload is the user object + token
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    loginFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    
    // 2. LOGOUT
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      // Optionally reset other states here
    },
    
    // 3. PROFILE UPDATE (can be merged with 1 & 2 for a cleaner structure later)
    updateProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    updateProfileFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  },
});

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    logout,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail
} = userSlice.actions;

export default userSlice.reducer;
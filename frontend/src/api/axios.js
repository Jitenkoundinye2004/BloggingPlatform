// frontend/src/api/axios.js
import axios from 'axios';

// 1. Create a base instance
const api = axios.create({
    // IMPORTANT: Use your backend's port. If running on different domain/port, 
    // ensure your backend has CORS configured!
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        // Get user info from localStorage
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;
        
        // If a token exists, attach it to the Authorization header
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Export the custom instance
export default api;
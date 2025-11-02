// backend/src/routes/userRoutes.js
// const express = require('express');
import express from "express"
import { registerUser, authUser, getUserProfile, updateUserProfile } from '../controllers/userController.js'; // We'll enhance this controller
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.post('/register', registerUser);

// Private/Protected route (requires JWT)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

export default router;

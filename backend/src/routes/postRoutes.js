// backend/src/routes/postRoutes.js
import express from 'express';
import {
    getPosts,
    getPostById,
    getPostsByUser,
    createPost,
    updatePost,
    deletePost,
    // --- NEW IMPORTS FOR COMMENTS & LIKES ---
    createPostComment,
    togglePostLike
    // ----------------------------------------
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Import Multer/Cloudinary

const router = express.Router();

// -----------------------------------------------------------------
// 1. PUBLIC ROUTES (GET) - Base Post CRUD
// -----------------------------------------------------------------
// Includes search/filter functionality via query params
router.route('/').get(getPosts);
router.route('/:id').get(getPostById);
router.route('/user/:userId').get(getPostsByUser);

// -----------------------------------------------------------------
// 2. PROTECTED ROUTES (POST, PUT, DELETE) - Base Post CRUD
// -----------------------------------------------------------------
router.route('/')
    .post(
        protect,
        upload.single('image'), // Handles feature image upload
        createPost
    );

router.route('/:id')
    .put(
        protect,
        upload.single('image'), // Allows uploading a new feature image during update
        updatePost
    )
    .delete(protect, deletePost);

// -----------------------------------------------------------------
// 3. NESTED PROTECTED ROUTES - Comments and Likes
// -----------------------------------------------------------------

// POST /api/posts/:id/comments - Creates a comment on the post
router.route('/:id/comments')
    .post(protect, createPostComment);

// POST /api/posts/:id/like - Toggles a like (like/unlike)
router.route('/:id/like')
    .post(protect, togglePostLike);

export default router;

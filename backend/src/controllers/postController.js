// backend/src/controllers/postController.js
import Post from "../models/Post.js";
// const { cloudinary } = require('../middleware/uploadMiddleware'); // For deleting old images
import { cloudinary } from "../middleware/uploadMiddleware.js";

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
const getPostsByUser = async (req, res) => {
    const userId = req.params.userId;

    const posts = await Post.find({ user: userId })
        .populate('user', 'username profilePicture')
        .sort({ createdAt: -1 });

    res.json({ posts });
};

// @desc    Get all posts (with search/filter/pagination - Industry level)
// @route   GET /api/posts
const getPosts = async (req, res) => {
    // 1. Search Logic: Find posts matching keyword in title or content
    const keyword = req.query.keyword
        ? {
              $or: [
                  { title: { $regex: req.query.keyword, $options: 'i' } },
                  { content: { $regex: req.query.keyword, $options: 'i' } },
              ],
          }
        : {};
        
    // 2. Filter Logic: Filter by category (if provided)
    const category = req.query.category ? { category: req.query.category } : {};

    // 3. Pagination Setup
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    let count;
    try {
        count = await Post.countDocuments({ ...keyword, ...category });
    } catch (error) {
        console.error('Error counting documents:', error);
        count = 0; // Fallback to 0 if count fails
    }

    let posts;
    try {
        posts = await Post.find({ ...keyword, ...category })
            .populate('user', 'username profilePicture') // Get user data
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 }); // Latest posts first
    } catch (error) {
        console.error('Error finding posts:', error);
        posts = []; // Fallback to empty array if find fails
    }

    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
};


// @desc    Get single post
// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
    // Populate the post with the author and the comments (from the virtual field)
    const post = await Post.findById(req.params.id)
        .populate('user', 'username profilePicture')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'username profilePicture' } // Populate user in comments
        }); 

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};


// @desc    Create a post
// @route   POST /api/posts
// @access  Private (requires 'protect' middleware)
const createPost = async (req, res) => {
    const { title, content, category, tags } = req.body;
    
    // Check if an image was uploaded via the middleware
    const imageURL = req.file ? req.file.path : null;
    
    const post = new Post({
        user: req.user._id, // User ID is attached via the 'protect' middleware
        title,
        content,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        image: imageURL,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
};


// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    const { title, content, category, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
        // Only the author can update the post
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to update this post');
        }

        // Handle image update (requires careful management of old image deletion from Cloudinary)
        if (req.file) {
            // Delete the old image from Cloudinary (if it exists)
            if (post.image) {
                 // Extract public ID from the Cloudinary URL (e.g., folder/public_id)
                 const publicId = post.image.split('/').slice(-2).join('/').split('.')[0];
                 await cloudinary.uploader.destroy(publicId);
            }
            post.image = req.file.path; // Set new image URL
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
        
        const updatedPost = await post.save();
        res.json(updatedPost);

    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};


// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin)
const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        // Author or Admin can delete
        if (post.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(401);
            throw new Error('User not authorized to delete this post');
        }

        // Delete image from Cloudinary before deleting the post
        if (post.image) {
            const publicId = post.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.deleteOne({ _id: post._id }); // Use deleteOne with filtering
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

// const Comment = require('../models/Comment'); // <--- IMPORT THE NEW MODEL
import Comment from "../models/Comment.js";

// @desc    Create a new comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const createPostComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (post) {
        const comment = new Comment({
            content,
            user: req.user._id, // User ID from 'protect' middleware
            post: postId,
        });

        await comment.save();
        
        // Optional: Update comment count on the post for quick lookup
        post.commentCount = (post.commentCount || 0) + 1;
        await post.save();

        // Populate the user field before sending the response
        await comment.populate('user', 'username profilePicture');
        
        res.status(201).json(comment);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

// @desc    Toggle a Like on a post (Like/Unlike)
// @route   POST /api/posts/:id/like
// @access  Private
const togglePostLike = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (post) {
        const userLiked = post.likes.includes(userId);

        if (userLiked) {
            // UNLIKE: Remove user ID from the likes array
            post.likes.pull(userId);
            res.json({ message: 'Post unliked successfully', liked: false });
        } else {
            // LIKE: Add user ID to the likes array
            post.likes.push(userId);
            res.json({ message: 'Post liked successfully', liked: true });
        }

        await post.save();

    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

export { getPosts, getPostById, getPostsByUser, createPost, updatePost, deletePost, createPostComment, togglePostLike };

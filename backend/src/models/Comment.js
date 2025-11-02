// backend/src/models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post', // Link to the Post model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Link to the User model (the commenter)
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    // Optional: for nested comments/replies (more advanced)
    // parentComment: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment',
    //     default: null,
    // }
}, {
    timestamps: true,
});

export default mongoose.model('Comment', CommentSchema);

// backend/src/models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL of the uploaded image from Cloudinary
        required: false, // Feature image is optional
    },
    category: {
        type: String,
        required: true,
    },
    tags: [{ // For search and filtering
        type: String,
        trim: true,
    }],
    likes: [{ // Array of User IDs who liked the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentCount: {
        type: Number,
        default: 0,
    }


}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtual fields
    toObject: { virtuals: true }
});

// Reverse populate with Comments (We'll create the Comment model later)
PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

export default mongoose.model('Post', PostSchema);

// backend/src/middleware/uploadMiddleware.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure the storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-platform-images', // Specify a folder in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'],
        // Transformation options, e.g., max size
        transformation: [{ width: 1500, height: 1000, crop: 'limit' }],
    },
});

// Create the Multer upload instance
// 'image' is the field name that will be expected in the form-data
const upload = multer({ storage: storage });

export { cloudinary, upload };

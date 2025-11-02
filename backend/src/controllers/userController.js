// backend/src/controllers/userController.js
 // Import the model
import User from "../models/User.js"
import jwt from "jsonwebtoken" // Already imported for generateToken

// Helper function (keep this from previous response)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        username,
        email,
        password, // Hashing is handled by the pre-save hook in the model!
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile (Private/Protected)
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    // req.user is set by the 'protect' middleware!
    const user = req.user;

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile (Private/Protected)
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // Handle profile picture upload
        if (req.file) {
            user.profilePicture = req.file.path; // Cloudinary URL
        } else if (req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture; // URL string
        }

        if (req.body.password) {
            user.password = req.body.password; // Will be hashed by pre-save hook
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture: updatedUser.profilePicture,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export { authUser, registerUser, getUserProfile, updateUserProfile };

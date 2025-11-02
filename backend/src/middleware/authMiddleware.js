// Middleware to protect routes
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
// const User = require('../models/User');
import User from "../models/User.js"

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user to the request object (without password)
            req.user = await User.findById(decoded.id).select('-password');
            
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };

// backend/src/config/db.js
// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Log successful connection details for development
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log and exit on failure
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with a non-zero status code for failure
    }
};

export default connectDB;

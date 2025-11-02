// A professional Mongoose model for a User
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    profilePicture: { type: String, default: 'default-avatar.png' }
}, { timestamps: true });

// Pre-save hook to hash the password before saving a new user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);

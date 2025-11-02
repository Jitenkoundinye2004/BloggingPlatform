// backend/server.js
// const express = require('express');
import express from "express"
// const dotenv = require('dotenv');
import dotenv from "dotenv"
// const connectDB = require('./src/config/db');
import connectDB from "./src/config/db.js"
import {notFound , errorHandler} from "./src/middleware/errorMiddleware.js"
import postRoutes from "./src/routes/postRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware to parse JSON body from requests
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Primary Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Custom Error Handling Middleware (Professional Standard)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
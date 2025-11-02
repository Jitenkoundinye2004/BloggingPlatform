// backend/src/middleware/errorMiddleware.js
// Catches requests to non-existent API routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the main error handler
};

// backend/src/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    // Sometimes Express sets a 200 status code even if an error occurred. 
    // We explicitly check and set the status code to 500 (Server Error) if it's 200.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    
    res.json({
        message: err.message,
        // In a production environment, you would typically NOT send the stack trace.
        // We include it here only for development debugging.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };

// Import the ErrorHandler class from the "../utils/ErrorHandler" module
const ErrorHandler = require("../utils/ErrorHandler");

// Define an error handling middleware function
module.exports = (err, req, res, next) => {
    // Set default status code and error message if not provided
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Check for specific error types and handle them accordingly

    // Wrong Mongodb Id (castError)
    if (err.name === "CastError") {
        const message = `Resource not found with this id. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate key '${Object.keys(err.keyValue)}' entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid URL. Please try again later.`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {
        const message = `URL expired. Please try again later.`;
        err = new ErrorHandler(message, 400);
    }

    // Set the HTTP response status code and return the error message
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

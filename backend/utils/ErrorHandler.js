// Import the necessary module
const { Error } = require("mongoose");

// Define a custom error handler class that extends the built-in Error class
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Set the status code property of the error
        this.statusCode = statusCode;

        // Capture the stack trace of the error
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the ErrorHandler class to make it accessible to other modules
module.exports = ErrorHandler;

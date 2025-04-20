const errorHandlerMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Clone the error object to avoid modifying the original
  const error = { ...err };
  error.message = err.message;

  // MongoDB duplicate key
  if (error.code === 11000) {
    error.statusCode = 400;
    error.message = `Duplicate field value: ${Object.keys(error.keyValue).join(
      ","
    )}. Please use another value.`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === "CastError") {
    error.statusCode = 400;
    error.message = `Invalid ${error.path}: ${error.value}`;
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    error.statusCode = 401;
    error.message = "Invalid token. Please log in again.";
  }

  if (error.name === "TokenExpiredError") {
    error.statusCode = 401;
    error.message = "Your token has expired. Please log in again.";
  }

  // Create response
  const errorResponse = {
    status: error.status,
    message: error.message,
  };

  return res.status(error.statusCode).json(errorResponse);
};

export default errorHandlerMiddleware;

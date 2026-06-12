import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error",
      err.errors || "Error from error.middleware.js",
      err.stack,
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorHandler;

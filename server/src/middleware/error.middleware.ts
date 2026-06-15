import { ErrorRequestHandler } from "express";
import ApiError from "../utils/ApiError.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      (err as any).statusCode || 500,
      (err as Error).message || "Internal Server Error",
      (err as any).errors || "Unexpected server error",
      (err as Error).stack,
    );
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorHandler;

class ApiError extends Error {
  statusCode: number;
  errors?: unknown;
  stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown,
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "ApiError";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
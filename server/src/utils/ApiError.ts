class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.name = "ApiError";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

import { Request, Response, NextFunction } from "express";

/**
 * Custom Error class with status code
 */
export class ApiError extends Error {
  statusCode: number;
  errorCode: number;

  constructor(message: string, statusCode: number, errorCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  const statusCode = (err as ApiError).statusCode || 500;
  const errorCode = (err as ApiError).errorCode || statusCode;

  res.status(statusCode).json({
    status: false,
    message: err.message || "Internal Server Error",
    errorCode,
  });
};

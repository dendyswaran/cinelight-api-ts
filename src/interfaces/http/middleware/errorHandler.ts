import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errorCode?: number;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || statusCode;
  const message = err.message || 'Internal Server Error';

  // In production, don't expose internal errors
  const responseMessage =
    process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message;

  res.status(statusCode).json({
    status: false,
    message: responseMessage,
    errorCode: errorCode
  });
};

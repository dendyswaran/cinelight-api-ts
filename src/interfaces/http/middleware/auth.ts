import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config';

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
    return;
  }
};

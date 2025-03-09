import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../../infrastructure/config/constants';
import { UserService } from '../../../infrastructure/services/UserService';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { User } from '@domain/entities/User';

export interface DecodedToken {
  id: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: No token provided',
        errorCode: 401
      });
    }

    try {
      // Verify and decode token
      const decoded = verify(token, JWT_SECRET) as DecodedToken;
      const dataSource = DataSourceConfig.getInstance();
      const userRepository = dataSource.getRepository(User);

      // Get user from database to ensure they still exist and are active
      const userService = new UserService(userRepository);
      const user = await userService.findById(decoded.id);

      if (!user || !user.isActive) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized: Invalid user',
          errorCode: 401
        });
      }

      // Attach user to request for use in controllers
      (req as any).user = user;
      (req as any).token = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: Invalid token',
        errorCode: 401
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);

    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      errorCode: 500
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: No user found',
        errorCode: 401
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden: Insufficient permissions',
        errorCode: 403
      });
    }

    next();
  };
};

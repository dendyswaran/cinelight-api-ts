import { Application } from 'express';
import { UserService } from '@infrastructure/services/UserService';
import { AuthController } from '../controllers/AuthController';
import { authenticateJwt } from '../middleware/auth';
import { API_PREFIX } from '@infrastructure/config/constants';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { User } from '@domain/entities/User';

export const setupAuthRoutes = (app: Application) => {
  const dataSource = DataSourceConfig.getInstance();
  const userRepository = dataSource.getRepository(User);

  const userService = new UserService(userRepository);
  const authController = new AuthController(userService);

  /**
   * @route POST /api/auth/login
   * @desc Authenticate user and get token
   * @access Public
   */
  app.post(`${API_PREFIX}/auth/login`, authController.login.bind(authController));

  /**
   * @route POST /api/auth/logout
   * @desc Logout user and invalidate token (if using token blacklist)
   * @access Private
   */
  app.post(
    `${API_PREFIX}/auth/logout`,
    authenticateJwt,
    authController.logout.bind(authController)
  );

  /**
   * @route GET /api/auth/me
   * @desc Get current user data
   * @access Private
   */
  app.get(
    `${API_PREFIX}/auth/me`,
    authenticateJwt,
    authController.getCurrentUser.bind(authController)
  );
};

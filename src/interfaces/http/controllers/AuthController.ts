import config from '@config/index';
import { UserService } from '@infrastructure/services/UserService';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Login user and return token
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validate request
      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
      }

      // Find user by username
      const user = await this.userService.findByUsername(username);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res
          .status(401)
          .json({ message: 'Your account has been deactivated. Please contact administrator.' });
        return;
      }

      // Check password
      const isMatch = await user.validatePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };

      // @ts-ignore: JWT sign types don't match correctly
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

      // Return token and user info (without password)
      const userResponse = {
        id: user.id,
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role,
        isActive: user.isActive
      };

      res.json({
        token,
        user: userResponse
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  /**
   * Logout user
   * Note: In JWT, we don't actually invalidate tokens on the server side unless we're using a token blacklist
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a stateless JWT implementation, logout is typically handled on the client side
      // by removing the token from storage

      // If token blacklisting is implemented, you'd add the token to the blacklist here

      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  /**
   * Get current user information
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // The user has already been authenticated with jwt middleware
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await this.userService.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Return user info without password
      res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role,
        isActive: user.isActive
      });
    } catch (err) {
      console.error('Get current user error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
}

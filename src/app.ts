import { errorHandler } from '@interfaces/http/middleware/errorHandler';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import config from './config';

// Import routes
import { setupAuthRoutes } from '@interfaces/http/routes/authRoutes';
import { setupBundleRoutes } from '@interfaces/http/routes/bundleRoutes';
import { setupEquipmentRoutes } from '@interfaces/http/routes/equipmentRoutes';
import { setupQuotationRoutes } from '@interfaces/http/routes/quotationRoutes';

/**
 * Creates and configures an Express application
 */
export const createApp = (): Application => {
  // Create Express app
  const app: Application = express();

  // Middlewares
  app.use(helmet());
  app.use(cors(config.cors));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: true,
      message: 'Service is healthy',
      data: {
        uptime: process.uptime(),
        timestamp: new Date()
      }
    });
  });

  // API Routes
  setupAuthRoutes(app);
  setupEquipmentRoutes(app);
  setupBundleRoutes(app);
  setupQuotationRoutes(app);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: false,
      message: 'Resource not found',
      errorCode: 404
    });
  });

  // Error Handler
  app.use(errorHandler);

  return app;
};

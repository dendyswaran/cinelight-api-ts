import { EquipmentBundle } from '@domain/entities/EquipmentBundle';
import { EquipmentBundleItem } from '@domain/entities/EquipmentBundleItem';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { EquipmentBundleService } from '@infrastructure/services/EquipmentBundleService';
import { EquipmentBundleController } from '@interfaces/http/controllers/EquipmentBundleController';
import { Application } from 'express';
import { authenticateJwt } from '../middleware/auth';
import { API_PREFIX } from '@infrastructure/config/constants';

export const setupBundleRoutes = (app: Application) => {
  const dataSource = DataSourceConfig.getInstance();
  const bundleRepository = dataSource.getRepository(EquipmentBundle);
  const bundleItemRepository = dataSource.getRepository(EquipmentBundleItem);

  const bundleService = new EquipmentBundleService(bundleRepository, bundleItemRepository);
  const bundleController = new EquipmentBundleController(bundleService);

  /**
   * @route GET /bundles
   * @desc Get all equipment bundles with pagination
   * @access Private
   */
  app.get(
    `${API_PREFIX}/bundles`,
    authenticateJwt,
    bundleController.findAll.bind(bundleController)
  );

  /**
   * @route GET /bundles/:id
   * @desc Get a specific equipment bundle by ID
   * @access Private
   */
  app.get(
    `${API_PREFIX}/bundles/:id`,
    authenticateJwt,
    bundleController.findById.bind(bundleController)
  );

  /**
   * @route POST /bundles
   * @desc Create a new equipment bundle
   * @access Private (Admin only)
   */
  app.post(
    `${API_PREFIX}/bundles`,
    authenticateJwt,
    // requireRole(['admin']),
    bundleController.create.bind(bundleController)
  );

  /**
   * @route PUT /bundles/:id
   * @desc Update an equipment bundle
   * @access Private (Admin only)
   */
  app.put(
    `${API_PREFIX}/bundles/:id`,
    authenticateJwt,
    // requireRole(['admin']),
    bundleController.update.bind(bundleController)
  );

  /**
   * @route DELETE /bundles/:id
   * @desc Delete an equipment bundle
   * @access Private (Admin only)
   */
  app.delete(
    `${API_PREFIX}/bundles/:id`,
    authenticateJwt,
    // requireRole(['admin']),
    bundleController.delete.bind(bundleController)
  );
};

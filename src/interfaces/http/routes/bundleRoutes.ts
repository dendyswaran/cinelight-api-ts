import { EquipmentBundle } from '@domain/entities/EquipmentBundle';
import { EquipmentBundleItem } from '@domain/entities/EquipmentBundleItem';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { EquipmentBundleService } from '@infrastructure/services/EquipmentBundleService';
import { EquipmentBundleController } from '@interfaces/http/controllers/EquipmentBundleController';
import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth';

export const setupBundleRoutes = (router: Router) => {
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
  // @ts-ignore - Express route handler type issue
  router.get('/', authenticateJwt, (req, res) => bundleController.findAll(req, res));

  /**
   * @route GET /bundles/:id
   * @desc Get a specific equipment bundle by ID
   * @access Private
   */
  // @ts-ignore - Express route handler type issue
  router.get('/:id', authenticateJwt, (req, res) => bundleController.findById(req, res));

  /**
   * @route POST /bundles
   * @desc Create a new equipment bundle
   * @access Private (Admin only)
   */
  router.post(
    '/',
    authenticateJwt,
    // requireRole(['admin']),
    // @ts-ignore - Express route handler type issue
    (req, res) => bundleController.create(req, res)
  );

  /**
   * @route PUT /bundles/:id
   * @desc Update an equipment bundle
   * @access Private (Admin only)
   */
  router.put(
    '/:id',
    authenticateJwt,
    // requireRole(['admin']),
    // @ts-ignore - Express route handler type issue
    (req, res) => bundleController.update(req, res)
  );

  /**
   * @route DELETE /bundles/:id
   * @desc Delete an equipment bundle
   * @access Private (Admin only)
   */
  router.delete(
    '/:id',
    authenticateJwt,
    // requireRole(['admin']),
    // @ts-ignore - Express route handler type issue
    (req, res) => bundleController.delete(req, res)
  );
};

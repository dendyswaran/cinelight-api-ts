import { Equipment } from '@domain/entities/Equipment';
import { EquipmentCategory } from '@domain/entities/EquipmentCategory';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { EquipmentCategoryService } from '@infrastructure/services/EquipmentCategoryService';
import { EquipmentService } from '@infrastructure/services/EquipmentService';
import { EquipmentCategoryController } from '@interfaces/http/controllers/EquipmentCategoryController';
import { EquipmentController } from '@interfaces/http/controllers/EquipmentController';
import { Application } from 'express';
import { authenticateJwt } from '../middleware/auth';

export const setupEquipmentRoutes = (app: Application) => {
  const dataSource = DataSourceConfig.getInstance();
  const equipmentRepository = dataSource.getRepository(Equipment);
  const equipmentCategoryRepository = dataSource.getRepository(EquipmentCategory);

  const equipmentService = new EquipmentService(equipmentRepository);
  const equipmentController = new EquipmentController(equipmentService);
  const categoryService = new EquipmentCategoryService(equipmentCategoryRepository);
  const categoryController = new EquipmentCategoryController(categoryService);

  // Equipment category routes
  /**
   * @route GET /equipment/categories
   * @desc Get all equipment categories with pagination
   * @access Private
   */
  app.get('/categories', authenticateJwt, categoryController.findAll.bind(categoryController));

  /**
   * @route GET /equipment/categories/:id
   * @desc Get a specific equipment category by ID
   * @access Private
   */
  app.get('/categories/:id', authenticateJwt, categoryController.findById.bind(categoryController));

  /**
   * @route POST /equipment/categories
   * @desc Create a new equipment category
   * @access Private (Admin only)
   */
  app.post(
    '/categories',
    authenticateJwt,
    // requireRole(['admin']),
    categoryController.create.bind(categoryController)
  );

  /**
   * @route PUT /equipment/categories/:id
   * @desc Update an equipment category
   * @access Private (Admin only)
   */
  app.put(
    '/categories/:id',
    authenticateJwt,
    // requireRole(['admin']),
    categoryController.update.bind(categoryController)
  );

  /**
   * @route DELETE /equipment/categories/:id
   * @desc Delete an equipment category
   * @access Private (Admin only)
   */
  app.delete(
    '/categories/:id',
    authenticateJwt,
    // requireRole(['admin']),
    categoryController.delete.bind(categoryController)
  );

  // Equipment routes
  /**
   * @route GET /equipment
   * @desc Get all equipment with pagination
   * @access Private
   */
  app.get('/', authenticateJwt, equipmentController.findAll.bind(equipmentController));

  /**
   * @route GET /equipment/category/:categoryId
   * @desc Get equipment by category ID
   * @access Private
   */
  app.get(
    '/category/:categoryId',
    authenticateJwt,
    equipmentController.findByCategory.bind(equipmentController)
  );

  /**
   * @route GET /equipment/:id
   * @desc Get a specific equipment by ID
   * @access Private
   */
  app.get('/:id', authenticateJwt, equipmentController.findById.bind(equipmentController));

  /**
   * @route POST /equipment
   * @desc Create a new equipment
   * @access Private (Admin only)
   */
  app.post(
    '/',
    authenticateJwt,
    // requireRole(['admin']),
    equipmentController.create.bind(equipmentController)
  );

  /**
   * @route PUT /equipment/:id
   * @desc Update an equipment
   * @access Private (Admin only)
   */
  app.put(
    '/:id',
    authenticateJwt,
    // requireRole(['admin']),
    equipmentController.update.bind(equipmentController)
  );

  /**
   * @route DELETE /equipment/:id
   * @desc Delete an equipment
   * @access Private (Admin only)
   */
  app.delete(
    '/:id',
    authenticateJwt,
    // requireRole(['admin']),
    equipmentController.delete.bind(equipmentController)
  );
};

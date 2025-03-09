import { Request, Response } from 'express';
import { EquipmentCategoryService } from '@infrastructure/services/EquipmentCategoryService';
import { parsePaginationOptions } from '@utils/pagination';
import { validateCategoryInput } from '@utils/validation';

export class EquipmentCategoryController {
  private categoryService: EquipmentCategoryService;

  constructor(categoryService: EquipmentCategoryService) {
    this.categoryService = categoryService;
  }

  /**
   * Create a new equipment category
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryData = req.body;

      // Validate input
      const validationErrors = validateCategoryInput(categoryData);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const category = await this.categoryService.createCategory(categoryData);

      res.status(201).json({
        status: true,
        message: 'Equipment category created successfully',
        data: category
      });
    } catch (error) {
      console.error('Create category error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get all equipment categories with pagination
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginationOptions = parsePaginationOptions(req.query);
      const paginatedCategories = await this.categoryService.findAll(paginationOptions);

      res.status(200).json({
        status: true,
        message: 'Equipment categories retrieved successfully',
        data: paginatedCategories.items,
        meta: paginatedCategories.meta
      });
    } catch (error) {
      console.error('Get categories error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get a specific equipment category by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.findById(parseInt(id));

      if (!category) {
        res.status(404).json({
          status: false,
          message: 'Equipment category not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment category retrieved successfully',
        data: category
      });
    } catch (error) {
      console.error('Get category error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Update an equipment category
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryData = req.body;

      // Validate input
      const validationErrors = validateCategoryInput(categoryData, true);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const updatedCategory = await this.categoryService.updateCategory(parseInt(id), categoryData);

      if (!updatedCategory) {
        res.status(404).json({
          status: false,
          message: 'Equipment category not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment category updated successfully',
        data: updatedCategory
      });
    } catch (error) {
      console.error('Update category error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Delete an equipment category
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.categoryService.deleteCategory(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          status: false,
          message: 'Equipment category not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment category deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('Delete category error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };
}

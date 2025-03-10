import { Request, Response } from 'express';
import { EquipmentBundleService } from '@infrastructure/services/EquipmentBundleService';
import { parsePaginationOptions } from '@utils/pagination';
import { validateBundleInput } from '@utils/validation';

export class EquipmentBundleController {
  private bundleService: EquipmentBundleService;

  constructor(bundleService: EquipmentBundleService) {
    this.bundleService = bundleService;
  }

  /**
   * Create a new equipment bundle
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const bundleData = req.body;

      // Validate input
      const validationErrors = validateBundleInput(bundleData);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const bundle = await this.bundleService.createBundle(bundleData);

      res.status(201).json({
        status: true,
        message: 'Equipment bundle created successfully',
        data: bundle
      });
    } catch (error) {
      console.error('Create bundle error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get all equipment bundles with pagination
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginationOptions = parsePaginationOptions(req.query);
      const paginatedBundles = await this.bundleService.findAll(paginationOptions);

      res.status(200).json({
        status: true,
        message: 'Equipment bundles retrieved successfully',
        data: paginatedBundles.items,
        meta: paginatedBundles.meta
      });
    } catch (error) {
      console.error('Get bundles error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get a specific equipment bundle by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bundle = await this.bundleService.findById(parseInt(id));

      if (!bundle) {
        res.status(404).json({
          status: false,
          message: 'Equipment bundle not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment bundle retrieved successfully',
        data: bundle
      });
    } catch (error) {
      console.error('Get bundle error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Update an equipment bundle
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bundleData = req.body;

      // Validate input
      const validationErrors = validateBundleInput(bundleData, true);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const updatedBundle = await this.bundleService.updateBundle(parseInt(id), bundleData);

      if (!updatedBundle) {
        res.status(404).json({
          status: false,
          message: 'Equipment bundle not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment bundle updated successfully',
        data: updatedBundle
      });
    } catch (error) {
      console.error('Update bundle error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Delete an equipment bundle
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.bundleService.deleteBundle(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          status: false,
          message: 'Equipment bundle not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment bundle deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('Delete bundle error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };
}

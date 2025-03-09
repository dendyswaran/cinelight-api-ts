import { Request, Response } from 'express';
import { EquipmentService } from '@infrastructure/services/EquipmentService';
import { parsePaginationOptions } from '@utils/pagination';
import { validateEquipmentInput } from '@utils/validation';

export class EquipmentController {
  private equipmentService: EquipmentService;

  constructor(equipmentService: EquipmentService) {
    this.equipmentService = equipmentService;
  }

  /**
   * Create a new equipment
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const equipmentData = req.body;

      // Validate input
      const validationErrors = validateEquipmentInput(equipmentData);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });
      }

      const equipment = await this.equipmentService.createEquipment(equipmentData);

      res.status(201).json({
        status: true,
        message: 'Equipment created successfully',
        data: equipment
      });
    } catch (error) {
      console.error('Create equipment error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get all equipment with pagination
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginationOptions = parsePaginationOptions(req.query);
      const paginatedEquipment = await this.equipmentService.findAll(paginationOptions);

      res.status(200).json({
        status: true,
        message: 'Equipment retrieved successfully',
        data: paginatedEquipment.items,
        meta: paginatedEquipment.meta
      });
    } catch (error) {
      console.error('Get equipment error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get equipment by category ID
   */
  findByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;
      const paginationOptions = parsePaginationOptions(req.query);

      const paginatedEquipment = await this.equipmentService.findByCategoryId(
        parseInt(categoryId),
        paginationOptions
      );

      res.status(200).json({
        status: true,
        message: 'Equipment by category retrieved successfully',
        data: paginatedEquipment.items,
        meta: paginatedEquipment.meta
      });
    } catch (error) {
      console.error('Get equipment by category error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get a specific equipment by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const equipment = await this.equipmentService.findById(parseInt(id));

      if (!equipment) {
        res.status(404).json({
          status: false,
          message: 'Equipment not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment retrieved successfully',
        data: equipment
      });
    } catch (error) {
      console.error('Get equipment error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Update an equipment
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const equipmentData = req.body;

      // Validate input
      const validationErrors = validateEquipmentInput(equipmentData, true);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });
      }

      const updatedEquipment = await this.equipmentService.updateEquipment(
        parseInt(id),
        equipmentData
      );

      if (!updatedEquipment) {
        res.status(404).json({
          status: false,
          message: 'Equipment not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment updated successfully',
        data: updatedEquipment
      });
    } catch (error) {
      console.error('Update equipment error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Delete an equipment
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.equipmentService.deleteEquipment(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          status: false,
          message: 'Equipment not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Equipment deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('Delete equipment error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };
}

import { Request, Response } from 'express';
import { QuotationService } from '@infrastructure/services/QuotationService';
import { parsePaginationOptions } from '@utils/pagination';
import { validateQuotationInput } from '@utils/validation';
import { QuotationStatus } from '@domain/entities/Quotation';

export class QuotationController {
  private quotationService: QuotationService;

  constructor(quotationService: QuotationService) {
    this.quotationService = quotationService;
  }

  /**
   * Create a new quotation
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const quotationData = req.body;

      // Validate input
      const validationErrors = validateQuotationInput(quotationData);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const quotation = await this.quotationService.createQuotation(quotationData);

      res.status(201).json({
        status: true,
        message: 'Quotation created successfully',
        data: quotation
      });
    } catch (error) {
      console.error('Create quotation error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get all quotations with pagination
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const paginationOptions = parsePaginationOptions(req.query);
      const paginatedQuotations = await this.quotationService.findAll(paginationOptions);

      res.status(200).json({
        status: true,
        message: 'Quotations retrieved successfully',
        data: paginatedQuotations.items,
        meta: paginatedQuotations.meta
      });
    } catch (error) {
      console.error('Get quotations error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Get a specific quotation by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const quotation = await this.quotationService.findById(parseInt(id));

      if (!quotation) {
        res.status(404).json({
          status: false,
          message: 'Quotation not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Quotation retrieved successfully',
        data: quotation
      });
    } catch (error) {
      console.error('Get quotation error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Update a quotation
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const quotationData = req.body;

      // Validate input
      const validationErrors = validateQuotationInput(quotationData, true);
      if (validationErrors.length > 0) {
        res.status(400).json({
          status: false,
          message: 'Validation error',
          errorCode: 400,
          errors: validationErrors
        });

        return;
      }

      const updatedQuotation = await this.quotationService.updateQuotation(
        parseInt(id),
        quotationData
      );

      if (!updatedQuotation) {
        res.status(404).json({
          status: false,
          message: 'Quotation not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Quotation updated successfully',
        data: updatedQuotation
      });
    } catch (error) {
      console.error('Update quotation error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Delete a quotation
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.quotationService.deleteQuotation(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          status: false,
          message: 'Quotation not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Quotation deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('Delete quotation error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Update quotation status
   */
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(QuotationStatus).includes(status as QuotationStatus)) {
        res.status(400).json({
          status: false,
          message: 'Invalid status value',
          errorCode: 400
        });

        return;
      }

      const updatedQuotation = await this.quotationService.updateStatus(
        parseInt(id),
        status as QuotationStatus
      );

      if (!updatedQuotation) {
        res.status(404).json({
          status: false,
          message: 'Quotation not found',
          errorCode: 404
        });

        return;
      }

      res.status(200).json({
        status: true,
        message: 'Quotation status updated successfully',
        data: updatedQuotation
      });
    } catch (error) {
      console.error('Update quotation status error:', error);

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Add an item to a quotation
   */
  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const itemData = req.body;

      const item = await this.quotationService.addItem(parseInt(id), itemData);

      res.status(201).json({
        status: true,
        message: 'Item added to quotation successfully',
        data: item
      });
    } catch (error) {
      console.error('Add item error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Remove an item from a quotation
   */
  removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, itemId } = req.params;

      const removed = await this.quotationService.removeItem(parseInt(id), parseInt(itemId));

      res.status(200).json({
        status: true,
        message: 'Item removed from quotation successfully',
        data: null
      });
    } catch (error) {
      console.error('Remove item error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Add a section to a quotation
   */
  addSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const sectionData = req.body;

      const section = await this.quotationService.addSection(parseInt(id), sectionData);

      res.status(201).json({
        status: true,
        message: 'Section added to quotation successfully',
        data: section
      });
    } catch (error) {
      console.error('Add section error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Remove a section from a quotation
   */
  removeSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, sectionId } = req.params;

      const removed = await this.quotationService.removeSection(parseInt(id), parseInt(sectionId));

      res.status(200).json({
        status: true,
        message: 'Section removed from quotation successfully',
        data: null
      });
    } catch (error) {
      console.error('Remove section error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Export a quotation to PDF
   */
  exportToPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const pdfBuffer = await this.quotationService.exportToPdf(parseInt(id));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.pdf`);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Export to PDF error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };

  /**
   * Export a quotation to Excel
   */
  exportToExcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const excelBuffer = await this.quotationService.exportToExcel(parseInt(id));

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.xlsx`);

      res.send(excelBuffer);
    } catch (error) {
      console.error('Export to Excel error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          status: false,
          message: error.message,
          errorCode: 400
        });
      }

      res.status(500).json({
        status: false,
        message: 'Internal server error',
        errorCode: 500
      });
    }
  };
}

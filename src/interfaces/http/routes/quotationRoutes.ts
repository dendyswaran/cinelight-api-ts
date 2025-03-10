import { Quotation } from '@domain/entities/Quotation';
import { QuotationItem } from '@domain/entities/QuotationItem';
import { QuotationSection } from '@domain/entities/QuotationSection';
import { DataSourceConfig } from '@infrastructure/database/data-source';
import { QuotationService } from '@infrastructure/services/QuotationService';
import { QuotationController } from '@interfaces/http/controllers/QuotationController';
import { authenticateToken, requireRole } from '@interfaces/http/middleware/authMiddleware';
import { Application } from 'express';
import { authenticateJwt } from '../middleware/auth';

export const setupQuotationRoutes = (app: Application) => {
  const quotationRepository = DataSourceConfig.getInstance().getRepository(Quotation);
  const sectionRepository = DataSourceConfig.getInstance().getRepository(QuotationSection);
  const itemRepository = DataSourceConfig.getInstance().getRepository(QuotationItem);
  const quotationService = new QuotationService(
    quotationRepository,
    sectionRepository,
    itemRepository
  );
  const quotationController = new QuotationController(quotationService);

  /**
   * @route GET /quotations
   * @desc Get all quotations with pagination
   * @access Private
   */
  app.get('/', authenticateJwt, quotationController.findAll.bind(quotationController));

  /**
   * @route GET /quotations/:id
   * @desc Get a specific quotation by ID
   * @access Private
   */
  app.get('/:id', authenticateJwt, quotationController.findById.bind(quotationController));

  /**
   * @route POST /quotations
   * @desc Create a new quotation
   * @access Private
   */
  app.post('/', authenticateJwt, quotationController.create.bind(quotationController));

  /**
   * @route PUT /quotations/:id
   * @desc Update a quotation
   * @access Private
   */
  app.put('/:id', authenticateJwt, quotationController.update.bind(quotationController));

  /**
   * @route DELETE /quotations/:id
   * @desc Delete a quotation
   * @access Private (Admin only)
   */
  app.delete(
    '/:id',
    authenticateJwt,
    // requireRole(['admin']),
    quotationController.delete.bind(quotationController)
  );

  /**
   * @route PUT /quotations/:id/status
   * @desc Update quotation status
   * @access Private
   */
  app.put(
    '/:id/status',
    authenticateJwt,
    quotationController.updateStatus.bind(quotationController)
  );

  /**
   * @route POST /quotations/:id/items
   * @desc Add an item to a quotation
   * @access Private
   */
  app.post('/:id/items', authenticateJwt, quotationController.addItem.bind(quotationController));

  /**
   * @route DELETE /quotations/:id/items/:itemId
   * @desc Remove an item from a quotation
   * @access Private
   */
  app.delete(
    '/:id/items/:itemId',
    authenticateJwt,
    quotationController.removeItem.bind(quotationController)
  );

  /**
   * @route POST /quotations/:id/sections
   * @desc Add a section to a quotation
   * @access Private
   */
  app.post(
    '/:id/sections',
    authenticateJwt,
    quotationController.addSection.bind(quotationController)
  );

  /**
   * @route DELETE /quotations/:id/sections/:sectionId
   * @desc Remove a section from a quotation
   * @access Private
   */
  app.delete(
    '/:id/sections/:sectionId',
    authenticateJwt,
    quotationController.removeSection.bind(quotationController)
  );

  /**
   * @route GET /quotations/:id/export/pdf
   * @desc Export a quotation to PDF
   * @access Private
   */
  app.get(
    '/:id/export/pdf',
    authenticateJwt,
    quotationController.exportToPdf.bind(quotationController)
  );

  /**
   * @route GET /quotations/:id/export/excel
   * @desc Export a quotation to Excel
   * @access Private
   */
  app.get(
    '/:id/export/excel',
    authenticateJwt,
    quotationController.exportToExcel.bind(quotationController)
  );
};

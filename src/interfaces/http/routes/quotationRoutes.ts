import { Router } from 'express';
import { QuotationController } from '@interfaces/http/controllers/QuotationController';
import { authenticateToken, requireRole } from '@interfaces/http/middleware/authMiddleware';

const router = Router();
const quotationController = new QuotationController();

/**
 * @route GET /quotations
 * @desc Get all quotations with pagination
 * @access Private
 */
router.get('/', authenticateToken, quotationController.findAll);

/**
 * @route GET /quotations/:id
 * @desc Get a specific quotation by ID
 * @access Private
 */
router.get('/:id', authenticateToken, quotationController.findById);

/**
 * @route POST /quotations
 * @desc Create a new quotation
 * @access Private
 */
router.post('/', authenticateToken, quotationController.create);

/**
 * @route PUT /quotations/:id
 * @desc Update a quotation
 * @access Private
 */
router.put('/:id', authenticateToken, quotationController.update);

/**
 * @route DELETE /quotations/:id
 * @desc Delete a quotation
 * @access Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), quotationController.delete);

/**
 * @route PUT /quotations/:id/status
 * @desc Update quotation status
 * @access Private
 */
router.put('/:id/status', authenticateToken, quotationController.updateStatus);

/**
 * @route POST /quotations/:id/items
 * @desc Add an item to a quotation
 * @access Private
 */
router.post('/:id/items', authenticateToken, quotationController.addItem);

/**
 * @route DELETE /quotations/:id/items/:itemId
 * @desc Remove an item from a quotation
 * @access Private
 */
router.delete('/:id/items/:itemId', authenticateToken, quotationController.removeItem);

/**
 * @route POST /quotations/:id/sections
 * @desc Add a section to a quotation
 * @access Private
 */
router.post('/:id/sections', authenticateToken, quotationController.addSection);

/**
 * @route DELETE /quotations/:id/sections/:sectionId
 * @desc Remove a section from a quotation
 * @access Private
 */
router.delete('/:id/sections/:sectionId', authenticateToken, quotationController.removeSection);

/**
 * @route GET /quotations/:id/export/pdf
 * @desc Export a quotation to PDF
 * @access Private
 */
router.get('/:id/export/pdf', authenticateToken, quotationController.exportToPdf);

/**
 * @route GET /quotations/:id/export/excel
 * @desc Export a quotation to Excel
 * @access Private
 */
router.get('/:id/export/excel', authenticateToken, quotationController.exportToExcel);

export default router;

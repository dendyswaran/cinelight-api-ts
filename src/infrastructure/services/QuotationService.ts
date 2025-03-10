import { Quotation, QuotationProps, QuotationStatus } from '@domain/entities/Quotation';
import { QuotationItem } from '@domain/entities/QuotationItem';
import { QuotationSection } from '@domain/entities/QuotationSection';
import { PaginatedResult, PaginationOptions } from '@utils/pagination';
import { Repository } from 'typeorm';

export interface IQuotationService {
  createQuotation(quotationData: QuotationProps): Promise<Quotation>;
  findById(id: number): Promise<Quotation | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Quotation>>;
  updateQuotation(id: number, quotationData: Partial<QuotationProps>): Promise<Quotation | null>;
  deleteQuotation(id: number): Promise<boolean>;
  updateStatus(id: number, status: QuotationStatus): Promise<Quotation | null>;
  addItem(quotationId: number, itemData: any): Promise<QuotationItem>;
  removeItem(quotationId: number, itemId: number): Promise<boolean>;
  addSection(quotationId: number, sectionData: any): Promise<QuotationSection>;
  removeSection(quotationId: number, sectionId: number): Promise<boolean>;
  generateQuotationNumber(): Promise<string>;
  exportToPdf(id: number): Promise<Buffer>;
  exportToExcel(id: number): Promise<Buffer>;
}

export class QuotationService implements IQuotationService {
  private quotationRepository: Repository<Quotation>;
  private sectionRepository: Repository<QuotationSection>;
  private itemRepository: Repository<QuotationItem>;

  constructor(
    quotationRepository: Repository<Quotation>,
    sectionRepository: Repository<QuotationSection>,
    itemRepository: Repository<QuotationItem>
  ) {
    this.quotationRepository = quotationRepository;
    this.sectionRepository = sectionRepository;
    this.itemRepository = itemRepository;
  }

  async createQuotation(quotationData: QuotationProps): Promise<Quotation> {
    // Generate quotation number if not provided
    if (!quotationData.quotationNumber) {
      quotationData.quotationNumber = await this.generateQuotationNumber();
    }

    const quotation = this.quotationRepository.create(quotationData);
    return this.quotationRepository.save(quotation);
  }

  async findById(id: number): Promise<Quotation | null> {
    return this.quotationRepository.findOne({
      where: { id },
      relations: ['sections', 'sections.items', 'items']
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Quotation>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'createdAt',
      order = 'DESC',
      filter = {}
    } = options || {};

    // Build query with search filter
    const queryBuilder = this.quotationRepository.createQueryBuilder('quotation');

    if (search) {
      queryBuilder.where(
        'quotation.quotationNumber ILIKE :search OR quotation.clientName ILIKE :search OR quotation.projectName ILIKE :search',
        { search: `%${search}%` }
      );
    }

    // Apply additional filters
    if (filter.status) {
      queryBuilder.andWhere('quotation.status = :status', { status: filter.status });
    }

    if (filter.fromDate) {
      queryBuilder.andWhere('quotation.issueDate >= :fromDate', { fromDate: filter.fromDate });
    }

    if (filter.toDate) {
      queryBuilder.andWhere('quotation.issueDate <= :toDate', { toDate: filter.toDate });
    }

    // Add sorting
    queryBuilder.orderBy(`quotation.${sort}`, order as 'ASC' | 'DESC');

    // Count total before pagination
    const total = await queryBuilder.getCount();

    // Add pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Get paginated results
    const items = await queryBuilder.getMany();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateQuotation(
    id: number,
    quotationData: Partial<QuotationProps>
  ): Promise<Quotation | null> {
    const quotation = await this.findById(id);

    if (!quotation) {
      return null;
    }

    Object.assign(quotation, quotationData);
    return this.quotationRepository.save(quotation);
  }

  async deleteQuotation(id: number): Promise<boolean> {
    const result = await this.quotationRepository.delete(id);
    return !!result.affected;
  }

  async updateStatus(id: number, status: QuotationStatus): Promise<Quotation | null> {
    const quotation = await this.findById(id);

    if (!quotation) {
      return null;
    }

    quotation.status = status;
    return this.quotationRepository.save(quotation);
  }

  async addItem(quotationId: number, itemData: any): Promise<QuotationItem> {
    const quotation = await this.findById(quotationId);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const itemEntity = this.itemRepository.create({
      ...itemData,
      quotationId
    });

    // Handle possible array return from create() method
    const item = Array.isArray(itemEntity) ? itemEntity[0] : itemEntity;

    // Calculate total if not provided
    if (!item.total) {
      item.calculateTotal();
    }

    const savedItem = await this.itemRepository.save(item);

    // Update quotation totals
    quotation.calculateTotals();
    await this.quotationRepository.save(quotation);

    // Update section subtotal if item belongs to a section
    if (item.sectionId) {
      const section = await this.sectionRepository.findOne({
        where: { id: item.sectionId },
        relations: ['items']
      });

      if (section) {
        section.calculateSubtotal();
        await this.sectionRepository.save(section);
      }
    }

    return Array.isArray(savedItem) ? savedItem[0] : savedItem;
  }

  async removeItem(quotationId: number, itemId: number): Promise<boolean> {
    const quotation = await this.findById(quotationId);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const item = await this.itemRepository.findOne({
      where: { id: itemId, quotationId }
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const sectionId = item.sectionId;

    // Delete the item
    const result = await this.itemRepository.delete(itemId);

    if (!result.affected) {
      return false;
    }

    // Update quotation totals
    quotation.calculateTotals();
    await this.quotationRepository.save(quotation);

    // Update section subtotal if item belonged to a section
    if (sectionId) {
      const section = await this.sectionRepository.findOne({
        where: { id: sectionId },
        relations: ['items']
      });

      if (section) {
        section.calculateSubtotal();
        await this.sectionRepository.save(section);
      }
    }

    return true;
  }

  async addSection(quotationId: number, sectionData: any): Promise<QuotationSection> {
    const quotation = await this.findById(quotationId);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const section = this.sectionRepository.create({
      ...sectionData,
      quotationId
    });

    const savedSection = await this.sectionRepository.save(section);
    return Array.isArray(savedSection) ? savedSection[0] : savedSection;
  }

  async removeSection(quotationId: number, sectionId: number): Promise<boolean> {
    const quotation = await this.findById(quotationId);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, quotationId }
    });

    if (!section) {
      throw new Error('Section not found');
    }

    // Delete the section
    const result = await this.sectionRepository.delete(sectionId);

    if (!result.affected) {
      return false;
    }

    // Update quotation totals (items linked to the section will be cascade deleted or orphaned based on DB config)
    quotation.calculateTotals();
    await this.quotationRepository.save(quotation);

    return true;
  }

  async generateQuotationNumber(): Promise<string> {
    // Get the current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Get the count of quotations for this month
    const prefix = `QL${year}${month}`;

    const latestQuotation = await this.quotationRepository
      .createQueryBuilder('quotation')
      .where('quotation.quotationNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('quotation.quotationNumber', 'DESC')
      .getOne();

    let counter = 1;

    if (latestQuotation) {
      // Extract the counter from the latest quotation number
      const match = latestQuotation.quotationNumber.match(/\d+$/);
      if (match) {
        counter = parseInt(match[0], 10) + 1;
      }
    }

    // Format: QL + YYYYMM + 4-digit sequence number
    return `${prefix}${String(counter).padStart(4, '0')}`;
  }

  async exportToPdf(id: number): Promise<Buffer> {
    // This is a placeholder implementation
    // In a real app, you would use a PDF library like PDFKit or jsPDF
    const quotation = await this.findById(id);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // For now, return an empty buffer
    // This should be replaced with real PDF generation logic
    return Buffer.from('');
  }

  async exportToExcel(id: number): Promise<Buffer> {
    // This is a placeholder implementation
    // In a real app, you would use a library like ExcelJS or xlsx
    const quotation = await this.findById(id);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // For now, return an empty buffer
    // This should be replaced with real Excel generation logic
    return Buffer.from('');
  }
}

import { EquipmentBundle, EquipmentBundleProps } from '@domain/entities/EquipmentBundle';
import { EquipmentBundleItem } from '@domain/entities/EquipmentBundleItem';
import { PaginatedResult, PaginationOptions } from '@utils/pagination';
import { Repository } from 'typeorm';

export interface IEquipmentBundleService {
  createBundle(bundleData: EquipmentBundleProps): Promise<EquipmentBundle>;
  findById(id: number): Promise<EquipmentBundle | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<EquipmentBundle>>;
  updateBundle(
    id: number,
    bundleData: Partial<EquipmentBundleProps>
  ): Promise<EquipmentBundle | null>;
  deleteBundle(id: number): Promise<boolean>;
}

export class EquipmentBundleService implements IEquipmentBundleService {
  private bundleRepository: Repository<EquipmentBundle>;
  private bundleItemRepository: Repository<EquipmentBundleItem>;

  constructor(
    bundleRepository: Repository<EquipmentBundle>,
    bundleItemRepository: Repository<EquipmentBundleItem>
  ) {
    this.bundleRepository = bundleRepository;
    this.bundleItemRepository = bundleItemRepository;
  }

  async createBundle(bundleData: EquipmentBundleProps): Promise<EquipmentBundle> {
    const bundle = this.bundleRepository.create(bundleData);
    return this.bundleRepository.save(bundle);
  }

  async findById(id: number): Promise<EquipmentBundle | null> {
    return this.bundleRepository.findOne({
      where: { id },
      relations: ['bundleItems', 'bundleItems.equipment', 'bundleItems.equipment.category']
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<EquipmentBundle>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'name',
      order = 'ASC',
      filter = {}
    } = options || {};

    // Build query with search filter
    const queryBuilder = this.bundleRepository
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.bundleItems', 'bundleItems')
      .leftJoinAndSelect('bundleItems.equipment', 'equipment');

    if (search) {
      queryBuilder.where('bundle.name ILIKE :search OR bundle.description ILIKE :search', {
        search: `%${search}%`
      });
    }

    // Apply additional filters
    if (filter.minPrice) {
      queryBuilder.andWhere('bundle.dailyRentalPrice >= :minPrice', {
        minPrice: filter.minPrice
      });
    }

    if (filter.maxPrice) {
      queryBuilder.andWhere('bundle.dailyRentalPrice <= :maxPrice', {
        maxPrice: filter.maxPrice
      });
    }

    if (filter.isActive !== undefined) {
      queryBuilder.andWhere('bundle.isActive = :isActive', { isActive: filter.isActive });
    }

    // Add sorting
    queryBuilder.orderBy(`bundle.${sort}`, order as 'ASC' | 'DESC');

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

  async updateBundle(
    id: number,
    bundleData: Partial<EquipmentBundleProps>
  ): Promise<EquipmentBundle | null> {
    const bundle = await this.findById(id);

    if (!bundle) {
      return null;
    }

    // Handle bundle items update if provided
    if (bundleData.bundleItems) {
      // Delete existing bundle items
      await this.bundleItemRepository.delete({ bundleId: id });

      // Prepare new bundle items with the correct bundleId
      const bundleItems = bundleData.bundleItems.map(item => ({
        ...item,
        bundleId: id
      }));

      // Remove bundleItems from bundleData to avoid TypeORM conflicts
      const { bundleItems: _, ...bundleDataWithoutItems } = bundleData;

      // Update bundle properties
      Object.assign(bundle, bundleDataWithoutItems);
      await this.bundleRepository.save(bundle);

      // Create new bundle items
      for (const item of bundleItems) {
        await this.bundleItemRepository.save(item);
      }

      // Fetch the updated bundle with items
      return this.findById(id);
    }

    // Update bundle properties without touching items
    Object.assign(bundle, bundleData);
    return this.bundleRepository.save(bundle);
  }

  async deleteBundle(id: number): Promise<boolean> {
    const result = await this.bundleRepository.delete(id);
    return !!result.affected;
  }
}

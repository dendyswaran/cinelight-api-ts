import { Equipment, EquipmentProps } from '@domain/entities/Equipment';
import { PaginatedResult, PaginationOptions } from '@utils/pagination';
import { Repository } from 'typeorm';

export interface IEquipmentService {
  createEquipment(equipmentData: EquipmentProps): Promise<Equipment>;
  findById(id: number): Promise<Equipment | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Equipment>>;
  updateEquipment(id: number, equipmentData: Partial<EquipmentProps>): Promise<Equipment | null>;
  deleteEquipment(id: number): Promise<boolean>;
  findByCategoryId(
    categoryId: number,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Equipment>>;
}

export class EquipmentService implements IEquipmentService {
  private equipmentRepository: Repository<Equipment>;

  constructor(equipmentRepository: Repository<Equipment>) {
    this.equipmentRepository = equipmentRepository;
  }

  async createEquipment(equipmentData: EquipmentProps): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(equipmentData);
    return this.equipmentRepository.save(equipment);
  }

  async findById(id: number): Promise<Equipment | null> {
    return this.equipmentRepository.findOne({
      where: { id },
      relations: ['category']
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Equipment>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'name',
      order = 'ASC',
      filter = {}
    } = options || {};

    // Build query with search filter
    const queryBuilder = this.equipmentRepository
      .createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.category', 'category');

    if (search) {
      queryBuilder.where(
        'equipment.name ILIKE :search OR equipment.description ILIKE :search OR category.name ILIKE :search',
        { search: `%${search}%` }
      );
    }

    // Apply additional filters
    if (filter.categoryId) {
      queryBuilder.andWhere('equipment.categoryId = :categoryId', {
        categoryId: filter.categoryId
      });
    }

    if (filter.minPrice) {
      queryBuilder.andWhere('equipment.dailyRentalPrice >= :minPrice', {
        minPrice: filter.minPrice
      });
    }

    if (filter.maxPrice) {
      queryBuilder.andWhere('equipment.dailyRentalPrice <= :maxPrice', {
        maxPrice: filter.maxPrice
      });
    }

    if (filter.isActive !== undefined) {
      queryBuilder.andWhere('equipment.isActive = :isActive', { isActive: filter.isActive });
    }

    // Add sorting
    queryBuilder.orderBy(`equipment.${sort}`, order as 'ASC' | 'DESC');

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

  async findByCategoryId(
    categoryId: number,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Equipment>> {
    const filterWithCategory = {
      ...(options?.filter || {}),
      categoryId
    };

    return this.findAll({
      ...options,
      filter: filterWithCategory
    });
  }

  async updateEquipment(
    id: number,
    equipmentData: Partial<EquipmentProps>
  ): Promise<Equipment | null> {
    const equipment = await this.findById(id);

    if (!equipment) {
      return null;
    }

    Object.assign(equipment, equipmentData);
    return this.equipmentRepository.save(equipment);
  }

  async deleteEquipment(id: number): Promise<boolean> {
    const result = await this.equipmentRepository.delete(id);
    return !!result.affected;
  }
}

import { EquipmentCategory, EquipmentCategoryProps } from '@domain/entities/EquipmentCategory';
import { PaginatedResult, PaginationOptions } from '@utils/pagination';
import { Repository } from 'typeorm';

export interface IEquipmentCategoryService {
  createCategory(categoryData: EquipmentCategoryProps): Promise<EquipmentCategory>;
  findById(id: number): Promise<EquipmentCategory | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<EquipmentCategory>>;
  updateCategory(
    id: number,
    categoryData: Partial<EquipmentCategoryProps>
  ): Promise<EquipmentCategory | null>;
  deleteCategory(id: number): Promise<boolean>;
}

export class EquipmentCategoryService implements IEquipmentCategoryService {
  private categoryRepository: Repository<EquipmentCategory>;

  constructor(categoryRepository: Repository<EquipmentCategory>) {
    this.categoryRepository = categoryRepository;
  }

  async createCategory(categoryData: EquipmentCategoryProps): Promise<EquipmentCategory> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async findById(id: number): Promise<EquipmentCategory | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['equipment']
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<EquipmentCategory>> {
    const { page = 1, limit = 10, search = '', sort = 'name', order = 'ASC' } = options || {};

    // Build query with search filter
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.where('category.name ILIKE :search OR category.description ILIKE :search', {
        search: `%${search}%`
      });
    }

    // Add sorting
    queryBuilder.orderBy(`category.${sort}`, order as 'ASC' | 'DESC');

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

  async updateCategory(
    id: number,
    categoryData: Partial<EquipmentCategoryProps>
  ): Promise<EquipmentCategory | null> {
    const category = await this.findById(id);

    if (!category) {
      return null;
    }

    Object.assign(category, categoryData);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return !!result.affected;
  }
}

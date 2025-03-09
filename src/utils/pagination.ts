/**
 * Interface for pagination request parameters
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC' | string;
  filter?: Record<string, any>;
}

/**
 * Interface for metadata in paginated responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface for paginated results
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Parse pagination options from query parameters
 * @param query Express query object
 * @returns Parsed pagination options
 */
export function parsePaginationOptions(query: Record<string, any>): PaginationOptions {
  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  const search = query.search || '';
  const sort = query.sort || 'createdAt';
  const order = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  // Extract filter parameters (all params except pagination ones)
  const filter: Record<string, any> = {};
  const paginationParams = ['page', 'limit', 'search', 'sort', 'order'];

  Object.keys(query).forEach(key => {
    if (!paginationParams.includes(key)) {
      filter[key] = query[key];
    }
  });

  return { page, limit, search, sort, order, filter };
}

/**
 * Create a paginated result
 * @param items Array of items
 * @param total Total number of items (before pagination)
 * @param options Pagination options
 * @returns Paginated result
 */
export function createPaginatedResult<T>(
  items: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  const { page = 1, limit = 10 } = options;

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

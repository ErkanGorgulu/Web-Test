/**
 * Common response structure for all API requests
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Filter operator
 */
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "in";

/**
 * Filter criteria
 */
export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: string | string[] | number | number[] | boolean | null;
}

/**
 * Sorting criteria
 */
export interface SortCriteria {
  field: string;
  direction: SortDirection;
}

/**
 * Query parameters for paginated requests
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: SortCriteria[];
  filters?: FilterCriteria[];
  search?: string;
}

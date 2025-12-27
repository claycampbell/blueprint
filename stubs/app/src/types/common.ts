/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    pageSize: number
  }
}

/**
 * API error response
 */
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Sort params
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Pagination Utilities
 * Phase 6 Step 10 - Reusable pagination helpers for large datasets
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    from: number;
    to: number;
  };
}

/**
 * Create pagination metadata
 */
export function createPagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    from: total > 0 ? from : 0,
    to: total > 0 ? to : 0,
  };
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit: number = 20,
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("limit") || String(defaultLimit))),
  );
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  return { page, limit, sortBy, sortOrder };
}

/**
 * Calculate skip value for database queries
 */
export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Create Prisma orderBy from sort parameters
 */
export function createOrderBy(
  sortBy?: string,
  sortOrder: "asc" | "desc" = "desc",
): any {
  if (!sortBy) {
    return { createdAt: "desc" };
  }

  return { [sortBy]: sortOrder };
}

/**
 * Generate page numbers for pagination UI
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5,
): (number | "...")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const halfVisible = Math.floor(maxVisible / 2);

  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if at start
  if (currentPage <= halfVisible) {
    end = maxVisible - 1;
  }

  // Adjust if at end
  if (currentPage >= totalPages - halfVisible) {
    start = totalPages - maxVisible + 2;
  }

  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

/**
 * Cursor-based pagination helpers (for infinite scroll)
 */
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CursorPaginationResult<T> {
  data: T[];
  cursor: {
    next: string | null;
    hasMore: boolean;
  };
}

/**
 * Create cursor pagination result
 */
export function createCursorPagination<T extends { id: string }>(
  data: T[],
  limit: number,
): CursorPaginationResult<T> {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    data: items,
    cursor: {
      next: nextCursor,
      hasMore,
    },
  };
}

/**
 * Create Prisma cursor query
 */
export function createCursorQuery(cursor: string | undefined, limit: number) {
  return {
    take: limit + 1, // Fetch one extra to determine if there are more
    ...(cursor && {
      skip: 1, // Skip the cursor
      cursor: { id: cursor },
    }),
  };
}

/**
 * Pagination component data for frontend
 */
export interface PaginationComponentData {
  currentPage: number;
  totalPages: number;
  pageNumbers: (number | "...")[];
  hasNext: boolean;
  hasPrev: boolean;
  showing: string; // "Showing 1-20 of 100 results"
}

/**
 * Generate pagination component data
 */
export function createPaginationComponentData(
  total: number,
  page: number,
  limit: number,
): PaginationComponentData {
  const pagination = createPagination(total, page, limit);
  const pageNumbers = generatePageNumbers(page, pagination.totalPages);

  return {
    currentPage: page,
    totalPages: pagination.totalPages,
    pageNumbers,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    showing: `Showing ${pagination.from}-${pagination.to} of ${total} results`,
  };
}

/**
 * URL helper for pagination links
 */
export function createPaginationUrl(
  baseUrl: string,
  page: number,
  additionalParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(additionalParams);
  params.set("page", String(page));
  return `${baseUrl}?${params.toString()}`;
}


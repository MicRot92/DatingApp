export interface PaginatedResult<T> {
    metadata: PaginationMetadata;
    items: T[];
}

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
export interface PaginationQuery {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 1 | -1;
}

export interface PaginatedMeta {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export const getPaginationOptions = (
    query: PaginationQuery,
    defaultSortBy = "createdAt",
): PaginationOptions => {
    const page = Math.max(1, parseInt(String(query.page || 1), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 10), 10)));
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || defaultSortBy;
    const sortOrder: 1 | -1 = query.sortOrder === "asc" ? 1 : -1;

    return { page, limit, skip, sortBy, sortOrder };
};

export const formatPaginatedMeta = (
    totalDocs: number,
    page: number,
    limit: number,
): PaginatedMeta => {
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    return {
        totalDocs,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

import type { ApiResponse, RoleInfo } from "./auth.js";

export interface GetRolesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface RoleFormData {
    name: string;
    description?: string;
    permissions: string[];
}

export interface RoleListResponseData {
    roles: (RoleInfo & { srNo?: number })[];
    meta?: {
        totalDocs?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

export type RoleListApiResponse = ApiResponse<RoleListResponseData | RoleInfo[]>;
export type RoleDetailApiResponse = ApiResponse<RoleInfo>;

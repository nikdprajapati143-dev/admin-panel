import type { AdminUser, ApiResponse } from "./auth.js";

export interface GetAdminsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface AdminListResponseData {
    admins: (AdminUser & { srNo?: number })[];
    meta?: {
        totalDocs?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

export type AdminListApiResponse = ApiResponse<AdminListResponseData | AdminUser[]>;
export type AdminDetailApiResponse = ApiResponse<AdminUser>;

export interface ToggleAdminStatusPayload {
    id: string;
    newStatus: "ACTIVE" | "INACTIVE";
}

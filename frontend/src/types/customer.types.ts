import type { ApiResponse } from "./auth.js";

export interface CustomerUser {
    id: string;
    _id: string;
    srNo?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode?: string;
    avatar?: string;
    status: "ACTIVE" | "INACTIVE";
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetCustomersQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface CustomerListResponseData {
    customers: CustomerUser[];
    meta?: {
        totalDocs?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

export type CustomerListApiResponse = ApiResponse<CustomerListResponseData | CustomerUser[]>;
export type CustomerDetailApiResponse = ApiResponse<CustomerUser>;

export interface ToggleCustomerStatusPayload {
    id: string;
    newStatus: "ACTIVE" | "INACTIVE";
}

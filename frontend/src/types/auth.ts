export interface RoleInfo {
    id: string;
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
}

export interface AdminUser {
    id: string;
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: RoleInfo | any;
    status: "ACTIVE" | "INACTIVE";
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    accessToken: string;
    admin: AdminUser;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    meta?: {
        totalDocs?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
    errors?: Array<{ field: string; message: string }>;
}

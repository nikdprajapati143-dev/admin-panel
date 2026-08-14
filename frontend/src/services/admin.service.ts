import { apiClient } from "../api/client.js";
import type { AdminUser, ApiResponse } from "../types/auth.js";
import type {
    AdminDetailApiResponse,
    AdminListApiResponse,
    GetAdminsQueryParams,
    ToggleAdminStatusPayload,
} from "../types/admin.types.js";

export const adminService = {
    /**
     * Get paginated list of administrators with optional search and filters
     */
    getAdmins: async (params?: GetAdminsQueryParams): Promise<AdminListApiResponse> => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.search) query.append("search", params.search);
        if (params?.status && params.status !== "ALL") query.append("status", params.status);

        const url = `/admin/admins${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await apiClient.get<AdminListApiResponse>(url);
        return response.data;
    },

    /**
     * Get single administrator details by ID
     */
    getAdminById: async (id: string): Promise<AdminDetailApiResponse> => {
        const response = await apiClient.get<AdminDetailApiResponse>(`/admin/admins/${id}`);
        return response.data;
    },

    /**
     * Create new administrator (FormData for avatar file support)
     */
    createAdmin: async (data: FormData): Promise<AdminDetailApiResponse> => {
        const response = await apiClient.post<AdminDetailApiResponse>("/admin/admins", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    /**
     * Update existing administrator details by ID
     */
    updateAdmin: async (id: string, data: FormData): Promise<AdminDetailApiResponse> => {
        const response = await apiClient.put<AdminDetailApiResponse>(`/admin/admins/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    /**
     * Toggle administrator active/inactive status
     */
    updateAdminStatus: async ({ id, newStatus }: ToggleAdminStatusPayload): Promise<ApiResponse<AdminUser>> => {
        const response = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/admins/${id}/status`, {
            status: newStatus,
        });
        return response.data;
    },

    /**
     * Soft-delete an administrator account
     */
    deleteAdmin: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/admin/admins/${id}`);
        return response.data;
    },
};

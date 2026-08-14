import { apiClient } from "../api/client.js";
import type { ApiResponse } from "../types/auth.js";
import type {
    GetRolesQueryParams,
    RoleDetailApiResponse,
    RoleFormData,
    RoleListApiResponse,
} from "../types/role.types.js";

export const roleService = {
    /**
     * Get paginated list of system roles with optional search
     */
    getRoles: async (params?: GetRolesQueryParams): Promise<RoleListApiResponse> => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.search) query.append("search", params.search);

        const url = `/admin/roles${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await apiClient.get<RoleListApiResponse>(url);
        return response.data;
    },

    /**
     * Get single role details by ID
     */
    getRoleById: async (id: string): Promise<RoleDetailApiResponse> => {
        const response = await apiClient.get<RoleDetailApiResponse>(`/admin/roles/${id}`);
        return response.data;
    },

    /**
     * Create new role and permission matrix
     */
    createRole: async (data: RoleFormData): Promise<RoleDetailApiResponse> => {
        const response = await apiClient.post<RoleDetailApiResponse>("/admin/roles", data);
        return response.data;
    },

    /**
     * Update existing role details and permission matrix by ID
     */
    updateRole: async (id: string, data: RoleFormData): Promise<RoleDetailApiResponse> => {
        const response = await apiClient.put<RoleDetailApiResponse>(`/admin/roles/${id}`, data);
        return response.data;
    },

    /**
     * Delete custom role
     */
    deleteRole: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/admin/roles/${id}`);
        return response.data;
    },
};

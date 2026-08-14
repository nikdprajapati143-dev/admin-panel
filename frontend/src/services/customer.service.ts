import { apiClient } from "../api/client.js";
import type { ApiResponse } from "../types/auth.js";
import type {
    CustomerDetailApiResponse,
    CustomerListApiResponse,
    CustomerUser,
    GetCustomersQueryParams,
    ToggleCustomerStatusPayload,
} from "../types/customer.types.js";

export const customerService = {
    /**
     * Get paginated list of customers with optional search and status filter
     */
    getCustomers: async (params?: GetCustomersQueryParams): Promise<CustomerListApiResponse> => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.search) query.append("search", params.search);
        if (params?.status && params.status !== "ALL") query.append("status", params.status);

        const url = `/admin/customers${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await apiClient.get<CustomerListApiResponse>(url);
        return response.data;
    },

    /**
     * Get single customer profile details by ID
     */
    getCustomerById: async (id: string): Promise<CustomerDetailApiResponse> => {
        const response = await apiClient.get<CustomerDetailApiResponse>(`/admin/customers/${id}`);
        return response.data;
    },

    /**
     * Create new customer profile (FormData for avatar support)
     */
    createCustomer: async (data: FormData): Promise<CustomerDetailApiResponse> => {
        const response = await apiClient.post<CustomerDetailApiResponse>("/admin/customers", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    /**
     * Update existing customer profile by ID
     */
    updateCustomer: async (id: string, data: FormData): Promise<CustomerDetailApiResponse> => {
        const response = await apiClient.put<CustomerDetailApiResponse>(`/admin/customers/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    /**
     * Toggle customer status (ACTIVE / INACTIVE)
     */
    updateCustomerStatus: async ({ id, newStatus }: ToggleCustomerStatusPayload): Promise<ApiResponse<CustomerUser>> => {
        const response = await apiClient.patch<ApiResponse<CustomerUser>>(`/admin/customers/${id}/status`, {
            status: newStatus,
        });
        return response.data;
    },

    /**
     * Soft-delete customer record
     */
    deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/admin/customers/${id}`);
        return response.data;
    },
};

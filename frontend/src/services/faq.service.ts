import { apiClient } from "../api/client.js";
import type { ApiResponse } from "../types/auth.js";
import type {
    CreateFaqPayload,
    FaqDetailApiResponse,
    FaqItem,
    FaqListApiResponse,
    GetFaqsQueryParams,
    ToggleFaqStatusPayload,
} from "../types/faq.types.js";

export const faqService = {
    /**
     * Get paginated list of FAQs with optional search and status/category filters
     */
    getFaqs: async (params?: GetFaqsQueryParams): Promise<FaqListApiResponse> => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.search) query.append("search", params.search);
        if (params?.category && params.category !== "ALL") query.append("category", params.category);
        if (params?.status && params.status !== "ALL") query.append("status", params.status);

        const url = `/admin/faqs${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await apiClient.get<FaqListApiResponse>(url);
        return response.data;
    },

    /**
     * Get single FAQ by ID
     */
    getFaqById: async (id: string): Promise<FaqDetailApiResponse> => {
        const response = await apiClient.get<FaqDetailApiResponse>(`/admin/faqs/${id}`);
        return response.data;
    },

    /**
     * Get distinct categories
     */
    getCategories: async (): Promise<ApiResponse<string[]>> => {
        const response = await apiClient.get<ApiResponse<string[]>>("/admin/faqs/categories");
        return response.data;
    },

    /**
     * Create new FAQ entry
     */
    createFaq: async (data: CreateFaqPayload): Promise<FaqDetailApiResponse> => {
        const response = await apiClient.post<FaqDetailApiResponse>("/admin/faqs", data);
        return response.data;
    },

    /**
     * Update existing FAQ by ID
     */
    updateFaq: async (id: string, data: Partial<CreateFaqPayload>): Promise<FaqDetailApiResponse> => {
        const response = await apiClient.put<FaqDetailApiResponse>(`/admin/faqs/${id}`, data);
        return response.data;
    },

    /**
     * Toggle FAQ status (ACTIVE / INACTIVE)
     */
    updateFaqStatus: async ({ id, newStatus }: ToggleFaqStatusPayload): Promise<ApiResponse<FaqItem>> => {
        const response = await apiClient.patch<ApiResponse<FaqItem>>(`/admin/faqs/${id}/status`, {
            status: newStatus,
        });
        return response.data;
    },

    /**
     * Soft-delete FAQ entry
     */
    deleteFaq: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/admin/faqs/${id}`);
        return response.data;
    },
};

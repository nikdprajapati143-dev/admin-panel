import { apiClient } from "../api/client.js";
import type { ApiResponse } from "../types/auth.js";
import type {
    AuthLoginApiResponse,
    AuthProfileApiResponse,
    ForgotPasswordPayload,
    LoginPayload,
    ResetPasswordPayload,
} from "../types/auth.types.js";

export const authService = {
    /**
     * Authenticate administrator user credentials
     */
    login: async (payload: LoginPayload): Promise<AuthLoginApiResponse> => {
        const response = await apiClient.post<AuthLoginApiResponse>("/admin/auth/login", payload);
        return response.data;
    },

    /**
     * Terminate administrator active session
     */
    logout: async (): Promise<ApiResponse<void>> => {
        const response = await apiClient.post<ApiResponse<void>>("/admin/auth/logout");
        return response.data;
    },

    /**
     * Get currently authenticated user profile & permissions
     */
    getProfile: async (): Promise<AuthProfileApiResponse> => {
        const response = await apiClient.get<AuthProfileApiResponse>("/admin/auth/me");
        return response.data;
    },

    /**
     * Request password reset link via email
     */
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiResponse<void>> => {
        const response = await apiClient.post<ApiResponse<void>>("/admin/auth/forgot-password", payload);
        return response.data;
    },

    /**
     * Reset password using reset token
     */
    resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<void>> => {
        const response = await apiClient.post<ApiResponse<void>>("/admin/auth/reset-password", payload);
        return response.data;
    },
};

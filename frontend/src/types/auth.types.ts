import type { ApiResponse, AdminUser, LoginResponse } from "./auth.js";

export interface LoginPayload {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export type AuthLoginApiResponse = ApiResponse<LoginResponse>;
export type AuthProfileApiResponse = ApiResponse<AdminUser>;

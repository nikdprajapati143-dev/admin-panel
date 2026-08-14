import { useQuery, useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service.js";
import { useAuthStore } from "../store/authStore.js";
import type { ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from "../types/auth.types.js";

// 1. Fetch Current User Profile Query Hook
export const useAuthProfile = () => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ["auth", "profile"],
        queryFn: () => authService.getProfile(),
        enabled: isAuthenticated,
    });
};

// 2. Login Mutation Hook
export const useLogin = () => {
    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
    });
};

// 3. Logout Mutation Hook
export const useLogout = () => {
    return useMutation({
        mutationFn: () => authService.logout(),
    });
};

// 4. Forgot Password Mutation Hook
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    });
};

// 5. Reset Password Mutation Hook
export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    });
};

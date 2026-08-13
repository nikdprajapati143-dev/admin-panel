import { create } from "zustand";
import { apiClient } from "../api/client.js";
import type { AdminUser, ApiResponse } from "../types/auth.js";

interface AuthState {
    admin: AdminUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (admin: AdminUser, accessToken: string) => void;
    setAdmin: (admin: AdminUser) => void;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

const getStoredAdmin = (): AdminUser | null => {
    try {
        const stored = localStorage.getItem("adminUser");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    admin: getStoredAdmin(),
    accessToken: localStorage.getItem("accessToken"),
    isAuthenticated: Boolean(localStorage.getItem("accessToken")),
    isLoading: true,

    setAuth: (admin: AdminUser, accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("adminUser", JSON.stringify(admin));
        set({
            admin,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    setAdmin: (admin: AdminUser) => {
        localStorage.setItem("adminUser", JSON.stringify(admin));
        set({ admin });
    },

    logout: async () => {
        try {
            await apiClient.post("/admin/auth/logout");
        } catch {
            // Ignore error during logout network request
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminUser");
            set({
                admin: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    checkAuthStatus: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            set({
                admin: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return;
        }

        try {
            const response = await apiClient.get<ApiResponse<AdminUser>>("/admin/profile");
            if (response.data.success && response.data.data) {
                const admin = response.data.data;
                localStorage.setItem("adminUser", JSON.stringify(admin));
                set({
                    admin,
                    accessToken: token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                throw new Error("Failed to fetch profile");
            }
        } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminUser");
            set({
                admin: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));

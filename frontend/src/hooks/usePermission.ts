import { useMemo } from "react";
import { useAuthStore } from "../store/authStore.js";
import {
    hasAllPermissions as checkAllPermissions,
    hasAnyPermission as checkAnyPermission,
    hasPermission as checkPermission,
} from "../utils/permission.js";

export const usePermission = () => {
    const { admin } = useAuthStore();

    const roleName = useMemo(() => {
        if (!admin || !admin.role) return "";
        return typeof admin.role === "string" ? admin.role : admin.role.name || "";
    }, [admin]);

    const permissions = useMemo<string[]>(() => {
        if (!admin || !admin.role || typeof admin.role === "string") return [];
        return Array.isArray(admin.role.permissions) ? admin.role.permissions : [];
    }, [admin]);

    const isSuperAdmin = useMemo(() => {
        return roleName === "SUPER_ADMIN" || permissions.includes("*");
    }, [roleName, permissions]);

    const hasPermission = (permission?: string): boolean => {
        return checkPermission(admin, permission);
    };

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        return checkAnyPermission(admin, requiredPermissions);
    };

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        return checkAllPermissions(admin, requiredPermissions);
    };

    return {
        admin,
        roleName,
        permissions,
        isSuperAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};

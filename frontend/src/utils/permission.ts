import type { AdminUser } from "../types/auth.js";
import { PERMISSION_ALIASES } from "../constants/permissions.js";

/**
 * Checks if a given permission string matches any of the user's granted permissions,
 * taking aliases (e.g. ADMIN_VIEW <-> admin:read) into consideration.
 */
const matchesPermission = (userPermissions: string[], requiredPerm: string): boolean => {
    if (userPermissions.includes("*")) return true;

    // Direct match
    if (userPermissions.includes(requiredPerm)) return true;

    // Check alias list for requiredPerm
    const aliases = PERMISSION_ALIASES[requiredPerm];
    if (aliases && aliases.some((alias) => userPermissions.includes(alias))) {
        return true;
    }

    // Check reverse match (if user has an alias defined in PERMISSION_ALIASES)
    for (const [key, aliasList] of Object.entries(PERMISSION_ALIASES)) {
        if (aliasList.includes(requiredPerm)) {
            if (userPermissions.includes(key) || aliasList.some((alias) => userPermissions.includes(alias))) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Returns true if the user is a SUPER_ADMIN or possesses the specified permission.
 */
export const hasPermission = (admin: AdminUser | null, permission?: string): boolean => {
    if (!admin || !admin.role) return false;

    const roleName = typeof admin.role === "string" ? admin.role : admin.role.name;
    if (roleName === "SUPER_ADMIN") return true;

    if (!permission) return true;

    const userPermissions: string[] =
        typeof admin.role === "object" && Array.isArray(admin.role.permissions)
            ? admin.role.permissions
            : [];

    return matchesPermission(userPermissions, permission);
};

/**
 * Returns true if the user has AT LEAST ONE of the specified permissions.
 */
export const hasAnyPermission = (
    admin: AdminUser | null,
    permissions: string[] = [],
): boolean => {
    if (!admin || !admin.role) return false;
    if (permissions.length === 0) return true;

    const roleName = typeof admin.role === "string" ? admin.role : admin.role.name;
    if (roleName === "SUPER_ADMIN") return true;

    return permissions.some((perm) => hasPermission(admin, perm));
};

/**
 * Returns true if the user has ALL of the specified permissions.
 */
export const hasAllPermissions = (
    admin: AdminUser | null,
    permissions: string[] = [],
): boolean => {
    if (!admin || !admin.role) return false;
    if (permissions.length === 0) return true;

    const roleName = typeof admin.role === "string" ? admin.role : admin.role.name;
    if (roleName === "SUPER_ADMIN") return true;

    return permissions.every((perm) => hasPermission(admin, perm));
};

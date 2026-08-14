import React from "react";
import { usePermission } from "../hooks/usePermission.js";

interface PermissionGuardProps {
    permission?: string;
    permissions?: string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    permission,
    permissions = [],
    requireAll = false,
    fallback = null,
    children,
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

    let isAllowed = true;

    if (permission) {
        isAllowed = hasPermission(permission);
    } else if (permissions.length > 0) {
        isAllowed = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    if (!isAllowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

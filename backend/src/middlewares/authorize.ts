import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";

const PERMISSION_ALIASES: Record<string, string[]> = {
    "admin:read": ["admin:read", "ADMIN_VIEW"],
    "admin:list": ["admin:list", "ADMIN_LIST"],
    "admin:create": ["admin:create", "ADMIN_CREATE"],
    "admin:edit": ["admin:edit", "ADMIN_EDIT"],
    "admin:delete": ["admin:delete", "ADMIN_DELETE"],

    "role:read": ["role:read", "ROLE_VIEW"],
    "role:list": ["role:list", "ROLE_LIST"],
    "role:create": ["role:create", "ROLE_CREATE"],
    "role:edit": ["role:edit", "ROLE_EDIT"],
    "role:delete": ["role:delete", "ROLE_DELETE"],

    "customer:read": ["customer:read", "CUSTOMER_VIEW"],
    "customer:list": ["customer:list", "CUSTOMER_LIST"],
    "customer:create": ["customer:create", "CUSTOMER_CREATE"],
    "customer:edit": ["customer:edit", "CUSTOMER_EDIT"],
    "customer:delete": ["customer:delete", "CUSTOMER_DELETE"],
};

const hasPermissionMatch = (userPermissions: string[], requiredPerm: string): boolean => {
    if (userPermissions.includes("*")) return true;
    if (userPermissions.includes(requiredPerm)) return true;

    const aliases = PERMISSION_ALIASES[requiredPerm];
    if (aliases && aliases.some((alias) => userPermissions.includes(alias))) {
        return true;
    }
    return false;
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user || !req.user.role) {
            return next(new AppError("User authentication metadata missing", 401));
        }

        const userRoleName = req.user.role.name;

        // SUPER_ADMIN role bypasses restriction check
        if (userRoleName === "SUPER_ADMIN") {
            return next();
        }

        if (!allowedRoles.includes(userRoleName)) {
            return next(
                new AppError(
                    `Role '${userRoleName}' is not authorized to perform this action`,
                    403,
                ),
            );
        }

        next();
    };
};

export const authorizePermissions = (...requiredPermissions: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user || !req.user.role) {
            return next(new AppError("User authentication metadata missing", 401));
        }

        const userRole = req.user.role;
        const userPermissions = userRole.permissions || [];

        if (userRole.name === "SUPER_ADMIN" || userPermissions.includes("*")) {
            return next();
        }

        const isAllowed = requiredPermissions.some((perm) =>
            hasPermissionMatch(userPermissions, perm),
        );

        if (!isAllowed) {
            return next(
                new AppError(
                    "Forbidden: You do not have the required permissions for this resource",
                    403,
                ),
            );
        }

        next();
    };
};

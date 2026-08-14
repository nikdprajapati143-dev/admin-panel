import { NextFunction, Request, Response } from "express";
import { PERMISSION_ALIASES } from "../constants/permissions.js";
import { AppError } from "../utils/appError.js";

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

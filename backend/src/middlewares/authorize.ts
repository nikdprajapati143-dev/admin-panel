import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";

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

        if (userRole.name === "SUPER_ADMIN") {
            return next();
        }

        const userPermissions = userRole.permissions || [];
        const hasAllPermissions = requiredPermissions.every((perm) =>
            userPermissions.includes(perm),
        );

        if (!hasAllPermissions) {
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

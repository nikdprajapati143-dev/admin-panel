import { Request, Response } from "express";
import { Permission } from "../models/permission.model.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class PermissionController {
    getAllPermissions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
        const permissions = await Permission.find({ isDeleted: false }).sort({ module: 1, name: 1 });

        // Group permissions by module
        const grouped: Record<string, any[]> = {};
        permissions.forEach((perm) => {
            if (!grouped[perm.module]) {
                grouped[perm.module] = [];
            }
            grouped[perm.module].push({
                id: perm._id.toString(),
                name: perm.name,
                code: perm.code,
                module: perm.module,
                description: perm.description,
            });
        });

        successResponse(res, "Permissions retrieved successfully", {
            permissions,
            grouped,
        });
    });
}

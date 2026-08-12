import { Request, Response } from "express";
import { RoleService } from "../services/role.service.js";
import { RoleTransformer } from "../transformers/role.transformer.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const roleService = new RoleService();

export class RoleController {
    createRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const newRole = await roleService.createRole(req.body);
        createdResponse(res, "Role created successfully", RoleTransformer.transform(newRole));
    });

    getRoleById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const role = await roleService.getRoleById(id);
        successResponse(res, "Role details retrieved", RoleTransformer.transform(role));
    });

    getAllRoles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { docs, meta } = await roleService.getAllRoles(req.query);
        successResponse(res, "Roles list retrieved successfully", RoleTransformer.transformMany(docs), meta);
    });

    updateRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const updatedRole = await roleService.updateRole(id, req.body);
        successResponse(res, "Role updated successfully", RoleTransformer.transform(updatedRole));
    });

    deleteRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        await roleService.softDeleteRole(id);
        successResponse(res, "Role soft-deleted successfully");
    });
}
